import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/data';
import { ProjectsGrid } from '@/components/ProjectsGrid';

export const revalidate = 60;
export const metadata: Metadata = {
  title: {
    absolute: "Портфоліо — реалізовані проєкти дизайну інтер'єру та архітектури · bureau X",
  },
  description: "Портфоліо реалізованих проєктів bureau X — дизайн інтер'єру квартир і будинків, архітектура, комерційні об'єкти. Київ та Україна.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <div className="container-wide pb-28 pt-36">
      <p className="eyebrow">Портфоліо</p>
      <h1 className="display-xl mt-5 text-[clamp(2.4rem,7vw,6rem)]">Проєкти</h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
