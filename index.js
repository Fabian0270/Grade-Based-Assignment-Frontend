import { mapRawCocktailData } from './utilities.js';

function showSection(sectionId) {
  document.getElementById('home').style.display = 'none';
  document.getElementById('search').style.display = 'none';
  document.getElementById('detail').style.display = 'none';
  document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('home-link').addEventListener('click', () => showSection('home'));
document.getElementById('search-link').addEventListener('click', () => showSection('search'));

function loadRandomCocktail() {
  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then((response) => response.json())
    .then((data) => {
      const cocktail = mapRawCocktailData(data.drinks[0]); // Använd mapRawCocktailData
      document.getElementById('cocktail-image').src = cocktail.thumbnail;
      document.getElementById('cocktail-name').textContent = cocktail.name;
      document.getElementById('see-more').onclick = () => {
        showDetail(cocktail);
      };
    })
    .catch((error) => console.error('Error fetching random cocktail:', error));
}

document.getElementById('new-cocktail').addEventListener('click', loadRandomCocktail);

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchTerm = document.getElementById('search-input').value;

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      const results = document.getElementById('search-results');
      results.innerHTML = '';

      if (data.drinks) {
        const cocktails = data.drinks.map(mapRawCocktailData);
        cocktails.forEach((cocktail) => {
          const listItem = document.createElement('li');
          listItem.textContent = cocktail.name;
          listItem.addEventListener('click', () => {
            showDetail(cocktail);
          });
          results.appendChild(listItem);
        });
      } else {
        results.innerHTML = '<p>No results found.</p>';
      }
    })
    .catch((error) => console.error('Error fetching search results:', error));
});

function showDetail(cocktail) {
  showSection('detail');
  document.getElementById('detail-name').textContent = cocktail.name;
  document.getElementById('detail-image').src = cocktail.thumbnail;
  document.getElementById('category').textContent = `Category: ${cocktail.category}`;
  document.getElementById('tags').textContent = `Tags: ${cocktail.tags.join(', ') || 'None'}`;
  document.getElementById('instructions').textContent = `Instructions: ${cocktail.instructions}`;
  document.getElementById('glass').textContent = `Glass: ${cocktail.glass}`;

  const ingredientsList = document.getElementById('ingredients');
  ingredientsList.innerHTML = '';
  cocktail.ingredients.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.ingredient} - ${item.measure}`;
    ingredientsList.appendChild(listItem);
  });
}

// Ladda en slumpmässig cocktail när sidan öppnas
loadRandomCocktail();