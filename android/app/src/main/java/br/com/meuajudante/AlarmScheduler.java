package br.com.meuajudante;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import org.json.JSONObject;

import java.util.Calendar;
import java.util.List;

/**
 * Agenda alarmes exatos via AlarmManager.setAlarmClock — a forma mais
 * confiável do Android: ignora Doze, mostra o ícone de despertador na
 * barra de status e permite iniciar foreground service do background.
 * Cada disparo é único; o AlarmReceiver reagenda o dia seguinte.
 */
public final class AlarmScheduler {

    public static final String ACTION_DISPARAR = "br.com.meuajudante.ALARME_DISPARAR";

    private AlarmScheduler() {}

    private static PendingIntent operacao(Context ctx, int id) {
        Intent intent = new Intent(ctx, AlarmReceiver.class);
        intent.setAction(ACTION_DISPARAR);
        intent.putExtra("id", id);
        return PendingIntent.getBroadcast(
            ctx, id, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static PendingIntent operacaoSoneca(Context ctx, int id) {
        Intent intent = new Intent(ctx, AlarmReceiver.class);
        intent.setAction(ACTION_DISPARAR);
        intent.putExtra("id", id);
        intent.putExtra("soneca", true);
        return PendingIntent.getBroadcast(
            ctx, id, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    private static PendingIntent abrirApp(Context ctx) {
        Intent intent = new Intent(ctx, MainActivity.class);
        return PendingIntent.getActivity(
            ctx, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    /** Próxima ocorrência futura de "HH:mm" (hoje se ainda não passou, senão amanhã). */
    private static long proximoDisparo(String hora) {
        String[] partes = hora.split(":");
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(partes[0]));
        cal.set(Calendar.MINUTE, Integer.parseInt(partes[1]));
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        // Margem de 90s: ao reagendar no momento do disparo, garante "amanhã"
        if (cal.getTimeInMillis() <= System.currentTimeMillis() + 90_000) {
            cal.add(Calendar.DAY_OF_YEAR, 1);
        }
        return cal.getTimeInMillis();
    }

    private static void agendarEm(Context ctx, long millis, PendingIntent op) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        try {
            am.setAlarmClock(new AlarmManager.AlarmClockInfo(millis, abrirApp(ctx)), op);
        } catch (SecurityException e) {
            // Permissão de alarme exato revogada (Android 12/12L):
            // fallback inexato — pode atrasar alguns minutos, mas dispara
            if (Build.VERSION.SDK_INT >= 23) {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, millis, op);
            } else {
                am.set(AlarmManager.RTC_WAKEUP, millis, op);
            }
        }
    }

    public static void agendarProximo(Context ctx, JSONObject alarme) {
        int id = alarme.optInt("id");
        String hora = alarme.optString("hora");
        if (hora.isEmpty()) return;
        agendarEm(ctx, proximoDisparo(hora), operacao(ctx, id));
    }

    public static void agendarSoneca(Context ctx, JSONObject alarme, long delayMillis) {
        int id = alarme.optInt("id");
        agendarEm(ctx, System.currentTimeMillis() + delayMillis, operacaoSoneca(ctx, id));
    }

    public static void cancelar(Context ctx, int id) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.cancel(operacao(ctx, id));
    }

    public static void agendarTodos(Context ctx) {
        List<JSONObject> alarmes = AlarmStore.listarAlarmes(ctx);
        for (JSONObject a : alarmes) {
            agendarProximo(ctx, a);
        }
    }
}
