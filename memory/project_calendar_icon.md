---
name: project-calendar-icon
description: Botão de calendário na tela inicial sem função — pendente de implementação
metadata:
  type: project
---

O botão de calendário (`<IcCalendar>`) está na barra inferior da tela inicial em `app/page.tsx:285`, canto inferior direito ao lado do botão de adicionar remédio. Ele tem `aria-label="Ver calendário"` mas nenhum `onClick` ou `href` — não faz nada ao ser clicado.

**Why:** O ícone foi adicionado visualmente mas a funcionalidade de calendário ainda não foi criada.

**How to apply:** Quando o usuário pedir para implementar o calendário ou a funcionalidade do botão, apontar para `app/page.tsx:285` como ponto de partida.
