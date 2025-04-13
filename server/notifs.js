import { inspect } from 'node:util';

const { EVENT_WEBHOOK, ERROR_WEBHOOK } = process.env;

if(!EVENT_WEBHOOK || !ERROR_WEBHOOK) {
    console.error('Missing notification webhooks in environment variables');
}

async function sendMessage(webhook, msg) {
    fetch(webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: msg
        }),
    })
}

function truncatedError(err) {
    let errstr = inspect(err);
    if(errstr.length > 1000) {
        errstr = errstr.substring(0, 1000) + '...';
    }
    return errstr;
}

export const sendErrorNotification = (err, user) => {
    sendMessage(ERROR_WEBHOOK, `**Error Occurred**:\nUser: \`\`\`${JSON.stringify(user)}\`\`\`\nError: \`\`\`${truncatedError(err)}\`\`\``);
}

export const sendEventNotification = (msg) => {
    sendMessage(EVENT_WEBHOOK, `**Event**: \n${msg}`);
}
