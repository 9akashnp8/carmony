
const speedometer = document.getElementById('speedometer')
const tachometer = document.getElementById('tachometer')

function updateCurrentMix(currentMix) {
    const stems = ['bass', 'pad', 'synth', 'guitar', 'drums', 'drums_2']
    stems.forEach(stem => {
        const stemInfoEl = document.getElementById(stem);
        stemInfoEl.innerText = currentMix[stem]
    })
}

async function handleRpmChange(event) {
    const accelPos = event.target.value
    const { speed, rpm } = simulateEngineState(+accelPos)
    speedometer.parentNode.lastChild.textContent = `${speed} km/h`
    tachometer.parentNode.lastChild.textContent = `${rpm} rpm`

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

const MAXRPM = 7000
const IDLE_RPM = 850
const RATE_OF_RPM_INCREASE = 500
const RATE_OF_RPM_DECREASE = 300
let currentRpm = IDLE_RPM
let rpm = 0

function updateRpm() {
    currentRpm += rpm
    currentRpm = Math.max(IDLE_RPM, currentRpm)
    const speed = (currentRpm - 2614) / 22.229
    speedometer.setAttribute('value', speed)
    tachometer.setAttribute('value', currentRpm)
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        rpm = RATE_OF_RPM_INCREASE
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        rpm = -RATE_OF_RPM_DECREASE
    }
})

setInterval(updateRpm, 100)

async function playAudio() {
    const response = await fetch('/play')
    console.log(response)
}