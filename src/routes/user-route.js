const express = require('express')
const bcrypt = require('bcryptjs')
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

//getting list of all employees
router.get('/list' ,auth,async (req,res) => {
    try {
        if(req.user.role == 'guest')
            throw new Error('You are not authorised to view this')
        //find all the users in the database except admin
        const user = await User.find({"role":{$ne:"admin"}})
        res.send(utils.createResponse(undefined,user))
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
})

//showing the requester profile
router.get('/dashboard', auth , async (req,res) => {
    try {
        const user = await User.findById(req.user._id)
        if(!user)
            throw new Error('No user found')
        res.send(utils.createResponse(undefined,user))
    } catch (error) {
        res.send(utils.createResponse(e.message))
    }
})

//adding employee to the database
router.post('/add',auth,async (req,res) => {
    const user = new User(req.body)
    try {
        if(req.user.role === 'guest')
            throw new Error('You do not have valid permission to perform for this action')
        console.log('add function');
        await user.save()
        const name = `${utils.nameFormatter(req.body.fname)} ${utils.nameFormatter(req.body.lname)}`
        await mailer.onboardingMail(req.body.email,name,user._id)
        res.send(utils.createResponse(undefined,user))
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
})

//verifying the user and setting their password after onboarding
router.post('/verify',async (req,res) => {
    const id = req.query.token  //getting querry  from the url
    try {
        //encrypting the password before saving to the database
        const encryptedpassword = await bcrypt.hash(req.body.password,10) 
        const user = await User.findByIdAndUpdate({_id:id},{password:encryptedpassword,flag:1})
        res.send(utils.createResponse(undefined,user))
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
})

//updating the details 
router.put('/update' , auth ,async (req,res) => {
    
    const updates = Object.keys(req.body)   //converting the object to the array
    const allowedupdates = ['dob','passport','aadhar']   //defining what should be updated
    const isValidOperation = updates.every((update) => allowedupdates.includes(update))

    if(!isValidOperation)
        return res.send(utils.createResponse('Invalid updates!!!'))

    try {
        updates.forEach((update) =>{
            req.user.details[update] = req.body[update]
            req.user.flag = 2
        })
        await req.user.save()
        res.send(utils.createResponse(undefined,req.user))
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