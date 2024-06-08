async function fetchTopAnime() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching top anime:', error);
        return null;
    }
}

async function fetchAnimeSearch(query) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=20`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return null;
    }
}

async function displayTopAnime() {
    const topAnimeData = await fetchTopAnime();
    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = '';

    if (topAnimeData && topAnimeData.data && topAnimeData.data.length > 0) {
        topAnimeData.data.slice(0, 20).forEach(anime => {
            const listItem = document.createElement('li');
            listItem.classList.add('mb-4', 'flex', 'items-center');
            listItem.innerHTML = `
                <a href="anime.html?id=${anime.mal_id}" class="no-underline text-gray-800 flex items-center w-full">
                   <img src="${anime.images.jpg.image_url}" alt="image of ${anime.title}" class="w-[50px] h-[70px] object-cover mr-2">
                   <strong>${anime.title}</strong>
                   <span class="score ml-auto font-bold">Score: ${anime.score}</span>
                </a>
            `;
            animeList.appendChild(listItem);
        });
    } else {
        animeList.innerHTML = '<li>No top anime found.</li>';
    }
}

async function displaySearchResults(query) {
    const searchResults = await fetchAnimeSearch(query);
    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = '';

    if (searchResults && searchResults.data && searchResults.data.length > 0) {
        searchResults.data.forEach(anime => {
            const listItem = document.createElement('li');
            listItem.classList.add('mb-4', 'flex', 'items-center');
            listItem.innerHTML = `
                <a href="anime.html?id=${anime.mal_id}" class="no-underline text-gray-800 flex items-center w-full">
                   <img src="${anime.images.jpg.image_url}" alt="image of ${anime.title}" class="w-[50px] h-[70px] object-cover mr-2">
                   <strong>${anime.title}</strong>
                   <span class="score ml-auto font-bold">Score: ${anime.score}</span>
                </a>
            `;
            animeList.appendChild(listItem);
        });
    } else {
        animeList.innerHTML = '<li>No anime found for the search term.</li>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayTopAnime();

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const homeButton = document.getElementById('home-button');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            displaySearchResults(query);
        } else {
            displayTopAnime();
        }
    });

    homeButton.addEventListener('click', () => {
        displayTopAnime();
    });
});
