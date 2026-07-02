import { downloadContentFromMessage } from '@realvare/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted && !m.message?.imageMessage) {
        return m.reply(`✨ *Rileva Immagine AI*\n\nQuota un'immagine o invAIla con caption:\n*${usedPrefix + command}*`)
    }

    conn.sendMessage(m.chat, { text: '🔍 Analizzando l\'immagine per tracce di AI... ⏳' }, { quoted: m })

    try {
        let medAIBuffer, mimeType = 'image/jpeg', fileName = 'image.jpg'

        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
        const msg = quoted ? (quoted.imageMessage || quoted.stickerMessage) :
                            (m.message?.imageMessage || m.message?.stickerMessage)

        if (!msg) return m.reply('❌ Nessuna immagine trovata.')
        const stream = await downloadContentFromMessage(msg, msg.imageMessage ? 'image' : 'sticker')
        medAIBuffer = Buffer.from([])
        for await (const chunk of stream) {
            medAIBuffer = Buffer.concat([medAIBuffer, chunk])
        }
        if (msg.mimetype) mimeType = msg.mimetype
        const SIGHTENGINE_USER = global.APIKeys.sightengine_user
        const SIGHTENGINE_SECRET = global.APIKeys.sightengine_secret

        const apiUrl = `https://api.sightengine.com/1.0/check.json`

        const formData = new FormData()
        formData.append('media', new Blob([medAIBuffer], { type: mimeType }), fileName)
        formData.append('models', 'genai')
        formData.append('api_user', SIGHTENGINE_USER)
        formData.append('api_secret', SIGHTENGINE_SECRET)

        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()
        console.log('Risposta SightEngine genai:', result)

        if (result.status !== 'success') {
            return m.reply('❌ Errore API SightEngine: ' + (result.error?.message || 'Sconosciuto'))
        }

        const aiScore = result.type?.ai_generated || 0

        let verdict, emoji
        if (aiScore >= 0.85) {
            verdict = 'Molto probabile generata da AI'
            emoji = '🤖'
        } else if (aiScore >= 0.5) {
            verdict = 'Probabile generata da AI'
            emoji = '🧐'
        } else if (aiScore >= 0.2) {
            verdict = 'Possibili tracce di AI'
            emoji = '🤔'
        } else {
            verdict = 'Probabile immagine reale/autentica'
            emoji = '📸'
        }

        const caption = `
ㅤㅤ⋆｡˚『 ╭ \`RILEVA AI\` ╯ 』˚｡⋆\n╭  
│
│ \`Risultato:\` *${verdict}*
│ \`Probabilità:\` *${(aiScore * 100).toFixed(1)}%*
│
╰ㅤ⋆｡˚『 𝐯𝐚𝐫𝐞 ✧ 𝐛𝐨𝐭 』˚｡⋆
        `.trim()
        await conn.sendMessage(m.chat, { image: medAIBuffer, caption }, { quoted: m })
    } catch (e) {
        console.error('Errore comando .isai:', e)
        m.reply('❌ Errore durante l\'analisi: ' + e.message)
    }
}

handler.help = ['isai']
handler.tags = ['strumenti']
handler.command = /^(isai|checkai|isaiimage)$/i

export default handler