import { listaTareas, tituloNuevaTarea, descripcionNuevaTarea, dialogNuevaTarea, selectEstado, checkEstado, dialogModificar } from "./main.js";

export const urlTareas = "https://670aed6fac6860a6c2cadd97.mockapi.io/api/tareas";

export let tareas = [];

function convertirFecha(fechaStr) {
    const [fecha, tiempo, ampm] = fechaStr.split(/, | /);
    const [dia, mes, año] = fecha.split("/").map(Number);
    let [hora, minutos, segundos] = tiempo.split(":").map(Number);
    
    if (ampm === "p.m." && hora !== 12) hora += 12;
    if (ampm === "a.m." && hora === 12) hora = 0;
    
    return new Date(año, mes - 1, dia, hora, minutos, segundos);
}

export function parseTarea(tarea) {
    let estado = tarea.estado? "Finalizada el " : "Pendiente";
    let claseFinalizado = tarea.estado? " finalizada" : "";
    let imagen = tarea.estado? "./images/finalizada.png" : "./images/botonPlay.png"
    
    return `
    <div class="cardTarea${claseFinalizado}">
        <div>
            <h3>${tarea.titulo}</h3>
            <p>Creada: ${tarea.fechaCreacion}</p>
            <p>${estado}${tarea.fechaFinalizacion}</p>
        </div>
        <img src="${imagen}" data-value="${tarea.id}">
    </div>
    `      
}

export function showTareas() {
    listaTareas.innerHTML = '';
    tareas.sort( (a, b) => convertirFecha(b.fechaCreacion) - convertirFecha(a.fechaCreacion) );
    tareas.sort((a, b) => a.estado - b.estado);
    tareas.forEach(el => {
        listaTareas.innerHTML += parseTarea(el);
    });
}

export function getTareas() {
    fetch(urlTareas)
        .then((response) => {
            if(response.status === 200) {
                return response.json()
            } else {
                throw new Error("No se pueden obtener los datos remotos. " + response.status)
            }
        })
        .then((data) => tareas.push(...data))

        .then(() => showTareas());
}

export function postTarea() {
    let nuevaTarea = {
        fechaCreacion: new Date().toLocaleString(),
        fechaFinalizacion: "",
        titulo: tituloNuevaTarea.value,
        descripcion: descripcionNuevaTarea.value,
        estado: false
    }

    const opciones = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaTarea)
    }

    fetch(urlTareas, opciones)
        .then((response) => {
            if(response.status === 201) {
                return response.json()
            } else {
                throw new Error("No se pudo crear el recurso. " + response.status)
            }
        })
        .then((data) => {
            tareas.push(data);
            showTareas();
            dialogNuevaTarea.close();
            tituloNuevaTarea.value = '';
            descripcionNuevaTarea.value = '';
        })
}

export function updateTarea() {
    let idTarea = selectEstado.value;
    let fechaFinalizacion = new Date().toLocaleDateString();
    let estado = checkEstado.checked;
    let urlTarea = urlTareas+`/${idTarea}`;

    const opciones = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({fechaFinalizacion: fechaFinalizacion, estado: true})
    }
    if (estado) {
        fetch(urlTarea, opciones)
        .then((response) => {
            if(response.status === 200) {
                return response.json()
            } else {
                throw new Error("No se pudo actualizar el recurso. " + response.status)
            }
        })
        .then((data) => {
            let tarea = tareas.find(el => el.id == idTarea);
            
            tarea.fechaFinalizacion = fechaFinalizacion;
            tarea.estado = true;
            showTareas();
            dialogModificar.close();
            checkEstado.checked = false;
        })
    }
}