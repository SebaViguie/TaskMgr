import { getTareas, postTarea, tareas, updateTarea } from "./tareas.js";
import { cargarVoces, reproducirTexto } from "./speechSyn.js";

//Elementos body
export const listaTareas = document.querySelector(".listaTareas");
const menuLateral = document.querySelector("header div");
const btnMenu = document.querySelector("header img");
//Botones menú
const nuevaTarea = document.querySelector("#nuevaTarea");
const modificar = document.querySelector("#modificar");
const configuracion = document.querySelector("#configuracion");
//Dialogs
export const dialogNuevaTarea = document.querySelector("#dialogNuevaTarea");
export const dialogModificar = document.querySelector("#dialogModificar");
const dialogConfiguracion = document.querySelector("#dialogConfiguracion");
const btnCancelar = document.querySelectorAll('button[value="cancelar"]');
const btnCrear = document.querySelector("#crearTarea");
const btnModificar = document.querySelector("#modificarEstado");
const btnConfiguracion = document.querySelector("#guardarConfiguracion");
//Elementos de dialogs
export const tituloNuevaTarea = document.querySelector("#tituloNuevaTarea");
export const descripcionNuevaTarea = document.querySelector("#descripcionNuevaTarea");
export const selectEstado = document.querySelector("#selectEstado");
export const checkEstado = document.querySelector("#checkEstado");
export const selectVoice = document.querySelector("#selectVoice");
export const inputRange = document.querySelector("#inputRange");

getTareas();
cargarVoces();

//Eventos
nuevaTarea.addEventListener("click", () => {
    dialogNuevaTarea.showModal();
    menuLateral.classList.remove("menuOpen");
})

modificar.addEventListener("click", () => {
    selectEstado.innerHTML = "";

    dialogModificar.showModal();

    let tareasPendientes = tareas.filter(el => el.estado == false);

    tareasPendientes.forEach((item) => {
        const option = document.createElement("option");

        option.value = item.id;
        option.textContent = item.titulo;

        selectEstado.appendChild(option);
    })
    menuLateral.classList.remove("menuOpen");
})

configuracion.addEventListener("click", () => {
    dialogConfiguracion.showModal();
    menuLateral.classList.remove("menuOpen");
})

btnCancelar.forEach(boton => {
    boton.addEventListener('click', () => {
        const dialog = boton.closest('dialog');
        dialog.close();        
    });
});

btnCrear.addEventListener("click", () => postTarea());

btnModificar.addEventListener("click", () => updateTarea());

btnConfiguracion.addEventListener("click", () => {
    localStorage.setItem("voice", selectVoice[selectVoice.options.selectedIndex].text);
    localStorage.setItem("range", inputRange.value);
    Speakit.utteranceRate = inputRange.value
    dialogConfiguracion.close();
})

listaTareas.addEventListener("click", function(event) {
    if (event.target.tagName === "IMG") {
        let tareaReproducir = tareas.find(item => item.id == event.target.dataset.value);

        reproducirTexto(tareaReproducir.descripcion);
    }
})

btnMenu.addEventListener("click", () => menuLateral.classList.add("menuOpen"));
document.addEventListener("click", (event) => {
    if (!menuLateral.contains(event.target) && !btnMenu.contains(event.target)) {
        menuLateral.classList.remove("menuOpen");
    }
});