const productos = [];
let carrito = [];
const pintarProductosAppend = document.getElementById("pintarProductosArray"); // Seleccionamos el contenedor donde se pintarán los productos
const contenedorCarrito = document.querySelector("#lista-carrito tbody"); // Seleccionamos el contenedor de los productos del carrito
const vaciarCarritp = document.getElementById("vaciar-carrito");
const finalizar = document.getElementById("finalizar");

const arrProductos = [];

// Creamos la clase Producto

class Producto {
  constructor(nombre, precio, imagen, id) {
    this.nombre = nombre;
    this.precio = parseFloat(precio);
    this.imagen = imagen;
    this.id = parseFloat(id);
    this.cantidad = 1;
  }
  addCantidad() {
    this.cantidad++;
  }
}

// Creamos los productos
// productos.push(new Producto('Slouchy Azul',2500,'img/productos/slouchyazul.png',1));
//  productos.push(new Producto('Slouchy Celeste',2500,'img/productos/slouchycelestenevado.png',2));
//  productos.push(new Producto('Short Camuflado',2300,'img/productos/shortcamuflado.png',3));
//  productos.push(new Producto('Short Azul',2300,'img/productos/shortazul.png',4));
//  productos.push(new Producto('Campera Negra',2700,'img/productos/camperanegra.png',5));
//  productos.push(new Producto('Campera Roja',2700,'img/productos/camperaroja.png',6));
// productos.push(new Producto('Jumper Negro',1500,'img/productos/jumpernegro.png',7));
//  productos.push(new Producto('Pollera Celeste',1000,'img/productos/polleraceleste.png',8));

document.addEventListener("DOMContentLoaded", () => {
  peticion();
});

const peticion = async () => {
  try {
    const respuesta = await fetch("./js/api.json");
    const data = await respuesta.json();
    for (const item of data) {
      productos.push(
        new Producto(item.nombre, item.precio, item.imagen, item.id)
      );
    }
    await pintarProductos(productos, pintarProductosAppend);
  } catch (error) {
    console.error(error);
  }
};

// Función de carga inicial de la página
document.addEventListener("DOMContentLoaded", () => {
  pintarProductos(productos, pintarProductosAppend); // Pintamos los productos
  carritoVacio(); // Comprobamos si el carrito está vacío
  carritoVacioNoti(); // Comprobamos si el carrito está vacío
});

// Crear una función que muestre nuestros productos en el Dom

function pintarProductos(array, contenedor) {
  contenedor.innerHTML = "";
  for (const item of array) {
    let card = document.createElement("div");
    card.classList.add("col-3");
    card.innerHTML = `
            <div class="card mt-4">
                <img src="${item.imagen}" class="imagen-ropa card-img-top" title="${item.nombre}">
                <div class="card-body">
                    <h4>${item.nombre}</h4>
                    <p class="precio">$${item.precio}</p>
                    <button class="btn btn-dark input agregar-carrito" id="${item.id}">Agregar al carrito</button>
                </div>
            </div>
        `;
    contenedor.append(card);
  }
  addCarrito(); // Agregamos la funcion de agregar al carrito
}







// Creamos una función que agregue productos al carrito

