const API_KEY = "d619c5e3-acdd-403b-853e-5ea282d4a1f0";
const CARDS_PER_PAGE = 50;
let currentPage = 1;
let totalCardsFetched = 0;
let totalApiCards = 0;
let isLoading = false;

async function fetchAllCards(page = 1, searchQuery = '') {
    if (isLoading) return;
    isLoading = true;

    const $container = $("#all-cards-container");
    const $loader = $("#loader-all-cards");
    const $loadMoreBtn = $("#load-more-btn");

    $loadMoreBtn.prop("disabled", true);
    $loader.show();

    let apiUrl = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${CARDS_PER_PAGE}`;
    if (searchQuery) {
        apiUrl += `&q=name:*${searchQuery}*`;
    }

    try {
        const response = await fetch(
            apiUrl,
            { headers: { "X-Api-Key": API_KEY } }
        );
        const { data: cards, totalCount } = await response.json();

        if (page === 1) {
            totalApiCards = totalCount;
            $container.empty();
            totalCardsFetched = 0;
        }

        if (cards && cards.length > 0) {
            const imageLoadPromises = [];

            cards.forEach(card => {
                const $cardDiv = $(`
                    <div class="col-6 col-md-2 text-center mb-4">
                        <div class="card shadow-sm">
                            <img src="${card.images.small}" class="card-img-top" alt="${card.name}">
                            <div class="card-body p-1">
                                <p class="mb-0">${card.name}</p>
                            </div>
                        </div>
                    </div>`);
                
                const $img = $cardDiv.find('img');
                
                const imgPromise = new Promise(resolve => {
                    $img.on('load', function() {
                        $(this).closest('.col-6').addClass('loaded');
                        resolve();
                    }).on('error', function() { // En caso de error de carga de imagen
                        console.warn('Error al cargar imagen:', card.images.small);
                        $(this).closest('.col-6').addClass('loaded'); 
                        resolve();
                    });
                    if (this.complete) {
                        $img.trigger('load');
                    }
                });
                imageLoadPromises.push(imgPromise);

                $container.append($cardDiv);
            });

            await Promise.all(imageLoadPromises);

            totalCardsFetched += cards.length;
            currentPage = page;
        } else if (page === 1) {
            $container.html(`<p class="text-info text-center w-100">No se encontraron cartas.</p>`);
        } else {
            $loadMoreBtn.hide();
            $container.append(`<p class="text-info text-center w-100 mt-4">¡Has visto todas las cartas disponibles!</p>`);
        }

    } catch (err) {
        console.error("Error al cargar cartas:", err);
        if (page === 1) {
            $container.html(`<p class="text-danger text-center w-100">Error al cargar cartas. Inténtalo de nuevo más tarde.</p>`);
        } else {
            console.warn("No se pudieron cargar más cartas.");
        }
        $loadMoreBtn.hide();
    } finally {
        $loader.hide();
        $loadMoreBtn.prop("disabled", false);
        isLoading = false;
    }
}

$(document).ready(function() {
    fetchAllCards(1);

    $("#load-more-btn").on("click", function() {
        fetchAllCards(currentPage + 1);
    });

    $("#search-button").on("click", function() {
        const query = $("#search-input").val().trim();
        currentPage = 1;
        fetchAllCards(1, query);
    });

    $("#search-input").on("keypress", function(e) {
        if (e.which == 13) {
            $("#search-button").click();
        }
    });
});