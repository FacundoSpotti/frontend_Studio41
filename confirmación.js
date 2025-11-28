async function mostrarServicios() { 

    try {

    let carrito = JSON.parse(localStorage.getItem("carritoServicios")) || [];
    const contenedorServicios = document.querySelector('#servicio-carrito');
    const servicios = await cargarServicios();
    let cadaServicio = '';

    carrito.forEach(id => {

        cadaServicio +=
        
                `<article class="project project--small desactivado">
                        <div class="project_img ${servicios[id-1].id}">
                        
                        <style>
                            .${servicios[id-1].id} {
                                background-image: url(${servicios[id-1].image});
                            }
                        </style>
                        
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

    cargaDinamica(contenedorServicios, contenidoServicios);} 
    
    catch (error) {

        console.error("Error al mostrar servicios:", error);

    }
}

mostrarServicios();
