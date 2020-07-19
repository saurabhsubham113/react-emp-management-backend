const jwt = require('jsonwebtoken')
const User = require('../models/user')
const utils = require('../../utils')

const auth = async (req, res, next) => {
   try{ 
       const token = req.headers['x-auth-token']
        const decode = jwt.verify(token,process.env.TOKEN_SECRET)
        //getting user from the token provided
        const user = await User.findOne({ _id:decode._id,'tokens.token':token })
        if (!user) throw new Error('please authenticate')
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send(utils.createResponse(e.message))
    }
}

module.exports = auth