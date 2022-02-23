const lazyRepeatList = document.createElement('ons-lazy-repeat');
lazyRepeatList.id = "pokemonList";
lazyRepeatList.style.textTransform = "capitalize";

document.addEventListener('init', (e) => {

    const onsList = document.getElementById('pokeList');
    onsList.appendChild(lazyRepeatList);

    if (e.target.id === 'index') {
        e.target.querySelector('#pokemonList').onClick = () => {
            document.querySelector('#navigator').pushPage('pokeData').then(r => {
            });
        }

        e.target.querySelector('#pokemonList').onclick = function (event) {
            // console.log(event.target.innerHTML);
            document.querySelector('#navigator').pushPage('pokeData', {data: {title: event.target.innerHTML}}).then(r => {
            });
            //console.log(event.target.data.title)
            // document.querySelector('#pID').innerHTML =event.target.data.title;
        }
    }

    if (e.target.id === 'pokeData') {

        async function getApiData(url) {
            const response = await fetch(url);

            return await response.json()
        }

        async function getSecondApiData(url) {
            const data = await getApiData(url);
            // console.log("here:::"+data);

            document.querySelector('#pokeImage').src = data.sprites.other.dream_world.front_default;
            document.querySelector('#name').innerHTML = data.name + " #" + data.game_indices[0].game_index;


            // console.log(data.stats[0]);

            for (let i = 0; i < 6; i++) {
                document.querySelector('#effort' + (i + 1)).innerHTML = data.stats[i].effort;
                document.querySelector('#baseStat' + (i + 1)).innerHTML = data.stats[i].base_stat;
            }

            // console.log(data.types[0].type.name);

            for (let i = 0; i < data.types.length; i++) {
                document.querySelector('#type' + (i + 1)).innerHTML = data.types[i].type.name
            }
        }

        async function getFirstApiData(url) {
            const response = await fetch(url);
            const data = await response.json();

            for (let i = 0; i < 100; i++) {
                if (pokeName === data.results[i].name) {
                    dataUrl = data.results[i].url;
                    // console.log(i + ":::" + data.results[i].url);
                    break;
                }
            }

            // console.log(dataUrl);
            // console.log(pokeName);

            document.querySelector('#pokeDataTitle').innerHTML = pokeName;

            getSecondApiData(dataUrl);
        }

        const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=100";

        const pokeName = e.target.data.title;
        let dataUrl;

        setTimeout(() => {
            document.querySelector('#loader').style.display = 'none';
            document.querySelector('#data').removeAttribute("hidden");
            getFirstApiData(apiURL).then(r => {
            });
        }, 1000);
    }
});

ons.ready(() => {
    const list = document.getElementById('pokemonList');
    const apiURL = "https://pokeapi.co/api/v2/pokemon?limit=100";

    async function getApi(url) {

        // Storing response
        const response = await fetch(url);

        // Storing data in form of JSON
        const data = await response.json();
        // console.log(data);
        for (let i = 0; i < 100; i++) {
            show(data.results);
            // console.log(data.results[i])
        }
    }

    getApi(apiURL).then(r => {
    });

    function show(data) {
        let dataList = [];

        // Loop to access all rows
        for (let r of data) {
            dataList += `<ons-list-item modifier="chevron" class="list-item--material__right" tappable>` + r.name + `</ons-list-item>`
        }

        lazyRepeatList.innerHTML = dataList;

        // document.getElementById("pokemonList").innerHTML = dataList;
    }
});

const navigator = document.querySelector('#navigator');

const popPage = () => navigator.popPage();

// Pad the history with an extra page so that we don't exit right away
window.addEventListener('load', () => window.history.pushState({}, ''));

// When the browser goes back a page, if our navigator has more than one page we pop the page and prevent the back event by adding a new page
// Otherwise we trigger a second back event, because we padded the history we need to go back twice to exit the app.
window.addEventListener('popstate', () => {
    const {pages} = navigator;
    if (pages && pages.length > 1) {
        popPage();
        window.history.pushState({}, '');
    } else {
        window.history.back();
    }
});
