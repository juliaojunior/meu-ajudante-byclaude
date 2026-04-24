const KEY = "meu-ajudante-prefs";

export type Preferencias = {
  textoGrande: boolean;
};

const DEFAULT: Preferencias = { textoGrande: false };

export function getPreferencias(): Preferencias {
  if (typeof window === "undefined") return DEFAULT;
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULT;
  }
}

export function savePreferencias(p: Preferencias): void {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("preferencias-changed"));
}

export function toggleTextoGrande(): void {
  const p = getPreferencias();
  savePreferencias({ ...p, textoGrande: !p.textoGrande });
}
