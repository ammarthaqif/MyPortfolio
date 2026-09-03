import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Github, Linkedin, Twitter, MessageSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { UserProfile, ContactFormData } from '../types';

interface ContactSectionProps {
  profile: UserProfile;
  onCopyEmail: () => void;
  isEmailCopied: boolean;
  onNotify: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  onCopyEmail,
  isEmailCopied,
  onNotify,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: 'Full-Stack App Development',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onNotify('Your message has been captured. Opening email client fallback...');
      
      // Construct mailto URL as direct fallback
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${formData.projectType} from ${formData.name}`);
      const body = encodeURIComponent(
        `Hi Ammar,\n\nName: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\nBudget/Timeline: ${formData.budget || 'Not specified'}\n\nMessage:\n${formData.message}\n`
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    }, 600);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-800">
                <span>Direct Contact & Collaboration</span>
              </div>
              <h2
                id="contact-heading"
                className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight"
              >
                Let’s build something remarkable together.
              </h2>
              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                Have an application idea, a generative AI integration challenge, or a contract project in mind? Reach out directly via the form or email below.
              </p>
            </div>

            {/* Email quick card */}
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  Primary Email
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Responds in &lt;24h
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-base font-bold text-neutral-900 hover:text-neutral-700 break-all"
                >
                  {profile.email}
                </a>

                <button
                  id="copy-contact-email-btn"
                  type="button"
                  onClick={onCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-full text-xs font-semibold text-neutral-800 transition-all active:scale-95 whitespace-nowrap"
                >
                  {isEmailCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social profiles */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
                Social Profiles & Repositories
              </span>
              <div className="flex items-center gap-3">
                {profile.github && (
                  <a
                    id="contact-github-link"
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 border border-neutral-200 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    id="contact-linkedin-link"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 border border-neutral-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
                {profile.twitter && (
                  <a
                    id="contact-twitter-link"
                    href={profile.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 border border-neutral-200 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>X / Twitter</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8">
              {isSubmitted ? (
                <div
                  id="contact-success-state"
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Message Prepared!
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. If your email client didn't open automatically, you can also send directly to{' '}
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-semibold text-neutral-900 underline"
                    >
                      {profile.email}
                    </a>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        projectType: 'Full-Stack App Development',
                        budget: '',
                        message: '',
                      });
                    }}
                    className="mt-4 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Your Email *
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ada@example.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Project / Inquiry Type
                      </label>
                      <select
                        id="contact-project-type-select"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
                      >
                        <option value="Full-Stack App Development">Full-Stack App Development</option>
                        <option value="AI Integration & Multimodal Tools">AI Integration & Multimodal Tools</option>
                        <option value="Contract / Freelance Build">Contract / Freelance Build</option>
                        <option value="Full-Time Engineering Role">Full-Time Engineering Role</option>
                        <option value="Advisory / Architecture Consulting">Advisory / Architecture Consulting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                        Estimated Timeline / Scope (optional)
                      </label>
                      <input
                        id="contact-budget-input"
                        type="text"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g. 2-4 weeks or Q4 launch"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Project Details / Message *
                    </label>
                    <textarea
                      id="contact-message-input"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about what you are looking to build, key goals, tech stack preferences, or any questions..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  <button
                    id="submit-contact-form-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm"
                  >
                    {isSubmitting ? (
                      <span>Preparing message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
