"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const STORAGE_KEY = "install-prompt-dismissed-at";
const DISMISS_DAYS = 7;

function recentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const when = new Date(raw).getTime();
    if (Number.isNaN(when)) return false;
    const diffMs = Date.now() - when;
    const limitMs = DISMISS_DAYS * 24 * 60 * 60 * 1000;
    return diffMs < limitMs;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [savedEvent, setSavedEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed (running standalone) — never show.
    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      return;
    }

    // Recently dismissed — respect cool-down.
    if (recentlyDismissed()) {
      return;
    }

    setHidden(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setSavedEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (hidden || dismissed || !savedEvent) return null;

  async function handleInstall() {
    if (!savedEvent) return;
    try {
      await savedEvent.prompt();
      await savedEvent.userChoice;
    } catch {
      // Ignore — user closed the native prompt.
    } finally {
      setDismissed(true);
      setSavedEvent(null);
    }
  }

  function handleLater() {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // Ignore storage errors (private mode, etc.).
    }
    setDismissed(true);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Instalar Meu Ajudante na tela inicial"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: "calc(110px + env(safe-area-inset-bottom))",
        zIndex: 50,
        background: "#FFFBF3",
        border: "1px solid #EADFCE",
        borderRadius: 20,
        padding: "16px 20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-serif)",
          fontSize: 17,
          lineHeight: 1.35,
          color: "#1C1917",
          fontWeight: 500,
        }}
      >
        Instale o Meu Ajudante na tela inicial para abrir mais rápido.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <button
          type="button"
          onClick={handleLater}
          style={{
            flex: 1,
            minHeight: 48,
            padding: "0 18px",
            borderRadius: 24,
            border: "1.5px solid #EADFCE",
            background: "#FFFBF3",
            color: "#1C1917",
            fontWeight: 700,
            fontSize: 15,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          Agora não
        </button>
        <button
          type="button"
          onClick={handleInstall}
          style={{
            flex: 1.2,
            minHeight: 48,
            padding: "0 18px",
            borderRadius: 24,
            border: "none",
            background: "#C2410C",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(194,65,12,0.32)",
          }}
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
