const base_url = "https://backend-studio41.onrender.com";
const formulario = document.querySelector("form");

////////////////////////////////////CARGAR SERVICIOS////////////////////////////////////

async function cargarServicios() {
    const res = await fetch(base_url + "/servicios");
    return await res.json();
}

////////////////////////////////////MOSTRAR SERVICIOS////////////////////////////////////

async function mostrarServicios() {

    let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];

    if (carrito.length === 0) {
        window.location.href = "servicios.html"; //Si el carrito está vacío, me manda a servicios.
        return;
    }

    const contenedor = document.querySelector("#servicio-carrito");
    const servicios = await cargarServicios();
    let contenedorServicios = "";

    carrito.forEach((id) => { //recorro el array carrito
        const servicio = servicios.find(servicio => servicio.id == id); //busca dentro del array de servicios (que viene del backend) el objeto que tenga ese ID.
        if (!servicio) return;

        contenedorServicios += `
        <article class="project project--small" servicio-id="${id}">

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
      const card = this.parentElement; //me sirve para a partir del botón, llegar a la tarjeta completa. Info extraída de: https://www.w3schools.com/jsref/prop_node_parentelement.asp
      const id = card.getAttribute("servicio-id"); //por medio de getAttribute, obtengo el ID del servicio que quiero eliminar.

    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i] == id) {
        carrito.splice(i, 1);
        break;
      }
    }
      localStorage.setItem("carritoServicios", JSON.stringify(carrito));

      card.remove(); //.remove elimina un elemento del documento. Info extraída de: https://www.w3schools.com/jsref/met_element_remove.asp

      if (carrito.length === 0) {
        window.location.href = "servicios.html";
      }
    });
  });
}

////////////////////////////////////GUARDAR SOLICITUD////////////////////////////////////

async function guardarSolicitud(data) {
  const res = await fetch(base_url + "/solicitudes", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al guardar");

  return await res.json();
}

////////////////////////////////////ENVIAR FORMULARIO////////////////////////////////////

async function enviarFormulario(e) {
  e.preventDefault(); //Con esto evito que el formulario se envíe automáticamente y recargue la página.

  const carrito = JSON.parse(localStorage.getItem("carritoServicios")) || []; //Obtengo el carrito desde el localStorage.

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

  if (!solicitudData.nombre || !solicitudData.email || !solicitudData.presupuesto){
    alert("Completa todos los campos.");
    return;
  }

  try {
    await guardarSolicitud(solicitudData);
    alert("Solicitud enviada con éxito!");
    localStorage.removeItem("carritoServicios");
    formulario.reset();
    window.location.href = "index.html";
  }catch{
    alert("Error enviando solicitud.");
  }
}

mostrarServicios();
formulario.addEventListener("submit", enviarFormulario);
