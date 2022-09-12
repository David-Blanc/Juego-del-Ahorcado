document.getElementById("nuevo-juego").addEventListener("click", () => {
    document.getElementById("header").style.cssText = "display: none;";
    document.getElementById("main").style.cssText = "display: flex;";
    nuevoJuego();
    cronometro();
});

document.getElementById("desistir").addEventListener("click", () => { location.reload(); })

document.getElementById("btn-agregar-palabra").addEventListener("click", () => {
    document.getElementById("btns-inicio-0").style.cssText = "display: none;";
    document.getElementById("agregar-palabra").style.cssText = "display: flex;";
    btnGuardarIniciar.disabled = true;
    btnGuardarIniciar.style.cssText = "opacity: 0.75;";
    document.querySelector("textarea").focus();
    diccionario.splice(0, diccionario.length);
})

let numPalabras = 0;
const textarea = document.querySelector("#textarea");

//permite la carga (en agregar palabra) sólo de letras
let tempInput = ""
let expresion = /[A-ZÑ]/i;

textarea.addEventListener("input", (e) => {
    if (expresion.test(e.data) && e.data != null || e.inputType == 'deleteContentBackward') {
        tempInput = textarea.value
    } else {
        textarea.value = tempInput;
    }
})

document.getElementById("guardar").addEventListener("click", () => {
    let palabraAgregada = textarea.value;
    tempInput = "";

    if (palabraAgregada != "") {
        btnGuardarIniciar.disabled = false;
        btnGuardarIniciar.style.cssText = "opacity: 1;";
        diccionario.push(palabraAgregada);
        document.querySelector("textarea").value = "";
        document.querySelector("textarea").focus();
        numPalabras += 1;
        cuadroAlerta("Guardado (" + diccionario.length + "): " + palabraAgregada.toUpperCase(), "green-box");
    } else if (palabraAgregada == "") {
        cuadroAlerta("Ingrese una palabra", "red-box");
        document.querySelector("textarea").focus();
    }
})


let btnGuardarIniciar = document.getElementById("iniciar-juego");

btnGuardarIniciar.addEventListener("click", () => {
    document.getElementById("header").style.cssText = "display: none;";
    document.getElementById("main").style.cssText = "display: flex;";
    nuevoJuego();
    cronometro();
});

const diccionario = ["BAÑERA", "SAXOFON", "ARROZ", "CANCHA", "PELOTA"];// "CARTUCHERA", "PUERTA", "HELADERA", "ALJIBE", "JAZZ"];
const tamdiccionario = diccionario.length;

function elegirMatriz() {
    if (numPalabras > 0) {
        return numPalabras;
    } return tamdiccionario;
};

let btnJuego = document.getElementById("btn-juego");
let palabra;
//const vidas = 6; de querer cambiarlo hay que modificar el switch de generarDibujo
let vidasGastadas;
let aciertos;
btnJuego.addEventListener("click", nuevoJuego);

let victorias = 0;
let derrotas = 0;
let tablero = document.getElementById("puntuacion");

let ronda = 0;

function puntuacion() {
    return Math.floor(victorias * 100 / (victorias + derrotas));
}

let letras = document.querySelectorAll(".alfabeto button");
letras.forEach(Element => { Element.disabled = true });

function pantallaInicial() {
    vidasGastadas = 0;
    aciertos = 0;
    path.style.cssText = "visibility: visible;";
    svg.style.cssText = "stroke: #343A40;";
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    letras.forEach(Element => { Element.style.cssText = "font-family: 'Rubik', sans-serif; color:#0A3871"; Element.disabled = false });
    document.getElementById("body").style.cssText = "background-image: linear-gradient(white, #E9ECF8);";

}

function nuevoJuego() {

    pantallaInicial();
    document.getElementById("rondas").innerHTML = diccionario.length + ronda;
    ronda += 1;

    document.getElementById("ronda").innerHTML = ronda;
    btnJuego.disabled = true;
    btnJuego.style.cssText = "opacity: 0.75;";


    let aleatorio = Math.floor(Math.random() * (diccionario.length));
    palabra = diccionario[aleatorio];

    diccionario.splice(aleatorio, 1); //eliminar la plabra del array

    //console.log(palabra);
    let numLetras = palabra.length;
    let ubicPalabra = document.getElementById("palabra");
    ubicPalabra.innerHTML = "";

    for (let i = 0; i < numLetras; i++) {
        let span = document.createElement("span");
        ubicPalabra.appendChild(span);
    }
}


