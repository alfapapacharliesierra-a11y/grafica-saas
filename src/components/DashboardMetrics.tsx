'use client';

import { KPIs } from '@/lib/types';
import {
  TrendingUp,
  AlertCircle,
  Zap,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'purple' | 'orange' | 'green';
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    green: 'bg-green-50 border-green-200 text-green-600',
  };

  return (
    <div className={clsx('rounded-lg border-2 p-6', colorClasses[color])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
        </div>
        <div className="text-2xl opacity-50">{icon}</div>
      </div>
    </div>
  );
}

interface DashboardMetricsProps {
  kpis: KPIs;
}

export default function DashboardMetrics({ kpis }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Serviços de Hoje"
        value={kpis.servicos_hoje}
        icon={<Calendar size={24} />}
        color="blue"
      />
      <MetricCard
        title="Atrasados"
        value={kpis.atrasados}
        icon={<AlertCircle size={24} />}
        color="red"
        subtitle={kpis.atrasados > 0 ? 'Atenção!' : 'Nenhum'}
      />
      <MetricCard
        title="Em Produção"
        value={kpis.em_producao}
        icon={<Zap size={24} />}
        color="purple"
      />
      <MetricCard
        title="Agendados"
        value={kpis.agendados}
        icon={<TrendingUp size={24} />}
        color="orange"
      />
      <MetricCard
        title="Concluídos"
        value={kpis.concluidos}
        icon={<CheckCircle size={24} />}
        color="green"
      />
    </div>
  );
}
