'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Layers,
  Globe,
  Smartphone,
  Sparkles,
  Database,
  HelpCircle,
  FileCode,
  LayoutTemplate,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/components/providers/auth-provider';

type ProjectGoal =
  | 'internal tool'
  | 'SaaS'
  | 'website'
  | 'mobile app'
  | 'AI application'
  | 'data platform'
  | 'something else';

type StartMethod = 'Describe it' | 'Template' | 'Import existing data' | 'Start from scratch';

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGoal, setSelectedGoal] = useState<ProjectGoal>('SaaS');
  const [selectedMethod, setSelectedMethod] = useState<StartMethod>('Describe it');
  const [intentDescription, setIntentDescription] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const goalOptions: { id: ProjectGoal; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'internal tool',
      label: 'Internal Tool',
      desc: 'Admin portals, ops dashboards, CRM tools, or support panels',
      icon: <Briefcase className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'SaaS',
      label: 'SaaS Product',
      desc: 'Multi-tenant web apps with auth, billing, and team workspaces',
      icon: <Layers className="w-5 h-5 text-saffron" />,
    },
    {
      id: 'website',
      label: 'Modern Website',
      desc: 'High-performance marketing sites, directories, or media blogs',
      icon: <Globe className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'mobile app',
      label: 'Mobile App Backend',
      desc: 'Fast realtime API, push notification queues, and offline sync',
      icon: <Smartphone className="w-5 h-5 text-sky-400" />,
    },
    {
      id: 'AI application',
      label: 'AI Application',
      desc: 'RAG pipelines, vector embeddings, agent memory, and LLM gateway',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'data platform',
      label: 'Data Platform',
      desc: 'High-throughput analytics ingestion, pipelines, and SQL lake',
      icon: <Database className="w-5 h-5 text-teal-400" />,
    },
    {
      id: 'something else',
      label: 'Custom Architecture',
      desc: 'Specialized backend workloads, edge microservices, or games',
      icon: <HelpCircle className="w-5 h-5 text-neutral-400" />,
    },
  ];

  const methodOptions: { id: StartMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'Describe it',
      label: 'Describe in Natural Language',
      desc: 'Write what your app does; VELORA synthesizes schemas, auth, and APIs',
      icon: <Sparkles className="w-5 h-5 text-saffron" />,
    },
    {
      id: 'Template',
      label: 'Start from Starter Template',
      desc: 'Pick a pre-configured architecture for your specific workload',
      icon: <LayoutTemplate className="w-5 h-5 text-sky-400" />,
    },
    {
      id: 'Import existing data',
      label: 'Import Existing Data',
      desc: 'Connect an external PostgreSQL database, CSV file, or Supabase project',
      icon: <UploadCloud className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'Start from scratch',
      label: 'Start from Scratch',
      desc: 'Jump straight into a clean, empty canvas with Developer Mode',
      icon: <FileCode className="w-5 h-5 text-purple-400" />,
    },
  ];

  const handleComplete = () => {
    setIsFinishing(true);
    toast('Configuring your workspace and seeding initial schema...', 'info');

    try {
      localStorage.setItem(
        'velora_project_profile',
        JSON.stringify({
          goal: selectedGoal,
          method: selectedMethod,
          description: intentDescription,
          configuredAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }

    setTimeout(() => {
      toast('Workspace ready! Welcome to VELORA.', 'success');
      router.push('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-basalt text-salt flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-raised border border-border-default mb-2">
            <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            <span className="text-xs font-mono text-neutral-300">VELORA Setup Engine</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-salt">
            Welcome to VELORA{user?.name ? `, ${user.name}` : ''}.
          </h1>
          <p className="text-sm text-neutral-400">
            Let&apos;s configure your project environment in two quick steps.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-center gap-3">
          <div
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              step === 1
                ? 'bg-saffron text-basalt border-saffron font-semibold'
                : 'bg-surface-raised text-neutral-400 border-border-subtle'
            }`}
          >
            <span>1</span>
            <span>What are you building?</span>
          </div>
          <div className="w-6 h-px bg-border-subtle" />
          <div
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              step === 2
                ? 'bg-saffron text-basalt border-saffron font-semibold'
                : 'bg-surface-raised text-neutral-400 border-border-subtle'
            }`}
          >
            <span>2</span>
            <span>How do you want to start?</span>
          </div>
        </div>

        {/* Step 1: What are you building? */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {goalOptions.map((opt) => {
                const isSelected = selectedGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGoal(opt.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                      isSelected
                        ? 'border-saffron bg-surface-overlay ring-1 ring-saffron/40'
                        : 'border-border-default bg-surface-raised hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div className="p-2 rounded-lg bg-surface-base border border-border-subtle">
                        {opt.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-saffron" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-salt group-hover:text-white">
                        {opt.label}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-saffron text-basalt font-semibold text-sm hover:bg-saffron-hover transition-colors shadow-saffron-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: How do you want to start? */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {methodOptions.map((opt) => {
                const isSelected = selectedMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedMethod(opt.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                      isSelected
                        ? 'border-saffron bg-surface-overlay ring-1 ring-saffron/40'
                        : 'border-border-default bg-surface-raised hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div className="p-2 rounded-lg bg-surface-base border border-border-subtle">
                        {opt.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-saffron" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-salt group-hover:text-white">
                        {opt.label}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedMethod === 'Describe it' && (
              <div className="p-4 rounded-xl bg-surface-raised border border-border-default space-y-2">
                <label className="block text-xs font-medium text-neutral-300">
                  Briefly describe your vision:
                </label>
                <textarea
                  rows={3}
                  value={intentDescription}
                  onChange={(e) => setIntentDescription(e.target.value)}
                  placeholder="e.g. A marketplace connecting freelance designers with venture-backed startups, with escrow payments and reviews."
                  className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-surface-base text-xs text-salt placeholder-neutral-500 focus:outline-none focus:border-saffron resize-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border-default text-xs font-medium text-neutral-400 hover:text-salt hover:bg-surface-raised transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleComplete}
                disabled={isFinishing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-saffron text-basalt font-semibold text-sm hover:bg-saffron-hover transition-colors shadow-saffron-sm disabled:opacity-50"
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Launching Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
