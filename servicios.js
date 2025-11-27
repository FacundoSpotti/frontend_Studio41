async function mostrarServicios() { 

    try {

    const contenedorServicios = document.querySelector('#servicios');

    const servicios = await cargarServicios();

    let cadaServicio = '';

    servicios.forEach(servicio => {

        console.log("SERVICIO:", servicio);

        cadaServicio +=
        
                `<article class="project project--small desactivado">
                        <div class="project_img ${servicio.id}">
                        
                        <style>
                            .${servicio.id} {
                                background-image: url(${servicio.image});
                            }
                        </style>
                        
                        </div>

                        <div class="project_info project_info--small">
                            <span class="project_label">${servicio.plan}</span>
                            <span class="project_label">${servicio.titulo}</span>
                            <span class="project_label">${servicio.precio}${servicio.moneda}</span>
                            <p>${servicio.descripcion}</p>
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