for (let i = 0; i < letras.length; i++) {
    letras[i].addEventListener("click", clickLetra);
}

function clickLetra(event) {
    let letrabtn = event.target;
    letrabtn.disabled = true;
    let letra = letrabtn.innerHTML;
    let existenciaLetra = false;

    for (let i = 0; i < palabra.length; i++) {
        let letraPalabra = palabra.substring(i, i + 1);
        if (letraPalabra.toUpperCase() == letra.toUpperCase()) {
            let span = document.querySelectorAll("#palabra span");
            span[i].innerHTML = letra;
            existenciaLetra = true;
            aciertos += 1;
        }
    }

    if (existenciaLetra) {
        letrabtn.style.cssText = "background-image: url(images/check.png); background-size: cover; text-shadow: 0 0 5px white; -webkit-text-stroke: 0.5px white; color: rgba(10,56,113,0.75);";
        sfx.won.play();
    } else {
        vidasGastadas += 1;
        letrabtn.style.cssText = "background-image: url(images/cruz.png); background-size: cover; text-shadow: 0 0 5px white; -webkit-text-stroke: 0.5px white; color: rgba(10,56,113,0.75);";
        if (vidasGastadas >= 6) {
            letras.forEach(Element => { Element.disabled = true });
        }
        generarDibujo();
        sfx.loos.play();
    }

    if (aciertos == palabra.length) {
        if (vidasGastadas == 0) {
            letras.forEach(Element => { Element.disabled = true });
            setTimeout(pantallaGanador, 300);
        } else {
            letras.forEach(Element => { Element.disabled = true });
            deshacerDibujo(); }
    }
}

let path = document.querySelector("path");
let pathLength = path.getTotalLength();
let recorrido;

function generarDibujo() {


    function switchRecorrido(vidasGastadas) {
        switch (vidasGastadas) {
            case 0:
                return 0 / 6;
            case 1:
                return 0.495 / 6;
            case 2:
                return 1.84 / 6;
            case 3:
                return 2.82 / 6;
            case 4:
                return 4.3 / 6;
            case 5:
                return 5.1 / 6;
            case 6:
                return 6 / 6;
            default:
                return 0;
        }
    }

    let dibujarLength = pathLength * switchRecorrido(vidasGastadas);
    recorrido = pathLength * switchRecorrido(vidasGastadas - 1);

    const funcionInterval = setInterval(() => {

        path.style.strokeDashoffset = pathLength - (recorrido + pathLength * 0.001);
        recorrido += pathLength * 0.001;

        if (dibujarLength <= recorrido) {
            clearInterval(funcionInterval);
            if (vidasGastadas >= 6) {
                setTimeout(pantallaPerdedor, 300);
            }
        }
    }, 5);
}

function deshacerDibujo() {

    let retro = 0;
    const funcionInterval = setInterval(() => {

        path.style.strokeDashoffset = pathLength - recorrido + retro;
        retro += pathLength * vidasGastadas * 0.001;

        if (retro >= recorrido) {
            path.style.strokeDashoffset = pathLength;
            clearInterval(funcionInterval)
            setTimeout(pantallaGanador, 300);
        }
    }, 5);
}

let svg = document.getElementById("dibujo");

