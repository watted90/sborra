import { cpus as _cpus} from 'os'
import speed from 'performance-now'

let handler = async (m, { conn, usedPrefix }) => {

  if (!global.db.data.settings) global.db.data.settings = {}
  const botJid = conn.decodeJid(conn.user.jid);
  if (!global.db.data.settings[botJid]) global.db.data.settings[botJid] = {}
  
  let bot = global.db.data.settings[botJid]
  let chat = global.db.data.chats[m.chat]
 
  const status = (val) => {
    val = Boolean(val)
    return val ? '『 ✅ 』' : '『 ❌ 』'
  }
  const formatRow = (nome, val, emoji) => {
    return `│ ${status(val)}- *${nome.trim()}*`
  }

  const funzioni = [
    ['blocco privato', Boolean(bot.antiprivato)],
    ['limite comandi', Boolean(bot.antispambot)],
    ['autolettura', Boolean(bot.autoread)],
    ['subbots', Boolean(bot.jadibotmd)]
  ] // da aggiungere tutte le nuove funzioni (o usare un sistema automatizzato idk)
  const statoFunzioni = funzioni
    .map(([nome, val]) => formatRow(nome, val))
    .join('\n')
  let _uptime = process.uptime() * 1000
  let uptime = formatUptime(_uptime)
  let totalreg = Object.keys(global.db.data.users || {}).length
  let totalStats = Object.values(global.db.data.stats || {}).reduce((total, stat) => total + (stat?.total || 0), 0)
  let totalf = Object.values(global.plugins || {}).filter((v) => v?.help && v?.tags).length

  let timestamp = speed()
  let latensi = speed() - timestamp

  let plugins = Object.values(global.plugins || {})
  let attivi = plugins.filter(p => !p?.disabled).length

  let pp
  try {
    pp = await conn.profilePictureUrl(conn.user.jid, 'image')
  } catch {
    pp = './media/menu/menu.jpg'
  }
  let varebot = `
    ⋆｡˚『 🤖 ╭ \`INFO ✧ BOT\` ╯ 』˚｡⋆
╭
│ 『 👑 』 \`Creatore:\` *@${owner[0][0].split('@s.whatsapp.net')[0]}*
│ 『 🍭 』 \`Prefisso:\` *[ ${usedPrefix} ]*
│ 『 📦 』 \`Plugin Caricati:\` *${totalf}*
│ 『 ⚡』 \`Plugin Attivi:\` *${attivi}*
│ 『 ✨ 』 \`Velocità:\` *${latensi.toFixed(4)} ms*
│ 『 🕐 』 \`Uptime:\` *${uptime}*
│ 『 🌙 』 \`Modalità:\` *${bot.public ? 'Pubblica' : 'Privata'}*
│ 『 💎 』 \`Comandi Eseguiti:\` *${toNum(totalStats)}*
│ 『 👥 』 \`Utenti Registrati:\` *${toNum(totalreg)}*
│
│『 ⚙️ 』  *\`Stato Funzioni:\`*
${statoFunzioni}
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`

  await conn.reply(m.chat, varebot, m, {
    mentions: [owner[0][0] + '@s.whatsapp.net'],
    contextInfo: {
      ...global.fake.contextInfo
    }
  })
}

handler.help = ['infobot']
handler.tags = ['info']
handler.command = ['infobot']

export default handler

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number <= -1000 && number > -1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number <= -1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return number.toString()
  }
}

function formatUptime(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  let days = Math.floor(ms / (1000 * 60 * 60 * 24))

  let uptime = []
  if (days > 0) uptime.push(`${days} giorni`)
  if (hours > 0) uptime.push(`${hours} ore`)
  if (minutes > 0) uptime.push(`${minutes} minuti`)

  return uptime.join(', ')
}