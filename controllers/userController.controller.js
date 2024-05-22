const { Op } = require('sequelize');
const { sequelize, User, Task } = require('../models/');

const catchError = (res, msg, error, functionName) => {
  if (res != null) {
    console.log('Error - ', msg, functionName, error)
    res.status(500).json({
      message: msg, error: error.message
    });

  } else {
    console.log('Error - ', msg, functionName, error)
  }
}


const createUser = async (req, res) => {
  const { email, username, password, ...others } = req.body;
  try {
    const newUser = await sequelize.transaction(async () => {
      const result = await User.create({
        email,
        userName: username,
        password
      })

      return result;
    });

    res.status(200).json({ message: 'Successfully Registered! You can now log in with your new credentials.', newUser });
  } catch (error) {
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
      res.status(200).json({ message: 'Login successful', redirectUrl: '/' });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    catchError(res, error.message, error, 'loginUser')
  }
}

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logout successful', redirectUrl: '/login' });
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
    res.status(200).json(tasks);
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

    res.status(200).json({ newTask: result });
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

    res.status(200).json({ updatedTask: result })
  } catch (error) {
    catchError(res, error.message, error, 'updateUserTask');
  }
}

const deleteUserTask = async (req, res) => {
  const userID = req.params.userID;
  const idList = req.body;

  if (!Array.isArray(idList) || idList.length === 0) {
    return res.status(400).json({ message: 'Invalid request: ids must be a non-empty array' });
  }

  try {
    await sequelize.transaction(async () => {
      return await Task.destroy({
        where: {
          id: { [Op.in]: idList },
          userID: userID
        }
      })
    });

    res.status(200).json({ message: 'Tasks deleted successfully' });
  } catch (error) {
    catchError(res, error.message, error, 'updateUserTask');
  }
}

const addUserSubtask = async (req, res) => {
  const userID = req.params.userID;
  const parentTaskID = req.params.taskID;
  const taskTitle = req.body.taskTitle;

  try {
    const result = await sequelize.transaction(async () => {
      const parentTask = await Task.findOne({
        where: { id: parentTaskID },
        include: [{
          model: Task,
          as: 'subtasks'
        }],
      });
      if (!parentTask) {
        throw new Error('Tasks not found');
      }

      // Find the maximum orderIndex among subtasks
      const maxOrderIndex = parentTask.subtasks.length ? Math.max(...parentTask.subtasks.map(task => task.orderIndex)) : 0;
      const newTask = await Task.create({
        title: taskTitle,
        status: 'Not Started',
        priority: 'Low',
        orderIndex: maxOrderIndex + 1,
        userID: userID,
        parentTaskID: parentTask.id
      });

      return newTask;
    });

    res.status(200).json({ newTask: result });
  } catch (error) {
    catchError(res, error.message, error, 'addUserSubtask');
  }
}

module.exports = {
  createUser,
  checkUserExists,
  loginUser,
  logoutUser,
  getUserTasks,
  addUserTask,
  updateUserTask,
  deleteUserTask,
  addUserSubtask
}
