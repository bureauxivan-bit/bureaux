'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="team" title="Команда" reorderable fields={[
    { key: 'name', label: "Ім'я" },
    { key: 'role', label: 'Роль' },
    { key: 'quote', label: 'Цитата', type: 'textarea' },
    { key: 'photoUrl', label: 'Фото', type: 'image' },
  ]} />;
}
