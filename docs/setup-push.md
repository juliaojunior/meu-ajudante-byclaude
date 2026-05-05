# Configurar Notificações Push (Web Push + cron-job.org)

Este guia configura as notificações em background do Meu Ajudante.
Tempo estimado: 20–30 minutos.

---

## 1. Gerar as chaves VAPID

No terminal do projeto:

```bash
npx web-push generate-vapid-keys
```

Anote as duas chaves geradas (`Public Key` e `Private Key`).

---

## 2. Criar banco Redis no Upstash

1. Acesse [console.upstash.com](https://console.upstash.com) e crie uma conta gratuita.
2. Clique em **Create Database**.
3. Nome: `meu-ajudante` — Região: `us-east-1` (ou a mais próxima).
4. Após criar, abra a aba **REST API**.
5. Copie `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.

---

## 3. Configurar variáveis no Vercel

No painel do projeto na Vercel: **Settings → Environment Variables**.

Adicione as seguintes variáveis (em **Production** e **Preview**):

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public Key gerada no passo 1 |
| `VAPID_PRIVATE_KEY` | Private Key gerada no passo 1 |
| `VAPID_SUBJECT` | `mailto:seu@email.com` |
| `CRON_SECRET` | Qualquer string longa aleatória (ex: `openssl rand -hex 32`) |
| `UPSTASH_REDIS_REST_URL` | URL copiada do Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Token copiado do Upstash |

Depois de adicionar todas, faça um novo deploy na Vercel.

---

## 4. Criar arquivo .env.local (desenvolvimento local)

Copie `.env.example` para `.env.local` e preencha com os mesmos valores:

```bash
cp .env.example .env.local
```

> `.env.local` está no `.gitignore` — nunca suba esse arquivo.

---

## 5. Configurar o cron no cron-job.org

1. Acesse [cron-job.org](https://cron-job.org) e crie uma conta gratuita.
2. Clique em **CREATE CRONJOB**.
3. Preencha:
   - **Title:** Meu Ajudante — alarmes
   - **URL:** `https://SEU-DOMINIO.vercel.app/api/cron-tick`
   - **Schedule:** a cada 1 minuto (`*/1 * * * *`)
   - **Request method:** POST
4. Em **Headers**, adicione:
   - Header: `x-cron-secret`
   - Value: o mesmo `CRON_SECRET` que você colocou na Vercel
5. Salve e ative o cron.

---

## 6. Verificar que está funcionando

Acesse o app no celular, adicione um remédio com alarme e aguarde o horário.
A notificação deve aparecer mesmo com o navegador em segundo plano.

Para inspecionar logs: no painel da Vercel, acesse **Functions → /api/cron-tick → Logs**.

---

## Arquitetura resumida

```
cron-job.org (a cada minuto)
  → POST /api/cron-tick  (com x-cron-secret)
    → lê todos os usuários do Redis
    → verifica quais têm alarme neste minuto (horário de Brasília)
    → envia Push via web-push → FCM → dispositivo Android
    → Service Worker recebe o evento push → mostra notificação do SO
```
