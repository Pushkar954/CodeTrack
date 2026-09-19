import { Router } from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkAuth.js';
import { TaskController } from '../controllers/taskController.js';

const router = Router();
const taskController = new TaskController();

router.use(clerkAuthMiddleware);

router.use(clerkAuthMiddleware);

router.route('/')
  .get(taskController.getTasks.bind(taskController))
  .post(taskController.createTask.bind(taskController));

router.route('/:id')
  .get(taskController.getTaskById.bind(taskController))
  .put(taskController.updateTask.bind(taskController))
  .delete(taskController.deleteTask.bind(taskController));

router.patch('/:id/status', taskController.updateTaskStatus.bind(taskController));

export function setupTaskRoutes(): Router {
  return router;
}
