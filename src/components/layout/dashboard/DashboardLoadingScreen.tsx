import { LoadingScreen } from '@/components/ui/loading-screen';

interface DashboardLoadingScreenProps {
  message?: string;
}

export default function DashboardLoadingScreen({
  message = 'Loading dashboard',
}: DashboardLoadingScreenProps) {
  return <LoadingScreen message={message} />;
}
