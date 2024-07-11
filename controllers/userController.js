const UserModel = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require("../config/sendEmail")
const sendEmail = require('../config/sendEmail');

const userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation, tc } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    res.send({ "status": "failed", "message": "Email already exists" });
  } else {
    if (name && email && password && password_confirmation && tc) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const doc = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc
          });
          await doc.save();
          const saved_user = await UserModel.findOne({ email: email });
          const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });

          const emailSubject = 'Welcome to Our App!';
          const emailText = `Hello ${name},\n\nThank you for registering. We're excited to have you on board!\n\nBest regards,\nThe Team`;

          try {
            await sendEmail(email, emailSubject, emailText);
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token });
          } catch (emailError) {
            console.error('Error sending email:', emailError);
            res.status(201).send({ "status": "success", "message": "Registration Success, but failed to send email", "token": token });
          }

        } catch (error) {
          console.log(error);
          res.send({ "status": "failed", "message": "Unable to Register" });
        }
      } else {
        res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" });
      }
    } else {
      res.send({ "status": "failed", "message": "All fields are required" });
    }
  }
};

  const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      if (email && password) {
        const user = await UserModel.findOne({ email: email })
        console.log(user)
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if ((user.email === email) && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            res.send({ "status": "success", "message": "Login Success", "token": token })
          } else {
            res.send({ "status": "failed", "message": "Email or Password is not Valid" })
          }
        } else {
          res.send({ "status": "failed", "message": "You are not a Registered User" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Unable to Login" })
    }
  }

  const loggedUser = async (req, res) => {
    res.send({ "user": req.user })
  }


  
  module.exports = {
    userRegistration,
    userLogin,
    loggedUser,
    
  };