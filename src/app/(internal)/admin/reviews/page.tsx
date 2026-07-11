'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="reviews" title="Відгуки" fields={[
    { key: 'author', label: 'Автор' },
    { key: 'authorEn', label: 'Автор (EN)' },
    { key: 'projectName', label: 'Проєкт' },
    { key: 'projectNameEn', label: 'Проєкт (EN)' },
    { key: 'text', label: 'Текст', type: 'textarea' },
    { key: 'textEn', label: 'Текст (EN)', type: 'textarea' },
    { key: 'isPublished', label: 'Опубліковано', type: 'checkbox' },
  ]} />;
}
