// Crear los copos de nieve de manera dinámica
document.addEventListener("DOMContentLoaded", function() {
    const snowContainer = document.getElementById('snowContainer');
    const numberOfSnowflakes = 50;

    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw'; // Posición horizontal aleatoria
        snowflake.style.animationDuration = Math.random() * 3 + 3 + 's'; // Duración aleatoria para la animación
        snowflake.style.animationDelay = Math.random() * 3 + 's'; // Retraso aleatorio para la animación
        snowContainer.appendChild(snowflake);
    }
});
