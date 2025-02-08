const express = require('express')
const routes = express.Router()
const { getHomePage, getQhuong } = require('../controllers/homeController')

routes.get('/', getHomePage)

routes.get('/qhuong', getQhuong)


module.exports = routes