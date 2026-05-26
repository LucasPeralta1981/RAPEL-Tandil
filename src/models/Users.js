import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'b2b', 'b2c'], default: 'b2c' },
  company: String,
  cuit: String,
  phone: String,
  address: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
