'use client';
import { useLeadModal } from './LeadModal';

export function CtaButton({
  kind = 'estimate',
  className = 'btn-terra',
  children,
}: {
  kind?: 'estimate' | 'consult';
  className?: string;
  children: React.ReactNode;
}) {
  const { openEstimate, openConsult } = useLeadModal();
  return (
    <button onClick={kind === 'consult' ? openConsult : openEstimate} className={className}>
      {children}
    </button>
  );
}
