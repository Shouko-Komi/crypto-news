const newsUrls = [
    'https://crypto-news1.pages.dev/',
    'https://crypto-news2.pages.dev/',
    'https://crypto-news3.pages.dev/',
    'https://crypto-news4.pages.dev/',
    'https://crypto-news5.pages.dev/',
    'https://crypto-news6.pages.dev/',
    'https://crypto-news7.pages.dev/',
    'https://crypto-news8.pages.dev/',
    'https://crypto-news9.pages.dev/',
    'https://crypto-news10.pages.dev/',
    'https://crypto-news11.pages.dev/',
    'https://crypto-news12.pages.dev/'
];

const itemsPerPage = 9;
let currentPage = 1;

async function fetchNews(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const title = doc.querySelector('h1').innerText;
        const excerpt = doc.querySelector('p').innerText;
        return { title, excerpt, url };
    } catch (error) {
        console.error('Error fetching news:', error);
        return { title: 'Error fetching news', excerpt: '', url };
    }
}

async function loadNews(page = 1) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear previous content
    const newsGrid = document.createElement('div');
    newsGrid.className = 'news-grid';
    newsContainer.appendChild(newsGrid);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUrls = newsUrls.slice(start, end);

    for (const url of paginatedUrls) { // Fetch in original order
        const news = await fetchNews(url);
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `<h2>${news.title}</h2><p>${news.excerpt}</p>`;
        newsItem.addEventListener('click', () => {
            window.open(news.url, '_blank');
        });
        newsGrid.appendChild(newsItem);
    }

    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    const totalPages = Math.ceil(newsUrls.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = 'page-button';
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadNews(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});