import { selectVoice, inputRange } from "./main.js"

export function cargarVoces() {
    Speakit.languageFilter = 'es-AR'
    Speakit.getVoices().then((voices)=> {
    if (voices.length > 0) {
        selectVoice.innerHTML = ''
        voices.forEach((voice)=> {
            selectVoice.innerHTML += `<option value="${voice.lang}">${voice.name}</option>`
        })
    }

    let voiceLs = localStorage.getItem("voice");

    if (voiceLs) {
        for (let i = 0; i < selectVoice.options.length; i++) {
            if (voiceLs == selectVoice.options[i].text) {
                selectVoice.selectedIndex = i;
                break;
            }
        }
    }
    })
    
    let rangeLs = localStorage.getItem("range");

    inputRange.value = rangeLs || inputRange.value;
    Speakit.utteranceRate = inputRange.value;
}

export function reproducirTexto(texto) {
    Speakit.readText(texto, 
                     selectVoice.value,
                     selectVoice[selectVoice.options.selectedIndex].text)
}