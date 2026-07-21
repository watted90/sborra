import { igdl } from "ruhend-scraper"

function isValidNewsletterJid(jid) {
  return typeof jid === 'string' && jid.endsWith('@newsletter')
}

let handler = async (m, { args, conn }) => { 
  if (isValidNewsletterJid(m.chat)) return

  if (!args[0]) {
    return conn.reply(m.chat, '『 🔗 』 *`Inserisci un link di Instagram`*', m)
  }

  try {
    await m.react('🕒')
    let res = await igdl(args[0])
    let data = res.data       
    for (let media of data) {
      await new Promise(resolve => setTimeout(resolve, 1000))           
      await conn.sendFile(m.chat, media.url, 'igdlvarebot.mp4', '> sborra 令 bot', m)
    }
  } catch {
    await m.react('✖️')
    conn.reply(m.chat, `${global.errore}`, m)
  }
}

handler.command = ['igdl']
handler.tags = ['download']
handler.help = ['igdl']
handler.group = true
handler.register = true

export default handler