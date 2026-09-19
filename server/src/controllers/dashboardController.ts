import { Request, Response } from 'express';
import { Task } from '../models/Task.js';

export class DashboardController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).clerkUser.clerkUserId;

      const total = await Task.countDocuments({ userId });
      const completed = await Task.countDocuments({ userId, status: 'Completed' });
      const pending = await Task.countDocuments({ userId, status: 'Pending' });
      const inProgress = await Task.countDocuments({ userId, status: 'In Progress' });
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      const difficultyStats = await Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      ]);

      const topicStats = await Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$topic', count: { $sum: 1 } } },
      ]);

      const stats = {
        total,
        completed,
        pending,
        inProgress,
        completionRate,
        difficulty: {
          Easy: 0,
          Medium: 0,
          Hard: 0,
        },
        topics: {},
      };

      difficultyStats.forEach((d: any) => {
        (stats.difficulty as any)[d._id] = d.count;
      });

      topicStats.forEach((t: any) => {
        (stats.topics as any)[t._id] = t.count;
      });

      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      throw error;
    }
  }
}