function pantallaPerdedor() {
    derrotas += 1;
    tablero.innerHTML = puntuacion();
    if (ronda != elegirMatriz()) {
        btnJuego.style.cssText = "opacity: 1;";
    }

    svg.style.cssText = "background-image: url(images/colorsvg.png); background-size: cover;stroke: #343A40;";
    
    document.getElementById("body").style.cssText = "background-image: linear-gradient(white, rgba(255,0,0,0.1));";
    sfx.gameOver.play();

    //muestra las letras faltantes y las pinta de rojo
    for (let i = 0; i < palabra.length; i++) {
        let letraPalabra = palabra.substring(i, i + 1);
        let span = document.querySelectorAll("#palabra span");
        if (span[i].innerHTML == "") {
            span[i].innerHTML = letraPalabra.toUpperCase();
            span[i].style.cssText = "color: rgba(255,0,0);"
            for (let j = 0; j < letras.length; j++) {
                if (letras[j].innerHTML.toUpperCase() == span[i].innerHTML.toUpperCase()) {
                    letras[j].style.cssText = "font-family: 'Rubik Wet Paint', cursive; color:rgba(255,0,0)";
                }
            }
        }
    }

    if (ronda == elegirMatriz()) {
        juegoTerminado();
        document.getElementById("desistir").value = "Salir";
        document.getElementById("desistir").style.backgroundColor = "rgb(240, 191, 76)";
        letras.forEach(Element => { Element.disabled = true });
    } else {
        btnJuego.disabled = false;
    }

}

function pantallaGanador() {
    victorias += 1;
    tablero.innerHTML = puntuacion();

    if (ronda != elegirMatriz()) {
        btnJuego.style.cssText = "opacity: 1;";
    }


    document.getElementById("body").style.cssText = "background-image: linear-gradient(white, rgba(0,128,0,0.2));";
    sfx.goal.play();
    if (ronda == elegirMatriz()) {
        juegoTerminado();
        document.getElementById("desistir").value = "Salir";
        document.getElementById("desistir").style.backgroundColor = "rgb(240, 191, 76)";
        letras.forEach(Element => { Element.disabled = true });
    } else {
        btnJuego.disabled = false;
    }
}

//PopUp
let detenercronometro = false;

function juegoTerminado() {
    detenercronometro = true;

    const newMessage = document.createElement('div');
    newMessage.classList.add('mensajePopUp');

    const divContent = document.createElement('div');
    divContent.classList.add('divContentPopUp');

    const textMessage = document.createElement('h2');
    textMessage.classList.add('textPopUp');
    textMessage.innerHTML = "Puntaje: " + puntuacion() + "<br>Tiempo: " + s + "s";

    const closeButton = document.createElement('button');
    closeButton.classList.add('closeButtonPopUp');
    closeButton.innerHTML = 'Cerrar';

    closeButton.addEventListener('click', function () {
        body.removeChild(newMessage);
    });

    divContent.appendChild(textMessage);
    divContent.appendChild(closeButton);
    newMessage.appendChild(divContent);
    body.appendChild(newMessage);
}

function cuadroAlerta(contenido, clase) {
    const msj = document.querySelector(".alerta");

    const txt = document.createElement('p');
    txt.classList.add(clase);
    txt.innerHTML = contenido;

    msj.appendChild(txt);

    setTimeout(claseactive, 1500);

    function claseactive() {
        txt.classList.add("active");
    }

    setTimeout(removeraviso, 2000);

    function removeraviso() {
        msj.removeChild(txt);
    }

}

/* Pantalla completa */
var pantallaCompleta = document.querySelector("#pantalla-completa");
pantallaCompleta.onclick = fullScreen;
var elem = document.documentElement;

function fullScreen() {
    if (pantallaCompleta.value == "Pantalla completa") {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        pantallaCompleta.value = "Salir";
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        pantallaCompleta.value = "Pantalla completa";
    }
}

//medir tiempo de juego
let crono = document.getElementById("tiempo");
let s = 0;

function cronometro(){
    const intcron = setInterval(() => {
        s += 1;
        crono.innerHTML = s;
        if (detenercronometro) {
            clearInterval(intcron);
        }
    }, 1000);
}

//efectos de sonido
var sfx = {
    loos: new Howl({
      src: ["sounds/NOPE.mp3"],
    }),
    won: new Howl({
      src: ["sounds/DING.mp3"],
    }),
    gameOver: new Howl({
      src: ["sounds/HA HA (NELSON).mp3"],
    }),
    goal: new Howl({
      src: ["sounds/YAY.mp3"],
      loop: false,
    }),
  };