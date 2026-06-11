package br.com.meuajudante;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Alarmes do AlarmManager são perdidos ao reiniciar o aparelho ou mudar a
 * hora/fuso: reagenda todos a partir do que está salvo no AlarmStore.
 */
public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action)
            || Intent.ACTION_TIME_CHANGED.equals(action)
            || Intent.ACTION_TIMEZONE_CHANGED.equals(action)) {
            AlarmScheduler.agendarTodos(context);
        }
    }
}
