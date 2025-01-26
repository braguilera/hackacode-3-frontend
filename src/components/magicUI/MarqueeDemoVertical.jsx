import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import Marquee from '../magicUI/Marquee';



const ReviewCard = ({ name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-40 w-full cursor-pointer overflow-hidden rounded-xl border p-4 transition-colors duration-200 ",
        "border-slate-400/[.1] bg-slate-50 hover:bg-slate-100",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm 2xl:text-base font-medium text-yellow-500">
            {name}
          </figcaption>
        </div>
      </div>
      <blockquote className="m-0 text-sm dark:text-slate-400">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemoVertical() {
  const { t } = useTranslation("marquee");

  const projects = t("projects", { returnObjects: true });
  const works = t("works", { returnObjects: true });

  return (
    <div className="absolute -top-3 2xl:top-0 right-[50%] translate-x-[50%] translate-y-[-41%] flex h-[190px] w-2/3 flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">

      <div className='w-full grid grid-cols-2 overflow-hidden'>
        <Marquee pauseOnHover vertical className="[--duration:25s]">
          {projects.map((project, index) => (
            <ReviewCard key={index} name={project.name} body={project.body} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
          {works.map((work, index) => (
            <ReviewCard key={index} name={work.name} body={work.body} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3"></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3"></div>
    </div>
  );
}

export default MarqueeDemoVertical

