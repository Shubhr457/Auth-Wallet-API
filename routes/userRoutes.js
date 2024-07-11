import express from 'express';
import { userRegistration, userLogin, loggedUser } from '../controllers/userController';
import checkAuth from '../middlewares/middleware';

router.use('/loggeduser',checkAuth)

router.post('/register', userRegistration)
router.post("/login",userLogin)

router.get('/loggeduser',loggedUser)


export default router;
