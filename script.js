async function enviarDatos() {
    const quienEres = document.getElementById("quienEres").value;
    const aQuienRegalas = document.getElementById("aQuienRegalas").value;
    const apiUrlGet = "https://fb4mw60w-7033.use2.devtunnels.ms/Health/GETAPIIsRunnings";
    const apiUrlPost = "https://fb4mw60w-7033.use2.devtunnels.ms/Health/PostAPIIsRunnings";

    // Validación de los campos
    if (!quienEres || !aQuienRegalas) {
        mostrarError("Por favor, selecciona un nombre en ambos campos.",false);
        return;
    }
    if (quienEres === aQuienRegalas) {
        mostrarError("No puedes regalarte a ti mismo.",false);
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
            mostrarError("Error al obtener los datos.",false);
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
                mostrarError("La respuesta del servidor no es un JSON válido.",false);
                throw new Error("Error al parsear la respuesta.");
            }
        }

        const regalos = data || {};

        // Validación de si el destinatario ya ha regalado a alguien (comprobando que aQuienRegalas no está como un destinatario)
        if (Object.values(regalos).includes(aQuienRegalas)) {
            mostrarError(`${aQuienRegalas} ya ha recibido un regalo.`,false);
            return;
        }

        // Validación de si quienEres ya ha sido asignado como destinatario
        if (regalos[quienEres]) {
            mostrarError(`${quienEres} ya ha sido asignado como destinatario.`,false);
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
            mostrarError("Error al enviar los datos al API.",false);
            throw new Error("Error al enviar los datos.");
        }

        mostrarError("Datos enviados correctamente.",true);
    } catch (error) {
        console.error(error);
        mostrarError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    }
}

function mostrarError(message,isSuccess) {
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    const messageElement = document.getElementById('errorMessage');
    const modalHeader = document.getElementById('modalHeader');
    const modalTitle = document.getElementById('modalTitle'); // Nuevo título dinámico

    // Establecer el mensaje y el estilo del modal
    messageElement.innerText = message;

    if (isSuccess) {
        modalHeader.style.backgroundColor = "green";
        modalHeader.style.color = "white";
        modalTitle.innerText = "Éxito"; // Título para mensajes exitosos
    } else {
        modalHeader.style.backgroundColor = "#dc3545";
        modalHeader.style.color = "white";
        modalTitle.innerText = "Aviso"; // Título para mensajes de error
    }

    // Mostrar el modal con el mensaje
    modal.show();
}
