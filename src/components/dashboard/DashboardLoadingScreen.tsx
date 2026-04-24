interface DashboardLoadingScreenProps {
  message?: string;
}

export default function DashboardLoadingScreen({
  message = 'Loading dashboard...',
}: DashboardLoadingScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#fefcf3' }}
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#3d2817] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#3d2817] text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
