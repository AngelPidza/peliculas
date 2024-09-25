const apiKey = '83367c1161f8741daabb84287c358d04'; 
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const recommendationsDiv = document.getElementById('recommendations');

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value;
    resultsDiv.innerHTML = '';
    recommendationsDiv.innerHTML = '';

    if (!query) return;

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results.length > 0) {
        data.results.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');

            const movieImage = document.createElement('img');
            movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            movieImage.alt = movie.title;

            const movieTitle = document.createElement('span');
            movieTitle.textContent = `${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})`;
            movieTitle.style.cursor = 'pointer';
            movieTitle.addEventListener('click', () => showDetails(movie.id));

            movieDiv.appendChild(movieImage);
            movieDiv.appendChild(movieTitle);
            resultsDiv.appendChild(movieDiv);
        });

        const movieId = data.results[0].id;
        const recommendationsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}`);
        const recommendationsData = await recommendationsResponse.json();

        if (recommendationsData.results.length > 0) {
            recommendationsDiv.innerHTML = '<h2>Recomendaciones</h2>';
            recommendationsData.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');

                const movieImage = document.createElement('img');
                movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
                movieImage.alt = movie.title;

                const movieTitle = document.createElement('span');
                movieTitle.textContent = `${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})`;
                movieTitle.style.cursor = 'pointer';
                movieTitle.addEventListener('click', () => showDetails(movie.id));

                movieDiv.appendChild(movieImage);
                movieDiv.appendChild(movieTitle);
                recommendationsDiv.appendChild(movieDiv);
            });
        } else {
            recommendationsDiv.textContent = 'No hay recomendaciones disponibles.';
        }
    } else {
        resultsDiv.textContent = 'No se encontraron películas.';
    }
});

async function showDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    const movie = await response.json();

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('movie-details');
    detailsDiv.innerHTML = `
        <h3>${movie.title}</h3>
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
        <p><strong>Fecha de estreno:</strong> ${movie.release_date}</p>
        <p><strong>Sinopsis:</strong> ${movie.overview}</p>
        <p><strong>Calificación:</strong> ${movie.vote_average}/10</p>
    `;

    resultsDiv.appendChild(detailsDiv);
}
