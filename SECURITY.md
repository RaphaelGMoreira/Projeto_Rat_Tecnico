# Politica de Seguranca

Obrigado por ajudar a manter este projeto seguro.

## Versoes com suporte

| Versao           | Suporte       |
| ---------------- | ------------- |
| `main` (ultima)  | Sim           |
| Branches antigas | Nao garantido |

## Como reportar vulnerabilidades

Para vulnerabilidades reais ou suspeitas:

1. Nao abra issue publica.
2. Use o recurso **Private vulnerability reporting** do GitHub (aba `Security` do repositorio).
3. Inclua:
   - descricao do risco;
   - passos para reproducao;
   - impacto esperado;
   - sugestao de mitigacao (se houver).

Objetivo de SLA (boas praticas):

- triagem inicial: ate 3 dias uteis;
- atualizacao de status: ate 7 dias uteis;
- correcao/mitigacao: conforme severidade e impacto.

## Configuracoes recomendadas no GitHub

No repositorio, habilitar:

1. **Dependabot alerts**
2. **Secret scanning**
3. **Push protection**
4. **Code scanning** (workflow CodeQL incluso em `.github/workflows/codeql.yml`)
5. **Private vulnerability reporting**

Observacao: em repositorios privados, parte desses recursos depende do plano/licenciamento GitHub.

## Boas praticas de seguranca para contribuidores

- Nunca versione tokens, chaves ou credenciais.
- Use `.env` local e mantenha apenas `.env.example` no repositorio.
- Revise PRs para evitar dados pessoais ou sensiveis em testes/exemplos.
- Prefira dependencias fixadas por versao e mantenha update continuo.
