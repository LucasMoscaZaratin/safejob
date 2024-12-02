document.addEventListener("DOMContentLoaded", () => {
  const createUserForm = document.getElementById("capaceteForm");
  createUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user_name = document.getElementById("userName").value;
    const setor = document.getElementById("setor").value;

    try {
      const response = await fetch("http://localhost:3333/helmet/createHelmet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name,
          setor,
        }),
      });

      console.log("Status da resposta:", response.status); // Verificando o código de status

      const data = await response.json();
      console.log("Resposta da API:", data); // Verificando a resposta completa

      if (response.ok && data.message) {
        alert("Capacete criado com sucesso");
      } else {
        console.log(data.error || "Erro ao criar o capacete");
        alert(data.error || "Erro ao criar o capacete");
      }
    } catch (error) {
      console.error("Erro ao criar o usuário", error);
      alert("Erro ao criar o usuário. Por favor, tente novamente mais tarde");
    }
  });
});
