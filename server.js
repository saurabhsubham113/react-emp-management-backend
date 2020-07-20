const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
require('./src/db/mongodb')
const utils = require('./utils')
const userRouter = require('./src/routes/user-route')
const mail = require('./src/mail/mailer')
const app = express()

//for resoving cors
app.use(cors('*'))
/*Returns middleware that only parses json and only looks at requests
 where the Content-Type header matches the type option. */
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//for debugging purpose
app.use(morgan('dev'))

app.use(userRouter)


const port = process.env.PORT
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})