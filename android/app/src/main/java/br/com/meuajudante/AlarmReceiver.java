package br.com.meuajudante;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import org.json.JSONObject;

/** Recebe o disparo do AlarmManager, reagenda o dia seguinte e inicia o serviço que toca. */
public class AlarmReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!AlarmScheduler.ACTION_DISPARAR.equals(intent.getAction())) return;

        int id = intent.getIntExtra("id", 0);
        boolean soneca = intent.getBooleanExtra("soneca", false);

        JSONObject alarme = AlarmStore.getAlarme(context, id);
        if (alarme == null) return; // alarme antigo de remédio removido

        // Disparo diário normal: já deixa o de amanhã agendado.
        // Soneca não reagenda (o dia seguinte já foi agendado no disparo original).
        if (!soneca) {
            AlarmScheduler.agendarProximo(context, alarme);
        }

        // Usuário já marcou como tomado hoje: não toca
        if (AlarmStore.isSuprimido(context, id, AlarmStore.hojeStr())) return;

        Intent servico = new Intent(context, AlarmService.class);
        servico.setAction(AlarmService.ACTION_TOCAR);
        servico.putExtra("alarme", alarme.toString());
        if (Build.VERSION.SDK_INT >= 26) {
            context.startForegroundService(servico);
        } else {
            context.startService(servico);
        }
    }
}
