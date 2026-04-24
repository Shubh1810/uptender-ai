import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?redirected=auth_required');
  }

  const { data: role } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (role !== 'director') {
    redirect('/dashboard');
  }

  return <AdminDashboardClient />;
}
