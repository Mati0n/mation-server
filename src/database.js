import { connect as _connect } from 'mongoose';
const User = require('./models/user');

function connect () {
  // Подключение к базе данных
  _connect('mongodb://localhost/mation-server', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to the database');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });
}

async function createUser (username, password) {
  try {
    const user = new User({ username, password });
    await user.save();
    console.log('User created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

export default { connect, createUser };
