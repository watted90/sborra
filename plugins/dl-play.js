//Codice di fun_play.js


import yts from 'yt-search'
import axios from 'axios'

const API_BASE = 'https://chatunity-api.it'
const API_KEY = '3d986821d0cc62359f0fe5acac95898b77513ca1db779102cb00c1b23875a54a'

function cleanFileName(name = 'file') {
  return name.replace(/[\\/:*?<>|]/g, '').trim().slice(0, 80) || 'file'
}

function isYouTubeUrl(text) {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)
}

function normalizeYtUrl(text) {
  try {
    if (!isYouTubeUrl(text)) return null
    const u = new URL(text)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace('/', '').trim()
      return id ? `https://www.youtube.com/watch?v=${id}` : text
    }
    return text
  } catch {
    return text
  }
}

async function resolveVideo(text) {
  if (isYouTubeUrl(text)) {
    const url = normalizeYtUrl(text)
    const search = await yts(url)
    const vid = search?.videos?.[0] || null
    return { vid, url: vid?.url || url }
  }

  const search = await yts(text)
  const vid = search?.videos?.[0] || null
  return { vid, url: vid?.url || null }
}

async function downloadFromApi(query, format = 'mp3') {
  const url = `${API_BASE}/download?query=${encodeURIComponent(query)}&format=${format}`

  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 300000,
    maxRedirects: 5,
    headers: {
      Authorization: `Bearer ${API_KEY}`
    },
    validateStatus: s => s >= 200 && s < 300
  })

  const contentType = res.headers['content-type'] || ''
  const data = Buffer.from(res.data)

  if (!data || !data.length) {
    throw new Error('𝐋\' 𝐀𝐏𝐈 𝐇𝐀 𝐌𝐀𝐍𝐃𝐀𝐓𝐎 𝐔𝐍 𝐅𝐈𝐋𝐄 𝐕𝐔𝐎𝐓𝐎')
  }

  console.log('[play] download ok', {
    format,
    bytes: data.length,
    contentType
  })

  return data
}

async function handler(m, { conn, args, command, usedPrefix }) {
  const text = args.join(' ').trim()
  const prefix = usedPrefix || global.prefissoComandi || global.prefix || '.'
  const isAudioCmd = command === 'playaud'
  const isVideoCmd = command === 'playvid'

  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: `𝐔𝐓𝐈𝐋𝐈𝐙𝐙𝐀 𝐐𝐔𝐄𝐒𝐓𝐎 𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐂𝐎𝐍:\n${prefix}${command} 𝐂𝐀𝐍𝐙𝐎𝐍𝐄 + 𝐀𝐑𝐓𝐈𝐒𝐓𝐀` },
      { quoted: m }
    )
  }

  try {
    let vid = null
    let url = text

    const resolved = await resolveVideo(text)
    vid = resolved.vid
    url = resolved.url

    if (!url) {
      return conn.sendMessage(
        m.chat,
        { text: '⚠️ 𝐍𝐎𝐍 𝐇𝐎 𝐓𝐑𝐎𝐕𝐀𝐓𝐎 𝐍𝐔𝐋𝐋𝐀' },
        { quoted: m }
      )
    }

    if (command === 'play') {
      const title = vid?.title || text
      const thumb = vid?.thumbnail || 'https://picsum.photos/seed/chatunityplay/720/405'
      const views = vid?.views ? Number(vid.views).toLocaleString('it-IT') : 'N/D'
      const duration = vid?.timestamp || 'N/D'

      return await conn.sendMessage(
        m.chat,
        {
          image: { url: thumb },
          caption: `
╔═══⟬✧ 𝐏𝐋𝐀𝐘 ✧⟭═══✺
║ 📌 𝐓𝐈𝐓𝐎𝐋𝐎: ${title}
║ ⏱️ 𝐃𝐔𝐑𝐀𝐓𝐀: ${duration}
║ 👀 𝐕𝐈𝐄𝐖𝐒: ${views}
╚══════════════✺

> 𝐒𝐂𝐄𝐆𝐋𝐈 𝐔𝐍 𝐅𝐎𝐑𝐌𝐀𝐓𝐎 ☟
`.trim(),
          buttons: [
            {
              buttonId: `${prefix}playaud ${url}`,
              buttonText: { displayText: '𝐀𝐔𝐃𝐈𝐎' },
              type: 1
            },
            {
              buttonId: `${prefix}playvid ${url}`,
              buttonText: { displayText: '𝐕𝐈𝐃𝐄𝐎' },
              type: 1
            }
          ],
          headerType: 4
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, {
      react: { text: '⚡', key: m.key }
    })

    await conn.sendMessage(
      m.chat,
      {
        text: `𝐒𝐓𝐎 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐍𝐃𝐎 𝐈𝐋 ${isAudioCmd ? '𝐅𝐈𝐋𝐄 𝐀𝐔𝐃𝐈𝐎' : '𝐅𝐈𝐋𝐄 𝐕𝐈𝐃𝐄𝐎'}...`
      },
      { quoted: m }
    )

    const mediaBuffer = await downloadFromApi(url, isAudioCmd ? 'mp3' : 'mp4')

    if (isAudioCmd) {
      await conn.sendMessage(
        m.chat,
        {
          audio: mediaBuffer,
          mimetype: 'audio/mpeg',
          fileName: `${cleanFileName(vid?.title || 'audio')}.mp3`,
          ptt: false
        },
        { quoted: m }
      )
    } else if (isVideoCmd) {
      await conn.sendMessage(
        m.chat,
        {
          video: mediaBuffer,
          mimetype: 'video/mp4',
          caption: `✅ 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐓𝐎: ${vid?.title || '𝐕𝐈𝐃𝐄𝐎'}`
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })
  } catch (e) {
    console.error('[play error]', e?.response?.data || e)

    let msg = e?.message || 'server non raggiungibile.'
    if (e?.response?.status === 401) msg = 'Chiave API non valida.'
    else if (e?.response?.status === 413) msg = 'File troppo grande.'
    else if (e?.response?.status === 502) msg = 'API temporaneamente non raggiungibile (502).'
    else if (e?.code === 'ECONNABORTED') msg = 'Timeout API: il download ha impiegato troppo tempo.'

    await conn.sendMessage(
      m.chat,
      { text: `𝐄𝐑𝐑𝐎𝐑𝐄: ${msg}` },
      { quoted: m }
    )
  }
}

handler.help = ['play <nome>', 'playaud <nome/url>', 'playvid <nome/url>']
handler.tags = ['downloader']
handler.command = /^(play|playaud|playvid)$/i

export default handler