"use strict";


/* ============================================================
   CONFIGURACIÓN GENERAL
   ============================================================ */

/*
    Puntos exactos desde donde debe comenzar cada canción.

    Song1 empieza en 00:17.
    Song2 empieza en 01:31 = 91 segundos.
*/
const INICIO_SONG_1 = 17;
const INICIO_SONG_2 = 91;


/*
    Detectamos si la persona tiene configurada la reducción
    de movimiento en su dispositivo.

    En ese caso evitamos generar pétalos flotantes y otras
    animaciones innecesarias.
*/
const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* ============================================================
   ELEMENTOS DE LA INTERFAZ
   ============================================================ */

const pantallaInicial =
    document.getElementById("pantallaInicial");

const escenaPrincipal =
    document.getElementById("escenaPrincipal");

const botonComenzar =
    document.getElementById("botonComenzar");


const jardin =
    document.getElementById("jardin");

const petalosFlotantes =
    document.getElementById("petalosFlotantes");

/*
    Contenedor de las dos abejas decorativas.
*/
const abejas =
    document.getElementById("abejas");



const mensaje =
    document.getElementById("mensaje");

const cierre =
    document.getElementById("cierre");


const controlAudio =
    document.getElementById("controlAudio");

const iconoAudio =
    document.getElementById("iconoAudio");


const song1 =
    document.getElementById("song1");

const song2 =
    document.getElementById("song2");


/* ============================================================
   ESTADO DE LA EXPERIENCIA
   ============================================================ */

/*
    Estas variables nos permiten saber qué parte de la
    experiencia está activa.
*/
let experienciaIniciada = false;

let segundaParteIniciada = false;

let audioActivo = null;


/*
    Guardamos referencias a temporizadores para evitar
    crear varios al mismo tiempo.
*/
let temporizadorMensaje = null;

let intervaloPetalos = null;


/* ============================================================
   PREPARACIÓN DE LOS AUDIOS
   ============================================================ */

/*
    Dejamos cada archivo preparado en el segundo correcto.

    Si el navegador ya conoce la información del archivo,
    movemos inmediatamente su posición.

    Si todavía no terminó de cargar los metadatos,
    esperamos hasta que estén disponibles.
*/
function prepararPuntoInicio(audio, segundo) {

    const posicionar = () => {

        try {

            audio.currentTime = segundo;

        } catch (error) {

            console.warn(
                "No se pudo posicionar el audio todavía:",
                error
            );

        }

    };


    if (audio.readyState >= 1) {

        posicionar();

        return;

    }


    audio.addEventListener(
        "loadedmetadata",
        posicionar,
        {
            once: true
        }
    );

}


prepararPuntoInicio(
    song1,
    INICIO_SONG_1
);

prepararPuntoInicio(
    song2,
    INICIO_SONG_2
);


/* ============================================================
   DATOS DEL JARDÍN
   ============================================================ */

