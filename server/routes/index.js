const express = require('express')
const router = express.Router()
const mainController = require('../controller/mainController')

    // APP ROUTES
    router.get('/', mainController.homepage);
    router.get('/about', mainController.about);
    // router.get('/about', mainController.about);




// to use this router in the app.js , we need to export this router
module.exports  = router