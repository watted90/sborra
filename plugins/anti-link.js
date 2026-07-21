import fetch from 'node-fetch';
import FormData from 'form-data';
import { downloadContentFromMessage } from '@realvare/baileys';

const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})|whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;
const urlRegex = /(https?:\/\/[^\s]+)/g;

function extractTextAndUrlsFromMessage(message) {
    const extractedContent = { text: '', urls: [] };
    if (!message) return extractedContent;

    function findContentInObject(obj, inQuoted = false) {
        if (inQuoted) return;

        if (typeof obj === 'string') {
            extractedContent.text += ' ' + obj;
            const foundUrls = obj.match(urlRegex);
            if (foundUrls) extractedContent.urls.push(...foundUrls);
        } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (!Object.hasOwn(obj, key)) continue;

                if (key === 'quotedMessage') continue;

                findContentInObject(obj[key], false);
            }
        }
    }

    findContentInObject(message);
    return {
        text: extractedContent.text.trim(),
        urls: [...new Set(extractedContent.urls)]
    };
}

async function getMediaBuffer(message) {
    try {
        const msg =
            message.message?.imageMessage ||
            message.message?.videoMessage;

        if (!msg) return null;

        const type = msg.mimetype?.startsWith('video') ? 'video' : 'image';
        const stream = await downloadContentFromMessage(msg, type);

        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        return buffer;
    } catch {
        return null;
    }
}

async function readQRCode(imageBuffer) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const formData = new FormData();
        formData.append('file', imageBuffer, 'image.jpg');

        const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeout);
        const data = await response.json();
        return data?.[0]?.symbol?.[0]?.data || null;
    } catch {
        return null;
    }
}

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) return true;

    const { text: messageText, urls: extractedUrls } = extractTextAndUrlsFromMessage(m.message || {});
    let containsGroupLink = !!linkRegex.exec(messageText) || extractedUrls.some(url => linkRegex.exec(url));

    let qrLinkDetected = false;
    if (!containsGroupLink) {
        const media = await getMediaBuffer(m);
        if (media) {
            const qrData = await readQRCode(media);
            const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? '';
            if (qrText && linkRegex.test(qrText)) {
                containsGroupLink = true;
                qrLinkDetected = true;
            }
        }
    }

    if (containsGroupLink || qrLinkDetected) {
        const userTag = `@${m.sender.split('@')[0]}`;
        const tipo = qrLinkDetected ? 'ha inviato un QR di gruppo' : 'ha mandato un link di gruppo';

        await conn.sendMessage(m.chat, {
            text: `${userTag} ${tipo}.`,
            mentions: [m.sender]
        });

        if (!isAdmin && isBotAdmin) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }

    return true;
}