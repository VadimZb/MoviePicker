window.addEventListener("load", () => {
    const $titleInput = document.getElementById("titleInput");
    const $movieCard = document.getElementById('movieCard')
    const $errorCard = document.getElementById('errorCard')
    const socket = io();

    window.addEventListener('keypress', (e) => {
        $titleInput.focus()
    })

    document.getElementById("titleForm").addEventListener("submit", (e) => {
        e.preventDefault();
        if ($titleInput.value.replace(/\s/g, "")) {
            getMovie($titleInput.value);
        }
        $titleInput.value = ''
    });

    document.getElementById("findButton").addEventListener("click", () => {
        if ($titleInput.value.replace(/\s/g, "")) {
            getMovie($titleInput.value);
        }
        $titleInput.value = ''
    });

    document.getElementById("randomMovieBtn").addEventListener("click", () => {
        randomMovie()
    })

    document.getElementById('darkThemeBtn').addEventListener('click', () => {
        darkTheme()
    })

    function getMovie(title) {
        socket.emit("movie request", title);
    }

    function displayMovie(obj) {
        
        document.getElementById("movieTitle").textContent = obj.Title;
        document.getElementById("movieYear").textContent = obj.Year;
        document.getElementById("movieCountry").textContent = obj.Country.split(', ')[0];
        
        document.getElementById("movieRuntime").textContent = obj.Runtime;
        document.getElementById("moviePlot").textContent = obj.Plot;
        document.getElementById("movieDirector").textContent = obj.Director;
        
        document.getElementById("movieActors").textContent = obj.Actors;
        

        if (obj.Awards !== 'N/A') {
            document.getElementById("movieAwards").textContent = obj.Awards;
        } else {
            document.getElementById("movieAwards").textContent = ''
        }

        if (obj.Writer !== 'N/A') {
            document.getElementById("movieWriter").textContent = obj.Writer;
        } else {
            document.getElementById("movieWriter").textContent = obj.Director
        }

        if (obj.Genre !== 'N/A') {
            document.getElementById("movieGenre").textContent = obj.Genre;
        } else {
            document.getElementById("movieGenre").textContent = 'Unknown genre';
        }

        if (obj.Poster !== 'N/A') {
            document.getElementById("moviePoster").src = obj.Poster;
        } else {
            document.getElementById("moviePoster").src = '../img/noposter.jpg'
        }

        if (obj.imdbRating !== 'N/A') {
            document.getElementById("movieRating").textContent = obj.imdbRating
        } else {
            document.getElementById("movieRating").textContent = '?'
        }

        $errorCard.style.display = "none"
        $movieCard.style.display = "flex"

    }

    function randomMovie() {
        socket.emit("random movie request")
    }

    randomMovie()

    let darkThemeTurnedOn = false
    function darkTheme() {
        const btns = document.querySelectorAll(".btn")
        const inputs = document.querySelectorAll("input")
        if (darkThemeTurnedOn) {
            document.body.removeAttribute("style")
            $movieCard.classList.remove('bg-dark')
            for (let btn of btns) {
                btn.classList.remove("btn-dark")
            }

            for (let input of inputs) {
                input.classList.remove("bg-dark")
                input.removeAttribute("style")
            }
        } else {
            document.body.style.color = "white"
            document.body.style.background = "#121517"
            $movieCard.classList.add('bg-dark')
            for (let btn of btns) {
                btn.classList.add("btn-dark")
            }

            for (let input of inputs) {
                input.classList.add("bg-dark")
                input.style.color = "white"
                input.style.border = "none"
            }
        }

        darkThemeTurnedOn = !darkThemeTurnedOn
    }

    function displayError(errorMessage) {
        $movieCard.style.display = "none"
        $errorCard.style.display = "flex"
        $errorCard.textContent = errorMessage
    }

    socket.on("movie fetched", (movieObj) => {
        if (movieObj.Response === "True") {
            displayMovie(movieObj);
        } else {
            displayError(movieObj.Error)
        }
    });
});
