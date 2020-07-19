const express = require('express')
const User = require('../models/user')
const auth = require('../Middleware/auth')
const utils = require('../../utils')
const mailer = require('../mail/mailer')
const router = express.Router()

//logging in the user
router.post('/login', async (req,res) => {
    try {
        //creating our own fuction
        const user = await User.findByCredentials(req.body.email, req.body.password) 
        
        const token = await user.generateAuthToken()
        
        res.send(utils.createResponse(undefined,{user,token}))
    
    } catch (e) {        
        console.log(e);
        res.status(400).send(utils.createResponse(e.message))
        
    }
})

router.get('/dashboard' ,auth,async (req,res) => {
    try {
        const user = await User.find({"role":{$ne:"admin"}})
        res.send(utils.createResponse(undefined,user))
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
})

//adding employee to the database
router.post('/add',auth,async (req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const name = `${req.body.fname} ${req.body.lname}`
        await mailer.onboardingMail(req.body.email,name,user._id)
        res.send(utils.createResponse(undefined,user))
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
})

//viewing a specific employee using the employee id
router.get('/view/:id' , auth , async (req,res) => {
    const id = req.params.id
    try {
        if(req.user.role == 'guest')
            throw new Error('you are not authorized to view this')
        const user = await User.findById(id)
        res.send(utils.createResponse(undefined,user))
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
})

module.exports = router