# Gráfica SaaS - Sistema de Gestão de Serviços

Um sistema web full-stack completo para gerenciar serviços de impressão, produção e prazos em uma gráfica.

## 🚀 Características

- ✅ Dashboard com métricas em tempo real
- ✅ Cadastro de serviços com histórico completo
- ✅ Gestão de clientes e histórico protegido
- ✅ Agenda visual (Dia/Semana/Mês)
- ✅ Controle automático de prazos (Atrasado/Hoje/Amanhã)
- ✅ Busca e filtros avançados
- ✅ Histórico de alterações (Audit Trail)
- ✅ Interface responsiva para desktop e mobile
- ✅ Tema claro profissional

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Next.js 14
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Acesso direto local
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/alfapapacharliesierra-a11y/grafica-saas.git
cd grafica-saas
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Preencha com suas credenciais do Supabase.

4. Execute o servidor de desenvolvimento
```bash
npm run dev
```

5. Abra http://localhost:3000 no seu navegador

## 📦 Estrutura do Projeto

```
src/
├── app/              # Next.js app directory
├── components/       # Componentes React reutilizáveis
├── lib/
│   ├── supabase.ts   # Cliente Supabase
│   └── types.ts      # Tipos TypeScript
├── stores/           # Zustand stores (state management)
└── utils/            # Funções utilitárias
```

## 🗄️ Schema do Banco de Dados

Ver `docs/DATABASE.md` para detalhes completos do schema.

## 📝 Licença

MIT
