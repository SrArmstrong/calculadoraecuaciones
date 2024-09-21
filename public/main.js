document.getElementById('fetchResults').addEventListener('click', async () => {
    const response = await fetch('/resultados');
    const data = await response.json();

    const resultadosDiv = document.getElementById('resultados');

    resultadosDiv.innerHTML = `
        <h2>Primera ecuación</h2>
        <p>${data.Primerecuacion.ex}x ${data.Primerecuacion.ey}y = ${data.Primerecuacion.er}</p>

        <h2>Segunda ecuación</h2>
        <p>${data.Segundaecuacion.ex1}x ${data.Segundaecuacion.ey1}y = ${data.Segundaecuacion.er1}</p>

        <h2>Preliminares</h2>
        <p>Af: ${data.preliminares.Af}, As: ${data.preliminares.As}, Ar: ${data.preliminares.Ar}</p>
        <p>Afx: ${data.preliminares.Afx}, Asx: ${data.preliminares.Asx}, Arx: ${data.preliminares.Arx}</p>
        <p>Afy: ${data.preliminares.Afy}, Asy: ${data.preliminares.Asy}, Ary: ${data.preliminares.Ary}</p>

        <h2>Coordenadas</h2>
        <p>x: ${data.coordenadas.x} (${data.fracciones.xf})</p>
        <p>y: ${data.coordenadas.y} (${data.fracciones.yf})</p>
    `;
});

document.getElementById('nameForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    const name = document.getElementById('name').value;

    // Enviar el nombre al servidor usando fetch
    fetch('/submit-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(name)}`,
    })
    .then(response => response.text())
    .then(data => {
        console.log('Nombre enviado y recibido:', data);
    })
    .catch(error => {
        console.error('Error al enviar el nombre:', error);
    });
});
