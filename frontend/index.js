
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
    console.log(response)
}

speedometer.addEventListener('change', updateValues)
tachometer.addEventListener('change', updateValues)
accelerator.addEventListener('change', updateValues)

async function playAudio() {
    const response = await fetch('/play')
    console.log(response)
}