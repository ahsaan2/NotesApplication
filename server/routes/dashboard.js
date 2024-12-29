const express = require('express')
const router = express.Router()
const dashboardController = require('../controller/dashboardController')
const {isLoggedIn} = require('../middleware/checkAuth')
// DASHBOARD ROUTES
// authnticating the dashboard
router.get('/dashboard',isLoggedIn, dashboardController.dashboard)
router.get('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardViewNote)
router.put('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardUpdateNote)
router.delete('/dashboard/item-delete/:id',isLoggedIn, dashboardController.dashboardDeleteNote)


// adding item
router.get('/dashboard/add', isLoggedIn,dashboardController.dashboardAddNote )
router.post('/dashboard/add', isLoggedIn,dashboardController.dashboardAddNoteSubmit )

// router.get('/dashboard/search',isLoggedIn, dashboardController.dashboardSearch)
// router.post('/dashboard/search',isLoggedIn, dashboardController.dashboardSubmit)



module.exports = router;