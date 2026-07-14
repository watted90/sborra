import { createHash } from 'crypto';
import moment from 'moment-timezone';
moment.locale('it');

let Reg = /^\s*([\w\s]+)[.| ]+(\d{1,3})\s*$/i;

let handler = async function (m, { conn, text, usedPrefix, command }) {
    const isOwner = global.owner?.includes(m.sender);
    
    let target = m.sender;
    if (isOwner && (m.mentionedJid?.length || m.quoted)) {
        target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply('『 ⚠️ 』- `Impossibile trovare l\'utente da registrare.`');
    }

    let user = global.db.data.users[target] || (global.db.data.users[target] = {});
    let name2 = await conn.getName(target);

    let perfil = await conn.profilePictureUrl(target, 'image').catch(async _ => {
        const fallback = [
            'https://i.ibb.co/BKHtdBNp/default-avatar-profile-icon-1280x1280.jpg',
        ];
        return fallback[Math.floor(Math.random() * fallback.length)];
    });

    if (user.registered) {
        const timeSinceReg = moment(user.regTime).fromNow();
        return conn.sendMessage(m.chat, {
            text: `『 ❌ 』- *${target === m.sender ? 'Sei' : 'Questo utente è'} già registrato!*\n『 📅 』 Registrazione: ${timeSinceReg}\n\n*Per resettare usa:* _${usedPrefix}unreg_`
        }, { quoted: m });
    }

    if (!Reg.test(text))  {
        return m.reply(`─ׄ─⭒『 \`FORMATO ERRATO\` 』⭒─ׄ─\n\n
『 ✅ 』 \`Formato:\` *${usedPrefix + command} nome anni*
『 📝 』 \`Esempio:\` *${usedPrefix + command} dieh 17*`
        );
    }

    let [_, name, age] = text.match(Reg);
    if (!name) return m.reply('『 ❗ 』 \`\`*Il nome non può essere vuoto.*');
    if (!age) return m.reply('『 ❗ 』 \`L\'età non può essere vuota.\`');
    if (name.length > 32) return m.reply('『 ❗ 』 \`Il nome è troppo lungo (max 32 caratteri).\`');
    if (name.includes('@')) return m.reply('『 ❗ 』 \`Il nome non può contenere "@".\`');

    age = parseInt(age);
    if (age > 69 || age < 10) return m.reply('『 ❗ 』 \`L\'età inserita non è valida (10-69).\`');

    const initialStats = {
        hp: 100,
        level: 1,
        xp: 0,
        euro: 10,
    };

    user.name = name.trim();
    user.age = age;
    user.regTime = +new Date();
    user.registered = true;
    user.euro = (user.euro || 0) + 15;
    user.exp = (user.exp || 0) + 245;
    Object.assign(user, initialStats);

    await global.db.write();

    let sn = createHash('md5').update(target).digest('hex');
    const registrationTime = moment().format('DD/MM/YYYY');

    let regbot = `
ㅤㅤ⋆｡˚『 ╭ \`REGISTRAZIONE\` ╯ 』˚｡⋆\n╭\n│
│ 『 👤 』 \`Nome:\` *${name}*
│ 『 🎂 』 \`Età:\` *${age} anni*
│ 『 📅 』 \`Data:\` *${registrationTime}*
│ 『 🆔 』 \`ID:\` *${sn.slice(0, 8).toUpperCase()}*
│
╟─ׄ─⭒『 \`RICOMPENSE\` 』⭒─ׄ─
│
│ 『 🪙 』 \`Euro:\` *+15*
│ 『 🌟 』 \`Exp:\` *+245*
│ 
╰⭒─ׄ─ׅ─ׄ『  ℹ️  \`INFO\`  』─ׄ─ׅ─ׄ
`;
    await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            mentionedJid: [target]
        }
    }, { quoted: m });

};

handler.help = ['reg'];
handler.tags = ['main'];
handler.command = ['verify', 'registrazione', 'reg', 'register', 'registrare'];

export default handler;