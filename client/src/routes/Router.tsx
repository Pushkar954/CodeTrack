import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useClerkAuth } from '../features/auth/authContext';
import { Dashboard } from '../pages/Dashboard';
import { TaskManager } from '../pages/TaskManager';
import { TaskForm } from '../components/tasks/TaskForm';
import { Navbar } from '../layouts/Navbar';
import { Footer } from '../layouts/Footer';
import apiClient from '../services/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const TaskFormWrapper: React.FC = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/api/v1/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return (
    <TaskForm
      onSubmit={async (data: any) => mutation.mutateAsync(data)}
      onCancel={() => {}}
      loading={mutation.isPending}
    />
  );
};

export const Router: React.FC = () => {
  const { isSignedIn, isLoaded } = useClerkAuth();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Dashboard /><Footer /></>} />
      <Route path="/tasks" element={isSignedIn ? <><Navbar /><TaskManager /><Footer /></> : <Navigate to="/" replace />} />
      <Route path="/tasks/new" element={isSignedIn ? <><Navbar /><TaskFormWrapper /><Footer /></> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
