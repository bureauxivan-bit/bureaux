'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="faq" title="FAQ" fields={[
    { key: 'question', label: 'Запитання' },
    { key: 'questionEn', label: 'Запитання (EN)' },
    { key: 'answer', label: 'Відповідь', type: 'textarea' },
    { key: 'answerEn', label: 'Відповідь (EN)', type: 'textarea' },
  ]} />;
}
