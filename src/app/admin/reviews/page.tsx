'use client';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
export default function Page() {
  return <CollectionEditor endpoint="reviews" title="Відгуки" fields={[
    { key: 'author', label: 'Автор' },
    { key: 'projectName', label: 'Проєкт' },
    { key: 'text', label: 'Текст', type: 'textarea' },
    { key: 'isPublished', label: 'Опубліковано', type: 'checkbox' },
  ]} />;
}
