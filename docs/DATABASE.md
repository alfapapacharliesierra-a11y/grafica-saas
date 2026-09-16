# Schema do Banco de Dados Supabase

Este documento descreve a estrutura completa do banco de dados PostgreSQL para o sistema de gestão de serviços.

## Tabelas

### 1. `clientes`
Armazena informações dos clientes.

```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_unique UNIQUE(email)
);
```

### 2. `tipos_servico`
Lista de tipos de serviços oferecidos.

```sql
CREATE TABLE tipos_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Valores Iniciais:**
- Impressão
- Banner
- Faixa
- Adesivo
- Cartão de visita
- Panfleto
- Convite
- Folder
- Plotagem
- Encadernação
- Outros

### 3. `servicos`
Armazena os serviços criados.

```sql
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  tipo_servico_id UUID NOT NULL REFERENCES tipos_servico(id),
  descricao TEXT NOT NULL,
  data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_entrega TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'Agendado',
  observacoes TEXT,
  concluido BOOLEAN DEFAULT FALSE,
  data_conclusao TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT status_check CHECK (
    status IN ('Agendado', 'Em produção', 'Pronto', 'Entregue', 'Cancelado')
  )
);

CREATE INDEX idx_servicos_cliente ON servicos(cliente_id);
CREATE INDEX idx_servicos_status ON servicos(status);
CREATE INDEX idx_servicos_data_entrega ON servicos(data_entrega);
```

### 4. `historico_audit`
Registra todas as alterações nos serviços.

```sql
CREATE TABLE historico_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_servico ON historico_audit(servico_id);
```

## Políticas de Segurança (RLS - Row Level Security)

Todas as tabelas devem ter RLS habilitado com políticas permissivas para acesso local:

```sql
-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_audit ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para desenvolvimento
CREATE POLICY "Allow all access" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all access" ON tipos_servico FOR ALL USING (true);
CREATE POLICY "Allow all access" ON servicos FOR ALL USING (true);
CREATE POLICY "Allow all access" ON historico_audit FOR ALL USING (true);
```

## Triggers para Auditoria Automática

```sql
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atualizar_timestamp_clientes
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER atualizar_timestamp_servicos
BEFORE UPDATE ON servicos
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();
```

## Criptografia em Repouso

O Supabase usa PostgreSQL com suporte a criptografia de dados sensíveis:
- Todos os dados são armazenados com criptografia de repouso no PostgreSQL
- Configure variáveis de ambiente sensíveis (tokens, chaves API) no Vault do Supabase

## Backup e Recuperação

- Supabase realiza backups automáticos diários
- Retenção de backups: 7 dias para plano gratuito, até 30 dias para planos pagos
- Acesse backups através do dashboard do Supabase
