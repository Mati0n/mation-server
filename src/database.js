import { connect as _connect } from 'mongoose';

function connect () {
  // Подключение к базе данных
  _connect('mongodb://localhost/smart_home_system', {
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

export default { connect };
