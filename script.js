let result = document.getElementById("result");
let searchCocktailBtn = document.getElementById("search-cocktail"); // Am modificat id-ul butonului
let searchByIngredientBtn = document.getElementById("search-by-ingredient"); // Am adăugat acest buton
let url = "https://thecocktaildb.com/api/json/v1/1/search.php?s=";

let getInfo = (searchType) => {
  let userInp = document.getElementById("user-inp").value;
  let apiUrl = "";
  if (userInp.length == 0) {
    result.innerHTML = `<h3 class="msg">The input field cannot be empty</h3>`;
    return;
  }
  if (searchType === "name") {
    apiUrl = url + userInp;
  } else if (searchType === "ingredient") {
    apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + userInp;
  }
  
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("user-inp").value = "";
      console.log(data);
      if (searchType === "name") {
        let myDrink = data.drinks[0];
        let count = 1;
        let ingredients = [];
        for (let i in myDrink) {
          let ingredient = "";
          let measure = "";
          if (i.startsWith("strIngredient") && myDrink[i]) {
            ingredient = myDrink[i];
            if (myDrink[`strMeasure` + count]) {
              measure = myDrink[`strMeasure` + count];
            } else {
              measure = "";
            }
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
          }
        }
        result.innerHTML = `
          <img src=${myDrink.strDrinkThumb}>
          <h2>${myDrink.strDrink}</h2>
          <h3>Ingredients:</h3>
          <ul class="ingredients"></ul>
          <h3>Instructions:</h3>
          <p>${myDrink.strInstructions}</p>
        `;
        let ingredientsCon = document.querySelector(".ingredients");
        ingredients.forEach((item) => {
          let listItem = document.createElement("li");
          listItem.innerText = item;
          ingredientsCon.appendChild(listItem);
        });
      } // Actualizăm secțiunea care afișează lista de cocktailuri
      else if (searchType === "ingredient") {
          let drinks = data.drinks;
          if (drinks === null) {
              result.innerHTML = `<h3 class="msg">No cocktails found with this ingredient</h3>`;
              return;
          }
          result.innerHTML = `<h2>Cocktails with ${userInp}:</h2><div class="drink-list">`;
          drinks.forEach((drink) => {
              result.innerHTML += `
                  <div class="drink-item">
                      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
                      <p>${drink.strDrink}</p>
                  </div>
              `;
          });
          result.innerHTML += `</div>`;
         
          
      }
      
    })
    .catch(() => {
      result.innerHTML = `<h3 class="msg">Please enter a valid input</h3>`;
    });
};

window.addEventListener("load", () => getInfo("name"));

searchCocktailBtn.addEventListener("click", () => getInfo("name")); // Am adăugat evenimentul pentru butonul "Search Cocktail"

searchByIngredientBtn.addEventListener("click", () => getInfo("ingredient")); // Am adăugat evenimentul pentru butonul "Search by Ingredient"
