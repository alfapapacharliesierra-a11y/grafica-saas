'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import DashboardMetrics from '@/components/DashboardMetrics';
import { KPIs, ServicoComRelacoes } from '@/lib/types';
import { buscarKPIs, buscarServicos } from '@/lib/api';
import { calcularDeadlineStatus, calcularDiasRestantes, formatarData } from '@/lib/utils';
import { TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [kpis, setKpis] = useState<KPIs>({
    servicos_hoje: 0,
    atrasados: 0,
    em_producao: 0,
    agendados: 0,
    concluidos: 0,
  });
  const [proximosVencer, setProximosVencer] = useState<ServicoComRelacoes[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [kpisData, servicosData] = await Promise.all([
        buscarKPIs(),
        buscarServicos(),
      ]);

      setKpis(kpisData);

      // Filtrar e ordenar serviços próximos a vencer (não concluídos)
      const nãoConcluidos = servicosData.filter(
        (s: any) => s.status !== 'Pronto' && s.status !== 'Entregue' && s.status !== 'Cancelado'
      );

      const comDeadline = nãoConcluidos.map((s: any) => ({
        ...s,
        deadline_status: calcularDeadlineStatus(s.data_entrega, s.status),
        dias_restantes: calcularDiasRestantes(s.data_entrega),
      }));

      const ordenados = comDeadline.sort(
        (a, b) => (a.dias_restantes || 0) - (b.dias_restantes || 0)
      );

      setProximosVencer(ordenados.slice(0, 10));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral da sua gráfica</p>
        </div>

        {/* KPIs */}
        <DashboardMetrics kpis={kpis} />

        {/* Alerts */}
        {kpis.atrasados > 0 && (
          <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900">Atenção: Serviços Atrasados</h3>
                <p className="text-red-800 text-sm mt-1">
                  Você tem {kpis.atrasados} serviço{kpis.atrasados > 1 ? 's' : ''} com prazo vencido. Revise imediatamente!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Próximos a Vencer */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Próximos a Vencer</h2>
          {proximosVencer.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <TrendingUp size={48} className="mx-auto text-green-500 mb-3" />
              <p className="text-gray-600 font-medium">Nenhum serviço próximo de vencer</p>
              <p className="text-gray-500 text-sm mt-1">Tudo em dia! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proximosVencer.map((servico) => (
                <div
                  key={servico.id}
                  className={`p-4 rounded-lg border-l-4 transition-all ${
                    servico.deadline_status === 'ATRASADO'
                      ? 'bg-red-50 border-red-500'
                      : servico.deadline_status === 'HOJE'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {servico.cliente?.nome}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {servico.tipo_servico?.nome} • {servico.descricao}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Entrega: {formatarData(servico.data_entrega)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          servico.deadline_status === 'ATRASADO'
                            ? 'bg-red-200 text-red-900'
                            : servico.deadline_status === 'HOJE'
                            ? 'bg-yellow-200 text-yellow-900'
                            : 'bg-blue-200 text-blue-900'
                        }`}
                      >
                        {servico.deadline_status === 'ATRASADO'
                          ? '⚠️ Atrasado'
                          : servico.deadline_status === 'HOJE'
                          ? '📅 Hoje'
                          : `${servico.dias_restantes}d`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
