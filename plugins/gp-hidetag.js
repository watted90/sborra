let handler = async (m, { conn, text }) => {

  if (!m.isGroup) return

  let groupId = m.chat
  let groupMetadata = await conn.groupMetadata(groupId)
  let participants = groupMetadata.participants || []

  let users = participants.map(u => u.id)

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q)?.mimetype || ''
  let isMedia = /image|video|sticker|audio/.test(mime)

  let captionText = text ? text.trim() : ''
  let quotedText = q.text || q.caption || ''

  if (!isMedia && m.quoted) captionText = quotedText

  try {

    if (isMedia) {
      let media = await q.download()
      if (!media) throw 'Errore download media'

      let payload = {}

      if (q.mtype === 'imageMessage') {
        payload = { image: media, caption: captionText || quotedText || '', mentions: users }
      } else if (q.mtype === 'videoMessage') {
        payload = { video: media, caption: captionText || quotedText || '', mentions: users }
      } else if (q.mtype === 'audioMessage') {
        payload = { audio: media, mimetype: 'audio/mp4', mentions: users }
      } else if (q.mtype === 'stickerMessage') {
        payload = { sticker: media, mentions: users }
      }

      await conn.sendMessage(groupId, payload, { quoted: m })

    } else {
      await conn.sendMessage(groupId, {
        text: captionText || quotedText || '‎',
        mentions: users
      }, { quoted: m })
    })
    
  } catch (e) {
    await conn.sendMessage(groupId, { text: '❌ Errore nel tagging.' }, { quoted: m })
  }
}

handler.command = /^(hidetag|tag)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler