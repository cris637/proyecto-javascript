// Variables
const carrito = document.querySelector("#carrito");
const listaRopas = document.querySelector("#lista-ropas");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
  // Dispara cuando se presiona "Agregar Carrito"
  listaRopas.addEventListener("click", agregarRopa);

  // Cuando se elimina un producto del carrito
  carrito.addEventListener("click", eliminarRopa);

  // Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

  // NUEVO: Contenido cargado
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHTML();
  });
}

// Función que añade productos al carrito
function agregarRopa(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const ropa = e.target.parentElement.parentElement;
    // Enviamos la ropa seleccionado para tomar sus datos
    leerDatosRopa(ropa);
  }
}

// Lee los datos del producto
function leerDatosRopa(ropa) {
  const infoRopa = {
    imagen: ropa.querySelector("img").src,
    titulo: ropa.querySelector("h4").textContent,
    precio: ropa.querySelector(".precio").textContent,
    id: ropa.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  if (articulosCarrito.some((ropa) => ropa.id === infoRopa.id)) {
    const ropas = articulosCarrito.map((ropa) => {
      if (ropa.id === infoRopa.id) {
        let cantidad = parseInt(ropa.cantidad);
        cantidad++;
        ropa.cantidad = cantidad;
        return ropa;
      } else {
        return ropa;
      }
    });
    articulosCarrito = [...ropas];
  } else {
    articulosCarrito = [...articulosCarrito, infoRopa];
  }

  console.log(articulosCarrito);

  carritoHTML();
}

// Elimina la ropa del carrito en el DOM
function eliminarRopa(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-ropa")) {
    const ropa = e.target.parentElement.parentElement;
    const ropaId = ropa.querySelector("a").getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter((ropa) => ropa.id !== ropaId);

    carritoHTML();
  }
}

// Muestra la ropa seleccionado en el Carrito
function carritoHTML() {
  vaciarCarrito();

  articulosCarrito.forEach((ropa) => {
    const row = document.createElement("tr");
    row.innerHTML = `
               <td>  
                    <img src="${ropa.imagen}" width=100>
               </td>
               <td>${ropa.titulo}</td>
               <td>${ropa.precio}</td>
               <td>${ropa.cantidad} </td>
               <td>
                    <a href="#" class="borrar-ropa" data-id="${ropa.id}">X</a>
               </td>
          `;
    contenedorCarrito.appendChild(row);
  });

  // STORAGE
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Elimina los productos del carrito en el DOM
function vaciarCarrito() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
