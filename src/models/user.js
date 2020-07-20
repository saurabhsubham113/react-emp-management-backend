const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//creating user schema
const userSchema = new mongoose.Schema({

    status:{
        type:String,
        trim:true,
        default:'Active'
    },
    empid:{
        type:String,
        trim:true,
        required:true
    },

    fname:{
        type:String,
        trim:true,
        required:true
    },
    lname:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
    },
    role:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        trim:true,
        minlength:8
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    details:{
        dob:{
            type:Date
        },
        passport:{
            type:String,
            trim:true
        },
        aadhar:{
            type:Number,
            maxlength:12,
            
        }
    },
    flag:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

//creating what data should be visible to the client
//toJSON method is used to manipulate the data
userSchema.methods.toJSON = function(){
    const user = this
    
    const userObject = user.toObject()//changing user to object 
    
    delete userObject.tokens
    delete userObject.password

    return userObject
}

//it is used to create methods on instances not on models(User) also called instance method
//generating jwt token for authentication
userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

//creating your own custom function, it is accesible on model also called model function
//finding profile using email and password 
userSchema.statics.findByCredentials= async (email, password) => {
    const user = await User.findOne({ email:email })

    if(!user)
        throw new Error('unable to login')
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        throw new Error('unable to login')

    return user
}

//hashing the password before saving it to database
userSchema.pre('save', async function (next){
    const user = this

    //if password is modified then only hash the password 
    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password,10)

    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User