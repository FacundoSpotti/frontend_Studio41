console.log("JS funcionando")

/* BOTONES e INPUTS */
const btnCerrar = document.getElementById("btnCerrar");
const btnCrear = document.getElementById("btnCrear");
const btnActualizar = document.getElementById("btnActualizar");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");
const modalOverlay = document.getElementById("modalOverlay");

const formulario = document.querySelector("form");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const ubicacionInput = document.getElementById("ubicacion");
const comentarioTextArea = document.getElementById("comentario");
const presupuestoInput = document.getElementById("presupuesto");

const base_url = "https://backend-studio41.onrender.com";

function cargaDinamica(contenedor, contenido) {

    contenedor.innerHTML = contenido;

}

/*OBTENER SERVICIOS*/

async function cargarServicios() {

    const res = await fetch(base_url+"/servicios");
    const servicios = await res.json();
    return servicios;
}

cargarServicios();

/*FUNCIONES ASINCRONICAS*/

async function crearPeticion(peticionData) {
    try {
        const response = await fetch(base_url+"/peticiones", {
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
        const response = await fetch(base_url+"/peticiones");
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

/////////////////////////////////GUARDAR PETICION////////////////////////////

async function guardarPeticion(data) {
    try {
        const response = await fetch(`${base_url}/peticiones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("No se pudo guardar la petición");

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

// Estado global temporal
let ultimaPeticion = null;

async function enviarFormulario(e) {
    e.preventDefault();

    const presupuestoValor = Number(presupuestoInput.value);

    const peticionData = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        ubicacion: ubicacionInput.value.trim(),
        presupuesto: presupuestoValor,
        comentario: comentarioTextArea.value.trim(),
    };

    if (!peticionData.nombre || !peticionData.email || !peticionData.ubicacion || presupuestoValor <= 0) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const resultado = await guardarPeticion(peticionData);

    if (resultado) {
        ultimaPeticion = resultado;
        mostrarModalConfirmacion(resultado);

        // limpia inputs
        formulario.querySelectorAll("input").forEach(input => (input.value = ""));
        comentarioTextArea.value = "";

    }
}

//////////////////////////////////ACTUALIZAR PETICION///////////////////////////////

async function actualizarPeticion(id, peticionData) {
    try {
        const response = await fetch(`${base_url}/peticiones/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(peticionData),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar petición: " + response.status);
        }

        const peticionActualizada = await response.json();
        console.log("Petición actualizada:", peticionActualizada);
        return peticionActualizada;

    } catch (error) {
        console.error("Error fetch:", error);
    }
}

//////////////////////////////////MOSTRAR MODAL///////////////////////////////

function mostrarModalConfirmacion(peticion) {

    const modal = document.getElementById("modalConfirmacion");
    const overlay = document.getElementById("modalOverlay");
    const modalContenido = document.getElementById("modalContenido");

    modalContenido.innerHTML = `
        <p><strong>Nombre:</strong> ${peticion.nombre}</p>
        <p><strong>eMail:</strong> ${peticion.email}</p>
        <p><strong>Dirección:</strong> ${peticion.ubicacion}</p>
        <p><strong>Presupuesto:</strong> USD ${peticion.presupuesto}</p>
        <p><strong>Comentario:</strong> ${peticion.comentario || "Sin comentario"}</p>
    `;

    modal.classList.add("active");
    overlay.classList.add("active");

    // Guardamos el ID en localStorage (para editar luego)
    localStorage.setItem("ultimaPeticionId", peticion._id || peticion.id);
    ultimaPeticion = peticion;

}

function cerrarModal() {
    document.getElementById("modalConfirmacion").classList.remove("active");
    document.getElementById("modalOverlay").classList.remove("active");
}

//////////////////////////////////////////EDITAR PETICION///////////////////////////////

function cargarDatosParaEdicion(peticion) {

    nombreInput.value = peticion.nombre;
    emailInput.value = peticion.email;
    ubicacionInput.value = peticion.ubicacion;
    presupuestoInput.value = peticion.presupuesto;
    comentarioTextArea.value = peticion.comentario || "";

    ultimaPeticion = peticion;

    btnCrear.style.display = "none";
    btnActualizar.style.display = "inline-block";

    cerrarModal();
}

async function guardarEdicion() {

    const id = localStorage.getItem("ultimaPeticionId");

    const nuevaData = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        ubicacion: ubicacionInput.value.trim(),
        presupuesto: Number(presupuestoInput.value),
        comentario: comentarioTextArea.value.trim(),
        servicios: JSON.parse(localStorage.getItem("carritoServicios")) || []
    };

    const result = await actualizarPeticion(id, nuevaData);

    if(result) {
        alert("Cambios guardados");

        formulario.reset();

        // Volver estado botones
        btnCrear.style.display = "inline-block";
        btnActualizar.style.display = "none";

        ultimaPeticion = null;
        localStorage.removeItem("ultimaPeticionId");
    }
}

async function eliminarPeticion(id) {
    try {
        const response = await fetch(`${base_url}/peticiones/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Error al eliminar petición: " + response.status);
        }

        return true;
    } catch (error) {
        console.error("Error eliminando:", error);
        return false;
    }
}

async function eliminarPeticionConfirmada() {
    const id = localStorage.getItem("ultimaPeticionId");

    await eliminarPeticion(id);

    alert("Solicitud eliminada");

    formulario.reset();
    ultimaPeticion = null;
    localStorage.removeItem("ultimaPeticionId");

    cerrarModal();
    
    // Restaurar botones
    btnCrear.style.display = "inline-block";
    btnActualizar.style.display = "none";
}

/* EVENTOS (se agregan solo una vez) */
formulario.addEventListener("submit", enviarFormulario);
btnActualizar.addEventListener("click", guardarEdicion);
btnEditar.addEventListener("click", () => cargarDatosParaEdicion(ultimaPeticion));
btnEliminar.addEventListener("click", eliminarPeticionConfirmada);
btnCerrar.addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", cerrarModal);
