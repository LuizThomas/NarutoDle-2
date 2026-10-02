# NarutoDle 2 — Jogo Ninja Infinito de Adivinhação

**NarutoDle 2** é uma aplicação web completa inspirada nos jogos de dedução e adivinhação do universo Naruto/Naruto Shippuden/Boruto, com identidade visual própria, arquitetura full-stack profissional, e **jogabilidade infinita sem limite diário** (você pode jogar consecutivamente quantas partidas desejar).

---

## 🌟 Funcionalidades Principais

- **Partidas Infinitas sem Restrição Diária**:
  - Geração dinâmica de `gameId` por partida.
  - Seleção inteligente com cache de histórico na sessão para evitar repetições.
  - Botão "JOGAR NOVAMENTE" que recria a arena instantaneamente sem reload.
- **5 Modos de Jogo Completos**:
  - **Modo Clássico**: Palpites com matriz comparativa de atributos canônicos (Gênero, Espécie, Vila, Clã, Rank, Idade, Altura, Peso, Naturezas de Chakra, Kekkei Genkai, Primeiro Arco, Status, Era) com cores de acerto (🟩 Correto, 🟨 Parcial, ⬜ Incorreto) e setas direcionais numéricas (↑ / ↓).
  - **Modo Jutsu**: Descubra o portador da técnica com base em rank, elemento e descrição.
  - **Modo Citação (Quote)**: Adivinhe o autor de frases icônicas com pistas graduais a cada erro.
  - **Modo Olho (Dojutsu)**: Identifique o shinobi a partir de seu olhar e dojutsu.
  - **Modo Silhueta**: Reconheça o personagem pela silhueta e postura.
- **Segurança de Jogo de Ponta a Ponta**:
  - O `secretCharacterId` permanece estritamente guardado no backend Node.js.
  - A validação ocorre no servidor, impedindo que o jogador descubra a resposta inspecionando o DevTools.
- **Banco de Dados Canônico e Roster Rico**:
  - Mais de 65 shinobis detalhados catalogados com base nos Databooks oficiais de Masashi Kishimoto (I, II, III e IV).
- **Sensação Audiovisual e Imersão**:
  - Efeitos sonoros sintetizados via Web Audio API (golpe de chakra, acerto, erro, vitória).
  - Chuva de chakra / confetes via Canvas.
  - Vibração tátil no mobile via Haptic API.
  - Alternância de áudio em um clique.
- **Pergaminhos do Databook & Estatísticas**:
  - Painel de estatísticas com gráfico de distribuição de palpites (1 a 10+), histórico, streak atual e recorde.
  - Explorador do Databook completo com filtros por vila e busca instantânea.
- **Níveis de Dificuldade**:
  - Fácil (populares)
  - Normal (equilibrado)
  - Difícil (secundários)
  - Especialista (mestres lendários e ancestrais do Databook)

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TSX.
- **Design**: Identidade visual inspirada em pergaminhos ninja, HUD moderno e paleta escura com chakra laranja.

---

## 🚀 Como Executar

### 1. Pré-requisitos
- Node.js >= 20.x
- npm >= 10.x

### 2. Instalação das dependências
```bash
npm install
```

### 3. Execução em Desenvolvimento
```bash
npm run dev
```
O servidor Express integrará o Vite em modo middleware e estará disponível em `http://localhost:3000`.

### 4. Build de Produção
```bash
npm run build
```

### 5. Execução em Produção (Servidor Node)
```bash
npm start
```

---

## 🌐 Deploy no Vercel (100% Autônomo e Flexível)

O NarutoDle 2 foi arquitetado com um **motor híbrido autônomo**: ele roda perfeitamente em qualquer hospedagem estática ou serverless (Vercel, Netlify, Cloudflare Pages, GitHub Pages) **sem necessidade de manter conexão com o Google AI Studio**.

O arquivo `vercel.json` já está incluído na raiz do projeto com as regras de roteamento SPA:

### Como colocar no Vercel:
1. **Pelo GitHub / Dashboard da Vercel**:
   - Suba a pasta do projeto para o seu GitHub.
   - Na Vercel, clique em **Add New Project** e selecione o repositório.
   - O framework Vite será detectado automaticamente (`Build Command: npm run build`, `Output Directory: dist`).
   - Clique em **Deploy**.

2. **Via Vercel CLI**:
   ```bash
   npx vercel
   ```

A engine cliente do jogo assume imediatamente todo o processamento de partidas, comparações de atributos, dicas progressivas e histórico local em `localStorage`, garantindo **zero tempo fora do ar (zero downtime)** quando exportado.

---

## ⚙️ Variáveis de Ambiente (.env)

Consulte `.env.example`:
```env
PORT=3000
NODE_ENV=production
```

---

## 📡 Endpoints da API REST

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/characters` | Lista todos os shinobis públicos |
| `GET` | `/api/characters/search?q=:query` | Autocomplete rápido com normalização |
| `GET` | `/api/characters/:id` | Retorna o registro canônico do shinobi |
| `POST` | `/api/games` | Cria nova partida com seed único e sem expor a resposta |
| `GET` | `/api/games/:id` | Retorna estado seguro da partida |
| `POST` | `/api/games/:id/guess` | Processa palpite e retorna comparações/pistas |
| `POST` | `/api/games/:id/finish` | Desiste e revela o personagem secreto |
| `GET` | `/api/stats` | Métricas de jogador e distribuição de tentativas |
| `GET` | `/api/leaderboard` | Classificação de shinobis por streak |
| `GET` | `/api/admin/validate` | Validador de integridade dos registros do Databook |

---

## 📜 Licença
Inspirado no universo criado por Masashi Kishimoto. Desenvolvido para fins de entretenimento e estudo.
