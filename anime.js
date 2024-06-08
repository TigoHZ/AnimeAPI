async function fetchAnimeDetails(id) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching anime details:', error);
        return null;
    }
}

async function displayAnimeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    if (!animeId) {
        console.error('No anime ID provided in the URL');
        return;
    }
    console.log('Anime ID:', animeId);

    const animeData = await fetchAnimeDetails(animeId);

    if (animeData && animeData.data) {
        const { data } = animeData;
        document.getElementById('anime-title').innerText = data.title_english || data.title;
        document.getElementById('anime-image').src = data.images.jpg.image_url;
        document.getElementById('anime-score').innerText = data.score;
        document.getElementById('anime-rank').innerText = `#${data.rank}`;
        document.getElementById('anime-popularity').innerText = `#${data.popularity}`;
        document.getElementById('anime-members').innerText = data.members;
        document.getElementById('anime-episodes').innerText = data.episodes;
        document.getElementById('anime-aired').innerText = data.aired.string;
        document.getElementById('anime-studio').innerText = data.studios.map(studio => studio.name).join(', ');
        document.getElementById('anime-type').innerText = data.type;
        document.getElementById('anime-source').innerText = data.source;
        document.getElementById('anime-synopsis').innerText = data.synopsis;
    } else {
        document.getElementById('anime-info').innerHTML = '<p>Anime details not found.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayAnimeDetails();

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.history.back();
    });
});
