async function loadWorkerName() {
  try {
    // Chamada para a API
    const response = await fetch("http://localhost:3000/worker/getAllNameWorkers", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    // Selecionando os elementos no DOM
    const nameSelect = document.getElementById("userName");

    if (!nameSelect) {
      console.error("Elemento com ID 'userName' não encontrado no HTML.");
      return;
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    data.forEach((worker) => {
      console.log("Adicionando nome:", worker.nome);
      const option = document.createElement("option");
      option.value = worker.nome;
      option.textContent = worker.nome;
      nameSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar dados do incidente:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadWorkerName);
