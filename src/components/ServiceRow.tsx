'use client';

import { ServicoComRelacoes, DeadlineStatus } from '@/lib/types';
import { getDeadlineColor, getStatusColor, formatarData, calcularDiasRestantes } from '@/lib/utils';
import clsx from 'clsx';

interface ServiceRowProps {
  servico: ServicoComRelacoes;
  onStatusChange?: (servicoId: string, novoStatus: string) => void;
  onDelete?: (servicoId: string) => void;
  isCompleted?: boolean;
}

export default function ServiceRow({
  servico,
  onStatusChange,
  isCompleted = false,
}: ServiceRowProps) {
  const diasRestantes = calcularDiasRestantes(servico.data_entrega);
  const isOverdue = servico.deadline_status === 'ATRASADO';
  const isToday = servico.deadline_status === 'HOJE';

  return (
    <tr
      className={clsx(
        'border-b border-gray-200 hover:bg-gray-50 transition-colors',
        isOverdue && 'animate-pulse-red',
        isCompleted && 'opacity-concluido'
      )}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {servico.cliente?.nome || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {servico.tipo_servico?.nome || '-'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
        {servico.descricao}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {formatarData(servico.data_entrada)}
      </td>
      <td
        className={clsx(
          'px-6 py-4 whitespace-nowrap text-sm font-semibold',
          isToday && 'bg-yellow-50 text-yellow-900',
          isOverdue && 'text-red-700'
        )}
      >
        <div className="flex items-center gap-2">
          <span>{formatarData(servico.data_entrega)}</span>
          {diasRestantes >= 0 && diasRestantes <= 3 && (
            <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-900 rounded-full">
              {diasRestantes === 0 ? 'Hoje' : `${diasRestantes}d`}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <select
          value={servico.status}
          onChange={(e) => onStatusChange?.(servico.id, e.target.value)}
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer',
            getStatusColor(servico.status)
          )}
        >
          <option value="Agendado">Agendado</option>
          <option value="Em produção">Em produção</option>
          <option value="Pronto">Pronto</option>
          <option value="Entregue">Entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
        <input
          type="checkbox"
          checked={servico.concluido}
          disabled
          className="rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <span className={clsx(
          'px-2 py-1 rounded-full text-xs font-medium',
          getDeadlineColor(servico.deadline_status || 'PRÓXIMO')
        )}>
          {servico.deadline_status}
        </span>
      </td>
    </tr>
  );
}
