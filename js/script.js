let elForm = $(".js-form");
let elSearchInput = $(".js-search-input", elForm);
let elCatagorySelect = $(".js-catagory", elForm);
let elRatingInput = $(".js-rating-input", elForm);
let elSortingSealect = $(".js-soring-select", elForm);

let elSerchResult = $(".js-list");

let elTemplate = $(".js-template").content;

// kinolarning kalit so'zlarini tog'irlash

let normalizedMovies = movies.map((movie,i) => {
  return{
    id: i + 1,
    title: movie.Title.toString(),
    year: movie.movie_year,
    rating: movie.imdb_rating,
    catagories: movie.Categories.split("|").join(", "),
    trailer: `https://www.youtube.com/watch?v=${movie.ytid}`,
    smallPoster: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
  }
})

// category select uchun options lar yaratish va render qilish

let createGenreSelectOptions = function () {
  let movieCatagory = [];

  normalizedMovies.splice(200).forEach(function(movie) {
    movie.catagories.split(", ").forEach(function(catagory) {
      if(!movieCatagory.includes(catagory)) {
        movieCatagory.push(catagory);
      }
    })
  })

  movieCatagory.sort();

  let elOptionsFragment = document.createDocumentFragment();

  movieCatagory.forEach(function(catagory) {
    let elCatagoryOption = createElement("option", "", catagory);
    elCatagoryOption.value = catagory.toLowerCase();
    catagory.name = "catagory";

    elOptionsFragment.appendChild(elCatagoryOption);
    elCatagorySelect.appendChild(elOptionsFragment);
  })
}
createGenreSelectOptions();

// kinolarni render qilish

let renderMovies = function(searchResults) {
  elSerchResult.innerHTML = "";

  let elResultFragment = document.createDocumentFragment();

  searchResults.forEach(function(movie) {
    let elMovie = elTemplate.cloneNode(true);

    $(".movie-title", elMovie).textContent = movie.title;
    $(".movie-poster", elMovie).src = movie.smallPoster;
    $(".movie-year", elMovie).textContent = movie.year;
    $(".movie-catagory", elMovie).textContent = movie.catagories;
    $(".movie-rating", elMovie).textContent = movie.rating;
    $(".movie-trailer-link", elMovie).href = movie.trailer;

    elResultFragment.appendChild(elMovie);
  })

  elSerchResult.appendChild(elResultFragment);
}
renderMovies(normalizedMovies);

let sortAz = function(arr) {
  return arr.sort(function(a, b) {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else{
      return 0;
    }
  })
}

let sortSearchResult = function(results, sortType) {
  if (sortType === "az") {
    sortAz(results);
  } else if (sortType === "za") {
    sortAz(results).reverse();
  }
}

let findMovies = function(title , rating){
  return normalizedMovies.filter(function (movie) {
    return movie.title.match(title) && movie.rating >= rating;
  })
}

elForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  
  let searchTitle = elSearchInput.value.trim();
  let movieTitleRegExp = new RegExp(searchTitle, "gi");

  let minimumRating = Number(elRatingInput.value);
  let sorting = elSortingSealect.value;

  let searchResults = findMovies(movieTitleRegExp, minimumRating);
  sortSearchResult(searchResults, sorting);

  renderMovies(searchResults);
})