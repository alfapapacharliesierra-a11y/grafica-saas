'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import clsx from 'clsx';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: any) => void;
  filtrosDisponiveis?: {
    status?: string[];
    tipos?: { id: string; nome: string }[];
  };
}

export default function SearchAndFilter({
  onSearch,
  onFilterChange,
  filtrosDisponiveis,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    onSearch('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente ou descrição..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
            showFilters
              ? 'bg-blue-50 border-blue-300 text-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          )}
        >
          <Filter size={18} />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
          <div className="space-y-3">
            {filtrosDisponiveis?.status && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={activeFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os status</option>
                  {filtrosDisponiveis.status.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filtrosDisponiveis?.tipos && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Serviço
                </label>
                <select
                  value={activeFilters.tipo || ''}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os tipos</option>
                  {filtrosDisponiveis.tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={18} />
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
