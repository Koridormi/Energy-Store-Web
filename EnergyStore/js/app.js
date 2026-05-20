// variables
let carrito = [];

// selectors
const listaProductos = document.querySelector('#lista-productos');
const botonCarrito = document.querySelector('#boton-carrito');
const menuCarrito = document.querySelector('#menu-carrito');
const cantidadCarrito = document.querySelector('#cantidad-carrito');
const listaCarrito = document.querySelector('#lista-carrito');
const resumenCarrito = document.querySelector('#resumen-carrito');
const limpiarCarrito = document.querySelector('#limpiar-carrito');
const pagarCarrito = document.querySelector('#pagar-carrito');

// listeners
document.addEventListener('DOMContentLoaded', cargarProductos);

document.addEventListener('DOMContentLoaded', mostrarProductos);

botonCarrito.addEventListener('click', carritoToggle);

document.addEventListener('click', carritoHide);

menuCarrito.addEventListener('click', (e) => {
    e.stopPropagation();
});

document.body.addEventListener('click', botonAgregar);

menuCarrito.addEventListener('click', eliminarProducto);

limpiarCarrito.addEventListener('click', vaciarCarrito);

pagarCarrito.addEventListener('click', comprarProductos);

// functions
function carritoToggle(e) {
    e.preventDefault();

    menuCarrito.classList.toggle('carrito-toggle');
};

function carritoHide(e) {

    const clickBoton = botonCarrito.contains(e.target);

    if(!menuCarrito.classList.contains('carrito-toggle') && !clickBoton) {
        menuCarrito.classList.add('carrito-toggle');
    };

    carritoDescripcion();
};

function crearCard(producto) {
    if(listaProductos) {
        const productoDiv = document.createElement('DIV');
        productoDiv.classList.add('cards__container');

        const productoImagen = document.createElement('IMG');
        productoImagen.src = producto.imagen;
        productoImagen.alt = producto.nombre;

        const productoNombre = document.createElement('H2');
        productoNombre.textContent = producto.nombre;

        const productoDescripcion = document.createElement('P');
        productoDescripcion.textContent = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia et, rerum voluptates itaque aut suscipit.';

        const productoPrecio = document.createElement('P');
        productoPrecio.textContent = `$ ${producto.precio}`;

        const productoBoton = document.createElement('BUTTON');
        productoBoton.textContent = 'Agregar';
        productoBoton.classList.add('agregar-carrito');
        productoBoton.dataset.id = producto.id;

        listaProductos.appendChild(productoDiv);

        productoDiv.appendChild(productoImagen);
        productoDiv.appendChild(productoNombre);
        productoDiv.appendChild(productoDescripcion);
        productoDiv.appendChild(productoPrecio);
        productoDiv.appendChild(productoBoton);
    };
};

function obtenerProductos() {
    const url = '../db/db.json';

    return fetch(url)
        .then( (respuesta) => {
            return respuesta.json();
        })
        .then( (resultado) => {
            const {bebidasEnergeticas} = resultado;
            return bebidasEnergeticas;
        });
};

function mostrarProductos() {
    obtenerProductos()
        .then( (productos) => {
            productos.forEach( (producto) => {
                crearCard(producto);
            });
        });
};

function listarCarrito() {
    limpiarHTML(listaCarrito);

    carrito.forEach( (producto) => {
        const carritoTableRow = document.createElement('TR');
        carritoTableRow.classList.add('encabezado__carrito__lista__contenedor');

        const carritoTableData1 = document.createElement('TD');

        const carritoImagen = document.createElement('IMG');
        carritoImagen.src = producto.imagen;

        const carritoTableData2 = document.createElement('TD');

        const carritoParrafo1 = document.createElement('P');
        carritoParrafo1.textContent = producto.nombre;

        const carritoParrafo2 = document.createElement('P');
        carritoParrafo2.textContent = `$ ${producto.precio}`;

        const carritoParrafo3 = document.createElement('P');
        carritoParrafo3.textContent = producto.cantidad;

        const carritoParrafo4 = document.createElement('P');

        const carritoEnlace = document.createElement('A');
        carritoEnlace.textContent = 'X';
        carritoEnlace.classList.add('eliminar-carrito');
        carritoEnlace.dataset.id = producto.id;

        listaCarrito.appendChild(carritoTableRow);

        carritoTableData1.appendChild(carritoImagen);
        carritoTableRow.appendChild(carritoTableData1);

        carritoTableRow.appendChild(carritoTableData2);
        carritoTableData2.appendChild(carritoParrafo1);
        carritoTableData2.appendChild(carritoParrafo2);
        carritoTableData2.appendChild(carritoParrafo3);

        carritoParrafo4.appendChild(carritoEnlace);
        carritoTableData2.appendChild(carritoParrafo4);
    });

    elementosCarrito();
};

