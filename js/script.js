//CARRUSEL sacar cartas de la API
async function cargarCartasPokemon() {
    const track = document.getElementById('carousel-track');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Mostrar spinner de carga
    loadingSpinner.style.display = 'block';
    track.style.display = 'none'; // Ocultar el carrusel mientras se carga para evitar el desplazamiento

    try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=50');
        const data = await response.json();
        const cartas = data.data;

        // Elegir 6 al azar
        const cartasAleatorias = cartas.sort(() => 0.5 - Math.random()).slice(0, 6);

        // Duplicamos para bucle infinito
        const cartasDobles = [...cartasAleatorias, ...cartasAleatorias];

        // Limpiar las cartas existentes antes de añadir las nuevas (si las hay)
        track.innerHTML = '';

        // Inyectar en el DOM
        cartasDobles.forEach((carta, index) => {
            const div = document.createElement('div');
            div.className = 'carousel-item-custom';
            const img = document.createElement('img');
            img.src = carta.images.large;
            img.alt = carta.name;

            // Añadir un listener de evento de carga a cada imagen
            img.onload = () => {
                // Añadir la clase 'loaded' después de que la imagen se haya cargado completamente
                div.classList.add('loaded');
            };
            div.appendChild(img);
            track.appendChild(div);
        });

    } catch (error) {
        console.error('Error al cargar cartas Pokémon:', error);
        // Opcionalmente, mostrar un mensaje de error al usuario
        loadingSpinner.querySelector('p').textContent = 'Error al cargar las cartas. Inténtalo de nuevo más tarde.';
        loadingSpinner.querySelector('.spinner-border').style.display = 'none'; // Ocultar spinner
    } finally {
        // Ocultar spinner de carga y mostrar el carrusel una vez que todo esté hecho (éxito o error)
        loadingSpinner.style.display = 'none';
        track.style.display = 'flex'; // Mostrar el carrusel
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarCartasPokemon);