const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All of these routes are protected
router.use(protect);

router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
