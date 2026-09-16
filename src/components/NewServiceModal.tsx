'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Cliente, TipoServico } from '@/lib/types';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  clientes: Cliente[];
  tiposServico: TipoServico[];
  onNovoTipo?: (nome: string) => Promise<TipoServico>;
}

export default function NewServiceModal({
  isOpen,
  onClose,
  onSubmit,
  clientes,
  tiposServico,
  onNovoTipo,
}: NewServiceModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [novoTipoInput, setNovoTipoInput] = useState('');
  const [showNovoTipo, setShowNovoTipo] = useState(false);
  const [tiposLocal, setTiposLocal] = useState<TipoServico[]>(tiposServico);

  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo_servico_id: '',
    descricao: '',
    data_entrega: '',
    status: 'Agendado',
    observacoes: '',
  });

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNovoTipo = async () => {
    if (!novoTipoInput.trim() || !onNovoTipo) return;
    const novo = await onNovoTipo(novoTipoInput);
    setTiposLocal([...tiposLocal, novo]);
    setFormData({ ...formData, tipo_servico_id: novo.id });
    setNovoTipoInput('');
    setShowNovoTipo(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
      resetForm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      tipo_servico_id: '',
      descricao: '',
      data_entrega: '',
      status: 'Agendado',
      observacoes: '',
    });
    setStep(1);
    setShowNovoTipo(false);
    setNovoTipoInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Novo Serviço</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Cliente */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </span>
                <select
                  value={formData.cliente_id}
                  onChange={(e) =>
                    setFormData({ ...formData, cliente_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Step 2: Tipo de Serviço */}
          {step === 2 && (
            <div className="space-y-4">
              {!showNovoTipo ? (
                <>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Serviço *
                    </span>
                    <select
                      value={formData.tipo_servico_id}
                      onChange={(e) =>
                        setFormData({ ...formData, tipo_servico_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione um tipo</option>
                      {tiposLocal.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={() => setShowNovoTipo(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={18} />
                    Novo tipo de serviço
                  </button>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do novo tipo *
                    </span>
                    <input
                      type="text"
                      value={novoTipoInput}
                      onChange={(e) => setNovoTipoInput(e.target.value)}
                      placeholder="Ex: Camiseta"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleNovoTipo}
                      disabled={!novoTipoInput.trim() || !onNovoTipo}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      Criar
                    </button>
                    <button
                      onClick={() => setShowNovoTipo(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Descrição */}
          {step === 3 && (
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Serviço *
              </span>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descreva o serviço em detalhes..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </label>
          )}

          {/* Step 4: Data de Entrega */}
          {step === 4 && (
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Data e Hora de Entrega *
              </span>
              <input
                type="datetime-local"
                value={formData.data_entrega}
                onChange={(e) =>
                  setFormData({ ...formData, data_entrega: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
          )}

          {/* Step 5: Status */}
          {step === 5 && (
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </span>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Agendado">Agendado</option>
                <option value="Em produção">Em produção</option>
                <option value="Pronto">Pronto</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </label>
          )}

          {/* Step 6: Observações */}
          {step === 6 && (
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </span>
              <textarea
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Adicione observações adicionais..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </label>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Passo {step} de 6
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i <= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Anterior
          </button>
          {step < 6 ? (
            <button
              onClick={handleNext}
              disabled={!(
                (step === 1 && formData.cliente_id) ||
                (step === 2 && formData.tipo_servico_id) ||
                (step === 3 && formData.descricao) ||
                (step === 4 && formData.data_entrega) ||
                (step === 5)
              )}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.cliente_id || !formData.tipo_servico_id || !formData.descricao || !formData.data_entrega}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
