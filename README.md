# 🏆 Bolão Escolar 3º Ano — Copa do Mundo

Aplicação web de bolão para a turma do 3º Ano do **CETI Malaquis Ribeiro Damasceno** (São Lourenço do Piauí - PI).

## ⚽ Sobre o Projeto

Permite que os alunos façam apostas no placar do jogo **Brasil x Escócia** e escolham o marcador do primeiro gol de cada equipe. As apostas são salvas em tempo real via **Supabase**.

## 🎁 Premiação

O participante que acertar o placar leva para casa:
- 🥥 Uma **cabaça** legítima do sertão
- ⛏️ Uma **enxada** novinha

## 🛠️ Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- [Supabase](https://supabase.com/) — banco de dados e API em tempo real
- [Google Fonts — Outfit](https://fonts.google.com/specimen/Outfit)
- [FlagCDN](https://flagcdn.com/) — bandeiras dos países

## 📁 Estrutura

```
bolao-escolar/
├── index.html     # Estrutura da página
├── style.css      # Estilos e layout responsivo
├── app.js         # Lógica, integração Supabase e renderização
├── cabaca.jpg     # Foto do prêmio (cabaça)
├── enxada.jpg     # Foto do prêmio (enxada)
└── README.md
```

## 🚀 Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/bolao-escolar.git
   ```

2. Abra o arquivo `index.html` diretamente no navegador, ou hospede em qualquer serviço de páginas estáticas (GitHub Pages, Netlify, Vercel).

3. As apostas são salvas automaticamente no Supabase configurado em `app.js`.

## ⚙️ Configuração do Supabase

As credenciais já estão em `app.js`. Para usar seu próprio projeto Supabase, altere as variáveis no início do arquivo:

```js
const supabaseUrl = "SUA_URL_AQUI";
const supabaseKey = "SUA_CHAVE_AQUI";
```

A tabela `apostas` deve ter as seguintes colunas:

| Coluna       | Tipo      |
|--------------|-----------|
| `id`         | uuid (PK) |
| `nome`       | text      |
| `cpf`        | text      |
| `telefone`   | text      |
| `brasil`     | int4      |
| `haiti`      | int4      |
| `created_at` | timestamp |

> **Obs.:** O campo `haiti` armazena o placar da Escócia (nome legado do banco).

## 📱 Responsividade

Layout adaptado para dispositivos móveis e desktops.

---

Feito com 💚💛 para o Bolão do Terceirão!
