"use client";

import { createChat } from "@n8n/chat";
import { useEffect } from "react";
import "@n8n/chat/style.css";

export default function N8nChatWidget() {
  useEffect(() => {
    createChat({
      webhookUrl:
        "https://acsorbi.app.n8n.cloud/webhook/206f731a-85dc-437f-9f59-2b4bd15ef166/chat",
      webhookConfig: {
        method: "POST",
        headers: {},
      },
      target: "#n8n-chat",
      mode: "window",
      initialMessages: [
        "📅 Bienvenido a tu Agente Agendador\n\nSoy tu aliado para mantener tu agenda y tu comunicación siempre en orden:\n\n✅ Programo reuniones en Google Calendar para que tu tiempo esté perfectamente organizado.\n\n✅ Envió correos en Gmail de manera rápida y precisa, asegurando que tus mensajes lleguen justo cuando deben.\n\nConmigo, coordinar citas y mantener contacto será más fácil que nunca.",
      ],
      i18n: {
        en: {
          title: "Agente Agendador",
          subtitle: "Programa reuniones y envía correos fácilmente",
          footer: "",
          getStarted: "Nueva Agenda",
          inputPlaceholder: "Escribe tu solicitud..",
          closeButtonTooltip: "Cerrar chat",
        },
      },
    });
  }, []);

  return <div></div>;
}
