import dayjs from 'dayjs';
import { DeadlineStatus, ServiceStatus } from './types';

/**
 * Calcula o status do prazo comparando a data atual com a data de entrega
 */
export function calcularDeadlineStatus(
  dataEntrega: string,
  status: ServiceStatus
): DeadlineStatus {
  // Serviços concluídos nunca são atrasados
  if (status === 'Pronto' || status === 'Entregue' || status === 'Cancelado') {
    return 'CONCLUÍDO';
  }

  const hoje = dayjs().startOf('day');
  const entrega = dayjs(dataEntrega).startOf('day');
  const diferenca = entrega.diff(hoje, 'day');

  if (diferenca < 0) {
    return 'ATRASADO';
  } else if (diferenca === 0) {
    return 'HOJE';
  } else if (diferenca === 1) {
    return 'AMANHÃ';
  } else {
    return 'PRÓXIMO';
  }
}

/**
 * Calcula dias restantes até a entrega
 */
export function calcularDiasRestantes(dataEntrega: string): number {
  const hoje = dayjs().startOf('day');
  const entrega = dayjs(dataEntrega).startOf('day');
  return entrega.diff(hoje, 'day');
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export function formatarData(data: string): string {
  return dayjs(data).format('DD/MM/YYYY');
}

/**
 * Formata data e hora para exibição (DD/MM/YYYY HH:mm)
 */
export function formatarDataHora(data: string): string {
  return dayjs(data).format('DD/MM/YYYY HH:mm');
}

/**
 * Formata data apenas com hora (HH:mm)
 */
export function formatarHora(data: string): string {
  return dayjs(data).format('HH:mm');
}

/**
 * Retorna a cor do badge baseado no status do prazo
 */
export function getDeadlineColor(status: DeadlineStatus): string {
  switch (status) {
    case 'ATRASADO':
      return 'bg-red-100 text-red-800';
    case 'HOJE':
      return 'bg-yellow-100 text-yellow-800';
    case 'AMANHÃ':
      return 'bg-orange-100 text-orange-800';
    case 'PRÓXIMO':
      return 'bg-blue-100 text-blue-800';
    case 'CONCLUÍDO':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Retorna a cor do status do serviço
 */
export function getStatusColor(status: ServiceStatus): string {
  switch (status) {
    case 'Agendado':
      return 'bg-blue-100 text-blue-800';
    case 'Em produção':
      return 'bg-purple-100 text-purple-800';
    case 'Pronto':
      return 'bg-green-100 text-green-800';
    case 'Entregue':
      return 'bg-emerald-100 text-emerald-800';
    case 'Cancelado':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone (simples)
 */
export function validarTelefone(telefone: string): boolean {
  return telefone.replace(/\D/g, '').length >= 10;
}

/**
 * Formata telefone (brasileiro)
 */
export function formatarTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}
