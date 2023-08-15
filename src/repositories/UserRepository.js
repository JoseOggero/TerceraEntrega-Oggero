const User = require('../models/User');

class UserRepository {
  static async createUser(username, email, password) {
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();
    return user;
  }

  static async getUserByEmail(email) {
    return User.findOne({ email });
  }

}

module.exports = UserRepository;
