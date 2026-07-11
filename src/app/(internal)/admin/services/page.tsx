'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="services" title="Послуги" fields={[
    { key: 'title', label: 'Назва' },
    { key: 'titleEn', label: 'Назва (EN)' },
    { key: 'description', label: 'Опис', type: 'textarea' },
    { key: 'descriptionEn', label: 'Опис (EN)', type: 'textarea' },
    { key: 'coverUrl', label: 'Обкладинка', type: 'image' },
  ]} />;
}
