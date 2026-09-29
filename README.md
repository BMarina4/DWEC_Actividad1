# GAMEQUIZ

Concurso de preguntas sobre desarrollo web. El jugador introduce su nombre y responde 10 preguntas elegidas al azar; al final se muestra su puntuacion.

## Requisitos

No hay que instalar dependencias del proyecto. Solo se necesita un navegador moderno. Para que el navegador pueda cargar `data/preguntas.json`, hay que abrir la web desde un servidor local en lugar de abrir `index.html` directamente.

Una opcion es usar Visual Studio Code con la extension **Live Server**: abre `index.html` y selecciona **Open with Live Server**. Tambien se puede usar Python, si ya esta instalado, desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Despues, abre <http://localhost:8000> en el navegador.

## Estructura

- `index.html`: pantalla inicial para introducir el nombre.
- `juego.html`: pantalla del concurso.
- `css/estilos.css`: estilos.
- `js/inicio.js` y `js/juego.js`: logica del juego.
- `data/preguntas.json`: preguntas y respuestas.

## Envio de resultados

Al terminar, el juego intenta enviar el resultado a `http://localhost:3000/api/resultado`. El proyecto no incluye ese servidor; por tanto, si no se ejecuta un backend compatible en ese equipo, el envio no estara disponible, pero se puede jugar y ver la puntuacion normalmente.
