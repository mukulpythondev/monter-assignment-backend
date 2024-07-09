import mongoose from 'mongoose';

const TempUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: String,
  otpExpires: Date,
});

const TempUser = mongoose.model('TempUser', TempUserSchema);

export default TempUser;
