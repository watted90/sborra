import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn, participants, args }) => {
  const messaggio = args.join` `;
  const more = String.fromCharCode(8206)
  const readMore = more.repeat(4001)
  const info = messaggio ? `»『 📢 』 \`MESSAGGIO:\` *${messaggio}*` : '';
  
  let messaggi = `*─ׄ─ׅ─ׄ『 .𖥔 ݁ ˖🌍── .✦ 』─ׄ─ׅ─ׄ*\n\n${info ? info + '\n' : ''}\n╭  ┄ 𝅄  ۪꒰ *\`varebot\`* ꒱  ۟   𝅄 ┄\n${readMore}`;
  const aintthistooobvious = {
    '1': '🇺🇸', '1204': '🇨🇦', '1242': '🇧🇸', '1246': '🇧🇧', '1264': '🇦🇮', '1268': '🇦🇬', 
    '1284': '🇻🇬', '1340': '🇻🇮', '1345': '🇰🇾', '1441': '🇧🇲', '1473': '🇬🇩', '1649': '🇹🇨', 
    '1664': '🇲🇸', '1670': '🇲🇵', '1671': '🇬🇺', '1684': '🇦🇸', '1721': '🇸🇽', '1758': '🇱🇨', 
    '1767': '🇩🇲', '1784': '🇻🇨', '1787': '🇵🇷', '1809': '🇩🇴', '1829': '🇩🇴', '1849': '🇩🇴', 
    '1868': '🇹🇹', '1869': '🇰🇳', '1876': '🇯🇲', 
    '20': '🇪🇬', '211': '🇸🇸', '212': '🇲🇦', '213': '🇩🇿', '216': '🇹🇳', '218': '🇱🇾', '220': '🇬🇲', 
    '221': '🇸🇳', '222': '🇲🇷', '223': '🇲🇱', '224': '🇬🇳', '225': '🇨🇮', '226': '🇧🇫', '227': '🇳🇪', 
    '228': '🇹🇬', '229': '🇧🇯', '230': '🇲🇺', '231': '🇱🇷', '232': '🇸🇱', '233': '🇬🇭', '234': '🇳🇬', 
    '235': '🇹🇩', '236': '🇨🇫', '237': '🇨🇲', '238': '🇨🇻', '239': '🇸🇹', '240': '🇬🇶', '241': '🇬🇦', 
    '242': '🇨🇬', '243': '🇨🇩', '244': '🇦🇴', '245': '🇬🇼', '246': '🇮🇴', '248': '🇸🇨', '249': '🇸🇩', 
    '250': '🇷🇼', '251': '🇪🇹', '252': '🇸🇴', '253': '🇩🇯', '254': '🇰🇪', '255': '🇹🇿', '256': '🇺🇬', 
    '257': '🇧🇮', '258': '🇲🇿', '260': '🇿🇲', '261': '🇲🇬', '262': '🇷🇪', '263': '🇿🇼', '264': '🇳🇦', 
    '265': '🇲🇼', '266': '🇱🇸', '267': '🇧🇼', '268': '🇸🇿', '269': '🇰🇲', '27': '🇿🇦', '290': '🇸🇭', 
    '291': '🇪🇷', '297': '🇦🇼', '298': '🇫🇴', '299': '🇬🇱', 
    '30': '🇬🇷', '31': '🇳🇱', '32': '🇧🇪', '33': '🇫🇷', '34': '🇪🇸', '36': '🇭🇺', '39': '🇮🇹', 
    '350': '🇬🇮', '351': '🇵🇹', '352': '🇱🇺', '353': '🇮🇪', '354': '🇮🇸', '355': '🇦🇱', '356': '🇲🇹', 
    '357': '🇨🇾', '358': '🇫🇮', '359': '🇧🇬', '370': '🇱🇹', '371': '🇱🇻', '372': '🇪🇪', '373': '🇲🇩', 
    '374': '🇦🇲', '375': '🇧🇾', '376': '🇦🇩', '377': '🇲🇨', '378': '🇸🇲', '379': '🇻🇦', '380': '🇺🇦', 
    '381': '🇷🇸', '382': '🇲🇪', '383': '🇽🇰', '385': '🇭🇷', '386': '🇸🇮', '387': '🇧🇦', '389': '🇲🇰', 
    '40': '🇷🇴', '41': '🇨🇭', '420': '🇨🇿', '421': '🇸🇰', '423': '🇱🇮', '43': '🇦🇹', '44': '🇬🇧', 
    '45': '🇩🇰', '46': '🇸🇪', '47': '🇳🇴', '48': '🇵🇱', '49': '🇩🇪', 
    '500': '🇫🇰', '501': '🇧🇿', '502': '🇬🇹', '503': '🇸🇻', '504': '🇭🇳', '505': '🇳🇮', '506': '🇨🇷', 
    '507': '🇵🇦', '508': '🇵🇲', '509': '🇭🇹', '51': '🇵🇪', '52': '🇲🇽', '53': '🇨🇺', '54': '🇦🇷', 
    '55': '🇧🇷', '56': '🇨🇱', '57': '🇨🇴', '58': '🇻🇪', '590': '🇬🇵', '591': '🇧🇴', '592': '🇬🇾', 
    '593': '🇪🇨', '594': '🇬🇫', '595': '🇵🇾', '596': '🇲🇶', '597': '🇸🇷', '598': '🇺🇾', '599': '🇨🇼', 
    '60': '🇲🇾', '61': '🇦🇺', '62': '🇮🇩', '63': '🇵🇭', '64': '🇳🇿', '65': '🇸🇬', '66': '🇹🇭', 
    '670': '🇹🇱', '672': '🇳🇫', '673': '🇧🇳', '674': '🇳🇷', '675': '🇵🇬', '676': '🇹🇴', '677': '🇸🇧', 
    '678': '🇻🇺', '679': '🇫🇯', '680': '🇵🇼', '681': '🇼🇫', '682': '🇨🇰', '683': '🇳🇺', '685': '🇼🇸', 
    '686': '🇰🇮', '687': '🇳🇨', '688': '🇹🇻', '689': '🇵🇫', '690': '🇹🇰', '691': '🇫🇲', '692': '🇲🇭', 
    '7': '🇷🇺', '81': '🇯🇵', '82': '🇰🇷', '84': '🇻🇳', '850': '🇰🇵', '852': '🇭🇰', '853': '🇲🇴', 
    '855': '🇰🇭', '856': '🇱🇦', '86': '🇨🇳', '880': '🇧🇩', '886': '🇹🇼', '90': '🇹🇷', '91': '🇮🇳', 
    '92': '🇵🇰', '93': '🇦🇫', '94': '🇱🇰', '95': '🇲🇲', '960': '🇲🇻', '961': '🇱🇧', '962': '🇯🇴', 
    '963': '🇸🇾', '964': '🇮🇶', '965': '🇰🇼', '966': '🇸🇦', '967': '🇾🇪', '968': '🇴🇲', '970': '🇵🇸', 
    '971': '🇦🇪', '972': '🇮🇱', '973': '🇧🇭', '974': '🇶🇦', '975': '🇧🇹', '976': '🇲🇳', '977': '🇳🇵', 
    '98': '🇮🇷', '992': '🇹🇯', '993': '🇹🇲', '994': '🇦🇿', '995': '🇬🇪', '996': '🇰🇬', '998': '🇺🇿'
  };

  const getEmojiForNumber = async (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length < 5 || isNaN(phoneNumber)) return '🏳️';
    for (let i = 4; i >= 1; i--) {
        const potentialPrefix = phoneNumber.substring(0, i);
        if (aintthistooobvious[potentialPrefix]) {
            return aintthistooobvious[potentialPrefix];
        }
    }
    try {
      const pn = new PhoneNumber('+' + phoneNumber);
      if (pn.isValid()) {
         const region = pn.getRegionCode();
         if (region) {
            const offset = 127397;
            return region.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + offset));
         }
      }
    } catch {}
    return '🏳️';
  };

  const BATCH_SIZE = 10;
  const omlfinally = []; 
  const textLines = [];
  let targetParticipants = participants;
  if (!targetParticipants || targetParticipants.length === 0) {
      try {
        const meta = await conn.groupMetadata(m.chat);
        targetParticipants = meta.participants;
      } catch {}
  }
  // Cosi non si tagga piu da solo
  const botJid = await conn.decodeJid(conn.user?.id || conn.user?.jid || conn.user);
  for (let i = 0; i < targetParticipants.length; i += BATCH_SIZE) {
    const batch = targetParticipants.slice(i, i + BATCH_SIZE);
    
    const batchPromises = batch.map(async (mem) => {
      let realJid = '';
      let originalJid = '';
      if (typeof mem === 'object') {
        originalJid = mem.id || mem.jid;
        if (mem.jid && mem.jid.includes('@s.whatsapp.net')) {
             realJid = mem.jid;
        } else if (mem.id && mem.id.includes('@s.whatsapp.net')) {
             realJid = mem.id;
        } else {
             realJid = mem.id || mem.jid;
        }
      } else {
        originalJid = mem;
        realJid = mem;
      }
      if (realJid && realJid.includes('@lid')) {
         const decoded = await conn.decodeJid(realJid);
         if (decoded && decoded.includes('@s.whatsapp.net')) {
             realJid = decoded;
         }
      }
      if (botJid && realJid && botJid === realJid) return null;
      let emoji = '🏳️';
      let tagJid = '';
      let displayText = '';
      if (realJid && realJid.includes('@s.whatsapp.net')) {
          const phoneNumber = realJid.split('@')[0].replace(/[^0-9]/g, '');
          emoji = await getEmojiForNumber(phoneNumber);
          tagJid = realJid; 
          displayText = `@${phoneNumber}`; 
      } else {
          emoji = '👤';
          tagJid = originalJid;
          displayText = `@${originalJid.split('@')[0]}`;
      }
      return {
          line: `${emoji} ${displayText}`,
          jid: tagJid
      };
    });

    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(res => {
        if (!res) return;
        textLines.push(res.line);
        if (res.jid) omlfinally.push(res.jid);
    });
    
    if (i + BATCH_SIZE < targetParticipants.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  const getGroupData = async () => {
    try {
        const img = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://i.ibb.co/hJW7WwxV/varebot.jpg');
        const meta = await conn.groupMetadata(m.chat);
        return { img, subject: meta.subject || 'Gruppo' };
    } catch {
        return { img: 'https://i.ibb.co/hJW7WwxV/varebot.jpg', subject: 'Gruppo' };
    }
  };
  
  const infoGroup = await getGroupData();

  messaggi += textLines.join('\n');
  messaggi += `\n╰⸼ ┄ ┄꒰  ׅ୭ *tagall* ୧ ׅ ꒱─ ┄ ⸼`;
  
  await conn.sendMessage(m.chat, { 
    text: messaggi,
    mentions: omlfinally
  });
};

handler.help = ['tagall'];
handler.tags = ['gruppo'];
handler.command = /^(tagall|invoca|menzionatutti)$/i;
handler.admin = true;
handler.group = true;

export default handler;