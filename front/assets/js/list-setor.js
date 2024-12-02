async function loadSetorNames() {
  try {
    // Chamada para a API
    const response = await fetch("http://localhost:3333/helmet/getSetor", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json(); // Espera-se um array de objetos com 'nome_setor'
    console.log("Resposta da API:", data);

    const setorSelect = document.getElementById("setor");

    if (!setorSelect) {
      console.error("Elemento com ID 'setor' não encontrado no HTML.");
      return;
    }

    // Limpar as opções anteriores antes de adicionar novas
    setorSelect.innerHTML = "<option value=''>Selecione o setor</option>"; // Coloca uma opção padrão

    // Adicionar as opções no select
    // biome-ignore lint/complexity/noForEach: <explanation>
    data.forEach((setor) => {
      console.log("Adicionando setor:", setor.nome_setor);
      const option = document.createElement("option");
      option.value = setor.nome_setor; // A propriedade correta é 'nome_setor' no backend
      option.textContent = setor.nome_setor; // Também usa 'nome_setor'
      setorSelect.appendChild(option); // Adiciona a opção ao select
    });
  } catch (error) {
    console.error("Erro ao buscar os nomes dos setores:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadSetorNames); // Chama a função quando o DOM estiver completamente carregado
