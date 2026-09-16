'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import DashboardMetrics from '@/components/DashboardMetrics';
import SearchAndFilter from '@/components/SearchAndFilter';
import NewServiceModal from '@/components/NewServiceModal';
import ServiceRow from '@/components/ServiceRow';
import AuditHistory from '@/components/AuditHistory';
import { KPIs, ServicoComRelacoes } from '@/lib/types';
import { buscarKPIs, buscarServicos, atualizarStatusServico, criarServico, criarTipoServico } from '@/lib/api';
import { calcularDeadlineStatus, calcularDiasRestantes } from '@/lib/utils';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServicosPage() {
  const [kpis, setKpis] = useState<KPIs>({
    servicos_hoje: 0,
    atrasados: 0,
    em_producao: 0,
    agendados: 0,
    concluidos: 0,
  });
  const [servicos, setServicos] = useState<ServicoComRelacoes[]>([]);
  const [servicosFiltrados, setServicosFiltrados] = useState<ServicoComRelacoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

  // Carregar dados
  const carregarDados = async () => {
    setLoading(true);
    try {
      const [kpisData, servicosData] = await Promise.all([
        buscarKPIs(),
        buscarServicos(),
      ]);
      
      setKpis(kpisData);
      
      // Enriquecer serviços com deadline_status
      const servicosEnriquecidos = servicosData.map((s: any) => ({
        ...s,
        deadline_status: calcularDeadlineStatus(s.data_entrega, s.status),
        dias_restantes: calcularDiasRestantes(s.data_entrega),
      }));
      
      setServicos(servicosEnriquecidos);
      setServicosFiltrados(servicosEnriquecidos);
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

  const handleStatusChange = async (servicoId: string, novoStatus: string) => {
    try {
      await atualizarStatusServico(servicoId, novoStatus);
      toast.success('Status atualizado com sucesso!');
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleNovoServico = async (dados: any) => {
    try {
      await criarServico({
        cliente_id: dados.cliente_id,
        tipo_servico_id: dados.tipo_servico_id,
        descricao: dados.descricao,
        data_entrada: new Date().toISOString(),
        data_entrega: dados.data_entrega,
        status: dados.status,
        observacoes: dados.observacoes,
      });
      toast.success('Serviço criado com sucesso!');
      carregarDados();
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast.error('Erro ao criar serviço');
    }
  };

  const handleNovoTipo = async (nome: string) => {
    try {
      return await criarTipoServico(nome);
    } catch (error) {
      console.error('Erro ao criar tipo:', error);
      toast.error('Erro ao criar tipo de serviço');
      throw error;
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setServicosFiltrados(servicos);
      return;
    }

    const queryLower = query.toLowerCase();
    const filtrados = servicos.filter(
      (s) =>
        s.cliente?.nome.toLowerCase().includes(queryLower) ||
        s.descricao.toLowerCase().includes(queryLower)
    );
    setServicosFiltrados(filtrados);
  };

  const handleFilterChange = (filtros: any) => {
    let filtrados = servicos;

    if (filtros.status) {
      filtrados = filtrados.filter((s) => s.status === filtros.status);
    }

    if (filtros.tipo) {
      filtrados = filtrados.filter((s) => s.tipo_servico_id === filtros.tipo);
    }

    setServicosFiltrados(filtrados);
  };

  // Separar serviços por categoria
  const servicosAtrasados = servicosFiltrados.filter((s) => s.deadline_status === 'ATRASADO');
  const servicosHoje = servicosFiltrados.filter((s) => s.deadline_status === 'HOJE');
  const servicosProximos = servicosFiltrados.filter((s) => s.deadline_status === 'PRÓXIMO' || s.deadline_status === 'AMANHÃ');
  const servicosConcluidos = servicosFiltrados.filter((s) => s.deadline_status === 'CONCLUÍDO');

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
            <p className="text-gray-600 mt-1">Gestão de serviços em andamento</p>
          </div>
          <button
            onClick={() => setShowNewServiceModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus size={20} />
            <span>Novo Serviço</span>
          </button>
        </div>

        {/* Metrics */}
        <DashboardMetrics kpis={kpis} />

        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Services by Category */}
        <div className="space-y-8">
          {/* Atrasados */}
          {servicosAtrasados.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                ⚠️ Serviços Atrasados ({servicosAtrasados.length})
              </h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-red-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrada</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrega</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Concluído</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosAtrasados.map((s) => (
                      <ServiceRow
                        key={s.id}
                        servico={s}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hoje */}
          {servicosHoje.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2">
                📅 Serviços de Hoje ({servicosHoje.length})
              </h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-yellow-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrada</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrega</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Concluído</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosHoje.map((s) => (
                      <ServiceRow
                        key={s.id}
                        servico={s}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Próximos */}
          {servicosProximos.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                📋 Próximos Serviços ({servicosProximos.length})
              </h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrada</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrega</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Concluído</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosProximos.map((s) => (
                      <ServiceRow
                        key={s.id}
                        servico={s}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Concluídos */}
          {servicosConcluidos.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                ✓ Serviços Concluídos ({servicosConcluidos.length})
              </h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrada</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Entrega</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Concluído</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosConcluidos.map((s) => (
                      <ServiceRow
                        key={s.id}
                        servico={s}
                        onStatusChange={handleStatusChange}
                        isCompleted
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {servicosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum serviço encontrado</p>
              <p className="text-gray-400 text-sm mt-2">Crie um novo serviço para começar</p>
            </div>
          )}
        </div>
      </div>

      {/* New Service Modal */}
      <NewServiceModal
        isOpen={showNewServiceModal}
        onClose={() => setShowNewServiceModal(false)}
        onSubmit={handleNovoServico}
        clientes={[]} // Will be fetched
        tiposServico={[]}
        onNovoTipo={handleNovoTipo}
      />
    </Layout>
  );
}
