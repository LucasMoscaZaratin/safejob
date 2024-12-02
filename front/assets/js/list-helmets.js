document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fazendo a requisição GET à API para obter os dados dos capacetes
    const response = await fetch("http://localhost:3333/helmet/getHelmet", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dados recebidos da API:", data);

    const tableBody = document.getElementById("helmetTableBody");
    tableBody.innerHTML = "";

    // biome-ignore lint/complexity/noForEach: <explanation>
    data.forEach((helmet) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${helmet.id}</td>
          <td>${helmet.user_name}</td>
          <td>${helmet.status}</td>
          <td>${helmet.setor}</td>
          <td>
            <label class="switch">
              <input type="checkbox" ${helmet.is_active ? "checked" : ""} />
              <span class="slider"></span>
            </label>
          </td>
        `;

      // Adicionando a linha à tabela
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao buscar os dados dos capacetes:", error);
  }
});
