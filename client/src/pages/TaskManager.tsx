import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';

export const TaskManager: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/tasks', { params: { search: filter } });
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/api/v1/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading tasks</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Problems</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + Add Problem
        </button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />

      {showForm && (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-3">Add New Problem</h3>
          <TaskForm
            onSubmit={async (data: any) => createMutation.mutateAsync(data)}
            onCancel={() => setShowForm(false)}
            loading={createMutation.isPending}
          />
        </div>
      )}

      <div className="grid gap-3">
        {tasks?.map((task: any) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      {!tasks?.length && (
        <div className="text-center py-8 text-gray-500">
          <p>No problems found.</p>
          <p className="text-sm mt-1">Start building your problem-solving roadmap by adding your first problem.</p>
        </div>
      )}
    </div>
  );
};
