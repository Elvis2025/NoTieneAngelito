const apiUrl = "https://tu-api.com/endpoint"; // URL del endpoint de la API
const nombres = [
    "Josias", "Lisetd", "Cristy", "Magalys", "Yanidia", "Franchesca", 
    "Diomiris", "Anita", "Marielys", "Delainy", "Kevin", "Maycool", 
    "Samuel", "Andel", "Elvis", "Camila", "Abigail", "Nohemi", 
    "Marlyn", "Yisel", "Florinda", "Abel"
];

// Enviar los datos al API
async function enviarDatos() {
    const quienEres = document.getElementById("quienEres").value;
    const aQuienRegalas = document.getElementById("aQuienRegalas").value;

    if (!quienEres || !aQuienRegalas) {
        alert("Por favor, selecciona un nombre en ambos campos.");
        return;
    }
    if (quienEres === aQuienRegalas) {
        alert("No puedes regalarte a ti mismo.");
        return;
    }

    try {
        // Obtener el JSON actual del API
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Error al leer los datos del API.");
        
        const data = await response.json();
        const regalos = data || {}; // Si no hay datos, inicializar como objeto vacío
        
        // Validar si ya existe un registro para esta persona
        if (regalos[quienEres]) {
            alert(`${quienEres} ya tiene un regalo registrado.`);
            return;
        }

        // Agregar el nuevo regalo
        regalos[quienEres] = aQuienRegalas;

        // Enviar los datos actualizados al API
        const updatedResponse = await fetch(apiUrl, {
            method: "POST", // Cambia a PUT si la API lo requiere
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(regalos),
        });

        if (!updatedResponse.ok) throw new Error("Error al enviar los datos al API.");

        alert("Datos enviados correctamente.");
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
    }
}

// Configurar el evento del botón
document.getElementById("submitBtn").addEventListener("click", enviarDatos);
