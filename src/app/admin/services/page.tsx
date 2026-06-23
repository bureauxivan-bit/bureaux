'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="services" title="Послуги" fields={[
    { key: 'title', label: 'Назва' },
    { key: 'coverUrl', label: 'Обкладинка', type: 'image' },
  ]} />;
}
