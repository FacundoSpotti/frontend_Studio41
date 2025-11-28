const base_url = "https://backend-studio41.onrender.com";
const formulario = document.querySelector("form");

/* -------- Cargar servicios -------- */

async function cargarServicios() {
    const res = await fetch(base_url + "/servicios");
    return await res.json();
}

async function mostrarServicios() {

    let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];

    if (carrito.length === 0) {
        window.location.href = "servicios.html";
        return;
    }

    const contenedor = document.querySelector("#servicio-carrito");
    const servicios = await cargarServicios();
    let contenedorServicios = "";

    carrito.forEach((id) => {
        const servicio = servicios.find(servicio => servicio.id == id);
        if (!servicio) return;

        contenedorServicios += `
        <article class="project project--small" data-id="${id}">

            <button class="btnEliminarServicio">✕</button>

            <div class="project_img" style="background-image:url('${servicio.image}');"></div>
            <div class="project_info project_info--small">
            <span class="project_label">${servicio.plan}</span>
            <span class="project_label">${servicio.titulo}</span>
            <span class="project_label">${servicio.precio}${servicio.moneda}</span>
            </div>
            
        </article>
        `;
    });

  contenedor.innerHTML = contenedorServicios;

  document.querySelectorAll(".btnEliminarServicio").forEach(btn => {
    btn.addEventListener("click", function () {
      const card = this.parentElement;
      const id = card.getAttribute("data-id");

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i] == id) {
        carrito.splice(i, 1);
        break;
    }
}
      localStorage.setItem("carritoServicios", JSON.stringify(carrito));

      card.remove();

      if (carrito.length === 0) {
        window.location.href = "servicios.html";
      }
    });
  });
}


/* -------- Enviar solicitud -------- */

async function guardarSolicitud(data) {
  const res = await fetch(base_url + "/solicitudes", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al guardar");

  return await res.json();
}

async function enviarFormulario(e) {
    e.preventDefault();

    const carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];

    if (carrito.length === 0) {
        alert("No seleccionaste servicios.");
        return;
    }

    const solicitudData = {
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        ubicacion: ubicacion.value.trim(),
        comentario: comentario.value.trim(),
        presupuesto: Number(presupuesto.value),
        numero: 0,
        servicios: carrito.map(Number)
    };

    if (!solicitudData.nombre || !solicitudData.email || !solicitudData.presupuesto) {
        alert("Completa todos los campos.");
        return;
    }

    try {
        await guardarSolicitud(solicitudData);
        alert("Solicitud enviada con éxito!");
        localStorage.removeItem("carritoServicios");
        formulario.reset();
        window.location.href = "index.html";
    } catch {
        alert("Error enviando solicitud.");
    }
}


/* -------- Inicializar -------- */

mostrarServicios();
formulario.addEventListener("submit", enviarFormulario);
