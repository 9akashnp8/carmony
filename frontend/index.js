
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
let currentRpm = 2
let pressed = false
let pressedAt = null
let pressedDuration = null

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        if (pressed == false) {
            pressedAt = Date.now()
            pressed = true
        }
        pressedDuration = (Date.now() - pressedAt) / 1000
        if (currentRpm <= MAXRPM) {
            currentRpm = ((pressedDuration * 60) ** 2) // non linear increase
            console.log(pressedDuration, currentRpm)
            if (currentRpm > 0) {
                const speed = (currentRpm - 2614) / 22.229
                speedometer.setAttribute('value', speed)
                tachometer.setAttribute('value', currentRpm)
            }
        }
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') {
        pressed = false
    }
})

tachometer.addEventListener('change', handleRpmChange)

async function playAudio() {
    const response = await fetch('/play')
    console.log(response)
}