---
name: android-build
description: Build e verificação completa do APK Android do Meu Ajudante (Capacitor). Use sempre que o usuário pedir para "gerar APK", "buildar Android", "compilar o app", "rodar o build do Android", "verificar se compila", ou após alterações em código nativo Java (android/app/src/main/java/) ou em código TypeScript/React que precise chegar no APK. Também use quando o usuário pedir para confirmar que uma mudança não quebrou o build antes de declarar "pronto".
---

# Android Build & Verify

Pipeline de build do PWA Meu Ajudante empacotado com Capacitor para Android. Garante que mudanças no código web (Next.js/TS) e no código nativo (Java) cheguem juntas a um APK compilável.

## Quando usar este skill

- Depois de editar TypeScript/React que afete a UI do app no celular.
- Depois de editar arquivos em `android/app/src/main/java/` (ex: `MainActivity.java`).
- Antes de declarar uma tarefa "pronta" quando ela toca o build Android.
- Quando o usuário disser "gera o APK", "compila o app", "buildar Android" ou similar.

## Passos

Execute na ordem. Se algum passo falhar, **pare** e reporte o erro com `arquivo:linha` antes de tentar consertar — não emende um fix por cima sem confirmar a causa.

### 1. Build do Next.js (gera `out/`)

```bash
npm run build
```

Capacitor lê do diretório `out/` (configurado em `capacitor.config.ts`). Se o build do Next falhar com erro de TypeScript, reporte o arquivo e linha exatos antes de tentar consertar.

### 2. Sincronizar com o projeto Android

```bash
npx cap sync android
```

Copia `out/` para `android/app/src/main/assets/public/` e atualiza plugins nativos. Atalho disponível: `npm run cap:sync` faz os passos 1+2 juntos.

### 3. Compilar o APK

```bash
cd android && ./gradlew assembleDebug
```

Gera o APK debug. Erros de Java (visibilidade de método, imports) aparecem aqui. Se falhar, reporte o erro com `arquivo:linha` — exemplo: `android/app/src/main/java/com/example/meuajudante/MainActivity.java:42`.

### 4. Reportar resultado

Em caso de **sucesso**, informar o caminho do APK:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Em caso de **falha**, listar:
- Passo que falhou (1, 2 ou 3).
- Mensagem de erro relevante (não cole o log inteiro, só as linhas com `error:` ou `FAILURE:`).
- Arquivo e linha quando aplicável.

## Princípios

- **Não pule passos.** Editar Java sem rodar `npm run build` deixa o `out/` desatualizado, mas mudanças puramente nativas só precisam de `cap sync` se algum plugin foi adicionado. Na dúvida, rode os três.
- **Não maquile erros.** Se gradle falhar, não tente "consertar reordenando comandos" — leia o erro, identifique a causa, conserte na origem.
- **Verifique antes de declarar pronto.** Esse skill existe porque erros de compilação já apareceram tarde demais em sessões anteriores (visibilidade Java, props SVG em TS). O build verde é o critério de pronto, não a edição em si.
