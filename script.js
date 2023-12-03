//VERSI JQUERY

// $(".search-button").on("click", function () {
//   $.ajax({
//     url:
//       "http://www.omdbapi.com/?apikey=25858c6b&s=" + $(".input-keyword").val(),
//     success: (results) => {
//       const movies = results.Search;
//       let cards = "";
//       movies.forEach((m) => {
//         cards += showCard(m);
//       });
//       $(".movie-container").html(cards);

//       //KETIKA TOMBOL DI KLIK
//       $(".modal-details-button").on("click", function () {
//         console.log($(this).data("imdbID"));
//         $.ajax({
//           url:
//             "http://www.omdbapi.com/?apikey=25858c6b&i=" +
//             $(this).data("imdbid"),
//           success: (m) => {
//             const movieDetail = showMovieDetail(m);
//             $(".modal-body").html(movieDetail);
//           },
//           error: (e) => console.log(e.responseText),
//         });
//       });
//     },
//     error: (e) => console.log(e.responseText),
//   });
// });

//VERSI FETCH

// const SearchButton = document.querySelector(".search-button");
// SearchButton.addEventListener("click", function () {
//   const inputKeyword = document.querySelector(".input-keyword");
//   fetch("http://www.omdbapi.com/?apikey=25858c6b&s=" + inputKeyword.value)
//     .then((response) => response.json())
//     .then((response) => {
//       const movies = response.Search;
//       let cards = "";
//       movies.forEach((m) => (cards += showCard(m)));
//       const movieContainer = document.querySelector(".movie-container");
//       movieContainer.innerHTML = cards;
//       //KETIKA TOMBOL DETAIL DI KLIK
//       const modalDetailButton = document.querySelectorAll(
//         ".modal-details-button"
//       );
//       modalDetailButton.forEach((btn) => {
//         btn.addEventListener("click", function () {
//           const imdbid = this.dataset.imdbid;
//           fetch("http://www.omdbapi.com/?apikey=25858c6b&i=" + imdbid)
//             .then((response) => response.json())
//             .then((m) => {
//               const movieDetail = showMovieDetail(m);
//               const modalBody = document.querySelector(".modal-body");
//               modalBody.innerHTML = movieDetail;
//             });
//         });
//       });
//     })
// });

//REFACTOR

const SearchButton = document.querySelector(".search-button");
SearchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (err) {
    alert(err); // handle error here...
  }
});

function getMovies(keyword) {
  return fetch("http://www.omdbapi.com/?apikey=25858c6b&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}
function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showCard(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

//EVENT BINDING - jadi awalnya event nya ga ada, tpi nanti pas ada event nya bisa dijalanin juga
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-details-button")) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIDetail(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch("http://www.omdbapi.com/?apikey=25858c6b&i=" + imdbid)
    .then((response) => response.json())
    .then((m) => m);
}

function updateUIDetail(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
}

function showCard(m) {
  return `
    <div class="col-md-4 my-3">
      <div class="card">
        <img src="${m.Poster}" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${m.Title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
          <a href="#" class="btn btn-primary modal-details-button" data-toggle="modal"
          data-target="#movieDetailsModal" data-imdbid="${m.imdbID}">Show details</a>
        </div>
      </div>
    </div>
    `;
}

function showMovieDetail(m) {
  return ` <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <img src="${m.Poster}" class="img-fluid" />
      </div>
      <div class="col-md">
        <ul class="list-group">
          <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
          <li class="list-group-item">
            <strong>Director: </strong>${m.Director}
          </li>
          <li class="list-group-item">
            <strong>Actors: </strong>${m.Actors}
          </li>
          <li class="list-group-item">
            <strong>Writer: </strong>${m.Writer}
          </li>
          <li class="list-group-item">
            <strong>plot: </strong><br />${m.Plot}
          </li>
        </ul>
      </div>
    </div>
  </div>`;
}
