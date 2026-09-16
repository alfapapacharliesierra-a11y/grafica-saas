# Contribuindo

Obrigado por seu interesse em contribuir! Este documento descreve como contribuir com o projeto.

## Começando

1. Faça um Fork do repositório
2. Clone seu fork: `git clone https://github.com/seu-usuario/grafica-saas.git`
3. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
4. Comite suas mudanças: `git commit -m 'feat: descrição da mudança'`
5. Push para a branch: `git push origin feature/minha-feature`
6. Abra um Pull Request

## Padrões de Código

### Commits

Use o formato Conventional Commits:

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatora código
test: adiciona testes
chore: atualizações de build
```

### TypeScript

- Sempre use tipos explícitos
- Evite `any`
- Use interfaces para objetos complexos

### Componentes React

- Use functional components
- Use hooks modernos
- Componentes devem ser pequenos e reutilizáveis
- Documente props com comentários

### Tailwind CSS

- Use classes do Tailwind sempre que possível
- Evite CSS customizado
- Mantenha consistência com o design system

## Estrutura de Arquivos

```
src/
├── app/              # Páginas do Next.js
├── components/       # Componentes React reutilizáveis
├── lib/
│   ├── api.ts       # Funções de API
│   ├── supabase.ts  # Cliente Supabase
│   ├── types.ts     # Tipos TypeScript
│   └── utils.ts     # Funções utilitárias
├── stores/          # Estado (Zustand)
└── styles/          # CSS global
```

## Testes

*(A implementar)*

Ao adicionar novas funcionalidades, inclua testes correspondentes.

## Reportar Bugs

1. Use o título descritivo
2. Descreva o comportamento esperado vs. atual
3. Inclua passos para reproduzir
4. Adicione screenshots se aplicável
5. Mencione sua versão do Node.js e navegador

## Sugestões de Melhorias

1. Use um título claro
2. Explique o caso de uso
3. Descreva a solução esperada
4. Liste possíveis alternativas

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License.

## Dúvidas?

Abra uma Discussion ou entre em contato através das Issues.

Thanks! 🎉
