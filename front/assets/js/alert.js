(() => {
  const socketUrl = "ws://localhost:3000/impact/getImpact";
  const originalTitle = document.title;

  const setupWebSocket = () => {
    const socket = new WebSocket(socketUrl);

    const showNotification = (title, body) => {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(title, { body });
        } else if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(title, { body });
            }
          });
        }
      } else {
        console.warn("Notificações não são suportadas pelo navegador.");
      }
    };

    // Eventos WebSocket
    socket.onopen = () => {
      console.log("Conexão WebSocket estabelecida.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.success) {
          const alerts = data.data.filter((entry) => entry.alert);

          if (alerts.length > 0) {
            const alertMessages = alerts
              .map((alert) => `At ${alert.timestamp}: x=${alert.x}, y=${alert.y}, z=${alert.z}`)
              .join("\n");

            showNotification("Helmet Alerts", alertMessages);

            document.title = "🚨 ALERT! High Value Detected!";
            setTimeout(() => {
              document.title = originalTitle;
            }, 5000);
          }
        } else {
          console.error("Erro recebido do servidor:", data.message);
        }
      } catch (error) {
        console.error("Erro ao processar mensagem do servidor:", error);
      }
    };

    socket.onclose = (event) => {
      console.log(`Conexão WebSocket fechada. Código: ${event.code}, Motivo: ${event.reason}`);
      reconnect();
    };

    socket.onerror = (event) => {
      console.error("Erro no WebSocket:", event);
    };

    return socket;
  };

  const reconnect = () => {
    console.log("Tentando reconectar ao WebSocket...");
    setTimeout(() => setupWebSocket(), 5000);
  };

  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().catch((err) =>
      console.error("Erro ao solicitar permissão para notificações:", err)
    );
  }

  setupWebSocket();
})();
