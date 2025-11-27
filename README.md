# Discord UptimeRobot Bot

Bot do Discord que monitora automaticamente a saúde de seus bots e integra com UptimeRobot para gerenciar e resetar monitores quando necessário.

## 🚀 Funcionalidades

- **Comando `/pinger`**: Verificar a saúde dos bots monitorados com botão interativo
  - Parâmetros customizáveis: mensagem de texto e anexos (foto/vídeo)
  - Botão "verificar saude do meu bot" para check instantâneo
  
- **Comando `/cadastrar`**: Adicionar novos bots ao monitoramento via modal interativo
  - Campos: nome do bot, URL do monitor, ID do monitor UptimeRobot, canal de notificações (opcional)
  
- **Comando `/status`**: Ver todos os bots cadastrados e seu status atual
  - Exibe status em tempo real de cada bot monitorado
  - Informações detalhadas: status, monitor ID, URL
  
- **Sistema Automático de Monitoramento**:
  - Verifica a saúde dos bots a cada 5 minutos
  - Reseta automaticamente monitores quando necessário
  - Notificações automáticas no Discord quando monitores são resetados
  - Logs persistentes de todas as operações de reset

## 📋 Pré-requisitos

1. **Bot Discord**
   - Criar aplicação no [Discord Developer Portal](https://discord.com/developers/applications)
   - Copiar o **Client ID** e o **Token** do bot
   - Ativar as seguintes intents no bot:
     - Server Members Intent
     - Message Content Intent
   - Convidar o bot para seu servidor com permissões:
     - Send Messages
     - Use Slash Commands
     - Embed Links
     - Attach Files

2. **UptimeRobot API Key**
   - Fazer login em [UptimeRobot](https://uptimerobot.com)
   - Ir para **My Settings** → **Main API Key**
   - Copiar a API Key

## 🔧 Configuração Local

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd <seu-repositorio>
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no Replit Secrets ou crie um arquivo `.env`:
```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui
UPTIMEROBOT_API_KEY=sua_api_key_aqui
SESSION_SECRET=qualquer_string_aleatoria
```

4. Execute em desenvolvimento:
```bash
npm run dev
```

## 🚀 Deploy no Render via GitHub

### Passo 1: Preparar Repositório GitHub

1. Crie um novo repositório no GitHub (público ou privado)
2. Faça push do código para o GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### Passo 2: Configurar no Render

1. Acesse [Render](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - **Name**: `discord-uptimerobot-bot` (ou qualquer nome)
   - **Region**: Escolha a mais próxima
   - **Branch**: `main`
   - **Root Directory**: deixe vazio
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (ou escolha outro plano)

5. Adicione as **Environment Variables**:
   - `NODE_ENV` = `production`
   - `DISCORD_TOKEN` = seu token do Discord
   - `DISCORD_CLIENT_ID` = seu client ID
   - `UPTIMEROBOT_API_KEY` = sua API key
   - `SESSION_SECRET` = uma string aleatória segura

6. Clique em **"Create Web Service"**

### Passo 3: Aguardar Deploy

- O Render vai automaticamente:
  - Clonar seu repositório
  - Instalar dependências
  - Fazer build da aplicação
  - Iniciar o bot

- Quando o deploy terminar, o bot estará online no Discord!

### Deploy Automático

Após configurar, qualquer push para o branch `main` no GitHub vai automaticamente fazer um novo deploy no Render.

## 📝 Como Usar

### 1. Cadastrar um Bot

No Discord, use:
```
/cadastrar
```

Um modal aparecerá pedindo:
- **Nome do bot**: Nome amigável para identificar
- **URL do monitor**: URL que o UptimeRobot monitora
- **Monitor ID**: ID numérico do monitor no UptimeRobot
- **Canal de notificações** (opcional): ID do canal para receber notificações

### 2. Verificar Status

Para ver todos os bots cadastrados:
```
/status
```

### 3. Verificação Manual de Saúde

Para verificar a saúde dos bots manualmente:
```
/pinger
```

Ou com mensagem customizada e anexo:
```
/pinger mensagem:"Verificando meus bots" anexo:[sua_imagem.png]
```

Clique no botão **"verificar saude do meu bot"** para ver o status atual.

## 🔄 Monitoramento Automático

O bot verifica automaticamente todos os bots cadastrados **a cada 5 minutos**:

- Se um monitor estiver com status "down" ou "seems down", o bot automaticamente:
  1. Reseta o monitor no UptimeRobot
  2. Registra o reset nos logs
  3. Envia notificação no canal configurado (se especificado)

## 📊 Dados Persistidos

Os dados são salvos localmente em arquivos JSON:
- `data/bots.json` - Bots monitorados
- `data/logs.json` - Histórico de resets

**Importante**: No Render (plano free), o armazenamento é efêmero. Para persistência permanente, considere adicionar um banco de dados PostgreSQL.

## 🛠 Tecnologias

- **Discord.js** - Interações com Discord
- **Node-cron** - Agendamento de verificações automáticas
- **Axios** - Requisições HTTP para UptimeRobot API
- **Express** - Servidor HTTP
- **TypeScript** - Tipagem estática

## 📖 Estrutura do Projeto

```
├── server/
│   ├── discord-bot.ts        # Lógica principal do bot Discord
│   ├── uptimerobot.ts         # Integração com UptimeRobot API
│   ├── monitor-service.ts     # Serviço de monitoramento automático
│   ├── storage.ts             # Persistência de dados
│   └── app.ts                 # Aplicação Express
├── shared/
│   └── schema.ts              # Schemas TypeScript/Zod
├── data/                      # Dados persistidos (criado automaticamente)
├── render.yaml                # Configuração do Render
└── README.md                  # Este arquivo
```

## 🔍 Troubleshooting

### Bot não aparece online no Discord
- Verifique se o `DISCORD_TOKEN` está correto
- Confirme que o bot foi adicionado ao servidor com permissões adequadas

### Comandos não aparecem
- Aguarde alguns minutos após iniciar o bot
- Use `/` no Discord para ver se os comandos estão registrados

### Erro ao resetar monitor
- Verifique se a `UPTIMEROBOT_API_KEY` está correta
- Confirme que o Monitor ID fornecido existe no UptimeRobot

### Render reinicia o serviço
- No plano free, o Render pode hibernar após inatividade
- Considere fazer um "keep-alive" ou upgrade para plano pago

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
