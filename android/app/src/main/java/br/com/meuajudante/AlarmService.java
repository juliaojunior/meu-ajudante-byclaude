package br.com.meuajudante;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;

import androidx.core.app.NotificationCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Foreground service que faz o alarme "de verdade": toca alarme.wav em loop
 * no canal de áudio de ALARME (ignora modo silencioso de mídia), vibra
 * repetidamente e publica notificação full-screen que abre a AlarmActivity
 * por cima da tela de bloqueio. Para após 5 minutos se ninguém atender,
 * deixando uma notificação de "não tomado".
 */
public class AlarmService extends Service {

    public static final String ACTION_TOCAR = "br.com.meuajudante.alarme.TOCAR";
    public static final String ACTION_TOMEI = "br.com.meuajudante.alarme.TOMEI";
    public static final String ACTION_ADIAR = "br.com.meuajudante.alarme.ADIAR";

    private static final String CANAL_ID = "alarme_tela_cheia";
    private static final String CANAL_PERDIDO_ID = "alarme_perdido";
    private static final int NOTIF_ID = 4242;
    private static final int NOTIF_PERDIDO_ID = 4243;
    private static final long TEMPO_MAXIMO_MS = 5 * 60_000;
    private static final long SONECA_MS = 10 * 60_000;

    private static AlarmService instancia;
    private static Runnable aoMudar;

    private final List<JSONObject> ativos = new ArrayList<>();
    private MediaPlayer player;
    private Vibrator vibrator;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable timeout = this::desistir;

    public static List<JSONObject> getAtivos() {
        if (instancia == null) return new ArrayList<>();
        return new ArrayList<>(instancia.ativos);
    }

    public static void setAoMudar(Runnable r) {
        aoMudar = r;
    }

    private static void notificarMudanca() {
        if (aoMudar != null) aoMudar.run();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instancia = this;
        criarCanais();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;
        if (ACTION_TOCAR.equals(action)) {
            try {
                JSONObject alarme = new JSONObject(intent.getStringExtra("alarme"));
                boolean jaTem = false;
                for (JSONObject a : ativos) {
                    if (a.optInt("id") == alarme.optInt("id")) { jaTem = true; break; }
                }
                if (!jaTem) ativos.add(alarme);
            } catch (JSONException | NullPointerException ignored) {}

            if (ativos.isEmpty()) { stopSelf(); return START_NOT_STICKY; }

            startForeground(NOTIF_ID, construirNotificacao());
            tocar();
            handler.removeCallbacks(timeout);
            handler.postDelayed(timeout, TEMPO_MAXIMO_MS);
            notificarMudanca();
        } else if (ACTION_TOMEI.equals(action)) {
            String hoje = AlarmStore.hojeStr();
            for (JSONObject a : ativos) {
                AlarmStore.addTomadaPendente(
                    this, a.optString("remedioId"), a.optString("hora"), hoje);
            }
            pararTudo();
        } else if (ACTION_ADIAR.equals(action)) {
            for (JSONObject a : ativos) {
                AlarmScheduler.agendarSoneca(this, a, SONECA_MS);
            }
            pararTudo();
        }
        return START_NOT_STICKY;
    }

    private void tocar() {
        if (player != null) return; // já tocando
        AudioAttributes attrs = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        player = MediaPlayer.create(this, R.raw.alarme, attrs, am.generateAudioSessionId());
        if (player != null) {
            player.setLooping(true);
            player.start();
        }

        if (Build.VERSION.SDK_INT >= 31) {
            VibratorManager vm = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
            vibrator = vm.getDefaultVibrator();
        } else {
            vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        }
        if (vibrator != null && vibrator.hasVibrator()) {
            long[] padrao = {0, 700, 500};
            if (Build.VERSION.SDK_INT >= 26) {
                vibrator.vibrate(VibrationEffect.createWaveform(padrao, 0));
            } else {
                vibrator.vibrate(padrao, 0);
            }
        }
    }

    private void silenciar() {
        if (player != null) {
            try { player.stop(); } catch (IllegalStateException ignored) {}
            player.release();
            player = null;
        }
        if (vibrator != null) {
            vibrator.cancel();
            vibrator = null;
        }
        handler.removeCallbacks(timeout);
    }

    private void pararTudo() {
        silenciar();
        ativos.clear();
        notificarMudanca();
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
    }

    /** Timeout: para de tocar e deixa notificação de remédio não tomado. */
    private void desistir() {
        if (!ativos.isEmpty()) {
            NotificationCompat.Builder b = new NotificationCompat.Builder(this, CANAL_PERDIDO_ID)
                .setSmallIcon(R.drawable.ic_alarme_notif)
                .setContentTitle("Remédio não tomado")
                .setContentText(nomesAtivos())
                .setAutoCancel(true)
                .setContentIntent(PendingIntent.getActivity(
                    this, 1, new Intent(this, MainActivity.class),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(NOTIF_PERDIDO_ID, b.build());
        }
        pararTudo();
    }

    private String nomesAtivos() {
        StringBuilder sb = new StringBuilder();
        for (JSONObject a : ativos) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(a.optString("nome"));
        }
        return sb.toString();
    }

    private Notification construirNotificacao() {
        Intent telaCheia = new Intent(this, AlarmActivity.class);
        telaCheia.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent fsi = PendingIntent.getActivity(
            this, 2, telaCheia,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent tomei = new Intent(this, AlarmService.class).setAction(ACTION_TOMEI);
        PendingIntent piTomei = PendingIntent.getService(
            this, 3, tomei, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent adiar = new Intent(this, AlarmService.class).setAction(ACTION_ADIAR);
        PendingIntent piAdiar = PendingIntent.getService(
            this, 4, adiar, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        String hora = ativos.isEmpty() ? "" : ativos.get(0).optString("hora");

        return new NotificationCompat.Builder(this, CANAL_ID)
            .setSmallIcon(R.drawable.ic_alarme_notif)
            .setContentTitle("💊 Hora do remédio — " + hora)
            .setContentText(nomesAtivos())
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setOngoing(true)
            .setFullScreenIntent(fsi, true)
            .setContentIntent(fsi)
            .addAction(0, "✓ Já tomei", piTomei)
            .addAction(0, "Adiar 10 min", piAdiar)
            .build();
    }

    private void criarCanais() {
        if (Build.VERSION.SDK_INT < 26) return; // canais só existem a partir do Android 8
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // Canal silencioso: o som vem do MediaPlayer (loop), não da notificação
        NotificationChannel canal = new NotificationChannel(
            CANAL_ID, "Despertador de remédio", NotificationManager.IMPORTANCE_HIGH);
        canal.setDescription("Alarme em tela cheia na hora de cada remédio");
        canal.setSound(null, null);
        canal.enableVibration(false);
        canal.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        nm.createNotificationChannel(canal);

        NotificationChannel perdido = new NotificationChannel(
            CANAL_PERDIDO_ID, "Remédio não tomado", NotificationManager.IMPORTANCE_DEFAULT);
        perdido.setDescription("Aviso quando o alarme tocou e não foi atendido");
        nm.createNotificationChannel(perdido);
    }

    @Override
    public void onDestroy() {
        silenciar();
        instancia = null;
        notificarMudanca();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
