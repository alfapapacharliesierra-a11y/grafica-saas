'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { HistoricoAudit } from '@/lib/types';
import { buscarHistoricoServico } from '@/lib/api';
import { formatarDataHora } from '@/lib/utils';

interface AuditHistoryProps {
  servicoId: string;
}

export default function AuditHistory({ servicoId }: AuditHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [historico, setHistorico] = useState<HistoricoAudit[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      const data = await buscarHistoricoServico(servicoId);
      setHistorico(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && historico.length === 0) {
      carregarHistorico();
    }
  }, [isOpen]);

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">Histórico de Alterações</span>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 bg-gray-50 rounded-lg p-4">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">Carregando...</p>
          ) : historico.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Sem histórico</p>
          ) : (
            historico.map((item) => (
              <div key={item.id} className="text-sm">
                <p className="text-gray-900 font-medium">{item.descricao}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatarDataHora(item.criado_em)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