/*
    En lugar de crear todas las flores iguales, definimos
    cada una individualmente.

    Esto permite variar:

    - posición
    - altura
    - tamaño
    - inclinación
    - tipo de flor
    - número de pétalos

    Así el resultado se siente mucho más orgánico.
*/
const flores = [

    /* --------------------------------------------------------
       GRUPO 1
       Las primeras flores aparecen cerca del centro.
       -------------------------------------------------------- */

    {
        grupo: 1,
        tipo: "girasol",
        x: 50,
        altura: 17,
        escala: 0.96,
        inclinacion: -3,
        retraso: 0,
        petalos: 18
    },

    {
        grupo: 1,
        tipo: "coreopsis",
        x: 59,
        altura: 12,
        escala: 0.78,
        inclinacion: 7,
        retraso: 0.25,
        petalos: 8
    },

    {
        grupo: 1,
        tipo: "margarita",
        x: 41,
        altura: 13.5,
        escala: 0.82,
        inclinacion: -8,
        retraso: 0.42,
        petalos: 12
    },


    /* --------------------------------------------------------
       GRUPO 2
       El jardín comienza a expandirse.
       -------------------------------------------------------- */

    {
        grupo: 2,
        tipo: "calendula",
        x: 28,
        altura: 16,
        escala: 0.9,
        inclinacion: -6,
        retraso: 0.08,
        petalos: 16
    },

    {
        grupo: 2,
        tipo: "simple",
        x: 19,
        altura: 10.5,
        escala: 0.72,
        inclinacion: 9,
        retraso: 0.32,
        petalos: 7
    },

    {
        grupo: 2,
        tipo: "girasol",
        x: 72,
        altura: 18.5,
        escala: 0.88,
        inclinacion: 6,
        retraso: 0.18,
        petalos: 18
    },

    {
        grupo: 2,
        tipo: "coreopsis",
        x: 82,
        altura: 12,
        escala: 0.74,
        inclinacion: -7,
        retraso: 0.48,
        petalos: 8
    },


    /* --------------------------------------------------------
       GRUPO 3
       El jardín llega a los extremos.
       -------------------------------------------------------- */

    {
        grupo: 3,
        tipo: "margarita",
        x: 8,
        altura: 14,
        escala: 0.75,
        inclinacion: 10,
        retraso: 0.1,
        petalos: 12
    },

    {
        grupo: 3,
        tipo: "girasol",
        x: 91,
        altura: 15.5,
        escala: 0.78,
        inclinacion: -10,
        retraso: 0.25,
        petalos: 18
    },

    {
        grupo: 3,
        tipo: "calendula",
        x: 35,
        altura: 9.5,
        escala: 0.7,
        inclinacion: 5,
        retraso: 0.4,
        petalos: 16
    },

    {
        grupo: 3,
        tipo: "coreopsis",
        x: 65,
        altura: 10.5,
        escala: 0.76,
        inclinacion: -4,
        retraso: 0.55,
        petalos: 8
    },


    /* --------------------------------------------------------
       GRUPO 4
       Flores pequeñas del primer plano.
       -------------------------------------------------------- */

    {
        grupo: 4,
        tipo: "simple",
        x: 13,
        altura: 8.5,
        escala: 0.66,
        inclinacion: -7,
        retraso: 0,
        petalos: 7
    },

    {
        grupo: 4,
        tipo: "margarita",
        x: 23,
        altura: 11.5,
        escala: 0.76,
        inclinacion: 7,
        retraso: 0.12,
        petalos: 12
    },

    {
        grupo: 4,
        tipo: "calendula",
        x: 44,
        altura: 8,
        escala: 0.64,
        inclinacion: -4,
        retraso: 0.2,
        petalos: 16
    },

    {
        grupo: 4,
        tipo: "coreopsis",
        x: 55,
        altura: 9.5,
        escala: 0.72,
        inclinacion: 5,
        retraso: 0.28,
        petalos: 8
    },

    {
        grupo: 4,
        tipo: "simple",
        x: 76,
        altura: 9,
        escala: 0.68,
        inclinacion: -6,
        retraso: 0.36,
        petalos: 7
    },

    {
        grupo: 4,
        tipo: "calendula",
        x: 87,
        altura: 11,
        escala: 0.75,
        inclinacion: 8,
        retraso: 0.44,
        petalos: 16
    },


    /* --------------------------------------------------------
       GRUPO 5
       Flores protagonistas altas.

       Este grupo aparece cuando comienza Song2.

       Su objetivo es conectar visualmente el jardín inferior
       con el espacio central sin llenar completamente la pantalla.
       -------------------------------------------------------- */

    {
        grupo: 5,
        tipo: "coreopsis",
        x: 31,
        altura: 23.5,
        escala: 0.88,
        inclinacion: -7,
        retraso: 0,
        petalos: 8,
        alta: true
    },

    {
        grupo: 5,
        tipo: "calendula",
        x: 51,
        altura: 28,
        escala: 0.9,
        inclinacion: 4,
        retraso: 0.32,
        petalos: 16,
        alta: true
    },

    {
        grupo: 5,
        tipo: "margarita",
        x: 70,
        altura: 24.5,
        escala: 0.86,
        inclinacion: 8,
        retraso: 0.55,
        petalos: 12,
        alta: true
    }

];


