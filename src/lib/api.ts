import supabase from './supabase';
import { Cliente, Servico, TipoServico, HistoricoAudit, ServicoFiltros } from './types';

// ==================== CLIENTES ====================

export async function buscarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome', { ascending: true });

  if (error) throw error;
  return data as Cliente[];
}

export async function buscarClientePorId(id: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function criarCliente(cliente: Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select()
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function atualizarCliente(id: string, updates: Partial<Cliente>) {
  const { data, error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Cliente;
}

// ==================== TIPOS DE SERVIÇO ====================

export async function buscarTiposServico() {
  const { data, error } = await supabase
    .from('tipos_servico')
    .select('*')
    .order('nome', { ascending: true });

  if (error) throw error;
  return data as TipoServico[];
}

export async function criarTipoServico(nome: string) {
  const { data, error } = await supabase
    .from('tipos_servico')
    .insert([{ nome }])
    .select()
    .single();

  if (error) throw error;
  return data as TipoServico;
}

// ==================== SERVIÇOS ====================

export async function buscarServicos(filtros?: ServicoFiltros) {
  let query = supabase
    .from('servicos')
    .select(`
      *,
      cliente:clientes(*),
      tipo_servico:tipos_servico(*)
    `);

  if (filtros?.cliente_id) {
    query = query.eq('cliente_id', filtros.cliente_id);
  }

  if (filtros?.tipo_servico_id) {
    query = query.eq('tipo_servico_id', filtros.tipo_servico_id);
  }

  if (filtros?.status) {
    query = query.eq('status', filtros.status);
  }

  if (filtros?.data_inicio) {
    query = query.gte('data_entrega', filtros.data_inicio);
  }

  if (filtros?.data_fim) {
    query = query.lte('data_entrega', filtros.data_fim);
  }

  if (filtros?.apenas_concluidos) {
    query = query.eq('concluido', true);
  }

  if (filtros?.apenas_inconclusos) {
    query = query.eq('concluido', false);
  }

  if (filtros?.busca) {
    query = query.or(
      `descricao.ilike.%${filtros.busca}%,cliente.nome.ilike.%${filtros.busca}%`
    );
  }

  const { data, error } = await query.order('data_entrega', { ascending: true });

  if (error) throw error;
  return data;
}

export async function buscarServicoPorId(id: string) {
  const { data, error } = await supabase
    .from('servicos')
    .select(`
      *,
      cliente:clientes(*),
      tipo_servico:tipos_servico(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function criarServico(servico: Omit<Servico, 'id' | 'criado_em' | 'atualizado_em' | 'concluido'>) {
  const { data, error } = await supabase
    .from('servicos')
    .insert([{ ...servico, concluido: false }])
    .select()
    .single();

  if (error) throw error;

  // Registrar no histórico
  await registrarAudit(data.id, 'Serviço criado');

  return data as Servico;
}

export async function atualizarServico(id: string, updates: Partial<Servico>) {
  const servicoAnterior = await buscarServicoPorId(id);

  const { data, error } = await supabase
    .from('servicos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Registrar mudanças no histórico
  if (updates.status && updates.status !== servicoAnterior.status) {
    await registrarAudit(
      id,
      `Status alterado de "${servicoAnterior.status}" para "${updates.status}"`
    );
  }

  if (updates.data_entrega && updates.data_entrega !== servicoAnterior.data_entrega) {
    await registrarAudit(
      id,
      `Prazo alterado de ${servicoAnterior.data_entrega} para ${updates.data_entrega}`
    );
  }

  return data as Servico;
}

export async function atualizarStatusServico(id: string, novoStatus: string) {
  const servicoAnterior = await buscarServicoPorId(id);
  const concluido = novoStatus === 'Pronto' || novoStatus === 'Entregue';
  const data_conclusao = concluido ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('servicos')
    .update({
      status: novoStatus,
      concluido: concluido,
      data_conclusao: data_conclusao,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Registrar no histórico
  await registrarAudit(
    id,
    `Status alterado de "${servicoAnterior.status}" para "${novoStatus}"`
  );

  return data;
}

// ==================== HISTÓRICO / AUDIT ====================

export async function buscarHistoricoServico(servicoId: string) {
  const { data, error } = await supabase
    .from('historico_audit')
    .select('*')
    .eq('servico_id', servicoId)
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data as HistoricoAudit[];
}

export async function registrarAudit(
  servicoId: string,
  descricao: string,
  valorAnterior?: string,
  valorNovo?: string
) {
  const { error } = await supabase.from('historico_audit').insert([
    {
      servico_id: servicoId,
      descricao,
      valor_anterior: valorAnterior,
      valor_novo: valorNovo,
    },
  ]);

  if (error) throw error;
}

// ==================== KPIs ====================

export async function buscarKPIs() {
  const hoje = new Date().toISOString().split('T')[0];
  const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Serviços de hoje
  const { count: servicos_hoje } = await supabase
    .from('servicos')
    .select('*', { count: 'exact', head: true })
    .eq('data_entrega', hoje)
    .neq('status', 'Entregue');

  // Serviços atrasados
  const { count: atrasados } = await supabase
    .from('servicos')
    .select('*', { count: 'exact', head: true })
    .lt('data_entrega', hoje)
    .not('status', 'in', '(Pronto,Entregue,Cancelado)');

  // Serviços em produção
  const { count: em_producao } = await supabase
    .from('servicos')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Em produção');

  // Serviços agendados
  const { count: agendados } = await supabase
    .from('servicos')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Agendado');

  // Serviços concluídos (histórico)
  const { count: concluidos } = await supabase
    .from('servicos')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Pronto', 'Entregue']);

  return {
    servicos_hoje: servicos_hoje || 0,
    atrasados: atrasados || 0,
    em_producao: em_producao || 0,
    agendados: agendados || 0,
    concluidos: concluidos || 0,
  };
}
