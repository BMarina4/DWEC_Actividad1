const formulario = document.getElementById("formInicio");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();

    if (nickname === "") {
        alert("Debes introducir un nickname.");
        return;
    }

    localStorage.setItem("nickname", nickname);
    window.location.href = "./juego.html";
});
