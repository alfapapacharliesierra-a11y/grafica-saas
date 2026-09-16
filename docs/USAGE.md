# Guia de Uso do Sistema

## Dashboard

A página inicial mostra um resumo com:

- **KPIs**: Métricas em tempo real (hoje, atrasados, em produção, agendados, concluídos)
- **Alertas**: Notificações de serviços atrasados
- **Próximos a Vencer**: Lista dos 10 serviços mais urgentes, ordenados pelo prazo

## Serviços

### Criar um Novo Serviço

1. Clique no botão **+ Novo Serviço**
2. Preencha os dados em 6 passos:
   - **Passo 1**: Selecione o cliente
   - **Passo 2**: Selecione o tipo de serviço (ou crie um novo)
   - **Passo 3**: Descreva o serviço
   - **Passo 4**: Defina a data/hora de entrega
   - **Passo 5**: Escolha o status inicial
   - **Passo 6**: Adicione observações (opcional)
3. Clique em **Salvar**

### Alterar Status

1. Na tabela de serviços, clique no dropdown da coluna "Status"
2. Selecione o novo status
3. A mudança é salva automaticamente

**Status Disponíveis:**
- **Agendado**: Serviço foi apenas agendado
- **Em produção**: Trabalho iniciado
- **Pronto**: Pronto para entrega
- **Entregue**: Entregue ao cliente
- **Cancelado**: Serviço cancelado

### Visualizar Histórico

1. Clique em um serviço na tabela
2. Expanda "Histórico de Alterações"
3. Veja todas as mudanças de status, prazos, etc.

## Prazo e Prioridade

O sistema calcula automaticamente a situação do prazo:

| Status | Cor | Significado |
|--------|-----|-------------|
| 🔴 ATRASADO | Vermelho | Data de entrega passou e serviço não está concluído |
| 🟡 HOJE | Amarelo | Data de entrega é hoje |
| 🟠 AMANHÃ | Laranja | Data de entrega é amanhã |
| 🔵 PRÓXIMO | Azul | Data de entrega em dias futuros |
| 🟢 CONCLUÍDO | Verde | Status é "Pronto" ou "Entregue" |

**Destaque Visual:**
- Serviços atrasados têm animação piscante vermelha
- Serviços de hoje têm fundo amarelo
- Serviços concluídos aparecem com opacidade reduzida

## Clientes

### Cadastrar Cliente

1. Vá para a aba **Clientes**
2. Clique em **+ Novo Cliente**
3. Preencha:
   - Nome (obrigatório)
   - Telefone
   - E-mail
   - Observações
4. Clique em **Salvar**

### Visualizar Histórico do Cliente

1. Clique no card do cliente
2. Veja:
   - Estatísticas: "X Serviços em Andamento" e "Y Serviços Concluídos"
   - Tabela com histórico completo de todos os serviços

**Nota:** O histórico é permanente e nunca é apagado, mesmo após conclusão.

## Agenda

### Visualizar Agenda

1. Vá para a aba **Agenda**
2. Escolha a visualização:
   - **Mês**: Calendário mensal completo
   - **Semana**: Visualização semanal (em desenvolvimento)
   - **Dia**: Visualização diária (em desenvolvimento)
3. Use os botões de navegação para ver períodos anteriores/posteriores
4. Clique em **Hoje** para retornar ao dia atual

### Filtrar por Data

Ao clicar em um dia específico, uma gaveta lateral lista todos os serviços programados para aquele dia.

## Busca e Filtros

### Buscar

1. Use a barra de busca **"Buscar por cliente ou descrição"**
2. Resultados filtram em tempo real

### Filtros Avançados

1. Clique no ícone de **Filtros**
2. Aplique filtros por:
   - **Status**: Todos, Agendado, Em produção, etc.
   - **Tipo de Serviço**: Impressão, Banner, etc.
   - **Período**: Data de início e fim
3. Clique em **Limpar filtros** para resetar

## Boas Práticas

✅ **Recomendado:**
- Atualizar status dos serviços diariamente
- Revisar a seção "Próximos a Vencer" no Dashboard
- Manter observações detalhadas sobre alterações
- Fazer backup regular dos dados (Supabase faz automaticamente)

❌ **Evitar:**
- Cancelar serviços antigos (o histórico é importante)
- Alterar data de entrega sem justificar
- Deixar serviços com status "Agendado" por muito tempo

## Atalhos Teclado

- `Ctrl + K`: Abrir busca global (em breve)
- `Ctrl + N`: Novo serviço (em breve)

## FAQ

**P: Posso deletar um serviço?**
R: Não. O sistema mantém o histórico permanente. Você pode cancelar o serviço em vez de deletá-lo.

**P: Como modificar um cliente?**
R: Clique no card do cliente e você verá as informações. Edição será adicionada em breve.

**P: Os dados sincronizam em tempo real?**
R: Sim! Use Realtime do Supabase para sincronização entre abas/dispositivos (em breve).

**P: Como fazer backup dos dados?**
R: O Supabase faz backups automáticos. Você pode baixar um backup no dashboard do Supabase.
