import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<div>GoalForge AI</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
