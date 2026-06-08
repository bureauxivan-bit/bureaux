'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="services" title="Послуги" fields={[
    { key: 'title', label: 'Назва' },
    { key: 'number', label: 'Номер', type: 'number' },
    { key: 'description', label: 'Опис', type: 'textarea' },
    { key: 'coverUrl', label: 'Обкладинка', type: 'image' },
  ]} />;
}
