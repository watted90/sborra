let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!m.isGroup) {
        let errorMsg = `ㅤㅤ⋆｡˚『╭ \`ERRORE\` ╯』˚｡⋆\n╭\n`
        errorMsg += `│ 『⚠️』 \`Questo comando funziona solo nei gruppi!\`\n`
        errorMsg += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*\n\n`
        errorMsg += `> sborra ✧ bot`
        return m.reply(errorMsg)
    }

    try {
        const chat = global.db.data.chats[m.chat]
        const groupName = await conn.getName(m.chat)
        if (chat.expired < 1) {
            return m.reply(
`ㅤㅤ⋆｡˚『╭ \`STATO SCADENZA\` ╯』˚｡⋆
╭
│ 『📝』 \`Gruppo:\` *${groupName}*
│ 『⏱️』 \`Stato:\` *Nessuna scadenza impostata*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

> sborra ✧ bot`)
        }

        const now = new Date() * 1
        const remaining = chat.expired - now
        if (remaining <= 0) {
            await m.reply(
`ㅤㅤ⋆｡˚『╭ \`GRUPPO SCADUTO\` ╯』˚｡⋆
╭
│ 『📝』 \`Gruppo:\` *${groupName}*
│ 『⏱️』 \`Stato:\` *Scaduto*
│ 『📤』 \`Azione:\` *Uscita automatica*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

> sborra ✧ bot`)
            await conn.sendMessage(m.chat, { delete: m.key })
            return await conn.groupLeave(m.chat)
        }

        const totalTime = chat.expired - chat.joindate
        const percentage = Math.floor((remaining / totalTime) * 100)
        const barLength = 15
        const filledLength = Math.floor((percentage / 100) * barLength)
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

        let message = 
`ㅤㅤ⋆｡˚『╭ \`STATO SCADENZA\` ╯』˚｡⋆
╭
│ 『📝』 \`Gruppo:\` *${groupName}*
│ 『⏳』 \`Tempo rimasto:\`\n  ${msToDate(remaining)}
│ 『📊』 \`Progresso:\` *${percentage}%*
│ 『⬛』 \`Barra:\` [${bar}]`
        
        if (percentage <= 25) {
            message += `
│ 『⚠️』 \`Attenzione:\` *Scadenza vicina!*
│ 『💡』 \`Suggerimento:\` *Scrivi al creatore per aumentare la data.*
│             *Usa il comando .creatore per avere info*`
        }

        message += `\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*\n\n> sborra ✧ bot`

        return conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {}
        })

    } catch (e) {
        console.error(e)
        return m.reply(`${global.errore}`)
    }
}

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Giorni*\n ', h, ' *Ore*\n ', m, ' *Minuti*\n ', s, ' *Secondi* '].map(v => v.toString().padStart(2, 0)).join('')
}

handler.help = ['scadenza']
handler.tags = ['gruppo']
handler.command = /^(checkexpired|cexpired|scadenza)$/i
handler.group = true
handler.admin = true

export default handler