/* ============================================================
   CREACIÓN DE UNA FLOR
   ============================================================ */

function crearFlor(configuracion) {

    /*
        Contenedor principal de la flor.
    */
    const flor =
        document.createElement("div");


    flor.className = [
        "flor",
        `flor--${configuracion.tipo}`
    ].join(" ");


    /*
        Pasamos los valores del objeto a variables CSS.

        De esta forma JavaScript decide la personalidad
        de cada flor y CSS se encarga de dibujarla.
    */
    flor.style.setProperty(
        "--x",
        `${configuracion.x}%`
    );

    /*
        Las flores protagonistas pueden ser muy altas en escritorio,
        pero limitamos su altura en pantallas cortas.

        De esta forma nunca invaden el mensaje superior.
    */
    const alturaFlor =
        configuracion.alta
            ? `min(${configuracion.altura}rem, 54vh)`
            : `${configuracion.altura}rem`;


    flor.style.setProperty(
        "--altura",
        alturaFlor
    );

    flor.style.setProperty(
        "--escala",
        configuracion.escala
    );

    flor.style.setProperty(
        "--inclinacion",
        `${configuracion.inclinacion}deg`
    );

    flor.style.setProperty(
        "--retraso",
        `${configuracion.retraso}s`
    );


    /*
        Las flores altas quedan detrás de las flores pequeñas.

        Esto genera tres niveles visuales:
        fondo, plano medio y primer plano.
    */
    flor.style.zIndex = Math.max(
        1,
        Math.round(
            30 - configuracion.altura
        )
    );


    /* --------------------------------------------------------
       TALLO
       -------------------------------------------------------- */

    const tallo =
        document.createElement("span");

    tallo.className =
        "tallo-flor";


    /* --------------------------------------------------------
       HOJAS
       -------------------------------------------------------- */

    const hojaIzquierda =
        document.createElement("span");

    hojaIzquierda.className = [
        "hoja-flor",
        "hoja-flor--izquierda"
    ].join(" ");


    const hojaDerecha =
        document.createElement("span");

    hojaDerecha.className = [
        "hoja-flor",
        "hoja-flor--derecha"
    ].join(" ");


    /* --------------------------------------------------------
       CABEZA DE LA FLOR
       -------------------------------------------------------- */

    const cabeza =
        document.createElement("div");

    cabeza.className =
        "flor-cabeza";


    const coronaPetalos =
        document.createElement("div");

    coronaPetalos.className =
        "corona-petalos";


    /*
        Creamos cada pétalo alrededor del centro.

        Por ejemplo, una flor de 12 pétalos divide
        los 360 grados entre 12.
    */
    for (
        let indice = 0;
        indice < configuracion.petalos;
        indice += 1
    ) {

        const petalo =
            document.createElement("span");


        const angulo =
            (
                360 /
                configuracion.petalos
            ) * indice;


        petalo.className =
            "petalo-flor";


        petalo.style.setProperty(
            "--angulo",
            `${angulo}deg`
        );

        /*
            La caléndula tendrá dos capas visuales.

            Los pétalos impares quedan más cerca del centro y
            ligeramente más pequeños, dando la sensación de
            una flor más abundante.
        */
        if (
            configuracion.tipo ===
            "calendula"
        ) {

            const petaloInterior =
                indice % 2 !== 0;


            petalo.style.setProperty(
                "--radio-petalo",
                petaloInterior
                    ? "-11%"
                    : "-35%"
            );


            petalo.style.setProperty(
                "--escala-petalo",
                petaloInterior
                    ? "0.74"
                    : "1"
            );

        }



        coronaPetalos.appendChild(
            petalo
        );

    }


    /*
        Centro de la flor.
    */
    const centro =
        document.createElement("span");

    centro.className =
        "disco-flor";


    /*
        Armamos toda la cabeza.
    */
    cabeza.appendChild(
        coronaPetalos
    );

    cabeza.appendChild(
        centro
    );


    /*
        Armamos finalmente la flor completa.
    */
    flor.appendChild(
        tallo
    );

    flor.appendChild(
        hojaIzquierda
    );

    flor.appendChild(
        hojaDerecha
    );

    flor.appendChild(
        cabeza
    );


    jardin.appendChild(
        flor
    );


    /*
        Primero dejamos que termine de abrirse.

        Después activamos el pequeño movimiento
        de brisa.
    */
    if (!movimientoReducido) {

        const tiempoHastaBrisa =
            (
                configuracion.retraso +
                2.8
            ) * 1000;


        window.setTimeout(
            () => {

                flor.classList.add(
                    "flor-viva"
                );

            },
            tiempoHastaBrisa
        );

    }

}


