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

getPosition()
    .then((position) => console.log(position))
    .catch((err) => console.error(err.message))
