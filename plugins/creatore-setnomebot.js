const lenguajeIT = {
  smsNam2: () => "⚠️ *𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐮𝐨𝐯𝐨 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭.*",
  smsNam1: () => "✅ *𝐍𝐨𝐦𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨!*",
  smsNamErr: () => "❌ *𝐈𝐦𝐩𝐨𝐬𝐬𝐢𝐛𝐢𝐥𝐞 𝐦𝐨𝐝𝐢𝐟𝐢𝐜𝐚𝐫𝐞 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐛𝐨𝐭.*",
  smsConMenu: () => "🔙 *𝐓𝐨𝐫𝐧𝐚 𝐚𝐥 𝐌𝐞𝐧𝐮*"
}

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, lenguajeIT.smsNam2(), m)

  try {
    await conn.updateProfileName(text)

    await conn.reply(m.chat, lenguajeIT.smsNam1(), m)

  } catch (e) {
    console.error("Errore nel comando setnomebot:", e)
    await conn.reply(m.chat, lenguajeIT.smsNamErr(), m)
  }
}

handler.help = ['setnomebot <nome>']
handler.tags = ['owner']
handler.command = /^(setnomebot)$/i
handler.owner = true
export default handler