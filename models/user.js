import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  location: String,
  age: Number,
  work: String,
  dob: Date,
  description: String,
});

const User = mongoose.model('User', UserSchema);

export default User;
