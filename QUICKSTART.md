# 🚀 Guia de Primeiro Acesso - Gráfica SaaS

## ✅ Você está pronto para usar o sistema!

Congratulações! Seu sistema de gestão de serviços para gráfica foi criado com sucesso.

---

## 📋 Checklist de Configuração

### Passo 1: Configurar Supabase (5 minutos)

1. **Criar Projeto no Supabase**
   - Acesse [supabase.com](https://supabase.com)
   - Clique em "New Project"
   - Preencha os detalhes e copie a URL e chave anônima

2. **Atualizar `.env.local`**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   NEXT_PUBLIC_ACCESS_TOKEN=grafica-local-2024
   ```

3. **Criar Tabelas do Banco**
   - No dashboard do Supabase, vá para **SQL Editor**
   - Crie uma nova query
   - Copie e cole o conteúdo de `scripts/init-database.sql`
   - Clique em "Run"

### Passo 2: Instalar Localmente (3 minutos)

```bash
# Clone o repositório (se não fez ainda)
git clone https://github.com/alfapapacharliesierra-a11y/grafica-saas.git
cd grafica-saas

# Opção A: Usar script automático (Recomendado)
bash scripts/setup.sh          # macOS/Linux
scripts/setup.bat              # Windows

# Opção B: Manual
npm install
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### Passo 3: Executar Localmente (1 minuto)

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🎯 Primeiros Passos no Sistema

### 1. Criar um Cliente

1. Clique em **Clientes** na barra lateral
2. Clique em **+ Novo Cliente**
3. Preencha:
   - Nome: Ex: "João Silva Gráfica"
   - Telefone: Ex: "(11) 99999-9999"
   - E-mail: Ex: "joao@grafica.com.br"
   - Observações: (opcional)
4. Clique em **Salvar**

### 2. Criar um Serviço

1. Clique em **Serviços** ou em **+ Novo Serviço**
2. Preencha os 6 passos:
   - **Cliente**: Selecione o cliente criado
   - **Tipo**: Selecione "Impressão" (ou crie um novo)
   - **Descrição**: Ex: "1000 panfletos A5 colorido"
   - **Entrega**: Selecione data/hora desejada
   - **Status**: Selecione "Agendado"
   - **Observações**: (opcional)
3. Clique em **Salvar**

### 3. Acompanhar no Dashboard

1. Clique em **Dashboard** na barra lateral
2. Veja:
   - Métricas de KPIs
   - Serviços próximos a vencer
   - Alertas de atrasos

### 4. Alterar Status de Serviço

1. Vá para **Serviços**
2. Na tabela, clique no dropdown de **Status**
3. Selecione:
   - "Em produção" → Iniciou o trabalho
   - "Pronto" → Trabalho finalizado
   - "Entregue" → Entregue ao cliente
4. O sistema atualiza automaticamente!

---

## 📊 Entendendo o Dashboard

### KPIs (Métricas)

| Card | Significado |
|------|-------------|
| 📅 Serviços de Hoje | Quantos serviços vencem hoje |
| ⚠️ Atrasados | Quantos passaram do prazo |
| ⚡ Em Produção | Quantos estão em andamento |
| 📈 Agendados | Quantos foram apenas agendados |
| ✅ Concluídos | Total histórico concluído |

### Próximos a Vencer

Lista dos 10 serviços mais urgentes, ordenados por prazo.

**Cores:**
- 🔴 **Vermelho** = Atrasado (passou do prazo)
- 🟡 **Amarelo** = Hoje (vence hoje)
- 🔵 **Azul** = Próximo (próximos dias)

---

## 🔍 Usando Buscas e Filtros

### Busca Rápida

1. Na página **Serviços**, use a barra de busca
2. Digite nome do cliente ou descrição
3. Resultados filtram em tempo real

### Filtros Avançados

1. Clique no ícone de **Filtros** (ao lado da busca)
2. Selecione:
   - Status desejado
   - Tipo de serviço
   - Período de data
3. Os resultados atualizam automaticamente

---

## 💡 Dicas Importantes

✅ **Faça:**
- Atualizar status dos serviços frequentemente
- Revisar "Próximos a Vencer" diariamente
- Manter observações detalhadas
- Usar a busca para encontrar serviços rápido

❌ **Evite:**
- Deixar serviços com status "Agendado" indefinidamente
- Cancelar serviços antigos (mantém histórico importante)
- Alterações sem justificar nas observações

---

## 🐛 Troubleshooting

### "Erro: Supabase URL e Anon Key são obrigatórios"

**Solução:**
```bash
# Verifique se .env.local existe
ls .env.local              # macOS/Linux
dir .env.local             # Windows

# Verifique o conteúdo
cat .env.local             # macOS/Linux
type .env.local            # Windows

# Reinicie o servidor
# Ctrl+C para parar
npm run dev
```

### "Erro: Permission denied" ao salvar dados

**Solução:**
1. No dashboard do Supabase, vá para **Authentication > Policies**
2. Certifique-se que as políticas RLS estão **habilitadas**
3. Verifique se as políticas permitem acesso

### Dados não aparecem após criar

**Solução:**
1. Aguarde 2-3 segundos (Supabase pode ser lento em plano gratuito)
2. Atualize a página (F5 ou Cmd+R)
3. Verifique se os dados estão realmente no Supabase:
   - Dashboard Supabase > Table Editor > Veja as tabelas

---

## 📚 Documentação Completa

- **[README.md](../README.md)** - Visão geral do projeto
- **[docs/INSTALL.md](../docs/INSTALL.md)** - Instalação completa
- **[docs/DATABASE.md](../docs/DATABASE.md)** - Schema do banco
- **[docs/USAGE.md](../docs/USAGE.md)** - Guia de uso detalhado
- **[docs/ROADMAP.md](../docs/ROADMAP.md)** - Futuras funcionalidades

---

## 🆘 Precisa de Ajuda?

1. **Veja as Issues:** [GitHub Issues](https://github.com/alfapapacharliesierra-a11y/grafica-saas/issues)
2. **Abra uma Discussão:** [GitHub Discussions](https://github.com/alfapapacharliesierra-a11y/grafica-saas/discussions)
3. **Leia a Documentação:** Consulte os docs/ e README.md

---

## 🎉 Bom uso!

Seu sistema está pronto para revolucionar a gestão de serviços da sua gráfica!

**Próximo passo:** [Acesse o Dashboard](http://localhost:3000)

---

**Versão:** 1.0.0  
**Última atualização:** Setembro 2024
