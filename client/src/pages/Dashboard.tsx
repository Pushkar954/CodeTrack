import { apiClient } from '../services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useClerkAuth } from '../features/auth/authContext';
import { StatsCard } from '../components/dashboard/StatsCard';

export const Dashboard: React.FC = () => {
  const { isSignedIn } = useClerkAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/dashboard/stats');
      return response.data.data;
    },
    enabled: isSignedIn,
  });

  if (!isSignedIn) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Welcome to GoalForge AI</h2>
        <p className="text-gray-500">Sign in to track your DSA progress</p>
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Problems" value={(stats as any)?.total || 0} color="blue" />
        <StatsCard label="Completed" value={(stats as any)?.completed || 0} color="green" />
        <StatsCard label="In Progress" value={(stats as any)?.inProgress || 0} color="yellow" />
        <StatsCard label="Completion Rate" value={(stats as any)?.completionRate || 0} color="green" />
      </div>
    </div>
  );
};
