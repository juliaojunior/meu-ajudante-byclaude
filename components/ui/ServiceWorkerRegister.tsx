"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (Capacitor.isNativePlatform()) {
      // No app nativo os assets são locais e o alarme é do sistema: o SW
      // (push/offline da versão web) só atrapalha — o cache dele devolvia
      // a home no lugar do flight data e quebrava a navegação.
      // Remove registros e caches deixados por versões anteriores.
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
      if ("caches" in window) {
        caches
          .keys()
          .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
          .catch(() => {});
      }
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((err) => console.error("SW registration failed:", err));
  }, []);

  return null;
}
