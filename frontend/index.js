
const speedometer = document.getElementById('speedometer')
const tachometer = document.getElementById('tachometer')
const accelerator = document.getElementById('accelerator')

function simulateEngineState(accelPos) {
    const rpm = (60 * accelPos) + 1000
    const speed = (rpm - 2614) / 22.229
    speedometer.setAttribute('value', speed < 0 ? 0 : speed)
    tachometer.setAttribute('value', rpm)
    return { speed, rpm}
}

function updateCurrentMix(currentMix) {
    const stems = ['bass', 'pad', 'synth', 'guitar', 'drums', 'drums_2']
    stems.forEach(stem => {
        const stemInfoEl = document.getElementById(stem);
        stemInfoEl.innerText = currentMix[stem]
    })
}

async function handleAcceleratorChange(event) {
    const accelPos = event.target.value
    const { speed, rpm } = simulateEngineState(+accelPos)

    const body = { accel_pos: +accelPos, speed, rpm }
    const response = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    if (response.ok) {
        const currentMix = await response.json()
        updateCurrentMix(currentMix)
    }
}

accelerator.addEventListener('change', handleAcceleratorChange)

async function playAudio() {
    const response = await fetch('/play')
    console.log(response)
}