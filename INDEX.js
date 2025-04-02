//API key: 5db51dbd
//const fetchData = async(searchTerm)=> {
//    const response = await axios.get('http://omdbapi.com/', {
//        params: {
//            apikey:'5db51dbd',
//            s: 'avengers'
//        }
//    })

//    if(response.data.Error){
//        return []
//    }

//    console.log(response.data.Search)
//}

//fetchData()

autocompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return `
            <img src = "${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie){
        return movie.Title
    },
    async fetchData(searchTerm) {
        apiMovieURL = 'https://omdbapi.com/'
        const response = await axios.get(apiMovieURL, {
            params: '65904a8a',
            s: searchTerm
        })
        if(response.data.Error){
            return []
        }

        console.log(response.data)
        return response.data.Search
    }
}

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(Movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summery'), 'left')
    }
})

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(Movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summery'), 'right')
    }
})

//Crear dos variables para left Movie y right Movie

let leftMovie
let rightMovie

const onMovieSelect = async (movie,summaryElement, side) => {
    const response = await axios.get("https://omdbapi.com/",{
        params: {
            apikey: '65904a8a',
            i: movie.imbID
        }
    })
    console.log(response.data)
    summaryElement.innerHTML = movieTemplate(response.data)

    //Preguntame cual lado es
    if(side === 'left'){
        leftMovie = response.data
    }else{
        rightMovie = response.data
    }
    //Preguntamos si tenemos ambos lados
    if(leftMovie && rightMovie){
        // Entonces ejecutamos la funcion comparacion
        runComparasion()
    }
}

const runComparasion = () => {
    console.log('Comparasion de peliculas')
    const leftSideStats = document.querySelectorAll('#left-summary .notification')
    const rightSideStats = document.querySelectorAll('#right-summary .notification')

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats(index)
        const leftSideValue = parseInt(leftStat.dataset.value)
        const rightSideValue = parseInt(rightStat.dataset.value)

        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary')
            leftStat.classList.add('is-danger')
        }else{
            rightStat.classList.remove('is-primary')
            rightStat.classList.add('is-danger')
        }
    })
}
const movieTemplates = (moviedetails) => {
    //transformar a numeros los string que llegan de los datos
    const dollars = parseInt(moviedetails.BoxOffice.replace(/\$/g,'').replace(/,/g,''))
    console.log(dollars)
    const metascore = parseInt(moviedetails.metascore)
    const imdbRating = parseFloat(moviedetails.imdbRating)
    const imdbVotes =  parseInt(moviedetails.imdbVotes.replace(/,/g,''))
    console.log(metascore, imdbRating, imdbVotes)
    const awards = moviedetails.awards.split('').reduce((prev,word)=> {
        const value = parseInt(word)

        if(isNaN(value)){
            return prev
        }else{
            return prev + value
        }
    }, 0)
    console.log('Awards', awards)  
    //agregar la propiedad data-value a cada elemento del template

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${moviedetails.Poster}"/>
                </p>
            </figure>
        
        <div class="media-content">
            <div class="content">
                <h1>${moviedetails.Title}</h1>
                <h4>${moviedetails.Genre}</h4>
                <p>${moviedetails.Plot}</p>
            <div>
        </div>
        </article>
        <article data-values=${awards} clas="notification is-primary">
            <p class="title">${moviedetails.awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-values=${dollars} clas="notification is-primary">
            <p class="title">${moviedetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-values=${metascore} clas="notification is-primary">
            <p class="title">${moviedetails.metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-values=${imdbRating} clas="notification is-primary">
            <p class="title">${moviedetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-values=${imdbVotes} clas="notification is-primary">
            <p class="title">${moviedetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `

}



const root = document.querySelector('.autocomplete')
root.innerHTML = `
    <label><b> Busqueda de Peliculas </b></label>
    <input class = "input" />
    <div class = "dropdown">
        <div class = "dropdown-menu">
            <div class = "dropdown-content results"></div>
        </div>
    </div>
`
const input = document.querySelector("inputs")
const dropdown = document.querySelector(".dropdown")
const resultsWeapper = document.querySelector(".results")

const debonce = (func, delay = 1000) => {
    let timeoutId
    return(...arg) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(null, arg)
        }, delay)
    }
}

const onInput = async(event) => {
    const movies = await fetchData(event.target.values)
    console.log("MOVIES: ",movies)
    
    if(!movies.length){
        dropdown.classList.remove('is-activate')
        return
    }
    resultsWeapper.innerHTML = ''
    dropdown.classList.add('is-activate')

    for (let movie of movies){
        const option = document.createElement('a')
        const imgSrc = movie.Poster === "N/A" ? '': movie.Poster

        option.classList.add('dropdown-item')
        option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title}
        `
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-activate')
            input.value = movie.Title
            onMoviesSelect(movie)
        })
        resultsWeapper.appendChild(option)
    }
}

input.addEventListener('input', debonce(onInput, 1000))

document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-activate')
    }
})

const onMoviesSelect = async(movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '65904a8a',
            i: movie.imbID
        }
    })

    console.log(response.data)
    document.querySelector('summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieData1) => {
    return `
        <articule class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieData1.Poster}" />
                </p>
            </figure>
            <div class = ""media-content">
                <div class="content">
                    <h1>${movieData1.Title}</h1>
                    <h4>${movieData1.Genre}</h4>
                    <p>${movieData1.Plot}</p> 
                </div>
            </div>    
        </articule>
    
    `
}