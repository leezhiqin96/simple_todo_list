const { sequelize, User, Task } = require('../models/');

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

    res.status(200).send({ message: 'Successfully Registered! You can now log in with your new credentials.' });
  } catch (error) {
    await transaction.rollback();
    catchError(res, "Something went wrong, please reload and try again!", error, 'createUser')
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

const loginUser = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.login(login, password);
    if (user) {
      req.session.userId = user.dataValues.id; // Store user ID in the session
      res.status(200).send({ message: 'Login successful', redirectUrl: '/' });
    } else {
      res.status(401).send({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    catchError(res, error.message, error, 'loginUser')
  }
}

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to log out' });
    }
    res.status(200).send({ message: 'Logout successful', redirectUrl: '/login' });
  });
};

const getUserTasks = async (req, res) => {
  const userID = req.params.userID;

  try {
    const tasks = await Task.findAll({
      where: { parentTaskID: null, userID },
      include: [{
        model: Task,
        as: 'subtasks',
      }],
      order: [['orderIndex', 'ASC']]
    });
    res.status(200).send(tasks);
  } catch (error) {
    catchError(res, error.message, error, 'getUserTasks')
  }
}

const addUserTask = async (req, res) => {
  const userID = req.params.userID;
  const taskTitle = req.body.taskTitle

  try {
    const result = await sequelize.transaction(async () => {
      const user = await User.findOne({
        where: { id: userID },
        include: [{
          model: Task,
          as: 'tasks'
        }],
      });
      if (!user) {
        throw new Error('User not found');
      }

      // Filter out subtasks to get only parent tasks
      const parentTasks = user.tasks.filter(task => task.parentTaskID === null);
      // Find the maximum orderIndex among parent tasks
      const maxOrderIndex = parentTasks.length ? Math.max(...parentTasks.map(task => task.orderIndex)) : 0;
      const newTask = await Task.create({
        title: taskTitle,
        status: 'Not Started',
        priority: 'Low',
        orderIndex: maxOrderIndex + 1,
        userID: user.id,
      });

      return newTask;
    });

    res.status(200).send(result);
  } catch (error) {
    catchError(res, error.message, error, 'addUserTask');
  }
}

const updateUserTask = async (req, res) => {
  const taskID = req.params.taskID;
  const { id, field, value } = req.body;

  try {
    const result = await sequelize.transaction(async () => {
      const task = await Task.findByPk(taskID);
      task[field] = value;

      const updatedTask = await task.save();
      return updatedTask
    });

    res.status(200).json({task: result})
  } catch (error) {
    catchError(res, error.message, error, 'updateUserTask');
  }
}

module.exports = {
  createUser,
  checkUserExists,
  loginUser,
  logoutUser,
  getUserTasks,
  addUserTask,
  updateUserTask
}
