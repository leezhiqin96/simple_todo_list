const { sequelize, User } = require('../models/');

const catchError = (res, msg, error, functionName) => {
  if (res != null) {
    console.log('Error - ', msg, functionName, error)
    res.status(500).send({
      message: msg, error: error.message
    });

  } else {
    console.log('Error - ', msg, functionName, error)
  }

}


const createUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { email, username, password, ...others } = req.body;
    await User.create({
      email,
      userName: username,
      password
    }, { transaction })

    await transaction.commit();

    res.status(200).send({ message: 'Successfully Registered!' })
  } catch (error) {
    console.log("ERROR LOG", error);
    await transaction.rollback();
    catchError(res, error.message, error, 'createUser')
  }
}

const checkUserExists = async (req, res) => {
  const { email, userName } = req.query;
  let user;

  try {
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (userName) {
      user = await User.findOne({ where: { userName } })
    }

    res.status(200).json({ exists: user ? true : false });
  } catch (error) {
    catchError(res, error.message, error, 'checkEmailExists')
  }
}

module.exports = {
  createUser,
  checkUserExists
}
