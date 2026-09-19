import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, updateTaskSchema } from '../../schemas/goalSchema';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TaskFormData {
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  priority: string;
  status: string;
  deadline?: string;
  problemUrl: string;
  notes: string;
}

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel, loading }) => {
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    resolver: zodResolver(initialData ? updateTaskSchema : createTaskSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      topic: '',
      difficulty: 'Medium',
      priority: 'Medium',
      status: 'Pending',
      problemUrl: '',
      notes: '',
    },
  });

  const onFormSubmit = async (data: TaskFormData) => {
    setError('');
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input {...register('title')} className="w-full" />
        {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input {...register('description')} className="w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <Input {...register('topic')} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select {...register('difficulty')} className="w-full border rounded-lg px-3 py-2">
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select {...register('priority')} className="w-full border rounded-lg px-3 py-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <Input type="date" {...register('deadline')} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Problem URL</label>
        <Input {...register('problemUrl')} className="w-full" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting || loading}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>}
      </div>
    </form>
  );
};
