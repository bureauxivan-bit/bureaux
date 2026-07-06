'use client';
import { useLeadModal } from './LeadModal';
import { trackEvent } from '@/lib/track';

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
  const onClick = () => {
    trackEvent(kind === 'consult' ? 'cta_consult' : 'cta_estimate');
    if (kind === 'consult') openConsult();
    else openEstimate();
  };
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
