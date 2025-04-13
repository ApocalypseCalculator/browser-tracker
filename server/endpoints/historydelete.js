import { PrismaClient } from "../generated/prisma/index.js";
import { sendEventNotification } from "../notifs.js";
const prisma = new PrismaClient();

export default {
    name: '/api/history/delete',
    method: 'POST',
    verify: (req, res, next) => {
        return req.user && req.user.whiteListed;
    },
    execute: async (req, res, next) => {
        if(!req.body) {
            res.status(400).send('Invalid data type');
        }
        else {
            await prisma.event.create({
                data: {
                    type: 'delete',
                    userId: req.user.id,
                    data: JSON.stringify(req.body.all ? [] : req.body.urls)
                }
            });
            sendEventNotification(`DELETION - **${req.user.name}** from **${req.user.source}** performed a history deletion! (runtime: *${req.user.runtimeId}*)`);
            res.status(200).send('Success');
        }
    }
}
