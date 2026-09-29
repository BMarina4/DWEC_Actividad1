const jugador = document.getElementById("jugador");
const contenedorPreguntas = document.getElementById("preguntas");
const botonComprobar = document.getElementById("comprobar");
const mensaje = document.getElementById("mensaje");


const nickname = localStorage.getItem("nickname") || "Jugador";
const TOTAL_PREGUNTAS = 10;
let todasLasPreguntas = [];
let preguntasJuego = [];
let preguntaActual = 0;
let preguntasAcertadas = 0;
let preguntasFalladas = 0;

jugador.textContent = nickname;

// Carga las preguntas desde el archivo JSON
async function cargarPreguntas() {
    try {
        const respuesta = await fetch("data/preguntas.json");

        if (!respuesta.ok) {
            throw new Error("No se ha podido cargar el JSON");
        }

        todasLasPreguntas = await respuesta.json();
        iniciarJuego();
    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al cargar las preguntas.";
        botonComprobar.disabled = true;
    }
}


function mezclar(array) {
    return array.slice().sort(function () {
        return Math.random() - 0.5;
    });
}

// iniciar juego y preguntas
function iniciarJuego() {
    if (todasLasPreguntas.length < TOTAL_PREGUNTAS) {
        mensaje.textContent = "No hay suficientes preguntas.";
        botonComprobar.disabled = true;
        return;
    }

    preguntasJuego = mezclar(todasLasPreguntas).slice(0, TOTAL_PREGUNTAS);
    preguntaActual = 0;
    preguntasAcertadas = 0;
    preguntasFalladas = 0;
    mostrarPregunta();
}

// pregunta actual
function mostrarPregunta() {
    if (preguntaActual >= TOTAL_PREGUNTAS) {
        mostrarResultado();
        return;
    }

    const pregunta = preguntasJuego[preguntaActual];
    const bloque = document.createElement("div");
    const titulo = document.createElement("h2");
    const respuestas = mezclar(pregunta.respuestas);

    mensaje.textContent = "Pregunta " + (preguntaActual + 1) + " de " + TOTAL_PREGUNTAS;
    bloque.classList.add("pregunta");
    titulo.textContent = (preguntaActual + 1) + ". " + pregunta.pregunta;
    bloque.appendChild(titulo);

    for (let i = 0; i < respuestas.length; i++) {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        const letra = document.createElement("span");
        const texto = document.createElement("span");

        radio.type = "radio";
        radio.name = "pregunta-" + preguntaActual;
        radio.value = respuestas[i];

        letra.classList.add("letra-opcion");
        letra.textContent = String.fromCharCode(65 + i);

        texto.classList.add("texto-opcion");
        texto.textContent = respuestas[i];

        label.appendChild(radio);
        label.appendChild(letra);
        label.appendChild(texto);
        bloque.appendChild(label);
        bloque.appendChild(document.createElement("br"));
    }

    // respuesta correcta
    bloque.dataset.correcta = pregunta.correcta;


    contenedorPreguntas.innerHTML = "";
    contenedorPreguntas.appendChild(bloque);

    botonComprobar.textContent = "Comprobar";
    botonComprobar.disabled = false;
}


botonComprobar.addEventListener("click", function () {
    if (botonComprobar.textContent === "Comprobar") {
        comprobarPregunta();
    } else {
        siguientePregunta();
    }
});

// comprobacion
function comprobarPregunta() {
    const bloque = contenedorPreguntas.querySelector(".pregunta");
    const seleccionada = bloque.querySelector("input:checked");

    if (seleccionada === null) {
        alert("Selecciona una respuesta.");
        return;
    }

    if (seleccionada.value === bloque.dataset.correcta) {
        preguntasAcertadas++;
        seleccionada.parentElement.classList.add("correcta");
    } else {
        preguntasFalladas++;


        const opciones = bloque.querySelectorAll("label");

        for (let i = 0; i < opciones.length; i++) {
            const radio = opciones[i].querySelector("input");

            if (radio.value === bloque.dataset.correcta) {
                opciones[i].classList.add("correcta");
            }
        }
    }

    const radios = bloque.querySelectorAll("input");

    for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = true;
    }

    botonComprobar.textContent = "Siguiente";
}


function siguientePregunta() {
    preguntaActual++;

    if (preguntaActual >= TOTAL_PREGUNTAS) {
        mostrarResultado();
    } else {
        mostrarPregunta();
    }
}

// pantalla final
function mostrarResultado() {
    const porcentaje = preguntasAcertadas / TOTAL_PREGUNTAS * 100;

    contenedorPreguntas.innerHTML = "";
    mensaje.classList.add("mensaje-final");
    mensaje.innerHTML =
        '<p class="resultado-etiqueta">PUNTUACIÓN FINAL</p>' +
        '<h2>' + preguntasAcertadas + ' / ' + TOTAL_PREGUNTAS + ' <span>correctas</span></h2>' +
        '<p class="resultado-porcentaje">' + porcentaje + '%</p>' +
        '<button id="volver-jugar" class="boton-principal" type="button">Volver a jugar</button>';

    document.getElementById("volver-jugar").addEventListener("click", function () {
        window.location.reload();
    });

    botonComprobar.style.display = "none";
    enviarResultado();
}


async function enviarResultado() {
    const resultado = {
        nickname: nickname,
        preguntasAcertadas: preguntasAcertadas,
        preguntasFalladas: preguntasFalladas,
        ganador: preguntasAcertadas === TOTAL_PREGUNTAS
    };

    try {
        const respuesta = await fetch("http://localhost:3000/api/resultado", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resultado)
        });

        if (!respuesta.ok) {
            throw new Error("Error enviando el resultado");
        }
    } catch (error) {
        console.error("No se pudo enviar el resultado:", error);
    }
}


cargarPreguntas();