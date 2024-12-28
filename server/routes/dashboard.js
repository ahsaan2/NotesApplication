const express = require('express')
const router = express.Router()
const dashboardController = require('../controller/dashboardController')
const {isLoggedIn} = require('../middleware/checkAuth')
// DASHBOARD ROUTES
// authnticating the dashboard
router.get('/dashboard',isLoggedIn, dashboardController.dashboard)
router.get('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardViewNote)
router.put('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardUpdateNote)





module.exports = router;