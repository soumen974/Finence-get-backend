const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailVerification = require('../models/emailVerification');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateVerificationCode = async (email) => {
  if (!email) {
    throw new Error('Email cannot be null or undefined');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); 
  const expiresAt = new Date(Date.now() + 6 * 60000);

  await EmailVerification.findOneAndUpdate(
    { email },
    { code, expiresAt, createdAt: Date.now() },
    { upsert: true, new: true }
  );

  return code;
};

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #333; font-size: 24px;">Welcome to Our Service!</h2>
      <p style="color: #555; font-size: 16px;">Thank you for registering with us. To complete your registration, please use the following verification code:</p>
      <h1 style="background: #007bff; border-radius: 5px; display: inline-block; padding: 10px 20px; color: #fff; font-size: 32px;">${code}</h1>
      <p style="color: #555; font-size: 16px;">This code is valid for six minutes.</p>
      <p style="color: #777; font-size: 14px; margin-top: 20px;">If you did not request this code, please ignore this email.</p>
      <p style="color: #777; font-size: 14px;">Best regards,</p>
      <p style="color: #777; font-size: 14px;">The Team</p>
    </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

const createToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = [ 
  body('email').isEmail().withMessage('Invalid email address'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exist'});
    

    const verificationCode = await generateVerificationCode(email);
    await sendVerificationEmail(email, verificationCode);

      res.status(201).json({ message: `Verification code sent to ${email}` });

       setTimeout(() => {
          EmailVerification.deleteOne({ email });
      }, 360000);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}];

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = createToken(user);
    
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.status(200).json({ msg: 'Logged in successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, maxAge: 1 }); // Clear the cookie
  res.status(200).json({ msg: 'Logged out successfully' });
};