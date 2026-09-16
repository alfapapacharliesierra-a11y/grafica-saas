import { create } from 'zustand';
import { Cliente, Servico, TipoServico, ServicoComRelacoes, DeadlineStatus, ServiceStatus } from '@/lib/types';

interface AppState {
  // Estado
  clientes: Cliente[];
  servicos: ServicoComRelacoes[];
  tiposServico: TipoServico[];
  loading: boolean;
  error: string | null;
  filtroAtivo: string | null;
  buscaAtiva: string | null;
  servicoSelecionado: ServicoComRelacoes | null;

  // Ações
  setClientes: (clientes: Cliente[]) => void;
  setServicos: (servicos: ServicoComRelacoes[]) => void;
  setTiposServico: (tipos: TipoServico[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFiltroAtivo: (filtro: string | null) => void;
  setBuscaAtiva: (busca: string | null) => void;
  setServicoSelecionado: (servico: ServicoComRelacoes | null) => void;
  adicionarServico: (servico: ServicoComRelacoes) => void;
  atualizarServico: (id: string, updates: Partial<ServicoComRelacoes>) => void;
  removerServico: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  clientes: [],
  servicos: [],
  tiposServico: [],
  loading: false,
  error: null,
  filtroAtivo: null,
  buscaAtiva: null,
  servicoSelecionado: null,

  setClientes: (clientes) => set({ clientes }),
  setServicos: (servicos) => set({ servicos }),
  setTiposServico: (tipos) => set({ tiposServico: tipos }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFiltroAtivo: (filtro) => set({ filtroAtivo: filtro }),
  setBuscaAtiva: (busca) => set({ buscaAtiva: busca }),
  setServicoSelecionado: (servico) => set({ servicoSelecionado: servico }),

  adicionarServico: (servico) =>
    set((state) => ({
      servicos: [...state.servicos, servico],
    })),

  atualizarServico: (id, updates) =>
    set((state) => ({
      servicos: state.servicos.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  removerServico: (id) =>
    set((state) => ({
      servicos: state.servicos.filter((s) => s.id !== id),
    })),
}));
