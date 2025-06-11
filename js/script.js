// CARRUSEL sacar cartas de la API
async function cargarCartasPokemon() {
    const $track = $('#carousel-track');
    const $loadingSpinner = $('#loading-spinner');

    $loadingSpinner.show();
    $track.hide();

    try {
        const response = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=50');
        const data = await response.json();
        const cartas = data.data;

        const cartasAleatorias = cartas.sort(() => 0.5 - Math.random()).slice(0, 6);

        const cartasDobles = [...cartasAleatorias, ...cartasAleatorias];

        $track.empty();

        cartasDobles.forEach((carta) => {
            const $div = $('<div>').addClass('carousel-item-custom');
            const $img = $('<img>').attr({
                src: carta.images.large,
                alt: carta.name
            });

            $img.on('load', function() {
                $(this).closest('.carousel-item-custom').addClass('loaded');
            });

            $div.append($img);
            $track.append($div);
        });

    } catch (error) {
        console.error('Error al cargar cartas Pokémon:', error);
        $loadingSpinner.find('p').text('Error al cargar las cartas. Inténtalo de nuevo más tarde.');
        $loadingSpinner.find('.spinner-border').hide();
    } finally {
        $loadingSpinner.hide();
        $track.show();
    }
}

$(document).ready(function() {
    cargarCartasPokemon();
});