-- ============================================================
-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS SUPABASE
-- ============================================================
-- Execute este script no SQL Editor do Supabase
-- para criar todas as tabelas necessárias

-- ============================================================
-- 1. TABELA: CLIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_unique UNIQUE(email)
);

-- ============================================================
-- 2. TABELA: TIPOS_SERVICO
-- ============================================================
CREATE TABLE IF NOT EXISTS tipos_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. TABELA: SERVICOS
-- ============================================================
CREATE TABLE IF NOT EXISTS servicos (
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

-- ============================================================
-- 4. TABELA: HISTORICO_AUDIT
-- ============================================================
CREATE TABLE IF NOT EXISTS historico_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. ÍNDICES PARA PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_servicos_cliente ON servicos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_servicos_status ON servicos(status);
CREATE INDEX IF NOT EXISTS idx_servicos_data_entrega ON servicos(data_entrega);
CREATE INDEX IF NOT EXISTS idx_audit_servico ON historico_audit(servico_id);

-- ============================================================
-- 6. FUNÇÃO: ATUALIZAR TIMESTAMP
-- ============================================================
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 7. TRIGGERS: ATUALIZAR TIMESTAMP AUTOMATICAMENTE
-- ============================================================
DROP TRIGGER IF EXISTS atualizar_timestamp_clientes ON clientes;
CREATE TRIGGER atualizar_timestamp_clientes
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

DROP TRIGGER IF EXISTS atualizar_timestamp_servicos ON servicos;
CREATE TRIGGER atualizar_timestamp_servicos
BEFORE UPDATE ON servicos
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

-- ============================================================
-- 8. RLS (ROW LEVEL SECURITY) - POLÍTICAS PERMISSIVAS
-- ============================================================
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_audit ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (para desenvolvimento local)
DROP POLICY IF EXISTS "Allow all access" ON clientes;
DROP POLICY IF EXISTS "Allow all access" ON tipos_servico;
DROP POLICY IF EXISTS "Allow all access" ON servicos;
DROP POLICY IF EXISTS "Allow all access" ON historico_audit;

CREATE POLICY "Allow all access" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all access" ON tipos_servico FOR ALL USING (true);
CREATE POLICY "Allow all access" ON servicos FOR ALL USING (true);
CREATE POLICY "Allow all access" ON historico_audit FOR ALL USING (true);

-- ============================================================
-- 9. POPULAR TIPOS DE SERVIÇO PADRÃO
-- ============================================================
INSERT INTO tipos_servico (nome) VALUES
  ('Impressão')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Banner')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Faixa')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Adesivo')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Cartão de visita')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Panfleto')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Convite')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Folder')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Plotagem')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Encadernação')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tipos_servico (nome) VALUES
  ('Outros')
ON CONFLICT (nome) DO NOTHING;

-- ============================================================
-- 10. DADOS DE EXEMPLO (OPCIONAL)
-- ============================================================
-- Descomente para popular com dados de teste

/*
-- Inserir cliente de exemplo
INSERT INTO clientes (nome, telefone, email, observacoes) VALUES
  ('João Silva', '(11) 99999-9999', 'joao@example.com', 'Cliente VIP')
RETURNING id;

-- Copie o ID retornado e use no INSERT do serviço
-- Exemplo: INSERT INTO servicos (cliente_id, tipo_servico_id, ...)
*/

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
