console.log("JS funcionando")

const base_url = "https://backend-studio41.onrender.com";

function cargaDinamica(contenedor, contenido) {

    contenedor.innerHTML = contenido;

}

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

/////////////////////////////////GUARDAR PETICION EN LOCALSTORAGE///////////////////////////

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

//////////////////////FORMULARIO///////////////////////////

const formulario = document.querySelector("form");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const direccionInput = document.getElementById("direccion");
const presupuestoInput = document.getElementById("presupuesto");

// Estado global temporal
let ultimaPeticion = null;

formulario.addEventListener("submit", enviarFormulario);

async function enviarFormulario(e) {
    e.preventDefault();

    const presupuestoValor = Number(presupuestoInput.value);

    const peticionData = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        direccion: direccionInput.value.trim(),
        presupuesto: presupuestoValor,
        servicios: JSON.parse(localStorage.getItem("carritoServicios")) || []
    };

    if (!peticionData.nombre || !peticionData.email || !peticionData.direccion || presupuestoValor <= 0) {
        alert("Todos los campos son obligatorios y el presupuesto debe ser válido.");
        return;
    }

    const resultado = await guardarPeticion(peticionData);

    if (resultado) {
        ultimaPeticion = resultado;
        mostrarModalConfirmacion(resultado);

        // limpia inputs
        formulario.querySelectorAll("input").forEach(input => (input.value = ""));
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
    const btnEditar = document.getElementById("btnEditar");
    const btnConfirmar = document.getElementById("btnConfirmar");

    modalContenido.innerHTML = `
        <p><strong>Nombre:</strong> ${peticion.nombre}</p>
        <p><strong>Email:</strong> ${peticion.email}</p>
        <p><strong>Dirección:</strong> ${peticion.direccion}</p>
        <p><strong>Presupuesto:</strong> USD ${peticion.presupuesto}</p>
        <p><strong>Servicios:</strong></p>
        <ul>
        ${peticion.servicios.length 
            ? peticion.servicios.map(s=> `<li>${s.plan} — ${s.categoria} (${s.precio} USD)</li>`).join("") 
            : "<li>No se seleccionaron servicios.</li>"}
        </ul>
    `;

    modal.classList.add("active");
    overlay.classList.add("active");

    // Guardamos el ID en localStorage (para editar luego)
    localStorage.setItem("ultimaPeticionId", peticion.id);

    // Limpio eventos previos
    btnEditar.replaceWith(btnEditar.cloneNode(true));
    btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));

    // vuelvo a capturarlos ya clonados
    const newBtnEditar = document.getElementById("btnEditar");
    const newBtnConfirmar = document.getElementById("btnConfirmar");

    // EVENTO EDITAR
    newBtnEditar.addEventListener("click", () => {
        cerrarModal();
        cargarDatosParaEdicion(peticion);
    });

    // EVENTO CONFIRMAR
    newBtnConfirmar.addEventListener("click", () => {
        cerrarModal();
        alert("Solicitud confirmada correctamente");
    });

}

function cerrarModal() {
    document.getElementById("modalConfirmacion").classList.remove("active");
    document.getElementById("modalOverlay").classList.remove("active");
}

const btnCerrar = document.getElementById("btnCerrar");
btnCerrar.addEventListener("click", cerrarModal);

document.getElementById("modalOverlay").addEventListener("click", cerrarModal);

//////////////////////////////////////////EDITAR PETICION///////////////////////////////

function cargarDatosParaEdicion(peticion) {

    // Rellenar campos
    nombreInput.value = peticion.nombre;
    emailInput.value = peticion.email;
    direccionInput.value = peticion.direccion;
    presupuestoInput.value = peticion.presupuesto;

    // Guardar ID en variable global
    ultimaPeticion = peticion;

    // Cambiar el texto del botón
    const btnSubmit = formulario.querySelector("button[type='submit']");
    btnSubmit.textContent = "Guardar cambios";

    // Eliminar event listener previo del formulario para evitar doble guardado
    formulario.removeEventListener("submit", enviarFormulario);

    // Agregar nuevo listener solo para actualizar
    formulario.addEventListener("submit", guardarEdicion);
}

async function guardarEdicion(e) {
    e.preventDefault();

    const nuevaData = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        direccion: direccionInput.value.trim(),
        presupuesto: Number(presupuestoInput.value),
        servicios: JSON.parse(localStorage.getItem("carritoServicios")) || []
    };

    if (!nuevaData.nombre || !nuevaData.email || !nuevaData.direccion || nuevaData.presupuesto <= 0) {
        alert("Todos los campos son obligatorios y el presupuesto debe ser válido.");
        return;
    }

    const resultado = await actualizarPeticion(ultimaPeticion.id, nuevaData);

    if (resultado) {
        alert("Datos actualizados correctamente ✔️");

        // limpiar inputs
        formulario.querySelectorAll("input").forEach(i => (i.value = ""));

        // restaurar botón a estado original
        const btnSubmit = formulario.querySelector("button[type='submit']");
        btnSubmit.textContent = "Enviar";

        // restaurar comportamiento original (POST)
        formulario.removeEventListener("submit", guardarEdicion);
        formulario.addEventListener("submit", enviarFormulario);
    }
}



/*OBTENER SERVICIOS*/

async function cargarServicios() {

    const res = await fetch(base_url+"/servicios");
    const servicios = await res.json();

    console.log("SERVICIOS:", servicios);
    return servicios;
}

cargarServicios();

/* hola */