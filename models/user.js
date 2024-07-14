const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true },
  balance: { type: Number, default: 1000 },
})



const User = mongoose.model("User", userSchema)

module.exports=User
