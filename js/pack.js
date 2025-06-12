const API_KEY = "d619c5e3-acdd-403b-853e-5ea282d4a1f0";

function sampleArray(arr, n) {
    const result = [];
    const copy = [...arr];
    while (result.length < n && copy.length) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

async function fetchPack() {
    const $btn = $("#reload-btn");
    const $loader = $("#loader");
    const $container = $("#card-container");

    $btn.prop("disabled", true);
    $loader.show();
    $container.empty();

    const countsMap = {
        original: { common: 4, uncommon: 3, holo: 3, total: 10 },
        japanese: { common: 2, uncommon: 2, holo: 1, total: 5 },
        luxory:   { common: 0, uncommon: 5, holo: 5, total: 10 },
        ultra:    { common: 0, uncommon: 0, holo: 10, total: 10 }
    };
    const packType = $('input[name="packType"]:checked').val();
    const counts = countsMap[packType] || countsMap.original;

    try {
        const metaRes = await fetch(
            "https://api.pokemontcg.io/v2/cards?pageSize=1",
            { headers: { "X-Api-Key": API_KEY } }
        );
        const { totalCount } = await metaRes.json();
        const pageSize = 100;
        const pages = Math.ceil(totalCount / pageSize);
        const randomPage = Math.floor(Math.random() * pages) + 1;

        const dataRes = await fetch(
            `https://api.pokemontcg.io/v2/cards?pageSize=${pageSize}&page=${randomPage}`,
            { headers: { "X-Api-Key": API_KEY } }
        );
        const { data: allCards } = await dataRes.json();

        const commons   = allCards.filter(c => c.rarity === "Common");
        const uncommons = allCards.filter(c => c.rarity === "Uncommon");
        const holos     = allCards.filter(c => c.rarity && c.rarity.includes("Holo"));

        const pack = [
            ...sampleArray(commons,   counts.common),
            ...sampleArray(uncommons, counts.uncommon),
            ...sampleArray(holos,     counts.holo)
        ];

        const numCards = pack.length;
        
        pack.forEach((card, i) => {
            if (numCards === 10 && i === 5) { // Si son 10 cartas, fuerza una nueva fila después de la 5 carta
                $container.append('<div class="w-100 my-3"></div>');
            }
            const colClass = `col-6 col-md`; 

            const cardHTML = `
                <div class="${colClass} text-center mb-4">
                    <div class="card shadow-sm">
                        <img src="${card.images.small}" class="card-img-top" alt="${card.name}">
                        <div class="card-body p-2">
                            <p class="mb-0">${card.name}</p>
                        </div>
                    </div>
                </div>`;
            $container.append(cardHTML);
        });

    } catch (err) {
        console.error(err);
        $container.html(`<p class="text-danger text-center">Error al cargar cartas</p>`);
    } finally {
        $loader.hide();
        $btn.prop("disabled", false);
    }
}

$(document).ready(() => {
    $("#reload-btn").on("click", fetchPack);
});