import React from 'react';

interface Task {
  _id?: string;
  title: string;
  topic: string;
  difficulty: string;
  priority: string;
  status: string;
  deadline?: string;
  createdAt?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onComplete }) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    Pending: 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.topic}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${difficultyColors[task.difficulty as keyof typeof difficultyColors]}`}>
          {task.difficulty}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status as keyof typeof statusColors]}`}>
          {task.status}
        </span>
        <span className="text-xs text-gray-400">{task.priority} priority</span>
      </div>
      <div className="flex gap-2 mt-3">
        {onEdit && <button className="text-sm text-blue-600 hover:underline" onClick={() => onEdit?.(task._id!)}>Edit</button>}
        {onComplete && task.status !== 'Completed' && <button className="text-sm text-green-600 hover:underline" onClick={() => onComplete?.(task._id!)}>Complete</button>}
        {onDelete && <button className="text-sm text-red-600 hover:underline" onClick={() => onDelete?.(task._id!)}>Delete</button>}
      </div>
    </div>
  );
};
