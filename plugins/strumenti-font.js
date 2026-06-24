let handler = async (m, { conn, command, text, usedPrefix }) => {
    let example = m.name || "samakavare";
    const totalFonts = 21;
    if ((command === 'font' && !text) || !text) {
        let styles = [];
        for (let i = 1; i <= totalFonts; i++) {
            styles.push(`*Font ${i}:* ${styleText(example, i)}`);
        }

        let buttons = [
            { buttonId: `${usedPrefix}fontrandom ${example}`, buttonText: { displayText: '🎲 Font Random' }, type: 1 },
            { buttonId: `${usedPrefix}font1 ${example}`, buttonText: { displayText: '📝 Font 1' }, type: 1 },
            { buttonId: `${usedPrefix}font5 ${example}`, buttonText: { displayText: '✨ Font 5' }, type: 1 }
        ];

        let buttonMessage = {
            text: `ㅤㅤ⋆｡˚『 ╭ \`FONTS\` ╯ 』˚｡⋆\n╭\n│
│ 『 📝 』 \`Esempio:\` 
│ ${usedPrefix}font1 ${example}
│ ${usedPrefix}fontrandom ${example}
│
│ 『 🎨 』 \`Stili disponibili:\`
│ ${styles.join('\n│ ')}
│
│ 『 🎲 』 \`Comandi:\`
│ ${usedPrefix}font[1-${totalFonts}] testo
│ ${usedPrefix}fontrandom testo
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
            footer: '✧ 𝚜𝚋𝚘𝚛𝚛𝚊 𝚋𝚘𝚝 ✧',
            buttons: buttons,
            headerType: 1
        };
        
        return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    }

    let fontNumber;
    if (command === 'fontrandom' || (command === 'font' && text.toLowerCase() === 'random')) {
        fontNumber = Math.floor(Math.random() * totalFonts) + 1;
        if (text.toLowerCase() === 'random') text = example;
    } else {
        const cmdNum = command.replace(/[^0-9]/g, '');
        fontNumber = parseInt(cmdNum);
    }

    if (isNaN(fontNumber) || fontNumber < 1 || fontNumber > totalFonts) {
        return m.reply(`Per usare il comando digita ${usedPrefix}font <numero> <testo> oppure ${usedPrefix}font per la lista.`);
    }

    let result = styleText(text, fontNumber);
    
    let moreButtons = [
        { buttonId: `x`, buttonText: { displayText: `${result}` }, type: 1 },
        { buttonId: `${usedPrefix}fontrandom ${text}`, buttonText: { displayText: '🎲 Altro Random' }, type: 1 },
        { buttonId: `${usedPrefix}font${fontNumber === totalFonts ? 1 : fontNumber + 1} ${text}`, buttonText: { displayText: `📝 Font ${fontNumber === totalFonts ? 1 : fontNumber + 1}` }, type: 1 }
    ];
    
    let resultMessage = {
        text: `『 🎨 \`Font ${fontNumber}\` 』\n\n*${result}*`,
        footer: '✧ 𝚜𝚋𝚘𝚛𝚛𝚊 𝚋𝚘𝚝 ✧',
        buttons: moreButtons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, resultMessage, { quoted: m });
};

function styleText(text, style) {
    const styles = {
        1: { 'a': 'ᥲ', 'b': 'ᑲ', 'c': 'ᥴ', 'd': 'ძ', 'e': 'ᥱ', 'f': '𝖿', 'g': 'g', 'h': 'һ', 'i': 'і', 'j': 'ȷ', 'k': 'k', 'l': 'ᥣ', 'm': 'm', 'n': 'ᥒ', 'o': '᥆', 'p': '⍴', 'q': '𝗊', 'r': 'r', 's': 's', 't': '𝗍', 'u': 'ᥙ', 'v': '᥎', 'w': 'ᥕ', 'x': '᥊', 'y': 'ᥡ', 'z': 'z' },
        2: { 'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳' },
        3: { 'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃' },
        4: { 'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟' },
        5: { 'a': 'ɑׁׅ', 'b': '֮ϐׁ', 'c': 'ᝯׁ֒', 'd': 'ժׁׅ݊', 'e': 'ꫀׁׅܻ݊', 'f': 'ܻ⨍', 'g': 'ᧁׁ', 'h': 'hׁׅ֮', 'i': 'ꪱׁׁׁׅׅׅ', 'j': 'յׁׅ', 'k': 'ƙׁׅ', 'l': 'ᥣׁׅ֪', 'm': 'ꩇׁׅ֪݊', 'n': '݊ꪀ', 'o': 'ᨵׁׅׅ', 'p': '℘', 'q': 'qׁׅ', 'r': 'ꭈׁׅ', 's': 'ׅ꯱', 't': 'tׁׅ', 'u': 'υׁׅ', 'v': 'ׁׅ᥎ׁׅ', 'w': 'ᨰׁׅ', 'x': '᥊ׁׅ', 'y': 'ᨮׁׅ֮', 'z': 'zׁׅ֬' },
        6: { 'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫' },
        7: { 'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿' },
        8: { 'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉' },
        9: { 'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗', 'i': '🅘', 'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩' },
        10: { 'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ' },
        11: { 'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻' },
        12: { 'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯' },
        13: { 'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣' },
        14: { 'a': 'á', 'b': 'b', 'c': 'ç', 'd': 'd', 'e': 'é', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'í', 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'ñ', 'o': 'ó', 'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'ú', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'ý', 'z': 'z' },
        15: { 'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н', 'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ', 'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'у', 'z': 'z' },
        16: { 'a': 'Ä', 'b': 'ß', 'c': 'Ç', 'd': 'Ð', 'e': 'È', 'f': 'ƒ', 'g': 'G', 'h': 'H', 'i': 'Ì', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'ñ', 'o': 'Ö', 'p': 'þ', 'q': 'Q', 'r': '®', 's': '§', 't': '†', 'u': 'Ü', 'v': 'V', 'w': 'W', 'x': 'X', 'y': '¥', 'z': 'Z' },
        17: { 'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ' },
        18: { 'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷', 'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿', 'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇', 'y': '🆈', 'z': '🆉' },
        19: { 'a': 'ᗩ', 'b': 'ᗷ', 'c': 'ᑕ', 'd': 'ᗪ', 'e': 'E', 'f': 'ᖴ', 'g': 'G', 'h': 'ᕼ', 'i': 'I', 'j': 'ᒍ', 'k': 'K', 'l': 'ᒪ', 'm': 'ᗰ', 'n': 'ᑎ', 'o': 'O', 'p': 'ᑭ', 'q': 'ᑫ', 'r': 'ᖇ', 's': 'ᔕ', 't': 'T', 'u': 'ᑌ', 'v': 'ᐯ', 'w': 'ᗯ', 'x': '᙭', 'y': 'Y', 'z': 'ᘔ' },
        20: { 'a': 'ค', 'b': '๒', 'c': 'ς', 'd': '๔', 'e': 'є', 'f': 'Ŧ', 'g': 'ﻮ', 'h': 'ђ', 'i': 'เ', 'j': 'ן', 'k': 'к', 'l': 'ɭ', 'm': '๓', 'n': 'ภ', 'o': '๏', 'p': 'ק', 'q': 'ợ', 'r': 'г', 's': 'ร', 't': 'Շ', 'u': 'ย', 'v': 'ש', 'w': 'ฬ', 'x': 'א', 'y': 'ץ', 'z': 'չ' },
        21: { 'a': 'Λ', 'b': 'B', 'c': 'ᄃ', 'd': 'D', 'e': 'Σ', 'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'Ө', 'p': 'P', 'q': 'Q', 'r': 'Я', 's': 'S', 't': 'T', 'u': 'Ц', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z' }
    };

    return text.split('').map(char => {
        const lower = char.toLowerCase();
        if (styles[style] && styles[style][lower]) {
            return styles[style][lower];
        }
        return char;
    }).join('');
}

handler.help = ['font [1-21] <testo>', 'fontrandom <testo>'];
handler.tags = ['strumenti'];
handler.command = ['font', /^(font)(1[0-9]|2[0-1]|[1-9]|random)$/i];

export default handler;