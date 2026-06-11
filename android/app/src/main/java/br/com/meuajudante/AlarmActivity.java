package br.com.meuajudante;

import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.util.List;

/**
 * Tela cheia do despertador: aparece por cima da tela de bloqueio com a
 * tela ligada, mostra os remédios da vez e dois botões grandes.
 * O botão voltar é desativado — o alarme só para por escolha explícita.
 */
public class AlarmActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= 27) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        setContentView(R.layout.activity_alarm);
        preencher();

        findViewById(R.id.btn_tomei).setOnClickListener(v -> {
            enviarAcao(AlarmService.ACTION_TOMEI);
            finishAndRemoveTask();
        });
        findViewById(R.id.btn_adiar).setOnClickListener(v -> {
            enviarAcao(AlarmService.ACTION_ADIAR);
            finishAndRemoveTask();
        });

        // Se o serviço parar (timeout ou ação pela notificação), fecha a tela
        AlarmService.setAoMudar(() -> runOnUiThread(() -> {
            if (AlarmService.getAtivos().isEmpty()) {
                finishAndRemoveTask();
            } else {
                preencher();
            }
        }));
    }

    private void enviarAcao(String action) {
        Intent i = new Intent(this, AlarmService.class).setAction(action);
        startService(i);
    }

    private void preencher() {
        List<JSONObject> ativos = AlarmService.getAtivos();
        if (ativos.isEmpty()) {
            finishAndRemoveTask();
            return;
        }
        JSONObject primeiro = ativos.get(0);

        TextView txtRefeicao = findViewById(R.id.txt_refeicao);
        TextView txtHora = findViewById(R.id.txt_hora);
        LinearLayout lista = findViewById(R.id.lista_remedios);

        txtRefeicao.setText(primeiro.optString("refeicao").toUpperCase());
        txtHora.setText(primeiro.optString("hora"));

        lista.removeAllViews();
        for (JSONObject a : ativos) {
            TextView nome = new TextView(this);
            nome.setText(a.optString("nome"));
            nome.setTextSize(28);
            nome.setTextColor(Color.parseColor("#1C1917"));
            nome.setTypeface(null, android.graphics.Typeface.BOLD);
            nome.setGravity(Gravity.CENTER);
            lista.addView(nome);

            String dose = a.optString("dose");
            if (!dose.isEmpty()) {
                TextView txtDose = new TextView(this);
                txtDose.setText(dose);
                txtDose.setTextSize(18);
                txtDose.setTextColor(Color.parseColor("#57534E"));
                txtDose.setGravity(Gravity.CENTER);
                LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
                lp.bottomMargin = (int) (12 * getResources().getDisplayMetrics().density);
                txtDose.setLayoutParams(lp);
                lista.addView(txtDose);
            }
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        // Alarme não para com o botão voltar
    }

    @Override
    protected void onDestroy() {
        AlarmService.setAoMudar(null);
        super.onDestroy();
    }
}
