const express = require('express')
const router = express.Router()
const dashboardController = require('../controller/dashboardController')

// DASHBOARD ROUTES
router.get('/dashboard', dashboardController.dashboard)


module.exports = router;