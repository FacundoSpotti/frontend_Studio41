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