function cargarProductos() {
    const storage = JSON.parse(localStorage.getItem('productos'));
    
    if(storage) {
        carrito = storage;
    };

    listarCarrito();
    calcularTotal();
    carritoDescripcion();
};

function elementosCarrito() {
    const cantidad = carrito.reduce( (acc, producto) => {
        return acc + producto.cantidad;
    }, 0);

    if(carrito.length === 0) {
        cantidadCarrito.classList.add('carrito-toggle');
        cantidad.textContent = '0';
    };

    if(cantidad > 0) {
        cantidadCarrito.classList.remove('carrito-toggle');
        cantidadCarrito.textContent = cantidad;
    };

    if(cantidad > 9) {
        cantidadCarrito.textContent = '+9';
    };
};

function carritoDescripcion() {
    const carritoLista = document.querySelector('.encabezado__carrito__lista');
    const carritoMensaje = document.querySelector('.encabezado__carrito__descripcion');

    if(listaCarrito.children.length === 0) {
        carritoLista.classList.add('carrito-toggle');
        carritoMensaje.classList.remove('carrito-toggle');
    } else {
        carritoLista.classList.remove('carrito-toggle');
        carritoMensaje.classList.add('carrito-toggle');
    };
};

function limpiarHTML(contenedor) {
    while(contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    };
};

function botonAgregar(e) {
    if(e.target.classList.contains('agregar-carrito')) {
        const idProducto = Number(e.target.dataset.id);

        agregarProducto(idProducto);
    };
};

function agregarProducto(idProducto) {
    obtenerProductos()
        .then( (productos) => {
            const productoEncontrado = productos.find( (producto) => {
                return producto.id === idProducto;
            });

            productoDuplicado(productoEncontrado);
            
            const storage = localStorage.setItem('productos', JSON.stringify(carrito));
        });
};

function productoDuplicado(productoEncontrado) {
    const existeProducto = carrito.find( (producto) => {
        return producto.id === productoEncontrado.id;
    });

    if(existeProducto) {
        existeProducto.cantidad++;
    } else {
        productoEncontrado.cantidad = 1;
        carrito.push(productoEncontrado);
    };

    const storage = localStorage.setItem('productos', JSON.stringify(carrito));

    listarCarrito();
    calcularTotal();
};

function calcularTotal() {
    const total = carrito.reduce( (acc, producto) => {
        return acc + (producto.precio * producto.cantidad);
    }, 0);

    if(total > 0) {
        resumenCarrito.classList.remove('carrito-toggle');

        resumenCarrito.textContent = `Total: $ ${total.toFixed(2)}`;
    } else if(total === 0) {
        resumenCarrito.classList.add('carrito-toggle');

        resumenCarrito.textContent = `Total: $ 0`;
    };
};

function eliminarProducto(e) {
    if(e.target.classList.contains('eliminar-carrito')) {
        e.preventDefault();

        const idProducto = Number(e.target.dataset.id);

        const productoExiste = carrito.find( (producto) => {
            return producto.id === idProducto;
        });

        if(productoExiste.cantidad > 1) {
            productoExiste.cantidad--;
        } else {
            carrito = carrito.filter( (producto) => {
                return producto.id !== idProducto;
            });
        };

        if(carrito.length === 0) {
            resumenCarrito.classList.add('carrito-toggle');
        };

        const storage = localStorage.setItem('productos', JSON.stringify(carrito));

        listarCarrito();
        calcularTotal();
        carritoDescripcion();
    };
};

function vaciarCarrito() {
    if(carrito.length >= 1) {
        carrito = [];
        const storage = localStorage.clear();
    } else if(carrito.length === 0) {
        alert('Tu Carrito ya esta vacio');
    };

    listarCarrito();
    calcularTotal();
    carritoDescripcion();
};

function comprarProductos() {
    if(carrito.length >= 1) {
        alert('Compra Realizada con Exito!');
        carrito = [];
        const storage = localStorage.clear();
    } else if(carrito.length === 0) {
        alert('No tienes productos en tu carrito');
    };

    listarCarrito();
    calcularTotal();
    carritoDescripcion();
};