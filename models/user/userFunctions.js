const User = require('./user');

exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const { email, password, name, contactPhone } = data;
    const newUser = new User({ email, password, name, contactPhone });

    if (newUser) {
      resolve(newUser);
    } else {
      reject('wrong data');
    }
  });
};

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const findEmail = async(email) => {
      const result = await User.findOne({email: email}).select('-__v');
      try {
        return result
      } catch (error) {
        return error
      }
    }
    if (findEmail(email)) {
      resolve(findEmail(email));
    } else {
      reject(null);
    }
  });
};
