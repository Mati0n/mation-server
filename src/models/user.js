class User {
  constructor({ username, password, email, name, role }) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.name = name;
    this.role = role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastControlZone = null;
    this.lastControlDevice = null;
    // Другие поля пользователя...
  }
}

module.exports = User;
