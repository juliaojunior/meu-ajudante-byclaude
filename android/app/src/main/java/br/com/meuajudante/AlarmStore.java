package br.com.meuajudante;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Persistência dos alarmes agendados, tomadas pendentes (marcadas na tela
 * nativa, aguardando o app web consumir) e supressões do dia (remédio já
 * tomado antes do alarme tocar). Tudo em SharedPreferences como JSON.
 */
public final class AlarmStore {

    private static final String PREFS = "alarmes_store";
    private static final String KEY_ALARMES = "alarmes";
    private static final String KEY_TOMADAS_PENDENTES = "tomadas_pendentes";
    private static final String KEY_SUPRIMIDOS = "suprimidos";

    private AlarmStore() {}

    private static SharedPreferences prefs(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static String hojeStr() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    // ---- Alarmes agendados ----

    public static void salvarAlarmes(Context ctx, JSONArray alarmes) {
        prefs(ctx).edit().putString(KEY_ALARMES, alarmes.toString()).apply();
    }

    public static List<JSONObject> listarAlarmes(Context ctx) {
        List<JSONObject> lista = new ArrayList<>();
        try {
            JSONArray arr = new JSONArray(prefs(ctx).getString(KEY_ALARMES, "[]"));
            for (int i = 0; i < arr.length(); i++) {
                lista.add(arr.getJSONObject(i));
            }
        } catch (JSONException ignored) {}
        return lista;
    }

    public static JSONObject getAlarme(Context ctx, int id) {
        for (JSONObject a : listarAlarmes(ctx)) {
            if (a.optInt("id") == id) return a;
        }
        return null;
    }

    // ---- Tomadas pendentes (nativo -> web) ----

    public static void addTomadaPendente(Context ctx, String remedioId, String hora, String data) {
        try {
            JSONArray arr = new JSONArray(prefs(ctx).getString(KEY_TOMADAS_PENDENTES, "[]"));
            JSONObject t = new JSONObject();
            t.put("remedioId", remedioId);
            t.put("hora", hora);
            t.put("data", data);
            arr.put(t);
            prefs(ctx).edit().putString(KEY_TOMADAS_PENDENTES, arr.toString()).apply();
        } catch (JSONException ignored) {}
    }

    public static JSONArray consumirTomadasPendentes(Context ctx) {
        String raw = prefs(ctx).getString(KEY_TOMADAS_PENDENTES, "[]");
        prefs(ctx).edit().remove(KEY_TOMADAS_PENDENTES).apply();
        try {
            return new JSONArray(raw);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    // ---- Supressão do dia (já tomou antes do alarme) ----

    public static void suprimir(Context ctx, int id, String data) {
        try {
            JSONObject map = new JSONObject(prefs(ctx).getString(KEY_SUPRIMIDOS, "{}"));
            map.put(String.valueOf(id), data);
            prefs(ctx).edit().putString(KEY_SUPRIMIDOS, map.toString()).apply();
        } catch (JSONException ignored) {}
    }

    public static void dessuprimir(Context ctx, int id) {
        try {
            JSONObject map = new JSONObject(prefs(ctx).getString(KEY_SUPRIMIDOS, "{}"));
            map.remove(String.valueOf(id));
            prefs(ctx).edit().putString(KEY_SUPRIMIDOS, map.toString()).apply();
        } catch (JSONException ignored) {}
    }

    public static boolean isSuprimido(Context ctx, int id, String data) {
        try {
            JSONObject map = new JSONObject(prefs(ctx).getString(KEY_SUPRIMIDOS, "{}"));
            return data.equals(map.optString(String.valueOf(id)));
        } catch (JSONException e) {
            return false;
        }
    }
}
