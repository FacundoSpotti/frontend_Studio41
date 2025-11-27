/*CONTENEDOR*/

const contenedorPortfolio = document.querySelector('#servicios');
const contenedorModal = document.querySelector('#contacto');
const contenedorIntegrantes = document.querySelector('#nosotros');

/*CONTENIDOS*/

const contenidoPortfolio = `

<div class="container">

        <!--FORMATO BANNER-->

            <article class="project project--highlight">
            <div class="project_img ${proyectos[0].ref}">
            
            <style>
                .${proyectos[0].ref} {
                    background-image: url(${proyectos[0].image});
                }
            </style>
            
            </div>

            <div class="project_info">
              <span class="project_client">${proyectos[0].name}</span>
              <span class="project_year">${proyectos[0].year}</span>
              <span class="project_type">${proyectos[0].type}</span>
            </div>

          </article>

          <!--GRILLA-->

          <div class="project-grid">
            <article class="project project--small">
            <div class="project_img ${proyectos[1].ref}">
            
            <style>
                .${proyectos[1].ref} {
                    background-image: url(${proyectos[1].image});
                }
            </style>
            
            </div>

              <div class="project_info project_info--small">
                <span class="project_label">${proyectos[1].name}</span>
                <span class="project_label">${proyectos[1].year}</span>
                <span class="project_label">${proyectos[1].type}</span>
              </div>
            </article>

            <article class="project project--small">
            <div class="project_img ${proyectos[2].ref}">
            
            <style>
                .${proyectos[2].ref} {
                    background-image: url(${proyectos[2].image});
                }
            </style>
            
            </div>

              <div class="project_info project_info--small">
                <span class="project_label">${proyectos[2].name}</span>
                <span class="project_label">${proyectos[2].year}</span>
                <span class="project_label">${proyectos[2].type}</span>
              </div>
            </article>

            <article class="project project--small">
            <div class="project_img ${proyectos[3].ref}">
            
            <style>
                .${proyectos[3].ref} {
                    background-image: url(${proyectos[3].image});
                }
            </style>
            
            </div>

              <div class="project_info project_info--small">
                <span class="project_label">${proyectos[3].name}</span>
                <span class="project_label">${proyectos[3].year}</span>
                <span class="project_label">${proyectos[3].type}</span>
              </div>
            </article>
          </div>

          <!--FORMATO BANNER-->

          <article class="project project--wide">
            <div class="project_img ${proyectos[4].ref}">
            
            <style>
                .${proyectos[4].ref} {
                    background-image: url(${proyectos[4].image});
                }
            </style>
            
            </div>

            <div class="project_info">
              <span class="project_client">${proyectos[4].name}</span>
              <span class="project_year">${proyectos[4].year}</span>
              <span class="project_type">${proyectos[4].type}</span>
            </div>
          </article>
        </div>

`;
const contenidoIntegrantes = `

        <div class="container">
            <h2 class="section_title">Nuestro Equipo</h2>

            <div class="team-grid">
                <article class="team-card">
                <div class="team-card_photo">
                    <img src="${integrantes[0].image}" alt="${integrantes[0].name}" />
                </div>
                <div class="team-card_body">
                    <h3 class="team-card_name">${integrantes[0].name}</h3>
                    <p class="team-card_role">${integrantes[0].role}</p>
                    <button class="btn btn--ghost">Ver más</button>
                </div>
                </article>

                <article class="team-card">
                <div class="team-card_photo">
                    <img src="${integrantes[1].image}" alt="${integrantes[1].name}" />
                </div>
                <div class="team-card_body">
                    <h3 class="team-card_name">${integrantes[1].name}</h3>
                    <p class="team-card_role">${integrantes[1].role}</p>
                    <button class="btn btn--ghost">Ver más</button>
                </div>
                </article>
            </div>
            </div>`;
const contenidoFormulario = `
<div class="container contact">
          <div class="contact_form">
            <h2 class="section_title">Contactanos</h2>
            <form>
                <div class="field">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre"/>
                </div>

                <div class="field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email"/>
                </div>

                <div class="field">
                    <label for="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion"/>
                </div>

                <div class="field">
                    <label for="presupuesto">Presupuesto:</label>
                    <input type="text" id="presupuesto" name="presupuesto"/>
                </div>

                <button type="submit" class="btn btn--primary">Enviar</button>
            </form>
        </div>

          <div class="contact_logo">
            <img src="img/Studio 41 logo.jpeg" alt="Studio 41 Logo"/>
            <div class="contact_logo-placeholder">Studio 41</div>
          </div>
        </div>`;

/*EJECUCIONES*/

cargaDinamica(contenedorPortfolio, contenidoPortfolio);
cargaDinamica(contenedorIntegrantes, contenidoIntegrantes);
cargaDinamica(contenedorModal, contenidoModal);
cargarServicios();
cargaDinamica(contenedorModal, contenidoFormulario);
