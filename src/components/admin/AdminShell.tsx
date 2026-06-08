'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Огляд' },
  { href: '/admin/leads', label: 'Заявки' },
  { href: '/admin/projects', label: 'Проєкти' },
  { href: '/admin/services', label: 'Послуги' },
  { href: '/admin/team', label: 'Команда' },
  { href: '/admin/reviews', label: 'Відгуки' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/settings', label: 'Налаштування' },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#0f0e0d] text-paper">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-paper/10 p-5 md:flex">
        <Link href="/admin" className="display-xl mb-8 text-lg">BUREAU<span className="text-terra">X</span></Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => {
            const active = n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${active ? 'bg-terra text-paper' : 'text-paper/60 hover:bg-paper/5 hover:text-paper'}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-paper/10 pt-4 text-xs text-paper/40">
          <p className="truncate">{email}</p>
          <button onClick={logout} className="mt-2 text-paper/70 hover:text-terra">Вийти →</button>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between border-b border-paper/10 p-4 md:hidden">
          <Link href="/admin" className="display-xl text-base">BUREAU<span className="text-terra">X</span></Link>
          <button onClick={logout} className="text-sm text-paper/70">Вийти</button>
        </div>
        <div className="md:hidden flex gap-1 overflow-x-auto border-b border-paper/10 px-3 py-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-paper/60 hover:text-paper">
              {n.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
