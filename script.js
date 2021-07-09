'use strict'

const countriesContainer = document.querySelector('.countries')
const btn = document.querySelector('.btn-country')

const renderCountry = function (data, className = '') {
    const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(parseInt(data.population) / 1000000).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article>
    `
    countriesContainer.insertAdjacentHTML('beforeend', html)
    countriesContainer.style.opacity = 1
}

// Get Navigator Geoposition
const getPosition = async function () {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

const whereAmI = async function () {
    try {
        // Get Postion
        const position = await getPosition()
        const { latitude, longitude } = position.coords

        // Reverse geolocation
        const responseGeo = await fetch(`https://geocode.xyz/${latitude.toFixed(6)},${longitude.toFixed(6)}?json=1`)
        const dataGeo = await responseGeo.json()
        console.log(`You are in ${dataGeo.city}, ${dataGeo.country}`)

        // Country Data
        const responseCountry = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}`)
        const [dataCountry] = await responseCountry.json()
        renderCountry(dataCountry)

        // Country 2 (Neighbour)
        const [neighbour] = dataCountry.borders
        const responseNeighbour = await fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
        const dataNeighbour = await responseNeighbour.json()
        renderCountry(dataNeighbour, 'neighbour')
    } catch (err) {
        console.log(`Something went wrong. ${err.message}`)
    }
}

btn.addEventListener('click', whereAmI)
