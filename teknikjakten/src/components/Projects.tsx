import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { PROJECTS } from '../data/projects';
import { AREAS } from '../data/areaMeta';
import { getDoneProjects, toggleProjectDone } from '../utils/storage';
import { SPACE, withAlpha } from '../utils/theme';
import type { Project } from '../types';

/** Områdets färg, med rymdblått som reserv om ett projekt saknar område. */
function colorsFor(project: Project) {
  const area = AREAS.find(a => a.id === project.areaId);
  return {
    accent: area?.accentHex ?? SPACE.beam,
    glow: area?.glowHex ?? SPACE.beamBright,
    areaName: area?.name ?? '',
  };
}

function ProjectCard({ project, done, onToggle }: {
  project: Project;
  done: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { accent, glow, areaName } = colorsFor(project);

  return (
    <div
      className="space-panel overflow-hidden"
      style={{
        background: `linear-gradient(150deg, ${withAlpha(SPACE.panel, 0.92)} 0%, ${withAlpha(SPACE.navy, 0.85)} 60%, ${withAlpha(accent, 0.2)} 100%)`,
        borderColor: withAlpha(accent, done ? 0.75 : 0.5),
      }}
    >
      <div className="p-4 flex items-start gap-3">
        <span className="text-3xl leading-none flex-shrink-0" aria-hidden="true">{project.emoji}</span>

        <button
          onClick={() => setOpen(o => !o)}
          className="flex-1 min-w-0 text-left cursor-pointer"
          aria-expanded={open}
        >
          <p className="font-heading font-bold text-lg leading-tight break-words" style={{ color: glow }}>
            {project.title}
          </p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: SPACE.onDarkMuted }}>
            {areaName} · s. {project.bookPages}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-black mt-2" style={{ color: SPACE.atmosphere }}>
            {open ? 'Dölj' : 'Visa uppgiften'}
            <ChevronDown
              size={14}
              style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
            />
          </span>
        </button>

        {/* Elevens egen avbockning – ingen poäng, ingen stjärna. */}
        <button
          onClick={onToggle}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 cursor-pointer"
          style={{
            background: done ? accent : withAlpha(SPACE.deepest, 0.5),
            border: `2px solid ${withAlpha(done ? glow : SPACE.steel, 0.8)}`,
          }}
          aria-pressed={done}
          aria-label={done ? `Markera ${project.title} som inte gjord` : `Markera ${project.title} som gjord`}
        >
          <Check size={18} color={done ? '#ffffff' : SPACE.steel} />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="clay-card-sm p-3">
            <p className="text-sm text-gray-700 leading-relaxed">{project.intro}</p>
          </div>

          <div className="clay-card-sm p-3">
            <p className="font-heading font-bold text-gray-800 text-sm mb-1">Din uppgift</p>
            <p className="text-sm text-gray-700 leading-relaxed">{project.assignment}</p>
            <ul className="mt-2 space-y-1.5">
              {project.requirements.map((r, i) => (
                <li key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                  <span aria-hidden="true" style={{ color: accent }}>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.steps.map((step, i) => (
            <div key={i} className="clay-card-sm p-3">
              <p className="font-heading font-bold text-gray-800 text-sm mb-1">
                <span style={{ color: accent }}>{i + 1}.</span> {step.heading}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
            </div>
          ))}

          <div className="clay-card-sm p-3">
            <p className="font-heading font-bold text-gray-800 text-sm mb-2">Du kan behöva</p>
            <div className="space-y-2">
              {project.materials.map((group, i) => (
                <div key={i}>
                  {group.heading && (
                    <p className="text-xs font-black text-gray-500 mb-1">{group.heading}</p>
                  )}
                  <ul className="space-y-1">
                    {group.items.map((item, j) => (
                      <li key={j} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                        <span aria-hidden="true" style={{ color: accent }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {project.tips && project.tips.length > 0 && (
            <div className="clay-card-sm p-3">
              <p className="font-heading font-bold text-gray-800 text-sm mb-1">💡 Tips och mått</p>
              <ul className="space-y-1">
                {project.tips.map((t, i) => (
                  <li key={i} className="text-sm text-gray-700 leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { setView } = useApp();
  const [done, setDone] = useState<string[]>(() => getDoneProjects());

  function toggle(id: string) {
    setDone(toggleProjectDone(id));
  }

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Bygg och prova"
        subtitle={`${done.length} av ${PROJECTS.length} gjorda`}
        onBack={() => setView('area-select')}
      />

      <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16 space-y-4 mt-2">
        <p className="text-sm leading-relaxed" style={{ color: SPACE.onDarkMuted }}>
          Bokens sju praktiska projekt. Här finns uppgiften, arbetsgången och materiallistan –
          men inga poäng och inga stjärnor, för ett bygge kan appen inte rätta. Bocka av ett
          projekt själv när du är klar med det.
        </p>

        {PROJECTS.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            done={done.includes(project.id)}
            onToggle={() => toggle(project.id)}
          />
        ))}
      </main>
    </div>
  );
}
