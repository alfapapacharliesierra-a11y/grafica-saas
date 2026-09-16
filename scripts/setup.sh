#!/bin/bash

# ============================================================
# Script de Setup Automático - Gráfica SaaS
# ============================================================
# Use este script para automatizar o setup local
# bash scripts/setup.sh

echo "🚀 Iniciando setup do Gráfica SaaS..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env.local
if [ ! -f .env.local ]; then
    echo "📝 Criando .env.local..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env.local com suas credenciais do Supabase"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
else
    echo "✅ .env.local já existe"
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "Próximos passos:"
echo "1. Edite .env.local com suas credenciais do Supabase"
echo "2. Execute o SQL em scripts/init-database.sql no dashboard do Supabase"
echo "3. Execute: npm run dev"
echo "4. Abra http://localhost:3000"
echo ""
echo "Para mais informações, veja docs/INSTALL.md"
