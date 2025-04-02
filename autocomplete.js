const createAutocomplete =({root, rederOption, onOptionSelect, inputValue, fetchData})=>{
    //function createAutoComplete
    root.innerHTML `
    <label><b>Busqueda</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <dov class="dropdown-content results"></div>
        </div>
    </div>
    `
}
const input = root.querySelector('input')
const dropdown = root.querySelector('.dropdown')
const resultwrapper = root.querySelector('.result')

const debonce = (func, delay = 1000) =>{
    let timeoutId
    return(...args) => {
        clearTimeout(timeoutId)
        timeoutId = serTimeout(() =>{
            func.apply(null, args)
        }, deLay)
    }
}

const onInput = async event => {
    const items = await fetchData(event.target.value)
    console.log("Movies", items)

    if(!items.length){
        dropdown.classList.remove('is-active')
        return
    }
   
    resultwrapper.innerHTML=''
    dropdown.classList.add('is-active')
    for(let item of items) {
        const option = document.createElement('a')

        option.classList.add('dropdown-item')
        option.innerHTML = renderOption(item)
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active')
            input.value = inputValue(item)
            onOptionSelect(item)
            console.log("onMovieSelect")
        })
        resultsWrapper.appendChild(option)
    }
}

