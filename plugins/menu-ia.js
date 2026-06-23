import { xpRange } from '../lib/levelling.js'

const emojicategoria = {
  iatesto: '📝',
  iaaudio: '🎧',
  iaimmagini: '🖼️'
}

let tags = {
  'iatesto': '╭ *`𝐈𝐀 𝐓𝐄𝐒𝐓𝐎`* ╯',
  'iaaudio': '╭ *`𝐈𝐀 𝐀𝐔𝐃𝐈𝐎`* ╯',
  'iaimmagini': '╭ *`𝐈𝐀 𝐈𝐌𝐌𝐀𝐆𝐈𝐍𝐈`* ╯'
}

const mediaFile = './media/menu/varebot.mp4'

const defaultMenu = {
  before: `╭⭒─ׄ─⊱ *𝐌𝐄𝐍𝐔 - IA* ⊰
✦ 👤 *User:* %name
✧ 🪐 *Tempo Attivo:* %uptime
✦ 💫 *Utenti:* %totalreg 
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒\n
`.trimStart(),
  header: '      ⋆｡˚『 %category 』˚｡⋆\n╭',
  body: '*│ ➤* 『%emoji』 %cmd',
  footer: '*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*\n',
  after: `> ⋆｡°✩ 𝚜𝚋𝚘𝚛𝚛𝚊 𝚋𝚘𝚝 ✩°｡⋆`,
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    await conn.sendPresenceUpdate('composing', m.chat)
    let { level, exp, role } = global.db.data.users[m.sender] || {}
    let { min, xp, max } = xpRange(level || 0, global.multiplier || 1)
    let name = await conn.getName(m.sender) || 'Utente'
    let d = new Date()
    let locale = 'it'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  let uptime = clockString(process.uptime() * 1000)
    let totalreg = Object.keys(global.db.data.users).length

    // Prendo i plugin IA divisi per tag
    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled && plugin.tags)
      .filter(plugin => ['iatesto', 'iaaudio', 'iaimmagini'].some(t => plugin.tags.includes(t)))
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin
      }))

    let menuTags = Object.keys(tags)
    let text = [
      defaultMenu.before,
      ...menuTags.map(tag => {
        let header = defaultMenu.header.replace(/%category/g, tags[tag])
        let cmds = help
          .filter(menu => menu.tags.includes(tag) && menu.help)
          .map(menu =>
            menu.help.map(cmd =>
              defaultMenu.body
                .replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
                .replace(/%emoji/g, emojicategoria[tag] || '❔')
                .trim()
            ).join('\n')
          ).join('\n')
        return `${header}\n${cmds}\n${defaultMenu.footer}`
      }),
      defaultMenu.after
    ].join('\n')
    text = text.replace(/%name/g, name)
      .replace(/%level/g, level || 0)
      .replace(/%exp/g, exp || 0)
      .replace(/%role/g, role || 'N/A')
      .replace(/%week/g, week)
      .replace(/%date/g, date)
      .replace(/%time/g, time)
      .replace(/%uptime/g, uptime)
      .replace(/%totalreg/g, totalreg)

    await conn.sendMessage(m.chat, {
      video: { url: mediaFile },
      caption: text.trim(),
      gifPlayback: true,
      ...fake,
      contextInfo: {
        ...fake.contextInfo,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          ...fake.contextInfo.forwardedNewsletterMessageInfo,
          newsletterName: "⋆｡°✩ Menu IA ✩°｡⋆"
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Si è verificato un errore nel menu IA.', m)
    throw e
  }
}

handler.help = ['menuia']
handler.tags = ['menu']
handler.command = ['menuia', 'menuai']

export default handler

function clockString(ms) {
  if (isNaN(ms)) return '--:--:--'
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}