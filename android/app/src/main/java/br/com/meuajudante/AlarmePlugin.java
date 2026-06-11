package br.com.meuajudante;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

/**
 * Ponte JS <-> nativo do despertador.
 * O contrato é de sincronização total: o web envia a lista completa de
 * alarmes ativos e o nativo cancela tudo que tinha e reagenda do zero —
 * impossível sobrar alarme fantasma.
 */
@CapacitorPlugin(name = "Alarme")
public class AlarmePlugin extends Plugin {

    @PluginMethod
    public void sincronizar(PluginCall call) {
        JSArray alarmes = call.getArray("alarmes");
        if (alarmes == null) {
            call.reject("Lista de alarmes ausente");
            return;
        }

        // Cancela todos os alarmes agendados anteriormente
        List<JSONObject> antigos = AlarmStore.listarAlarmes(getContext());
        for (JSONObject a : antigos) {
            AlarmScheduler.cancelar(getContext(), a.optInt("id"));
        }

        // Salva e agenda a lista nova
        try {
            JSONArray novos = new JSONArray(alarmes.toString());
            AlarmStore.salvarAlarmes(getContext(), novos);
        } catch (JSONException e) {
            call.reject("Lista de alarmes inválida");
            return;
        }
        AlarmScheduler.agendarTodos(getContext());
        call.resolve();
    }

    @PluginMethod
    public void cancelarTodos(PluginCall call) {
        List<JSONObject> antigos = AlarmStore.listarAlarmes(getContext());
        for (JSONObject a : antigos) {
            AlarmScheduler.cancelar(getContext(), a.optInt("id"));
        }
        AlarmStore.salvarAlarmes(getContext(), new JSONArray());
        call.resolve();
    }

    @PluginMethod
    public void consumirTomadasPendentes(PluginCall call) {
        JSONArray tomadas = AlarmStore.consumirTomadasPendentes(getContext());
        JSObject ret = new JSObject();
        try {
            ret.put("tomadas", new JSArray(tomadas.toString()));
        } catch (JSONException e) {
            ret.put("tomadas", new JSArray());
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void suprimirHoje(PluginCall call) {
        Integer id = call.getInt("id");
        if (id == null) { call.reject("id ausente"); return; }
        AlarmStore.suprimir(getContext(), id, AlarmStore.hojeStr());
        call.resolve();
    }

    @PluginMethod
    public void dessuprimirHoje(PluginCall call) {
        Integer id = call.getInt("id");
        if (id == null) { call.reject("id ausente"); return; }
        AlarmStore.dessuprimir(getContext(), id);
        call.resolve();
    }
}
