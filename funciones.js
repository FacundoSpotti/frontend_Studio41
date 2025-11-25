const { url } = require("inspector");

function cargaDinamica(contenedor, contenido) {

    contenedor.innerHTML = contenido;
}

/*FUNCIONES ASINCRONICAS*/

async function crearPeticion(peticionData) {
    try {
        const response = await fetch("http://localhost:3000/peticiones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(peticionData),
        });

        if (!response.ok) {
            throw new Error("Error al crear petición: " + response.status);
        }

        const nuevaPeticion = await response.json();
        console.log("Petición creada:", nuevaPeticion);
        return nuevaPeticion;

    } catch (error) {
        console.error("Error fetch:", error);
    }
}

async function obtenerPeticiones() {
    try {
        const response = await fetch("http://localhost:3000/peticiones");
        if (!response.ok) {
            throw new Error("Error al obtener peticiones: " + response.status);
        }
        const peticiones = await response.json();
        console.log("Peticiones recibidas:", peticiones);
        return peticiones;
    } catch (error) {
        console.error("Error fetch:", error);
    }
}


/*OBTENER SERVICIOS*/

async function cargarServicios() {

    const res = await fetch("http://localhost:3000/servicios");
    const servicios = await res.json();

    console.log("SERVICIOS:", servicios);
    return servicios;
}

cargarServicios();





