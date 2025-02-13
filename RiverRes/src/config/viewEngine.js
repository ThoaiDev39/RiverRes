const path = require('path')
const express = require('express')

const configViewEngine = (app) => {
//    console.log("check dirname: ", __dirname)
    app.set('views', path.join(__dirname, '../views')) // Dùng đường dẫn tuyệt đối
    app.set('view engine', 'ejs')

    // config static files: img/css/js
    app.use(express.static(path.join(__dirname, '../publics')))

}

module.exports = configViewEngine
