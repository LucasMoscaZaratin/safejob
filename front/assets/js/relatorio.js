document.addEventListener("DOMContentLoaded", () => {
  const gerarRelatorioButton = document.getElementById("gerarRelatorio");
  gerarRelatorioButton.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:3333/report/generateReport", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar o relatório");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      console.log(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar o relatório", error);
    }
  });
});
