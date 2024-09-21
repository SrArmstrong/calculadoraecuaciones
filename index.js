const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar el formulario y enviar los resultados mediante websockets
app.post('/resultados', (req, res) => {
    const ex = parseFloat(req.body.ex);
    const ey = parseFloat(req.body.ey);
    const ey_sign = req.body.ey_sign;
    const er = parseFloat(req.body.er);

    const ex1 = parseFloat(req.body.ex1);
    const ey1 = parseFloat(req.body.ey1);
    const ey1_sign = req.body.ey1_sign;
    const er1 = parseFloat(req.body.er1);

    const Af = (ex * ey1);
    const As = (ex1 * ey);

    const Ar = (Af - As);

    const Afx = (er * ey1);
    const Asx = (er1 * ey);

    const Arx = (Afx - Asx);

    const Afy = (ex * er1);
    const Asy = (ex1 * er);
    
    const Ary = (Afy - Asy);

    const x = Arx / Ar;
    const y = Ary / Ar;

    function decimalToFraction(decimal) {
        const tolerance = 1.0E-6;
        let numerator = 1;
        let denominator = 1;
        let fraction = numerator / denominator;

        while (Math.abs(fraction - decimal) > tolerance) {
            if (fraction < decimal) {
                numerator++;
            } else {
                denominator++;
                numerator = Math.round(decimal * denominator);
            }
            fraction = numerator / denominator;
        }

        return `${numerator}/${denominator}`;
    }

    const xf = decimalToFraction(x);
    const yf = decimalToFraction(y);

    //Comprobación
    const ecua1 = ex * x;

    const ecua12 = ey * y;

    const ecua12f = ey_sign === '+' ? ecua1 + ecua12 : ecua1 - ecua12;

    
    const ecua2 = ex1 * x;

    const ecua22 = ey1 * y;

    const ecua22f = ey1_sign === '+' ? ecua2 + ecua22 : ecua2 - ecua22;


    // Convertir a enteros
    const ecua12f_int = Math.round(ecua12f);
    const ecua22f_int = Math.round(ecua22f);

    const data = {
        ex, ey, ey_sign, er,
        ex1, ey1, ey1_sign, er1,
        Af, As, Ar, Afx, Asx, Arx, Afy, Asy, Ary,
        x, y, xf, yf,
        ecua1, ecua12, ecua12f, ecua12f_int,
        ecua2, ecua22, ecua22f, ecua22f_int
    };

    // Emitir los resultados al cliente a través del socket
    io.emit('resultados', data);

});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Corriendo en el puerto 3000');
});