/* ============================================================
   CREACIÓN DE GRUPOS DE FLORES
   ============================================================ */

function mostrarGrupoFlores(numeroGrupo) {

    flores

        .filter(
            (flor) =>
                flor.grupo === numeroGrupo
        )

        .forEach(
            crearFlor
        );

}


/* ============================================================
   MENSAJES
   ============================================================ */

function mostrarMensaje(texto) {

    /*
        Evitamos que quede pendiente un cambio anterior.
    */
    window.clearTimeout(
        temporizadorMensaje
    );


    /*
        Esta función coloca la nueva frase y
        activa su animación.
    */
    const cambiarTexto = () => {

        mensaje.textContent =
            texto;


        mensaje.classList.remove(
            "saliendo"
        );


        /*
            Esperamos dos frames.

            Esto permite que el navegador registre primero
            el estado inicial y después anime correctamente
            la aparición.
        */
        window.requestAnimationFrame(
            () => {

                window.requestAnimationFrame(
                    () => {

                        mensaje.classList.add(
                            "visible"
                        );

                    }
                );

            }
        );

    };


    /*
        Si todavía no había ningún mensaje visible,
        mostramos directamente el primero.
    */
    if (
        !mensaje.classList.contains(
            "visible"
        )
    ) {

        cambiarTexto();

        return;

    }


    /*
        Si ya existe una frase, primero la retiramos
        suavemente.
    */
    mensaje.classList.add(
        "saliendo"
    );


    temporizadorMensaje =
        window.setTimeout(
            () => {

                mensaje.classList.remove(
                    "visible"
                );

                cambiarTexto();

            },
            movimientoReducido
                ? 0
                : 420
        );

}


/* ============================================================
   OCULTAR MENSAJE
   ============================================================ */

function ocultarMensaje() {

    window.clearTimeout(
        temporizadorMensaje
    );


    mensaje.classList.add(
        "saliendo"
    );


    mensaje.classList.remove(
        "visible"
    );

}


/* ============================================================
   CIERRE FINAL
   ============================================================ */

function mostrarCierre() {

    /*
        Primero desaparece la última frase.
    */
    ocultarMensaje();


    /*
        Después aparece el cierre sobre el jardín
        completamente florecido.
    */
    window.setTimeout(
        () => {

            cierre.classList.add(
                "visible"
            );


            cierre.setAttribute(
                "aria-hidden",
                "false"
            );

        },
        movimientoReducido
            ? 0
            : 650
    );

}


/* ============================================================
   PÉTALOS FLOTANTES
   ============================================================ */

