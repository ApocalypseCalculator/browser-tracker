import { PrismaClient } from "../generated/prisma/index.js";
import { sendEventNotification } from "../notifs.js";
const prisma = new PrismaClient();

export default {
    name: '/api/meta',
    method: 'POST',
    verify: (req, res, next) => {
        return true;
    },
    execute: async (req, res, next) => {
        if (!req.body.event || !['install', 'startup'].includes(req.body.event) || !req.headers['tracker-source']) {
            res.status(400).send('Invalid event type');
        }
        else {
            if (!req.user) {
                let user = await prisma.user.create({
                    data: {
                        runtimeId: req.headers['tracker-source'],
                    }
                })
                req.user = user;
            }
            if (req.user.whiteListed) {
                await prisma.event.create({
                    data: {
                        type: req.body.event,
                        userId: req.user.id
                    }
                });
                if(req.body.event === 'install') {
                    sendEventNotification(`INSTALL - **${req.user.name}** from **${req.user.source}** installed extension on runtime *${req.user.runtimeId}*`);
                }
                else if(req.body.event === 'startup') {
                    sendEventNotification(`STARTUP - **${req.user.name}** from **${req.user.source}** has initialized the extension on a new session (runtime *${req.user.runtimeId}*)`);
                }
                res.status(200).send('Success');
            }
            else {
                res.status(401).send('Whitelist needed');
            }
        }
    }
}
