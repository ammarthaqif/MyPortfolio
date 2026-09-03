import React from 'react';
import { Sparkles, Terminal, Rocket, ShieldCheck, Zap, Code2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AboutSectionProps {
  profile: UserProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const steps = [
    {
      icon: <Terminal className="w-4 h-4 text-neutral-900" />,
      title: 'Architectural Rigor',
      description: 'Designing typed data models, deterministic state pipelines, and accessible UI hierarchies before writing code.',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-neutral-900" />,
      title: 'Multimodal AI Engineering',
      description: 'Leveraging state-of-the-art Gemini models for audio, vision, function calling, and structured JSON outputs.',
    },
    {
      icon: <Code2 className="w-4 h-4 text-neutral-900" />,
      title: 'Fluid & Responsive UI',
      description: 'Mathematical spacing scales, WCAG AA contrast, and zero-jank interaction states built with modern Tailwind & React.',
    },
    {
      icon: <Rocket className="w-4 h-4 text-neutral-900" />,
      title: 'Production Publishing',
      description: 'Fast containerized deployments on Cloud Run, resilient server-side API proxying, and automated preview channels.',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-20 border-b border-neutral-200 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left bio column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-800">
              <span>Developer Background & Story</span>
            </div>

            <h2
              id="about-section-heading"
              className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight"
            >
              Turning ambitious ideas into published, high-performing software.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              <p>
                As a software engineer and creator, I specialize in combining modern full-stack web technologies with state-of-the-art artificial intelligence models. Working extensively with modern AI-augmented development environments, I’ve brought multiple production web applications from raw idea to live, published software.
              </p>
              <p>
                My philosophy centers on <strong>substance over gimmicks</strong>: clean interfaces, sub-second latency, robust error boundaries, and design that respects user attention. Whether engineering an internal developer tool or a consumer multimodal experience, every layout and byte is deliberate.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Current Status</span>
              </div>
              <p className="text-sm font-semibold text-neutral-900">
                {profile.availability}
              </p>
              <p className="text-xs text-neutral-500">
                Direct inquiry response time typically within 24 hours.
              </p>
            </div>
          </div>

          {/* Right process column */}
          <div id="process" className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                Published App Lifecycle & Methodology
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                How projects move from prompt ideation to rock-solid production web apps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-neutral-200 p-5 space-y-2.5 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-neutral-100 rounded-md">
                      {step.icon}
                    </div>
                    <span className="font-mono text-xs text-neutral-400 font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
