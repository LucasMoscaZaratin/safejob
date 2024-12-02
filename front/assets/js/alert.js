(() => {
  const socket = new WebSocket("ws://localhost:3000/getHelmet");

  // Verifica se o navegador suporta notificações
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
        console.warn("Notifications are disabled or denied.");
      }
    });
  } else {
    console.warn("Notifications are not supported by this browser.");
  }

  socket.onopen = () => {
    console.log("WebSocket connection established.");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.success) {
      const alerts = data.data.filter((entry) => entry.alert);

      if (alerts.length > 0) {
        const alertMessages = alerts
          .map((alert) => `ALERT! High value detected at ${alert.timestamp}: x=${alert.x}, y=${alert.y}, z=${alert.z}`)
          .join("\n");

        // Exibe notificação, se permitido
        if (Notification.permission === "granted") {
          // biome-ignore lint/complexity/noForEach: <explanation>
          alerts.forEach((alert) => {
            new Notification("Helmet Alert", {
              body: `High value detected at ${alert.timestamp}: x=${alert.x}, y=${alert.y}, z=${alert.z}`,
            });
          });
        }

        // Adiciona destaque ao título da página
        document.title = "🚨 ALERT! High Value Detected!";
        setTimeout(() => {
          document.title = document.title.replace("🚨 ALERT! High Value Detected!", ""); // Restaura o título original
        }, 5000);
      }
    } else {
      console.error("Error:", data.message);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
})();
