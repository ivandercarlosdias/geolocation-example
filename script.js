'use strict'

const countriesContainer = document.querySelector('.countries')
const btn = document.querySelector('.btn-country')

// Render countries html
const renderCountry = function (data, className = '') {
    const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(parseInt(data.population) / 1000000).toFixed(1)} mi people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article>
    `
    countriesContainer.insertAdjacentHTML('beforeend', html)
    countriesContainer.style.opacity = 1
}

// Get Navigator Geoposition
const getPosition = function () {
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
        const resGeo = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
        )
        if (!resGeo.ok) throw new Error(`Problem with geocoding api ${resGeo.status}`) // set error

        const dataGeo = await resGeo.json()
        console.log(`You are in ${dataGeo.city}, ${dataGeo.countryName}`)

        // Country Data
        const resCountry = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.countryName}`)
        if (!resCountry.ok) throw new Error(`Country not found (${resCountry.status})`) // set error

        const [dataCountry] = await resCountry.json()
        renderCountry(dataCountry)

        // Country 2 (Neighbour)
        const [neighbour] = dataCountry.borders
        if (!neighbour) throw new Error('No neighbour found!') // set error

        const resNeighbour = await fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
        if (!resNeighbour.ok) throw new Error(`Country not found (${resNeighbour.status})`) // set error

        const dataNeighbour = await resNeighbour.json()
        renderCountry(dataNeighbour, 'neighbour')
    } catch (err) {
        console.error(`Something went wrong. ${err.message} 💣`)
    } finally {
        // Set button to disable
        btn.disabled = true
    }
}

btn.addEventListener('click', whereAmI)
