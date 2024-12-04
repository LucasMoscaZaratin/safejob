document.addEventListener("DOMContentLoaded", () => {
  const createUserForm = document.getElementById("createUserForm");
  createUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const telefone = document.getElementById("telefone").value;
    const telefone_emergencia = document.getElementById("telefone").value;
    const tipo_sanguineo = document.getElementById("tipo-sanguineo").value;

    try {
      const response = await fetch("http://localhost:3000/worker/createWorker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cargo,
          telefone,
          telefone_emergencia,
          tipo_sanguineo,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        alert("Usuário criado com sucesso");
      } else {
        alert(data.error || "Erro ao criar o usuário");
      }
    } catch (error) {
      console.error("Erro ao criar o usuário", error);
      alert("Erro ao criar o usuário. Por favor, tente novamente mais tarde");
    }
  });
});
