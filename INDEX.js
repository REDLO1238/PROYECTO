const fetchData= async(searchTerm)=> {
    const response = await axios.get('http://omdbapi.com',{
        params: {
            apikey:'78bfc083',
            s:'avengers'

        }
    })
    if(response.data.Error){
        return[]
    }
    console.log(response.data.Search)
}
//fetchData()

const root = document.querySelector('.autocomplete')
root.innerHTML=`
<label><b>Busqueda de peliculas</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`
const input=document.querySelector("input")
const dropdown=document.querySelector('.dropdown')
const resultswrapper = document.querySelector('.results')

const debonce =(func, delay = 1000)=>{
    let timeoutId
    return(...args)=> {
        clearTimeout(timeoutId)
        timeoutId=setTimeout(()=>{
            func.apply(null,args)
             },delay) 
    }

}
const onInput = async(event)=>{
    const movies = await fetchData(event.target.value)
    console.log("MOVIES:",movies)
    if(!movies.length){
        dropdown.classList.add('is-active')
        return
    }
    resultswrapper.innerHTML= ''
    dropdown.classList.add('is-active')

    for(let movie of movies){
        const option = document.createElement('a')
        const imgSrc =movie.Poster === 'N/A' ? '':movie.Poster

        option.classList.add('dropdown-item')
        option.innerHTML= `
        <img src="${imgSrc}" />
        ${movie.Title}
        `
        option.addEventListener('click', ()=> {
            dropdown.classList.remove('is-active')
            input.value = movie.Title
            onMoviesSelect(movie)
        })
        resultswrapper.appendChild(option)
    }
}

input.addEventListener('input', debounce(onInput,1000))
document.addEventListener('click', event =>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active')
    }
})

const onMoviesSelect=async(movie)=>{
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey:'',
            i: movie.imdbID
        }
    })
    console.log(response.data)
    document.querySelector('#summary').innerHTML= movieTemplate(response.data)
}
const movieTemplate=(movieDetails)=> {
    return`
    <article class="media"
    <figure class"media-left">
    <p class="image">
    <img src="${movieDetails.Poster}"/>
    </p>
    </figure>
    <div class="media-content">
    <div class="content">
    <h1>${movieDetails.Title}</h1>
    <h4>${movieDetails.genre}</h4>
    <p>${movieDetails.Plot}</p>
    </dive>
    </div>
    </article>`

}