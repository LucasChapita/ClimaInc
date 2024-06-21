const apiKey = 'f00f5457c759b610fa6f57de612e13a9'; // Tu clave de API de OpenWeatherMap

document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getWeatherData(city);
});

async function getWeatherData(city) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Ciudad no encontrada o error en la solicitud');
        }

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeatherData(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <div class="weather-details">
            <h2>${data.city.name}, ${data.city.country}</h2>
            <p>Clima: ${data.list[0].weather[0].description}</p>
            <p>Humedad: ${data.list[0].main.humidity}%</p>
            <p>Viento: ${data.list[0].wind.speed} m/s</p>
        </div>
    `;

    // Preparar datos para el gráfico de línea
    const labels = [];
    const temperatures = [];

    // Obtener datos para las próximas 5 horas (ejemplo)
    const nextHours = data.list.slice(0, 5);
    nextHours.forEach(hour => {
        labels.push(new Date(hour.dt * 1000).toLocaleTimeString('es-ES', { hour: 'numeric' }));
        temperatures.push(hour.main.temp);
    });

    // Crear gráfico de línea
    const canvas = document.createElement('canvas');
    canvas.classList.add('chart');
    weatherInfo.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
