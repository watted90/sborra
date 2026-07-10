import fs from 'fs'

let afkFile = './afk.json'
let afkUsers = fs.existsSync(afkFile) ? JSON.parse(fs.readFileSync(afkFile)) : []

let saveAFK = () => fs.writeFileSync(afkFile, JSON.stringify(afkUsers))

let handler = async (m, { conn, text, command }) => {

  if (!m.isGroup) return

  let groupId = m.chat
  let groupMetadata = await conn.groupMetadata(groupId)
  let participants = groupMetadata.participants || []

  let allUsers = participants.map(u => u.id)
  let activeUsers = allUsers.filter(u => !afkUsers.includes(u))
  let excludedCount = allUsers.length - activeUsers.length

  if (command === 'afk') {
    if (afkUsers.includes(m.sender)) {
      afkUsers = afkUsers.filter(u => u !== m.sender)
      saveAFK()
      return conn.sendMessage(groupId, { text: `🟢 AFK disattivato, Ora potrai ricevere i tag dal bot.` }, { quoted: m })
    } else {
      afkUsers.push(m.sender)
      saveAFK()
      return conn.sendMessage(groupId, { text: `💤 AFK attivato, Adesso non riceverai tag dal bot.` }, { quoted: m })
    }
  }

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
        payload = { image: media, caption: captionText || quotedText || '', mentions: activeUsers }
      } else if (q.mtype === 'videoMessage') {
        payload = { video: media, caption: captionText || quotedText || '', mentions: activeUsers }
      } else if (q.mtype === 'audioMessage') {
        payload = { audio: media, mimetype: 'audio/mp4', mentions: activeUsers }
      } else if (q.mtype === 'stickerMessage') {
        payload = { sticker: media, mentions: activeUsers }
      }

      await conn.sendMessage(groupId, payload, { quoted: m })

    } else {
      await conn.sendMessage(groupId, {
        text: captionText || quotedText || '‎',
        mentions: activeUsers
      }, { quoted: m })
    }

    await conn.sendMessage(groupId, {
      text: `💤${excludedCount} utenti non hanno ricevuto il tag.`
    })

  } catch (e) {
    await conn.sendMessage(groupId, { text: '❌ Errore nel tagging.' }, { quoted: m })
  }
}

handler.command = /^(hidetag|tag|afk)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler