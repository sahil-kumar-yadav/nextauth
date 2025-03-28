import nodemailer from 'nodemailer';

const sendEmail = async ({ email, emailType, userId }) => {
    try {
        // todo: configure mail for usage
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service (e.g., Gmail, Outlook, etc.)
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app-specific password
            },
        });

        // Define the email content based on emailType
        let subject, text;
        if (emailType === 'verification') {
            subject = 'Verify Your Email';
            text = `Please verify your email by clicking the link: ${process.env.BASE_URL}/verify/${userId}`;
        } else if (emailType === 'reset') {
            subject = 'Reset Your Password';
            text = `You can reset your password by clicking the link: ${process.env.BASE_URL}/reset/${userId}`;
        } else {
            throw new Error('Invalid email type');
        }

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Recipient address
            subject: subject, // Subject line
            // text: text, // Plain text body
            html: `<p>${text}</p>`, // HTML body
        };

        // Send the email
        const mailResposeInfo = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${mailResposeInfo.messageId}`);
        return mailResposeInfo;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error; // Re-throw the error for further handling
    }
};

export default sendEmail;