const nodemailer = require('nodemailer')

function onboardingMail(sender, name, id) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        //setting the oauth for gmail account
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN
        }
    })
    //onboarding message
    const onboardingMessage = `
        <p>Dear ${name},</p>

        <p>Welcome to our ABC company.</p>
        <p>First of all a heartiest congratulation to you.</p>
         <p>
            We need a little more information to complete the registration,including confirmation of your email address.
            <strong> Click below to confirm your email address:</strong><br>
            http://localhost:4200/verify/?token=${id}
        </p>                
        <p>
            Our company is looking forward to helping you find your way and learn more about what we do here.
            We can't wait to see your work and show off some of your amazing skills.
            We believe that you will be a great asset to our company.        
        </p>
        <p>        
            We are like a big family and we look forward to being working with you.
        <p/>
        <p>Thank you!</p>
        <p>John Doe</p>
        <p>ABC Company</p>
`
    let mailoptions = {
        from: `subham saurabh <${process.env.EMAIL}> `,
        to: sender,
        subject: 'Welcome to our family',
        html: onboardingMessage
    }

    return transporter.sendMail(mailoptions)
}

module.exports = { onboardingMail }