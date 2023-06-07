import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastControlZone: { type: String, default: null },
  lastControlDevice: { type: String, default: null },
  // другие поля пользователя...
});

const User = model('User', userSchema);

export default User;