function crearPetaloFlotante() {

    /*
        Si la persona pidió reducir movimiento,
        no generamos partículas.
    */
    if (movimientoReducido) {

        return;

    }


    const petalo =
        document.createElement("span");


    /*
        Cada pétalo recibe valores ligeramente distintos
        para que el movimiento no parezca repetitivo.
    */
    const xInicial =
        Math.random() * 100;


    const desplazamiento =
        10 +
        Math.random() * 24;


    const direccion =
        Math.random() > 0.5
            ? 1
            : -1;


    petalo.className =
        "petalo-flotante";


    petalo.style.setProperty(
        "--x-inicial",
        `${xInicial}vw`
    );


    petalo.style.setProperty(
        "--x-final",
        `${
            xInicial +
            desplazamiento *
            direccion
        }vw`
    );


    petalo.style.setProperty(
        "--duracion",
        `${
            7 +
            Math.random() * 5
        }s`
    );


    petalo.style.setProperty(
        "--retraso-petalo",
        `${
            Math.random() * 0.8
        }s`
    );


    petalo.style.setProperty(
        "--tamano-petalo",
        `${
            0.65 +
            Math.random() * 0.55
        }rem`
    );


    petalosFlotantes.appendChild(
        petalo
    );


    /*
        Cuando el pétalo termina de caer,
        lo eliminamos del HTML.

        Así evitamos acumular elementos innecesarios.
    */
    petalo.addEventListener(
        "animationend",
        () => petalo.remove(),
        {
            once: true
        }
    );

}


/* ============================================================
   LANZAR VARIOS PÉTALOS
   ============================================================ */

function lanzarPetalos(cantidad = 8) {

    for (
        let indice = 0;
        indice < cantidad;
        indice += 1
    ) {

        window.setTimeout(
            crearPetaloFlotante,
            indice * 150
        );

    }

}


/* ============================================================
   PÉTALOS CONTINUOS
   ============================================================ */

function iniciarPetalosContinuos() {

    /*
        Evitamos crear más de un intervalo.
    */
    if (
        movimientoReducido ||
        intervaloPetalos
    ) {

        return;

    }


    /*
        Primera pequeña lluvia.
    */
    lanzarPetalos(10);


    /*
        Después aparecen solamente algunos pétalos
        cada cierto tiempo.

        No queremos una tormenta amarilla.
    */
    intervaloPetalos =
        window.setInterval(
            () => {

                lanzarPetalos(3);

            },
            3200
        );

}


/* ============================================================
   ABEJAS
   ============================================================ */

/*
    Las abejas aparecen únicamente después de que el jardín
    está suficientemente desarrollado.

    No intervienen en la experiencia ni reciben clics:
    son solamente un detalle visual.
*/
function activarAbejas() {

    abejas.classList.add(
        "activas"
    );

}


/* ============================================================
   LÍNEA DE TIEMPO DE SONG1
   ============================================================ */

/*
    Estos tiempos corresponden al tiempo REAL del MP3.

    Como comenzamos Song1 en el segundo 17,
    la primera acción sucede apenas después.
*/
const accionesSong1 = [

    {
        tiempo: 17.6,

        ejecutada: false,

        accion: () =>

            mostrarMensaje(
                "Hoy no podían faltar…"
            )
    },


    {
        tiempo: 18.6,

        ejecutada: false,

        accion: () =>
            mostrarGrupoFlores(1)
    },


    {
        tiempo: 21.2,

        ejecutada: false,

        accion: () =>

            mostrarMensaje(
                "unas flores amarillas para ti 🌼"
            )
    },


    {
        tiempo: 22.0,

        ejecutada: false,

        accion: () =>
            mostrarGrupoFlores(2)
    },


    {
        tiempo: 25.1,

        ejecutada: false,

        accion: () =>

            mostrarMensaje(
                "No te lo digo muchas veces…"
            )
    },


    {
        tiempo: 26.0,

        ejecutada: false,

        accion: () =>
            mostrarGrupoFlores(3)
    },


    {
        tiempo: 29.2,

        ejecutada: false,

        accion: () =>

            mostrarMensaje(
                "pero te quiero mucho 💛"
            )
    },


    {
        tiempo: 31.2,

        ejecutada: false,

        accion: () =>
            mostrarGrupoFlores(4)
    }

];


