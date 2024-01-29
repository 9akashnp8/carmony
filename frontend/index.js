
const speedometer = document.getElementById('speedometer')
const tachometer = document.getElementById('tachometer')
const accelerator = document.getElementById('accelerator')

async function updateValues(event) {
    const { name, value } = event.target
    const response = await fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, value })
    })
    if (response.ok) {
        const currentMix = await response.json()
        console.log(currentMix)
        const bassInfoEl = document.getElementById("bass");
        const padInfoEl = document.getElementById("pad");
        const synthInfoEl = document.getElementById("synth");
        const guitarInfoEl = document.getElementById("guitar");
        const drumsInfoEl = document.getElementById("drums");
        const drums2InfoEl = document.getElementById("drums_2");
        bassInfoEl.innerHTML = currentMix.bass
        padInfoEl.innerText = currentMix.pad
        synthInfoEl.innerText = currentMix.synth
        guitarInfoEl.innerText = currentMix.guitar
        drumsInfoEl.innerText = currentMix.drums
        drums2InfoEl.innerText = currentMix.drums_2
    }
}

speedometer.addEventListener('change', updateValues)
tachometer.addEventListener('change', updateValues)
accelerator.addEventListener('change', updateValues)

async function playAudio() {
    const response = await fetch('/play')
    console.log(response)
}