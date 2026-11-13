import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';
import { getAuth, getUserRole } from '@/server/auth';

export default async function AdminDashboardPage() {
  const auth = await getAuth();
  if (!auth) redirect('/?redirected=auth_required');
  if ((await getUserRole(auth)) !== 'director') redirect('/dashboard');

  return <AdminDashboardClient />;
}
