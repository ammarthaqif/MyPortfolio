import React from 'react';
import { SKILL_CATEGORIES } from '../data/profile';
import { Cpu, Terminal, Layers, Cloud } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const categoryIcons = [
    <Layers className="w-4 h-4 text-neutral-800" />,
    <Cpu className="w-4 h-4 text-neutral-800" />,
    <Terminal className="w-4 h-4 text-neutral-800" />,
    <Cloud className="w-4 h-4 text-neutral-800" />,
  ];

  return (
    <section id="skills" className="py-16 md:py-20 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-800">
            <span>Capabilities & Technical Stack</span>
          </div>
          <h2
            id="capabilities-section-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight"
          >
            Engineering depth across frontend, backend & foundation models.
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed font-normal">
            A battle-tested toolset honed through building and deploying production-grade AI web applications, responsive single-page architectures, and high-throughput server backends.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.title}
              id={`skill-category-${idx}`}
              className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-7 space-y-6 flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-neutral-100 rounded-lg shrink-0">
                    {categoryIcons[idx % categoryIcons.length]}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Skills list */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1.5 border-b border-neutral-100 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                          Core
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 text-xs text-neutral-500">
                      <span className="font-mono text-neutral-600 font-medium">
                        {skill.level}
                      </span>
                      <span className="hidden sm:inline-block text-neutral-300">·</span>
                      <span className="text-neutral-500">{skill.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
