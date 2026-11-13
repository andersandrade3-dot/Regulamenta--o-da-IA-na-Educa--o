# IA, Educação e Responsabilidade — Uso Consciente, Crítico e Ético na Educação

> *“Você utiliza inteligência artificial. Mas sabe utilizá-la com responsabilidade?”*

Aplicação web pedagógica interativa destinada aos estudantes da disciplina **Informática Aplicada ao Ensino de Física (IFCE)**, fundamentada no documento oficial do Ministério da Educação:

- **Inteligência Artificial na Educação Básica: documento orientador sobre caminhos curriculares e práticas éticas de uso de IA nas escolas** (MEC / SEB / DAGE / UNESCO, 2026 — arquivo `ia-basica.pdf`).

---

## Estrutura Pedagógica

1. **Identificação do Estudante**: coleta mínima (apenas **Nome completo** e **Turma**, em conformidade com a LGPD), geração de **Código de Retomada** único (`IFCE-XXXX-XX`) e retomada automática após fechar o navegador.
2. **Etapa 1 — A IA já faz parte da sua vida?**: dilema inicial sobre Lei da Física com pistas inspecionáveis, dados brasileiros da pesquisa TIC Educação 2024, caráter dual (oportunidades vs. riscos), distinção entre **Aprender SOBRE IA** e **Aprender COM IA** e checagens com Verdadeiro/Falso e Múltipla Escolha.
3. **Etapa 2 — Laboratório de Investigação: descubra o NotebookLM**: tutorial visual em 7 passos, download do PDF oficial `ia-basica.pdf`, 4 prompts copiáveis, **Desafio do Investigador** (confronto de respostas de IA com trechos reais do PDF) e associação de conceitos.
4. **Etapa 3 — Central de Decisões: ética ou irresponsabilidade?**: análise de 6 casos escolares, **Semáforo da Ética Digital** (arrastar ou clicar), quadro normativo **LGPD (Lei nº 13.709/2018)** e **ECA Digital (Lei nº 15.211/2025)** e checagens normativas.
5. **Etapa 4 — Física + Inteligência Artificial**: 7 possibilidades para ensinar as Leis de Newton, **Laboratório de Prompts** estruturados (sem API externa), **Bancada de Auditoria Científica** (localização de erros de unidade, concepção de ação-reação e alucinação bibliográfica) e questão de conduta.
6. **Etapa 5 — Desafio Final: você decide!**: mapa das 10 competências distribuídas ao longo da jornada e 5 cenários decisórios integradores apresentados um por vez.
7. **Etapa 6 — Sua opinião importa**: exatamente duas questões discursivas obrigatórias com salvamento automático e edição livre.
8. **Biblioteca de Referências & Tela de Conclusão**: acesso contínuo às referências institucionais (MEC, LGPD, ECA Digital, UNESCO, UNICEF, CNE) e resumo final de desempenho e registros.

---

## Organização Modular do Código (preparada para revisão docente)

Os conteúdos pedagógicos estão desacoplados dos componentes visuais para facilitar ajustes posteriores:

- `src/data/mecReferences.ts` — metadados das etapas e Biblioteca de Referências
- `src/data/stage1Data.ts` a `src/data/stage6Data.ts` — dilemas, situações, prompts, casos, semáforo e questões de cada etapa
- `src/data/allQuestions.ts` — consolidação dos 10 eixos de competência
- `src/lib/persistence.ts` — camada híbrida `localStorage` + RPCs do Supabase com tratamento de erros e retomada por código
- `supabase/schema.sql` — tabelas (`mission_attempts`, `mission_quiz_responses`, `mission_essays`), políticas RLS restritivas, funções RPC e view docente (`v_professor_resumo`)

---

## Como Rodar Localmente

```bash
npm install
npm run dev
```

Para executar os testes automatizados e checagem de tipos:

```bash
npm run typecheck
npm test
npm run build
```

---

## Configuração do Supabase (Persistência em Nuvem)

1. Crie um projeto gratuito no [Supabase](https://supabase.com/).
2. No **SQL Editor** do Supabase, cole e execute integralmente o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).
3. Copie `.env.example` para `.env.local` (não versionado) e preencha com a **Project URL** e a **anon public key** (nunca utilize a chave `service_role` no frontend):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

4. **Acompanhamento pelo professor**: no Supabase, consulte a view `public.v_professor_resumo` pelo Table Editor ou SQL Editor para visualizar nomes, turmas, etapas concluídas, acertos objetivos e as respostas discursivas de todos os estudantes.

> **Segurança e Privacidade**: as tabelas possuem Row Level Security (`RLS`) ativada bloqueando consultas anônimas diretas entre estudantes; toda gravação e retomada do frontend passa exclusivamente por funções `SECURITY DEFINER` validadas por token de sessão ou código exato de retomada.

---

## Publicação no GitHub e Vercel

1. Suba o repositório para o GitHub (o `.gitignore` já protege `.env` e `node_modules`).
2. Importe o repositório na [Vercel](https://vercel.com/) usando o preset **Vite** (`Build Command: npm run build`, `Output Directory: dist`).
3. Em **Settings → Environment Variables** na Vercel, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Faça o deploy. O arquivo `vercel.json` já garante o roteamento correto.

