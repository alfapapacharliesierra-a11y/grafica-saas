// Tipos e Interfaces do Sistema

export type ServiceStatus = 'Agendado' | 'Em produção' | 'Pronto' | 'Entregue' | 'Cancelado';
export type DeadlineStatus = 'ATRASADO' | 'HOJE' | 'AMANHÃ' | 'PRÓXIMO' | 'CONCLUÍDO';

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface TipoServico {
  id: string;
  nome: string;
  criado_em: string;
}

export interface Servico {
  id: string;
  cliente_id: string;
  tipo_servico_id: string;
  descricao: string;
  data_entrada: string;
  data_entrega: string;
  status: ServiceStatus;
  observacoes?: string;
  concluido: boolean;
  data_conclusao?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ServicoComRelacoes extends Servico {
  cliente?: Cliente;
  tipo_servico?: TipoServico;
  deadline_status?: DeadlineStatus;
  dias_restantes?: number;
}

export interface HistoricoAudit {
  id: string;
  servico_id: string;
  descricao: string;
  valor_anterior?: string;
  valor_novo?: string;
  criado_em: string;
}

export interface KPIs {
  servicos_hoje: number;
  atrasados: number;
  em_producao: number;
  agendados: number;
  concluidos: number;
}

export interface ServicoFiltros {
  cliente_id?: string;
  tipo_servico_id?: string;
  status?: ServiceStatus;
  data_inicio?: string;
  data_fim?: string;
  apenas_concluidos?: boolean;
  apenas_inconclusos?: boolean;
  busca?: string;
}
