import { getSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // Unauthenticated requests to /admin/* are redirected to /admin/login by
  // middleware; the login page itself renders without the shell.
  if (!session) return <>{children}</>;
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
