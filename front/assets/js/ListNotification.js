async function LoadIncidentData() {
  try {
    // Chamada para a API
    const response = await fetch("http://localhost:3333/list/listLocation", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    // Selecionando os elementos no DOM
    const localSelect = document.getElementById("localincidente");
    const typeSelect = document.getElementById("tipoincidente");

    if (!localSelect || !typeSelect) {
      console.error("IDs 'localincidente' ou 'tipoincidente' não encontrados no HTML.");
      return;
    }

    // Adicionando opções de locais
    // biome-ignore lint/complexity/noForEach: <explanation>
    data.locationIncident.forEach((location) => {
      console.log("Adicionando local:", location.nome); // Log para verificar os valores
      const option = document.createElement("option");
      option.value = location.nome;
      option.textContent = location.nome;
      localSelect.appendChild(option);
    });

    // Adicionando opções de tipos
    // biome-ignore lint/complexity/noForEach: <explanation>
    data.typeIncident.forEach((type) => {
      console.log("Adicionando tipo:", type.descricao); // Log para verificar os valores
      const option = document.createElement("option");
      option.value = type.descricao;
      option.textContent = type.descricao;
      typeSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao buscar dados do incidente:", error);
  }
}

document.addEventListener("DOMContentLoaded", LoadIncidentData);
