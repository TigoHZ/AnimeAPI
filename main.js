let currentPage = 1;
const itemsPerPage = 20;

async function fetchTopAnime(page = 1) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
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

async function fetchAnimeSearch(query, page = 1) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=20&page=${page}`);
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

async function displayTopAnime(page = 1) {
    const topAnimeData = await fetchTopAnime(page);
    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = '';

    if (topAnimeData && topAnimeData.data && topAnimeData.data.length > 0) {
        topAnimeData.data.slice(0, itemsPerPage).forEach((anime, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('mb-4', 'flex', 'items-center');
            listItem.innerHTML = `
                <a href="anime.html?id=${anime.mal_id}" class="no-underline text-gray-800 flex items-center w-full">
                   <img src="${anime.images.jpg.image_url}" alt="image of ${anime.title}" class="w-[50px] h-[70px] object-cover mr-2">
                   <span class="rank mr-2 font-bold">#${index + 1 + (page - 1) * itemsPerPage}</span>
                   <strong>${anime.title}</strong>
                   <span class="score ml-auto font-bold">Score: ${anime.score}</span>
                </a>
            `;
            animeList.appendChild(listItem);
        });

        setupPagination(topAnimeData.pagination.last_visible_page, page);
    } else {
        animeList.innerHTML = '<li>No top anime found.</li>';
    }
}

async function displaySearchResults(query, page = 1) {
    const searchResults = await fetchAnimeSearch(query, page);
    const animeList = document.getElementById('anime-list');
    animeList.innerHTML = '';

    if (searchResults && searchResults.data && searchResults.data.length > 0) {
        searchResults.data.forEach((anime, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('mb-4', 'flex', 'items-center');
            listItem.innerHTML = `
                <a href="anime.html?id=${anime.mal_id}" class="no-underline text-gray-800 flex items-center w-full">
                   <img src="${anime.images.jpg.image_url}" alt="image of ${anime.title}" class="w-[50px] h-[70px] object-cover mr-2">
                   <span class="rank mr-2 font-bold">#${index + 1 + (page - 1) * itemsPerPage}</span>
                   <strong>${anime.title}</strong>
                   <span class="score ml-auto font-bold">Score: ${anime.score}</span>
                </a>
            `;
            animeList.appendChild(listItem);
        });

        setupPagination(searchResults.pagination.last_visible_page, page);
    } else {
        animeList.innerHTML = '<li>No anime found for the search term.</li>';
    }
}

function setupPagination(lastPage, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.classList.add('p-2', 'm-1', 'bg-blue-500', 'text-white', 'rounded', 'hover:bg-blue-700');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            const query = document.getElementById('search-input').value.trim();
            if (query) {
                displaySearchResults(query, currentPage);
            } else {
                displayTopAnime(currentPage);
            }
        }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('p-2', 'm-1', 'bg-blue-500', 'text-white', 'rounded', 'hover:bg-blue-700');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === lastPage;
    nextButton.addEventListener('click', () => {
        if (currentPage < lastPage) {
            currentPage++;
            const query = document.getElementById('search-input').value.trim();
            if (query) {
                displaySearchResults(query, currentPage);
            } else {
                displayTopAnime(currentPage);
            }
        }
    });
    paginationContainer.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', () => {
    displayTopAnime();

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const homeButton = document.getElementById('home-button');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        currentPage = 1;
        if (query) {
            displaySearchResults(query, currentPage);
        } else {
            displayTopAnime(currentPage);
        }
    });

    homeButton.addEventListener('click', () => {
        searchInput.value = '';
        currentPage = 1;
        displayTopAnime(currentPage);
    });
});