/* ============================================================
   LÍNEA DE TIEMPO DE SONG2
   ============================================================ */

/*
    Song2 comienza desde el segundo 91.

    En esta segunda parte el jardín ya está prácticamente
    completo y comenzamos con los pétalos flotantes.
*/
const accionesSong2 = [

    /*
        Primero nacen las tres flores altas.

        Esto ocurre apenas comienza Song2 para que el centro
        de la pantalla gane profundidad progresivamente.
    */
    {
        tiempo: 91.2,

        ejecutada: false,

        accion: () =>
            mostrarGrupoFlores(5)
    },


    /*
        Comienzan los pétalos suaves.
    */
    {
        tiempo: 91.5,

        ejecutada: false,

        accion: () => {

            iniciarPetalosContinuos();

            lanzarPetalos(7);

        }
    },


    {
        tiempo: 92.2,

        ejecutada: false,

        accion: () =>

            mostrarMensaje(
                "Gracias por tantos momentos…"
            )
    },


    /*
        Cuando las flores altas ya comenzaron a crecer,
        aparecen las dos abejitas.
    */
    {
        tiempo: 93.4,

        ejecutada: false,

        accion: activarAbejas
    },


    {
        tiempo: 96.6,

        ejecutada: false,

        accion: () =>

            mostrarMensaje(
                "y por aguantarme siempre."
            )
    },


    {
        tiempo: 100.2,

        ejecutada: false,

        accion: () =>
            lanzarPetalos(10)
    },


    {
        tiempo: 103.7,

        ejecutada: false,

        accion: mostrarCierre
    }

];


/* ============================================================
   PROCESAR UNA LÍNEA DE TIEMPO
   ============================================================ */

function procesarAcciones(
    audio,
    acciones
) {

    const tiempoActual =
        audio.currentTime;


    acciones.forEach(
        (accion) => {

            /*
                Ejecutamos cada acción una sola vez cuando
                el audio llega al momento correspondiente.
            */
            if (
                !accion.ejecutada &&
                tiempoActual >=
                    accion.tiempo
            ) {

                accion.ejecutada = true;

                accion.accion();

            }

        }
    );

}


/* ============================================================
   SINCRONIZACIÓN CON SONG1
   ============================================================ */

song1.addEventListener(
    "timeupdate",
    () => {

        procesarAcciones(
            song1,
            accionesSong1
        );

    }
);


/* ============================================================
   SINCRONIZACIÓN CON SONG2
   ============================================================ */

song2.addEventListener(
    "timeupdate",
    () => {

        procesarAcciones(
            song2,
            accionesSong2
        );

    }
);


/* ============================================================
   INICIAR LA EXPERIENCIA
   ============================================================ */

async function iniciarExperiencia() {

    /*
        Evitamos que pueda ejecutarse dos veces.
    */
    if (experienciaIniciada) {

        return;

    }


    experienciaIniciada = true;


    botonComenzar.disabled =
        true;


    /*
        Retiramos la pantalla inicial.
    */
    pantallaInicial.classList.add(
        "oculta"
    );


    /*
        Mostramos la escena donde crecerán las flores.
    */
    escenaPrincipal.classList.add(
        "activa"
    );


    escenaPrincipal.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
        Mostramos el pequeño control musical.
    */
    controlAudio.classList.remove(
        "oculto"
    );


    /*
        Song1 se convierte en el audio activo.
    */
    audioActivo = song1;


    actualizarControlAudio();


    /*
        Nos aseguramos nuevamente de comenzar
        exactamente en el segundo 17.
    */
    try {

        song1.currentTime =
            INICIO_SONG_1;


        song1.volume =
            1;


        await song1.play();

    } catch (error) {

        /*
            Si algún navegador bloqueara el audio,
            la página seguirá abierta.

            El botón musical permitirá intentar
            reproducirlo nuevamente.
        */
        console.warn(
            "El navegador no permitió iniciar el audio automáticamente.",
            error
        );


        actualizarControlAudio();

    }

}


