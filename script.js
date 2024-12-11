async function enviarDatos() {
    const quienEres = document.getElementById("quienEres").value;
    const aQuienRegalas = document.getElementById("aQuienRegalas").value;
    const apiUrlGet = "https://fb4mw60w-7033.use2.devtunnels.ms/Health/GETAPIIsRunnings";
    const apiUrlPost = "https://fb4mw60w-7033.use2.devtunnels.ms/Health/PostAPIIsRunnings";

    // Validación de los campos
    if (!quienEres || !aQuienRegalas) {
        mostrarError("Por favor, selecciona un nombre en ambos campos.");
        return;
    }
    if (quienEres === aQuienRegalas) {
        mostrarError("No puedes regalarte a ti mismo.");
        return;
    }

    try {
        // Solicitud GET para obtener los datos
        const response = await fetch(apiUrlGet, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();  // Obtener el texto de error de la respuesta
            console.error("Error en la solicitud GET:", errorMessage);
            mostrarError("Error al obtener los datos.");
            throw new Error("Error al leer los datos del API.");
        }

        // Leer la respuesta como texto
        const responseText = await response.text();
        console.log("Respuesta del GET:", responseText);

        let data = {};
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error("Error al parsear los datos:", jsonError);
                mostrarError("La respuesta del servidor no es un JSON válido.");
                throw new Error("Error al parsear la respuesta.");
            }
        }

        const regalos = data || {};

        // Validación de si el destinatario ya ha regalado a alguien (comprobando que aQuienRegalas no está como un destinatario)
        if (Object.values(regalos).includes(aQuienRegalas)) {
            mostrarError(`${aQuienRegalas} ya ha recibido un regalo.`);
            return;
        }

        // Validación de si quienEres ya ha sido asignado como destinatario
        if (regalos[quienEres]) {
            mostrarError(`${quienEres} ya ha sido asignado como destinatario.`);
            return;
        }

        // Modificar la lista de regalos con la nueva entrada
        regalos[quienEres] = aQuienRegalas;

        // Solicitud POST para enviar los datos
        const updatedResponse = await fetch(apiUrlPost, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(regalos)
        });

        if (!updatedResponse.ok) {
            const errorMessage = await updatedResponse.text();
            console.error("Error en la solicitud POST:", errorMessage);
            mostrarError("Error al enviar los datos al API.");
            throw new Error("Error al enviar los datos.");
        }

        mostrarError("Datos enviados correctamente.");
    } catch (error) {
        console.error(error);
        mostrarError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    }
}

function mostrarError(message) {
    // Obtener el modal de error
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorMessageElement = document.getElementById('errorMessage');
    
    // Establecer el mensaje de error
    errorMessageElement.innerText = message;

    // Mostrar el modal con el mensaje
    modal.show();
}
