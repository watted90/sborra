import fs from 'fs'

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

const defaultMenu = {
  before: `╭⭒─ׄ─⊱ *𝐌𝐄𝐍𝐔 - 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃* ⊰
✦ 👤 *User:* %name
✧ 🪐 *Tempo Attivo:* %uptime
✦ 💫 *Utenti:* %totalreg 
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒\n`.trimStart(),
  header: '      ⋆｡˚『 \`𝐌𝐄𝐍𝐔𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃\` 』˚｡⋆\n╭',
  body: '*│ ➤* 『⬇️』 %cmd',
  footer: '*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*\n',
  after: `> ⋆｡°✩ 𝚜𝚋𝚘𝚛𝚛𝚊 𝚋𝚘𝚝 ✩°｡⋆`,
}
const handler = async (m, { conn, usedPrefix: _p }) => {
  const tags = { 'download': 'MENUDOWNLOAD' }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)
    const name = await conn.getName(m.sender)
    const uptime = clockString(process.uptime() * 1000)
    const totalreg = Object.keys(global.db.data.users).length
    
    const help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled && plugin.tags && plugin.tags.includes('download'))
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        prefix: 'customPrefix' in plugin
      }))

    let text = [
      defaultMenu.before,
      defaultMenu.header,
      help.map(menu => 
        menu.help.map(cmd => 
          defaultMenu.body.replace(/%cmd/g, menu.prefix ? cmd : _p + cmd)
        ).join('\n')
      ).join('\n'),
      defaultMenu.footer,
      defaultMenu.after
    ].join('\n')
    
    text = text.replace(/%name/g, name)
      .replace(/%uptime/g, uptime)
      .replace(/%totalreg/g, totalreg) 

 conn.sendMessage(m.chat, {
    video: fs.readFileSync('./media/menu/menu8.mp4'),
    caption: text.trim(),
    gifPlayback: true,
    ...fake,
    contextInfo: {
        ...fake.contextInfo,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
            ...fake.contextInfo.forwardedNewsletterMessageInfo,
            newsletterName: "ᰔᩚ . ˚ Menu Download ☆˒˒"
        }
    }
}, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, global.fake.error, m)
    throw e
  }
}
handler.help = ['menudl']
handler.tags = ['menu']
handler.command = ['menudl', 'menudownload']

export default handler