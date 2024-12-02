document.addEventListener("DOMContentLoaded", () => {
  const checklistForm = document.getElementById("checklistForm");

  const checkboxesNao = document.querySelectorAll('input[type="checkbox"][name$="-nao"]');
  // biome-ignore lint/complexity/noForEach: <explanation>
  checkboxesNao.forEach((checkbox) => {
    checkbox.addEventListener("click", (event) => {
      const groupName = event.target.getAttribute("name").replace("-nao", "");

      const checkboxesSameRow = document.querySelectorAll(`input[name^="${groupName}"]`);
      // biome-ignore lint/complexity/noForEach: <explanation>
      checkboxesSameRow.forEach((otherCheckbox) => {
        if (otherCheckbox !== event.target) {
          otherCheckbox.checked = false;
        }
      });

      if (event.target.checked) {
        window.open("notificacao.html", "popup", "width=600,height=400,scrollbars=no,resizable=no");
      }
    });
  });

  checklistForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const checklistData = {
      CreateChecklist: Array.from(document.querySelectorAll('input[type="checkbox"]'))
        .map((checkbox) => (checkbox.checked ? checkbox.value : ""))
        .filter((value) => value !== ""),
    };

    try {
      const response = await fetch("http://localhost:3333/submitChecklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checklistData),
      });

      if (response.ok) {
        alert("Checklist realizado com sucesso!");
        checklistForm.reset();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao enviar checklist:", error);
      alert("Erro ao enviar checklist.");
    }
  });
});
