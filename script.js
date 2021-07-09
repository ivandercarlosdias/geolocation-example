'use strict'

const countriesContainer = document.querySelector('.countries')
const btn = document.querySelector('.btn-country')

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
