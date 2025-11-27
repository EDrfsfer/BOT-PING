# Discord Bot Design Guidelines

## Design Approach
This is a Discord bot interface, not a web application. Design focuses on Discord embed messages, button interactions, and modal forms that create a cohesive, professional bot experience.

**Reference Approach**: Draw inspiration from professional Discord bots like MEE6, Dyno, and Carl-bot for clean, informative embed designs.

## Discord Embed Design

### Status Dashboard Embeds
- **Title**: Bold, clear status indicators (✅ Online, ⚠️ Warning, ❌ Offline)
- **Color Coding**: Green (#2ECC71) for healthy, Yellow (#F39C12) for warnings, Red (#E74C3C) for critical
- **Fields Layout**: Use inline fields for bot name/status pairs in 2-column grid
- **Footer**: Include timestamp and "Last checked" information
- **Thumbnail**: Small UptimeRobot logo or bot icon (top-right corner)

### Command Response Embeds
- **Success Messages**: Green left border, checkmark emoji in title
- **Error Messages**: Red left border, X emoji in title, clear error description
- **Info Messages**: Blue (#3498DB) left border, info icon in title
- **Consistency**: All embeds use same font hierarchy - bold titles, regular descriptions

## Interactive Components

### Buttons
- **"verificar saude do meu bot"**: Primary style (blurple), no emoji as requested
- **Action Buttons**: Use descriptive labels without emojis per user preference
- **Layout**: Single row for main actions, keep to 3-4 buttons maximum per message
- **States**: Leverage Discord's native button states (active/disabled)

### Modal Forms (/cadastrar command)
**Field Structure**:
1. **Bot Name**: Short text input (required) - "Nome do seu bot"
2. **Monitor URL**: Short text input (required) - "URL do monitor"
3. **UptimeRobot Monitor ID**: Short text input (required) - "ID do monitor no UptimeRobot"
4. **Notification Channel**: Short text input (optional) - "Canal para notificações (ID)"

**Modal Title**: "Cadastrar Novo Bot"
**Layout**: Vertical stack, clear labels, placeholder text for guidance

## Notification Messages

### Auto-Reset Notifications
- **Embed with alert color** (Yellow #F39C12)
- **Title**: "Monitor Resetado Automaticamente"
- **Fields**: Bot name, Monitor ID, Timestamp, Reason
- **Mention**: Optional ping to configured role/channel

### Health Check Results
- **List format** with emoji indicators
- **Grouped by status**: Online bots first, then warnings, then offline
- **Quick stats**: Total bots, healthy count, issues count in embed description

## Typography & Spacing

**Hierarchy**:
- Embed titles: Discord default bold
- Field names: Discord default bold
- Field values: Regular weight
- Inline code blocks: For IDs, URLs, technical data (``text``)

**Spacing**: Discord native spacing - trust platform defaults for consistent UX

## Command Parameters Design

### /pinger Command
- **Text Parameter**: Optional custom message to include in health check
- **Attachment Parameter**: Accept image/video files
- **Embed Output**: Show custom message in description, attachments in embed image field
- **Button Below**: Health check button remains interactive below custom content

## Content Strategy

- **Concise Responses**: Keep embed descriptions under 200 characters
- **Clear CTAs**: Button labels clearly describe action outcome
- **Error Handling**: Friendly error messages with suggested fixes
- **Confirmation Messages**: Always confirm successful actions with visual feedback

## Consistency Rules

- All success operations use green accent
- All errors use red accent  
- All informational messages use blue accent
- Warnings/cautions use yellow accent
- No custom emojis unless user requests them
- Maintain Portuguese language throughout all bot responses