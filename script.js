function calcularTasas() {
    let tea = parseFloat(document.getElementById("tea").value);

    if (!isNaN(tea)) {
        // Calcular TEM (Tasa Efectiva Mensual) a partir del TEA
        let tem = (Math.pow(1 + tea / 100, 1 / 12) - 1) * 100;

        // Actualizar los campos de TEM
        document.getElementById("tem").value = tem.toFixed(2);
        calcularPrestamo();
    }
}

function calcularPrestamo() {
    let montoSolicitado = parseFloat(document.getElementById("monto").value);
    let tea = parseFloat(document.getElementById("tea").value);
    let numeroCuotas = parseInt(document.getElementById("cuotas").value);
    let resultados = document.querySelector("#resultados tbody");

    // Seguro de Desgravamen
    const seguroDesgravamen = 13.90;

    // Limpiar la tabla de resultados
    resultados.innerHTML = '';

    // Calcular la Tasa Efectiva Mensual (TEM)
    let tem = (Math.pow(1 + tea / 100, 1 / 12) - 1);

    // Calcular la cuota mensual usando la fórmula de amortización
    let cuotaMensual = (montoSolicitado * tem) / (1 - Math.pow(1 + tem, -numeroCuotas));

    // Variables para acumular los totales
    let saldoCapital = montoSolicitado;
    let totalSaldoCapital = 0;
    let totalAmortizacionCapital = 0;
    let totalInteres = 0;
    let totalCuotaCI = 0;
    let totalSeguroDesgravamen = 0;
    let totalTotalCuota = 0;

    // Configurar un porcentaje de interés más alto para la primera cuota
    const porcentajeInteresAlto = 0.05; // Ajusta este valor si deseas otro porcentaje
    let primeraCuota = true;

    // Calcular el pago para cada mes
    for (let mes = 1; mes <= numeroCuotas; mes++) {
        let interes, amortizacionCapital;

        if (primeraCuota) {
            // Calcular un interés más alto para la primera cuota
            interes = saldoCapital * porcentajeInteresAlto;
            amortizacionCapital = cuotaMensual - interes;
            primeraCuota = false;
        } else {
            // Cálculo normal para las cuotas restantes
            interes = saldoCapital * tem;
            amortizacionCapital = cuotaMensual - interes;
        }

        // Calcular el total de la cuota (con seguro de desgravamen)
        let totalCuota = cuotaMensual + seguroDesgravamen;

        // Insertar los datos en la tabla
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${mes}</td>
            <td>${saldoCapital.toFixed(2)}</td>
            <td>${amortizacionCapital.toFixed(2)}</td>
            <td>${interes.toFixed(2)}</td>
            <td>${cuotaMensual.toFixed(2)}</td>
            <td>${seguroDesgravamen.toFixed(2)}</td>
            <td>${totalCuota.toFixed(2)}</td>
        `;
        resultados.appendChild(fila);

        // Acumular totales
        totalSaldoCapital += saldoCapital;
        totalAmortizacionCapital += amortizacionCapital;
        totalInteres += interes;
        totalCuotaCI += cuotaMensual;
        totalSeguroDesgravamen += seguroDesgravamen;
        totalTotalCuota += totalCuota;

        // Actualizar el saldo para el siguiente mes
        saldoCapital -= amortizacionCapital;
    }

    // Añadir fila con los totales
    let filaTotales = document.createElement("tr");
    filaTotales.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>${totalSaldoCapital.toFixed(2)}</strong></td>
        <td><strong>${totalAmortizacionCapital.toFixed(2)}</strong></td>
        <td><strong>${totalInteres.toFixed(2)}</strong></td>
        <td><strong>${totalCuotaCI.toFixed(2)}</strong></td>
        <td><strong>${totalSeguroDesgravamen.toFixed(2)}</strong></td>
        <td><strong>${totalTotalCuota.toFixed(2)}</strong></td>
    `;
    resultados.appendChild(filaTotales);
}

// Inicializar los cálculos al cargar la página
calcularTasas();
