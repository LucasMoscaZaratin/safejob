document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("senha").value;

    try {
      const response = await fetch("http://localhost:3000/login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Erro ao fazer login", error);
      alert("Erro ao realizar o login. Por favor, tente novamente mais tarde");
    }
    console.log(JSON.stringify({ email, password }));
  });
});
