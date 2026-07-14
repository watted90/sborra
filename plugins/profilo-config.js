import PhoneNumber from 'awesome-phonenumber'

const calculateLevel = (exp) => {
    return Math.floor(Math.sqrt(exp / 100)) + 1
}

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {}
    }

    let user = global.db.data.users[m.sender]
    if (!user.profile) {
        user.profile = {
            description: '',
            gender: '',
            instagram: '',
            city: '',
            birthday: '',
            hobby: '',
            status: '',
            occupation: '',
            music: '',
            food: '',
            movie: '',
            game: '',
            sport: '',
            language: ''
        }
    }

    let name = await conn.getName(m.sender)
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/BKHtdBNp/default-avatar-profile-icon-1280x1280.jpg')
    let currentLevel = user.level || calculateLevel(user.exp || 0)
    let phone = PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international')
    
    let type = command.toLowerCase()
    
    if (!text) {
        // Se il comando è 'del' senza parametri, non fare nulla
        if (type === 'del') {
            return
        }
        
        const helpMessages = {
            setdesc: `ㅤㅤ⋆｡˚『 ╭ \`DESCRIZIONE\` ╯ 』˚｡⋆
╭
│  『 📝 』 \`Imposta la tua biografia\`
│      *⤷*  *Massimo 100 caratteri*
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setdesc miglior bot di zozzap*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setgenere: `ㅤㅤ⋆｡˚『 ╭ \`GENERE\` ╯ 』˚｡⋆
╭
│  『 ⚧️ 』 \`Definisci il tuo genere\`
│
│  『 📌 』 \`Opzioni disponibili:\`
│      *⤷*  *👨🏻 Uomo*
│      *⤷*  *👩🏻 Donna*
│      *⤷*  *🌟 Non specificato*
│      *⤷*  *✨ [Personalizzato]*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setig: `ㅤㅤ⋆｡˚『 ╭ \`INSTAGRAM\` ╯ 』˚｡⋆
╭
│  『 📸 』 \`Collega il tuo profilo\`
│      *⤷*  *Solo username*
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setig varebot*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setcitta: `ㅤㅤ⋆｡˚『 ╭ \`CITTÀ\` ╯ 』˚｡⋆
╭
│  『 🌆 』 \`La tua città\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setcitta faenza*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`, 

            setcompleanno: `ㅤㅤ⋆｡˚『 ╭ \`COMPLEANNO\` ╯ 』˚｡⋆
╭
│  『 🎂 』 \`La tua data di nascita\`
│      *⤷*  *Formato: DD/MM/YYYY*
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setcompleanno 19/04/2008*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`, 

            sethobby: `ㅤㅤ⋆｡˚『 ╭ \`HOBBY\` ╯ 』˚｡⋆
╭
│  『 🎨 』 \`I tuoi interessi\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}sethobby Musica*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`, 

            setstato: `ㅤㅤ⋆｡˚『 ╭ \`STATO\` ╯ 』˚｡⋆
╭
│  『 💝 』 \`Il tuo stato sentimentale\`
│
│  『 📌 』 \`Opzioni:\`
│      *⤷*  *Single*
│      *⤷*  *Fidanzato/a*
│      *⤷*  *Sposato/a*
│      *⤷*  *Divorziato*
│      *⤷*  *Complicato*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`, 

            setlavoro: `ㅤㅤ⋆｡˚『 ╭ \`LAVORO\` ╯ 』˚｡⋆
╭
│  『 💼 』 \`La tua occupazione\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setlavoro studente*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setmusica: `ㅤㅤ⋆｡˚『 ╭ \`MUSICA\` ╯ 』˚｡⋆
╭
│  『 🎵 』 \`Il tuo genere musicale preferito\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setmusica Pop, Rock*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setcibo: `ㅤㅤ⋆｡˚『 ╭ \`CIBO\` ╯ 』˚｡⋆
╭
│  『 🍕 』 \`Il tuo piatto preferito\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setcibo Pizza Margherita*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setfilm: `ㅤㅤ⋆｡˚『 ╭ \`FILM\` ╯ 』˚｡⋆
╭
│  『 🎬 』 \`Il tuo film/serie preferito\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setfilm Avengers*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setgioco: `ㅤㅤ⋆｡˚『 ╭ \`GIOCO\` ╯ 』˚｡⋆
╭
│  『 🎮 』 \`Il tuo videogioco preferito\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setgioco Minecraft*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setsport: `ㅤㅤ⋆｡˚『 ╭ \`SPORT\` ╯ 』˚｡⋆
╭
│  『 🏃 』 \`Il tuo sport preferito\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setsport Calcio*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,

            setlingua: `ㅤㅤ⋆｡˚『 ╭ \`LINGUA\` ╯ 』˚｡⋆
╭
│  『 🌍 』 \`Le tue lingue parlate\`
│
│  『 💡 』 \`Esempio:\`
│      *⤷*  *${usedPrefix}setlingua Italiano, Inglese*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`
        }
        
        await conn.sendMessage(m.chat, {
            text: helpMessages[type] || '『 ❌ 』- \`Comando non valido\`',
            mentions: [m.sender],
            contextInfo: {
                ...global.fake.contextInfo
            }
        }, { quoted: m })
        return
    }
    
    if (type === 'del') {
        const validFields = {
            'desc': 'description',
            'bio': 'description', 
            'genere': 'gender',
            'ig': 'instagram',
            'citta': 'city',
            'compleanno': 'birthday',
            'hobby': 'hobby',
            'stato': 'status',
            'lavoro': 'occupation',
            'musica': 'music',
            'cibo': 'food',
            'film': 'movie',
            'gioco': 'game',
            'sport': 'sport',
            'lingua': 'language'
        }

        const fieldToDelete = text.toLowerCase()
        if (!validFields[fieldToDelete]) {
            await conn.sendMessage(m.chat, {
                text: `ㅤㅤ⋆｡˚『 ╭ \`ERRORE\` ╯ 』˚｡⋆
╭
│  『 ❌ 』 \`Campo non valido!\`
│
│  『 📌 』 \`Campi disponibili:\`
│      *⤷*  *${Object.keys(validFields).join(', ')}*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
                mentions: [m.sender],
                contextInfo: {
                    ...global.fake.contextInfo
                }
            }, { quoted: m })
            return
        }

        const actualField = validFields[fieldToDelete]
        const oldValue = user.profile[actualField] || 'Vuoto'
        user.profile[actualField] = ''

        const fieldDisplayNames = {
            'description': '📝 Bio',
            'gender': '⚧️ Genere',
            'instagram': '📸 Instagram',
            'city': '🌆 Città',
            'birthday': '🎂 Compleanno',
            'hobby': '🎨 Hobby',
            'status': '💝 Stato',
            'occupation': '💼 Lavoro',
            'music': '🎵 Musica',
            'food': '🍕 Cibo',
            'movie': '🎬 Film',
            'game': '🎮 Gioco',
            'sport': '🏃 Sport',
            'language': '🌍 Lingua'
        }

        const displayName = fieldDisplayNames[actualField] || '✨ Campo'

        await conn.sendMessage(m.chat, {
            text: `ㅤㅤ⋆｡˚『 ╭ \`CAMPO ELIMINATO\` ╯ 』˚｡⋆
╭
│  『 🗑️ 』 \`Campo rimosso con successo\`
│
│  『 ${displayName.split(' ')[0]} 』 \`${displayName.split(' ').slice(1).join(' ')}:\`
│      *⤷*  *Valore precedente: ${oldValue}*
│      *⤷*  *Nuovo valore: Vuoto*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
            mentions: [m.sender],
            contextInfo: {
                ...global.fake.contextInfo
            }
        }, { quoted: m })

        await m.react('🗑️')
        return
    }
    
    switch (type) {
        case 'setdesc':
        case 'setbio':
            if (text.length > 100) {
                await conn.sendMessage(m.chat, {
                    text: `ㅤㅤ⋆｡˚『 ╭ \`ERRORE\` ╯ 』˚｡⋆
╭
│  『 ❌ 』 \`Testo troppo lungo!\`
│      *⤷*  *Massimo: 100 caratteri*
│      *⤷*  *Attuale: ${text.length} caratteri*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
                    mentions: [m.sender],
                    contextInfo: {
                        ...global.fake.contextInfo
                    }
                }, { quoted: m })
                return
            }
            user.profile.description = text
            break
            
        case 'setgenere':
            user.profile.gender = text
            break
            
        case 'setig':
            if (!text.match(/^[a-zA-Z0-9._]+$/)) {
                await conn.sendMessage(m.chat, {
                    text: `ㅤㅤ⋆｡˚『 ╭ \`ERRORE\` ╯ 』˚｡⋆
╭
│  『 ❌ 』 \`Username Instagram non valido\`
│      *⤷*  *Usa solo lettere, numeri, . e _*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
                    mentions: [m.sender],
                    contextInfo: {
                        ...global.fake.contextInfo
                    }
                }, { quoted: m })
                return
            }
            user.profile.instagram = text
            break
            
        case 'setcitta':
            user.profile.city = text
            break
            
        case 'setcompleanno':
            if (!text.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                await conn.sendMessage(m.chat, {
                    text: `ㅤㅤ⋆｡˚『 ╭ \`ERRORE\` ╯ 』˚｡⋆
╭
│  『 ❌ 』 _*Formato data non valido*_
│      *⤷*  \`Usa formato DD/MM/YYYY\`
│      *⤷*  \`Esempio: 19/04/2008\`
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
                    mentions: [m.sender],
                    contextInfo: {
                        ...global.fake.contextInfo
                    }
                }, { quoted: m })
                return
            }
            user.profile.birthday = text
            break
            
        case 'sethobby':
            user.profile.hobby = text
            break
            
        case 'setstato':
            user.profile.status = text
            break
            
        case 'setlavoro':
            user.profile.occupation = text
            break

        case 'setmusica':
            user.profile.music = text
            break

        case 'setcibo':
            user.profile.food = text
            break

        case 'setfilm':
            user.profile.movie = text
            break

        case 'setgioco':
            user.profile.game = text
            break

        case 'setsport':
            user.profile.sport = text
            break

        case 'setlingua':
            user.profile.language = text
            break
            
        default:
            await m.reply('『 ❌ 』- \`Comando non valido\`')
            return
    }

    global.db.data.users[m.sender] = user
    
    const fieldMap = {
        setdesc: ['description', '📝', 'Bio'],
        setbio: ['description', '📝', 'Bio'],
        setgenere: ['gender', '⚧️', 'Genere'],
        setig: ['instagram', '📸', 'Instagram'],
        setcitta: ['city', '🌆', 'Città'],
        setcompleanno: ['birthday', '🎂', 'Compleanno'],
        sethobby: ['hobby', '🎨', 'Hobby'],
        setstato: ['status', '💝', 'Stato'],
        setlavoro: ['occupation', '💼', 'Lavoro'],
        setmusica: ['music', '🎵', 'Musica'],
        setcibo: ['food', '🍕', 'Cibo'],
        setfilm: ['movie', '🎬', 'Film'],
        setgioco: ['game', '🎮', 'Gioco'],
        setsport: ['sport', '🏃', 'Sport'],
        setlingua: ['language', '🌍', 'Lingua']
    }

    let [field, emoji, label] = fieldMap[type] || ['', '✨', 'Campo']
    let newValue = user.profile[field]

    await conn.sendMessage(m.chat, {
        text: `ㅤㅤ⋆｡˚『 ╭ \`PROFILO AGGIORNATO\` ╯ 』˚｡⋆
╭
│  『 ✅ 』 _*salvato con successo*_
│  『 ${emoji} 』 \`${label}:\`
│      *⤷*  *${newValue}*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
        mentions: [m.sender],
        contextInfo: {
            ...global.fake.contextInfo
        }
    }, { quoted: m })

    await m.react('✅')
}

handler.tags = ['profilo']
handler.command = /^(set(desc|bio|genere|ig|citta|compleanno|hobby|stato|lavoro|musica|cibo|film|gioco|sport|lingua)|del)$/i
handler.register = true
export default handler