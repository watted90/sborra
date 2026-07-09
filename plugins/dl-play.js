import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import yts from 'yt-search'

function clean(name = 'file') {
  return name.replace(/[\\/:*?<>|]/g, '').trim().slice(0, 80) || 'file'
}

async function searchVideo(query) {
  const res = await yts(query)
  const vid = res.videos[0]
  if (!vid) return null

  return {
    title: vid.title,
    url: vid.url,
    thumbnail: vid.thumbnail,
    views: vid.views,
    duration: vid.duration.seconds
  }
}

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err)
      resolve(stdout)
    })
  })
}

async function downloadAudio(url) {
  const tmp = path.join(process.cwd(), `tmp_${Date.now()}.mp3`)
  await run(
    `yt-dlp --cookies-from-browser chrome --js-runtimes node:/usr/bin/node -f ba -o "${tmp}" "${url}"`
  )
  const buffer = fs.readFileSync(tmp)
  fs.unlinkSync(tmp)
  return buffer
}

async function downloadVideo(url) {
  const tmp = path.join(process.cwd(), `tmp_${Date.now()}.mp4`)
  await run(
    `yt-dlp --cookies-from-browser chrome --js-runtimes node:/usr/bin/node -f "best[ext=mp4]" -o "${tmp}" "${url}"`
  )
  const buffer = fs.readFileSync(tmp)
  fs.unlinkSync(tmp)
  return buffer
}

async function handler(m, { conn, args, command, usedPrefix }) {
  const text = args.join(' ').trim()
  const prefix = usedPrefix || '.'

  if (!text) {
    return conn.sendMessage(
      m.chat,
      { text: `𝐔𝐒𝐀:\n${prefix}${command} 𝐓𝐈𝐓𝐎𝐋𝐎` },
      { quoted: m }
    )
  }

  try {
    const info = await searchVideo(text)
    if (!info) {
      return conn.sendMessage(m.chat, { text: '⚠️ 𝐍𝐎𝐍 𝐇𝐎 𝐓𝐑𝐎𝐕𝐀𝐓𝐎 𝐍𝐔𝐋𝐋𝐀' }, { quoted: m })
    }

    if (command === 'play') {
      const views = info.views ? Number(info.views).toLocaleString('it-IT') : 'N/D'
      const duration = info.duration ? `${info.duration}s` : 'N/D'

      return conn.sendMessage(
        m.chat,
        {
          image: { url: info.thumbnail },
          caption: `
╔═══⟬✧ 𝐏𝐋𝐀𝐘 ✧⟭═══✺
║ 📌 𝐓𝐈𝐓𝐎𝐋𝐎: ${info.title}
║ ⏱️ 𝐃𝐔𝐑𝐀𝐓𝐀: ${duration}
║ 👀 𝐕𝐈𝐄𝐖𝐒: ${views}
╚══════════════✺

> 𝐒𝐂𝐄𝐆𝐋𝐈 𝐔𝐍 𝐅𝐎𝐑𝐌𝐀𝐓𝐎 ☟
`.trim(),
          buttons: [
            {
              buttonId: `${prefix}playaud ${info.url}`,
              buttonText: { displayText: '🎧 𝐀𝐔𝐃𝐈𝐎' },
              type: 1
            },
            {
              buttonId: `${prefix}playvid ${info.url}`,
              buttonText: { displayText: '🎬 𝐕𝐈𝐃𝐄𝐎' },
              type: 1
            }
          ],
          headerType: 4
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } })

    if (command === 'playaud') {
      await conn.sendMessage(m.chat, { text: '🎧 𝐒𝐓𝐎 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐍𝐃𝐎 𝐋\' 𝐀𝐔𝐃𝐈𝐎...' }, { quoted: m })
      const buffer = await downloadAudio(info.url)

      return conn.sendMessage(
        m.chat,
        {
          audio: buffer,
          mimetype: 'audio/mpeg',
          fileName: `${clean(info.title)}.mp3`
        },
        { quoted: m }
      )
    }

    if (command === 'playvid') {
      await conn.sendMessage(m.chat, { text: '🎬 𝐒𝐓𝐎 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐍𝐃𝐎 𝐈𝐋 𝐕𝐈𝐃𝐄𝐎...' }, { quoted: m })
      const buffer = await downloadVideo(info.url)

      return conn.sendMessage(
        m.chat,
        {
          video: buffer,
          mimetype: 'video/mp4',
          caption: `✅ 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐓𝐎: ${info.title}`
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    return conn.sendMessage(
      m.chat,
      { text: `𝐄𝐑𝐑𝐎𝐑𝐄: ${e}` },
      { quoted: m }
    )
  }
}

handler.help = ['play', 'playaud', 'playvid']
handler.tags = ['downloader']
handler.command = /^(play|playaud|playvid)$/i

export default handler