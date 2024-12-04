document.addEventListener("DOMContentLoaded", () => {
  const createNotification = document.getElementById("incidentForm");
  createNotification.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dia = document.getElementById("dataincidente").value;
    const hora = document.getElementById("horaincidente").value;
    const localizacao = document.getElementById("localincidente").value;
    const type = document.getElementById("tipoincidente").value;
    const user_name = document.getElementById("userName").value;

    try {
      const response = await fetch("http://localhost:3000/notification/createNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dia,
          hora,
          localizacao,
          type,
          user_name,
        }),
      });
      if (response.ok) {
        alert("Notificação enviada com sucesso");
        createNotification.reset();
      } else {
        const erro = await response.json();
        alert(erro.error || "Erro ao enviar a notificação");
      }
    } catch (error) {
      console.log("Erro:", error);
      alert("Erro ao enviar a notificação. Por favor, tente novamente mais tarde");
    }
    console.log(
      JSON.stringify({
        dia,
        hora,
        localizacao,
        type,
        user_name,
      })
    );
  });
});
