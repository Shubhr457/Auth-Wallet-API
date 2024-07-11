const express = require('express')
const {userRegistration,userLogin,loggedUser} = require('../controllers/userController')
const router = express.Router();
const checkAuth = require("../middlewares/middleware")


router.use('/loggeduser',checkAuth)

router.post('/register', userRegistration)
router.post("/login",userLogin)

router.get('/loggeduser',loggedUser)


module.exports=router;