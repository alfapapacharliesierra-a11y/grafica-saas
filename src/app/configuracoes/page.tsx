'use client';

import Layout from '@/components/Layout';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Configuracoes() {
  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Ajuste as configurações do sistema</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <SettingsIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">Página de configurações em desenvolvimento</p>
          <p className="text-gray-400 text-sm mt-2">Aguarde futuras atualizações</p>
        </div>
      </div>
    </Layout>
  );
}
