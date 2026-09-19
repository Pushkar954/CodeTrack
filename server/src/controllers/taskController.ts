import { Request, Response } from 'express';
import { Task } from '../models/Task.js';
import { NotFoundError } from '../errors/appError.js';

export class TaskController {
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;
      const { topic, difficulty, priority, status, search, sortBy, sortOrder } = req.query;

      const filter: any = { userId };
      if (topic) filter.topic = topic as string;
      if (difficulty) filter.difficulty = difficulty as string;
      if (priority) filter.priority = priority as string;
      if (status) filter.status = status as string;
      if (search) {
        filter.$or = [
          { title: { $regex: search as string, $options: 'i' } },
          { description: { $regex: search as string, $options: 'i' } },
          { topic: { $regex: search as string, $options: 'i' } },
        ];
      }

      let sort: any = {};
      const sortByParam = (sortBy as string) || 'newest';
      const sortOrderParam = (sortOrder as string) || 'desc';
      switch (sortByParam) {
        case 'deadline': sort = { deadline: sortOrderParam === 'asc' ? 1 : -1 }; break;
        case 'priority': sort = { priority: sortOrderParam === 'asc' ? 1 : -1 }; break;
        case 'difficulty': sort = { difficulty: sortOrderParam === 'asc' ? 1 : -1 }; break;
        case 'oldest': sort = { createdAt: 1 }; break;
        default: sort = { createdAt: -1 }; break;
      }

      const tasks = await Task.find(filter).sort(sort).lean();
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      throw error;
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;
      const taskData = { ...req.body, userId };
      const task = await Task.create(taskData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;
      const task = await Task.findOne({ _id: req.params.id, userId }).lean();
      if (!task) throw new NotFoundError('Task not found');
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      throw error;
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId },
        req.body,
        { new: true, runValidators: true }
      ).lean();
      if (!task) throw new NotFoundError('Task not found');
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId });
      if (!task) throw new NotFoundError('Task not found');
      res.status(200).json({ success: true, data: { message: 'Task deleted' } });
    } catch (error) {
      throw error;
    }
  }

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;
      const { status } = req.body;
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId },
        { status, completedAt: status === 'Completed' ? new Date() : undefined },
        { new: true, runValidators: true }
      ).lean();
      if (!task) throw new NotFoundError('Task not found');
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      throw error;
    }
  }
}