function addCarrito() {
  const botones = document.getElementsByClassName("agregar-carrito");
  for (const boton of botones) {
    boton.addEventListener("click", (e) => {
      // Creamos una condición para el carrito
      let producto = carrito.find((producto) => producto.id == e.target.id); // Buscamos el producto en el carrito
      if (producto) {
        producto.addCantidad(); // Aumentamos la cantidad del producto si es que existe en el carrito
      } else {
        // Si el producto no existe en el carrito lo agregamos del array de productos
        producto = productos.find((producto) => producto.id == e.target.id); // Buscamos el producto en el array de productos
        carrito.push(producto); // Lo agregamos al carrito
      }
      pintarCarrito(carrito, contenedorCarrito); // Pintamos el carrito
      Toastify({
        text: "Producto Agregado",
        duration: 1000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #EB82F4 ,#E65EF1)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    });
  }
}

// Creamos una función que muestre los productos del array carrito de manera dinámica



function pintarCarrito(array, contenedor) {
  contenedor.innerHTML = "";
  for (const item of array) {
    let card = document.createElement("tr");
    card.innerHTML = `
            <td>  
                <img src="${item.imagen}" width=100>
            </td>
            <td>${item.nombre}</td>
            <td>${item.precio}</td>
            <td>${item.cantidad} </td>
            <td>
                <a href="#" class="borrar-ropa" id="${item.id}">X</a>
            </td>
        `;
    contenedor.append(card);
  // enviar carrito
  }

  borrarProducto(); // Agregamos la funcion de borrar productos del carrito
  carritoVacioNoti(); // Agreamos la funcion de notificación de carrito vacío
  saveStorage(); // Storage
}


// Creamos una función que elimine productos del carrito

function borrarProducto() {
  const borrar = document.getElementsByClassName("borrar-ropa");
  for (const btn of borrar) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const producto = carrito.find((producto) => producto.id == e.target.id); // Buscamos el producto en el carrito
      carrito.splice(carrito.indexOf(producto), 1); // Eliminamos el producto del carrito
      pintarCarrito(carrito, contenedorCarrito); // Pintamos el carrito
      carritoVacioNoti(); // Agreamos la funcion de notificación de carrito vacío
      Toastify({
        text: "Producto Eliminado",
        duration: 1000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #FF6D6D, #FF6D6D)",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    });
  }
}

// Creamos una función que elimine todos los productos del carrito

function carritoVacioNoti() {
  if (carrito.length == 0) {
    vaciarCarritp.style.display = "none";
    finalizar.style.display = "none";
  } else {
    // Ponerle flex a vaciarCarritp con todo centrado
    vaciarCarritp.style.display = "flex";
    vaciarCarritp.style.alignItems = "center";
    vaciarCarritp.style.justifyContent = "center";
    vaciarCarritp.style.flexDirection = "column";
    vaciarCarritp.style.width = "95%";
    vaciarCarritp.style.margin = "1rem auto";

    finalizar.style.display = "flex";
    finalizar.style.alignItems = "center";
    finalizar.style.justifyContent = "center";
    finalizar.style.flexDirection = "column";
    finalizar.style.width = "95%";
    finalizar.style.margin = "1rem auto";
  }
}

function carritoVacio() {
  vaciarCarritp.addEventListener("click", (e) => {
    e.preventDefault(); // Evitamos que se recargue la página
    carrito = []; // Vaciamos el carrito
    pintarCarrito(carrito, contenedorCarrito); // Pintamos el carrito
    for (const producto of productos) {
      producto.cantidad = 1; // Reestablecemos la cantidad de productos a 1
    }
    carritoVacioNoti();
    Toastify({
      text: "Carrito vacio",
      duration: 1000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #951111 , #951111)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  });
}

// Funcion storage

function saveStorage(name) {
  localStorage.setItem(name, JSON.stringify(carrito));
}

function loadStorage(name) {
  const array = JSON.parse(localStorage.getItem(name));
  if (array) {
    for (const item of array) {
      carrito.push(
        new Producto(
          item.nombre,
          item.precio,
          item.imagen,
          item.id,
          item.cantidad
        )
      );
    }
    pintarCarrito(carrito, contenedorCarrito);
  }
}



finalizar.addEventListener("click", () => {
  if (carrito.length == 0) {
    Toastify({
      text: "Carrito vacio",
      duration: 1000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #951111 , #951111)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } else {
    saveStorage("carrito");
    enviar(carrito);
  }
});

function enviar(carrito) {
  /*
    Crear un enlace de whatsapp y pasar los productos del carrito convertidos a string por parámetro en el link https://api.whatsapp.com/send?phone=5611042722
  */
  let link = `https://api.whatsapp.com/send?phone=5493865394041&text=Hola%20me%20gustaría%20hacer%20un%20pedido%20con%20las%20siguientes%20cosas %0A`;
  for (const producto of carrito) {
    // Pasar los parámetros de cada producto a texto
    const productoString = `${producto.cantidad}%20unidades de ${producto.nombre} con costo por prenda de $${producto.precio},`;

    // Por cada producto en el carrito se añadirá el producto a la url
    link += `${productoString}%0A`;
  }
  window.open(link, "_blank");
}


{/* <a href="https://api.whatsapp.com/send?phone=212121&text=Hola%20me%20gustaria%20hacer%20un%20pedido%20con%20las%20siguientes%20cosas ${item.nombre} ${item.cantidad}" class="btn btn btn-success"">Enviar Carrito</a> */}