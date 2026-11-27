import type { Metadata } from 'next';
import { Quiz } from '@/components/quiz/Quiz';

// Ad-only landing: noindex (inherited from the internal layout), no header or
// footer, so paid traffic has a single action — finish the quiz.
export const metadata: Metadata = {
  title: 'Безкоштовний розрахунок проєкту',
  description: 'Дайте відповідь на кілька запитань — і отримайте індивідуальний розрахунок вартості проєкту.',
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  return <Quiz />;
}
