const base_url = "https://backend-studio41.onrender.com";

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

function cargaDinamica(contenedor, contenido) {

    contenedor.innerHTML = contenido;

}

/*cargar servicios*/

async function cargarServicios() {

    const res = await fetch(base_url+"/servicios");
    const servicios = await res.json();

    return servicios;
}

/*CRUD*/

async function crearSolicitud(solicitudData) {
    try {
        const response = await fetch(base_url+"/solicitudes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(solicitudData),
        });

        if (!response.ok) {
            throw new Error("Error al crear solicitud: " + response.status);
        }

        const nuevaSolicitud = await response.json();
        console.log("Solicitud creada:", nuevaSolicitud);
        return nuevaSolicitud;

    } catch (error) {
        console.error("Error fetch:", error);
    }
}

async function obtenerSolicitud() {
    try {
        const response = await fetch(base_url+"/solicitudes");
        if (!response.ok) {
            throw new Error("Error al obtener solicitudes: " + response.status);
        }
        const solicitudes = await response.json();
        console.log("Solicitudes recibidas:", solicitudes);
        return solicitudes;
    } catch (error) {
        console.error("Error fetch:", error);
    }
}

async function guardarSolicitud(data) {
    try {
        const response = await fetch(`${base_url}/solicitudes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("No se pudo guardar la solicitud");

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
    const carritoIds = JSON.parse(localStorage.getItem("carritoServicios")) || [];
    const serviciosLista = await cargarServicios(); // ← importante

    const serviciosSeleccionados = carritoIds.map(id => serviciosLista[id - 1]);

    const solicitudData = {
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim(),
        ubicacion: ubicacionInput.value.trim(),
        presupuesto: presupuestoValor,
        comentario: comentarioTextArea.value.trim(),
        servicios: serviciosSeleccionados   // ← ahora sí mandamos objetos completos
    };

    console.log("ENVIANDO:", solicitudData); // debug

    const resultado = await guardarSolicitud(solicitudData);

    if (resultado) {
        ultimaSolicitud = resultado;
        mostrarModalConfirmacion(resultado);
        formulario.reset();
    }
}

async function actualizarSolicitud(id, solicitudData) {
    try {
        const response = await fetch(`${base_url}/solicitudes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(solicitudData),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar solicitud: " + response.status);
        }

        const solicitudActualizada = await response.json();
        console.log("Solicitud actualizada:", solicitudActualizada);
        return solicitudActualizada;

    } catch (error) {
        console.error("Error fetch:", error);
    }
}

async function mostrarModalConfirmacion(solicitud) {

    const modal = document.getElementById("modalConfirmacion");
    const overlay = document.getElementById("modalOverlay");
    const modalContenido = document.getElementById("modalContenido");

    let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];
    const servicios = await cargarServicios();

    // Convertir IDs guardados en carrito → nombres de servicio
    const serviciosTexto = carrito.length > 0
        ? carrito.map(id => servicios[id]?.categoria || "(desconocido)").join(", ")
        : "Sin servicios seleccionados";

    modalContenido.innerHTML = `
        <p><strong>Nombre:</strong> ${solicitud.nombre}</p>
        <p><strong>eMail:</strong> ${solicitud.email}</p>
        <p><strong>Dirección:</strong> ${solicitud.ubicacion}</p>
        <p><strong>Presupuesto:</strong> USD ${solicitud.presupuesto}</p>
        <p><strong>Comentario:</strong> ${solicitud.comentario || "Sin comentario"}</p>
        <p><strong>Servicios:</strong> ${serviciosTexto}</p>
    `;

    modal.classList.add("active");
    overlay.classList.add("active");

    localStorage.setItem("ultimaPeticionId", solicitud._id || solicitud.id);
    ultimaSolicitud = solicitud;
}

function cerrarModal() {
    document.getElementById("modalConfirmacion").classList.remove("active");
    document.getElementById("modalOverlay").classList.remove("active");
}

function cargarDatosParaEdicion(peticion) {

    nombreInput.value = solicitud.nombre;
    emailInput.value = solicitud.email;
    ubicacionInput.value = solicitud.ubicacion;
    presupuestoInput.value = solicitud.presupuesto;
    comentarioTextArea.value = solicitud.comentario || "";

    ultimaSolicitud = solicitud;

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

    const result = await actualizarSolicitud(id, nuevaData);

    if(result) {
        alert("Cambios guardados");

        formulario.reset();

        // Volver estado botones
        btnCrear.style.display = "inline-block";
        btnActualizar.style.display = "none";

        ultimaSolicitud = null;
        localStorage.removeItem("ultimaPeticionId");
    }
}

async function eliminarSolicitudConfirmada() {
    const id = localStorage.getItem("ultimaPeticionId");

    await eliminarSolicitud(id);

    alert("Solicitud eliminada");

    formulario.reset();
    ultimaSolicitud = null;
    localStorage.removeItem("ultimaPeticionId");

    cerrarModal();
    
    // Restaurar botones
    btnCrear.style.display = "inline-block";
    btnActualizar.style.display = "none";
}

/* EVENTOS (se agregan solo una vez) */
formulario.addEventListener("submit", enviarFormulario);
btnActualizar.addEventListener("click", guardarEdicion);
btnEditar.addEventListener("click", () => cargarDatosParaEdicion(ultimaSolicitud));
btnEliminar.addEventListener("click", eliminarSolicitudConfirmada);
btnCerrar.addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", cerrarModal);

/*mostrar servicios seleccionados*/

async function mostrarServicios() { 

    try {

        let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];

        if (carrito.length === 0) {
            window.location.href = "servicios.html"; 
            return;
        }

        const contenedorServicios = document.querySelector('#servicio-carrito');
        const servicios = await cargarServicios();
        let cadaServicio = '';

        carrito.forEach((id) => {

            cadaServicio +=
            
                    `<article class="project project--small" data-id="${id}">
                        <button class="btnEliminarServicio">✕</button>
                            <div class="project_img" 
                                style="background-image:url('${servicios[id-1].image}'); 
                                background-size:cover; 
                                background-position:center;">
                            </div>
                            <div class="project_info project_info--small">
                                <span class="project_label">${servicios[id-1].plan}</span>
                                <span class="project_label">${servicios[id-1].titulo}</span>
                                <span class="project_label">${servicios[id-1].precio}${servicios[id-1].moneda}</span>
                                <p>${servicios[id-1].descripcion}</p>
                            </div>
                    </article>`     
            });

        const contenidoServicios = `
            <div class="project-grid">
                ${cadaServicio}
            </div>`;

        cargaDinamica(contenedorServicios, contenidoServicios);

        const botones = document.querySelectorAll(".btnEliminarServicio");

        botones.forEach(btn => {
            
            btn.addEventListener("click", function() {
                
                const card = this.parentElement;
                const id = card.getAttribute("data-id");

                carrito = carrito.filter(serv => serv !== id);
                localStorage.setItem("carritoServicios", JSON.stringify(carrito));

                card.remove();

                if (carrito.length === 0) {
                    window.location.href = "servicios.html";
                }
            });
        });
    }
    
    catch (error) {

        console.error("Error al mostrar servicios:", error);

    }

}

mostrarServicios();
