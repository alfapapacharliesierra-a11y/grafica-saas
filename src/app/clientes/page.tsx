'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Cliente } from '@/lib/types';
import { buscarClientes } from '@/lib/api';
import { Phone, Mail, MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const data = await buscarClientes();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">Gestão de clientes e histórico</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            <Plus size={20} />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Clientes Grid */}
        {clientes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Nenhum cliente cadastrado</p>
            <p className="text-gray-400 text-sm mt-2">Comece criando seu primeiro cliente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-bold text-gray-900">{cliente.nome}</h3>
                <div className="space-y-3 mt-4">
                  {cliente.telefone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={18} className="text-blue-600" />
                      <a href={`tel:${cliente.telefone}`} className="hover:text-blue-600">
                        {cliente.telefone}
                      </a>
                    </div>
                  )}
                  {cliente.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail size={18} className="text-blue-600" />
                      <a href={`mailto:${cliente.email}`} className="hover:text-blue-600">
                        {cliente.email}
                      </a>
                    </div>
                  )}
                  {cliente.observacoes && (
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-1" />
                      <p className="text-sm">{cliente.observacoes}</p>
                    </div>
                  )}
                </div>
                <button className="w-full mt-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Ver Histórico
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
