import nodemailer from 'nodemailer';
import 'dotenv/config';
import ApiError from './ApiError.js';
// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service you use
  secure:true,
  port:465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate a random OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  return otp.toString();
};

// Function to send OTP email
export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "mukulpythondev@gmail.com",
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 1 hour.`,
  };

 
    await transporter.sendMail(mailOptions, (error, mailResponse)=> {
      if(error)
      {
        console.error('Error sending OTP email:', error);
        throw new ApiError(500, 'Failed to send OTP email');
      }
      console.log('OTP email sent successfully');
    } );
   
  
 
  
};
