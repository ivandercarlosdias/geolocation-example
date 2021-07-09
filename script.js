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

const getPosition = function () {
    return new Promise((resolve, reject) => {
        // navigator.geolocation.getCurrentPosition(
        //     (position) => resolve(position),
        //     (err) => reject(err)
        // )
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

const whereAmI = function () {
    getPosition()
        .then((position) => {
            // console.log(position.coords)
            const { latitude, longitude } = position.coords

            return fetch(`https://geocode.xyz/${latitude.toFixed(6)},${longitude.toFixed(6)}?json=1`)
        })
        .then((response) => {
            if (!response.ok) throw new Error(`Problem with geocoding api ${response.status}`)

            return response.json()
        })
        .then((data) => {
            console.log(`You are in ${data.city}, ${data.country}`)

            return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`)
        })
        .then((response) => {
            if (!response.ok) throw new Error(`Country not found (${response.status})`)

            return response.json()
        })
        .then((data) => {
            renderCountry(data[0])

            const neighbour = data[0].borders[0]

            if (!neighbour) throw new Error('No neighbour found!')

            // Country 2 (Neighbour)
            return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => renderCountry(data, 'neighbour'))

        .catch((err) => console.error(`${err.message} 💥`))
}

btn.addEventListener('click', whereAmI)