/* ============================================================
   BOTÓN DE INICIO
   ============================================================ */

botonComenzar.addEventListener(
    "click",
    iniciarExperiencia,
    {
        once: true
    }
);


/* ============================================================
   CAMBIO DE SONG1 A SONG2
   ============================================================ */

async function iniciarSegundaParte() {

    /*
        Evitamos ejecutar la transición dos veces.
    */
    if (segundaParteIniciada) {

        return;

    }


    segundaParteIniciada =
        true;


    /*
        Song2 se convierte ahora en el audio activo.
    */
    audioActivo =
        song2;


    try {

        /*
            Comenzamos exactamente desde 01:31.
        */
        song2.currentTime =
            INICIO_SONG_2;


        song2.volume =
            1;


        await song2.play();

    } catch (error) {

        console.warn(
            "No se pudo iniciar la segunda canción.",
            error
        );

    }


    actualizarControlAudio();

}


/*
    Apenas termina Song1 comienza Song2.
*/
song1.addEventListener(
    "ended",
    iniciarSegundaParte
);


/* ============================================================
   REPETIR SONG2
   ============================================================ */

/*
    Song2 debe seguir sonando mientras la página
    permanezca abierta.

    No utilizamos el atributo HTML "loop" porque ese
    atributo volvería al segundo 0.

    Nosotros necesitamos volver siempre a 01:31.
*/
song2.addEventListener(
    "ended",
    async () => {

        try {

            song2.currentTime =
                INICIO_SONG_2;


            await song2.play();

        } catch (error) {

            console.warn(
                "No se pudo repetir la segunda canción.",
                error
            );

        }

    }
);


/* ============================================================
   CONTROL DE AUDIO
   ============================================================ */

function actualizarControlAudio() {

    if (!audioActivo) {

        return;

    }


    const estaPausado =
        audioActivo.paused;


    /*
        Si está reproduciendo mostramos pausa.

        Si está detenido mostramos reproducción.
    */
    iconoAudio.textContent =
        estaPausado
            ? "▶"
            : "❚❚";


    const texto =
        estaPausado
            ? "Reanudar música"
            : "Pausar música";


    controlAudio.setAttribute(
        "aria-label",
        texto
    );


    controlAudio.setAttribute(
        "title",
        texto
    );

}


/* ============================================================
   PAUSAR / REANUDAR MÚSICA
   ============================================================ */

controlAudio.addEventListener(
    "click",
    async () => {

        if (!audioActivo) {

            return;

        }


        try {

            if (audioActivo.paused) {

                await audioActivo.play();

            } else {

                audioActivo.pause();

            }

        } catch (error) {

            console.warn(
                "No se pudo cambiar el estado del audio.",
                error
            );

        }


        actualizarControlAudio();

    }
);


/* ============================================================
   ACTUALIZAR EL ÍCONO DEL AUDIO
   ============================================================ */

song1.addEventListener(
    "play",
    actualizarControlAudio
);

song1.addEventListener(
    "pause",
    actualizarControlAudio
);

song2.addEventListener(
    "play",
    actualizarControlAudio
);

song2.addEventListener(
    "pause",
    actualizarControlAudio
);


/* ============================================================
   LIMPIEZA AL SALIR DE LA PÁGINA
   ============================================================ */

/*
    Cuando la página deja de estar activa eliminamos
    el intervalo que genera pétalos.

    Es una pequeña medida de limpieza y rendimiento.
*/
window.addEventListener(
    "pagehide",
    () => {

        if (intervaloPetalos) {

            window.clearInterval(
                intervaloPetalos
            );


            intervaloPetalos =
                null;

        }

    }
);