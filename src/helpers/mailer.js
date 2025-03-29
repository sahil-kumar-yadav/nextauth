import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '@/models/userModel';

const sendEmail = async ( email, emailType, userId ) => {
  try {
    // Create a transporter
    console.log('Creating transporter...');
    console.log('Email:', email);
    console.log('Email Type:', emailType);
    console.log('User ID:', userId);
    console.log("emailuser", process.env.EMAIL_USER);
    console.log("emailpass", process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Define the email content based on emailType
    let subject, text, htmlContent;

    if (emailType === 'verification') {
      // Generate a verification token using bcryptjs
      const verifyToken = await bcrypt.hash(userId + Date.now().toString(), 10); // Unique token
      const verifyTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

      // Update the user in the database with the verification token and expiry
      await User.findByIdAndUpdate(userId, {
        verifyToken,
        verifyTokenExpiry,
      });

      subject = 'Verify Your Email';
      text = `Please verify your email by clicking the link: ${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(verifyToken)}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>${subject}</h2>
          <p>Dear User,</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(verifyToken)}" 
             style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
             Verify Email
          </a>
          <p>If the button above does not work, copy and paste the following link into your browser:</p>
          <p>${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(verifyToken)}</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thank you,<br>The Team</p>
        </div>
      `;
    } else if (emailType === 'reset') {
      // Generate a forgot password token using bcryptjs
      const forgotPasswordToken = await bcrypt.hash(userId + Date.now().toString(), 10); // Unique token
      const forgotPasswordExpiry = Date.now() + 3600000; // Token valid for 1 hour

      // Update the user in the database with the forgot password token and expiry
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken,
        forgotPasswordExpiry,
      });

      subject = 'Reset Your Password';
      text = `You can reset your password by clicking the link: ${process.env.DOMAIN}/resetpassword?token=${encodeURIComponent(forgotPasswordToken)}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>${subject}</h2>
          <p>Dear User,</p>
          <p>You can reset your password by clicking the link below:</p>
          <a href="${process.env.DOMAIN}/resetpassword?token=${encodeURIComponent(forgotPasswordToken)}" 
             style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
             Reset Password
          </a>
          <p>If the button above does not work, copy and paste the following link into your browser:</p>
          <p>${process.env.DOMAIN}/resetpassword?token=${encodeURIComponent(forgotPasswordToken)}</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thank you,<br>The Team</p>
        </div>
      `;
    } else {
      throw new Error('Invalid email type');
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Recipient address
      subject: subject, // Subject line
      html: htmlContent, // HTML body
    };

    // Send the email
    const mailResponseInfo = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${mailResponseInfo.messageId}`);
    return mailResponseInfo;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error; // Re-throw the error for further handling
  }
};

export default sendEmail;