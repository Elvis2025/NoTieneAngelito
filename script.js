function mostrarError(mensaje) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = mensaje;
    const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    errorModal.show();
}

async function enviarDatos() {
    const quienEres = document.getElementById("quienEres").value;
    const aQuienRegalas = document.getElementById("aQuienRegalas").value;

    if (!quienEres || !aQuienRegalas) {
        mostrarError("Por favor, selecciona un nombre en ambos campos.");
        return;
    }
    if (quienEres === aQuienRegalas) {
        mostrarError("No puedes regalarte a ti mismo.");
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error al leer los datos del API.");
        
        const data = await response.json();
        const regalos = data || {};
        
        if (regalos[quienEres]) {
            mostrarError(`${quienEres} ya tiene un regalo registrado.`);
            return;
        }

        regalos[quienEres] = aQuienRegalas;

        const updatedResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(regalos),
        });

        if (!updatedResponse.ok) throw new Error("Error al enviar los datos al API.");

        alert("Datos enviados correctamente.");
    } catch (error) {
        console.error(error);
        mostrarError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    }
}
