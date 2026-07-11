'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="team" title="Команда" reorderable fields={[
    { key: 'name', label: "Ім'я" },
    { key: 'nameEn', label: "Ім'я (EN)" },
    { key: 'role', label: 'Роль' },
    { key: 'roleEn', label: 'Роль (EN)' },
    { key: 'quote', label: 'Цитата', type: 'textarea' },
    { key: 'quoteEn', label: 'Цитата (EN)', type: 'textarea' },
    { key: 'photoUrl', label: 'Фото', type: 'image' },
  ]} />;
}
