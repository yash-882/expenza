import nodemailer from 'nodemailer'

// Sender configs
const createTransport = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.G_PASSWORD
        },
        tls: {
            rejectUnauthorized: false //NEVER SET IT TO FALSE IN PRODUCTION
        }
    })
}

// receiver
const sendMail = async (receiverEmail) => {
    // sender configs and credentials
    const transporter = createTransport()

    // send mail to receiver (can include texts, reciever's mail, subject, etc)
    await transporter.sendMail(receiverEmail);
}

export default {
    createTransport,
    sendMail
}