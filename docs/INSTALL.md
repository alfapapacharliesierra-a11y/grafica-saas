# Guia de Instalação e Deploy

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)
- Conta no Vercel (opcional, para deploy)

## 1. Clonar o Repositório

```bash
git clone https://github.com/alfapapacharliesierra-a11y/grafica-saas.git
cd grafica-saas
```

## 2. Configurar Supabase

### 2.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preenccha:
   - **Project name**: grafica-saas
   - **Database password**: Gere uma senha forte
   - **Region**: Selecione a mais próxima (ex: Brazil)
5. Clique em "Create new project"

### 2.2 Copiar Credenciais

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie:
   - `Project URL` (será `NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` key (será `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2.3 Criar Tabelas

1. No dashboard do Supabase, vá para **SQL Editor**
2. Crie uma nova query
3. Cole o conteúdo de `docs/DATABASE.md` (seção SQL)
4. Clique em "Run"

### 2.4 Popular Tipos de Serviço

```sql
INSERT INTO tipos_servico (nome) VALUES
  ('Impressão'),
  ('Banner'),
  ('Faixa'),
  ('Adesivo'),
  ('Cartão de visita'),
  ('Panfleto'),
  ('Convite'),
  ('Folder'),
  ('Plotagem'),
  ('Encadernação'),
  ('Outros');
```

## 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

2. Edite `.env.local` e preencha com suas credenciais:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
NEXT_PUBLIC_ACCESS_TOKEN=grafica-local-2024
```

## 4. Instalar Dependências

```bash
npm install
```

## 5. Executar Localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 6. Build para Produção

```bash
npm run build
npm start
```

## Deploy no Vercel

### 6.1 Preparar Repositório

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 6.2 Deploy

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New" > "Project"
3. Selecione o repositório `grafica-saas`
4. Clique em "Import"
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ACCESS_TOKEN`
6. Clique em "Deploy"

## Troubleshooting

### Erro: "Supabase URL e Anon Key são obrigatórios"

- Verifique se `.env.local` está criado com as variáveis corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Permission denied" ao acessar dados

- Verifique se RLS está configurado com políticas permissivas (veja DATABASE.md)
- Teste as permissões no SQL Editor do Supabase

### Conexão lenta com Supabase

- Verifique sua conexão de internet
- Considere usar CDN do Vercel para cache
- Otimize queries no banco de dados

## Próximos Passos

1. Adicionar autenticação com Supabase Auth (opcional)
2. Configurar Edge Functions para lógica de servidor
3. Adicionar notificações em tempo real com Realtime do Supabase
4. Implementar backup automático
5. Adicionar logs e monitoramento
