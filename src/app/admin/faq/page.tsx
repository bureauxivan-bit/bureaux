'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="faq" title="FAQ" fields={[
    { key: 'question', label: 'Запитання' },
    { key: 'answer', label: 'Відповідь', type: 'textarea' },
  ]} />;
}
