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
                    amount: req.body.all ? -1 : req.body.urls.length,
                }
            });
            // note: this is possibly a periodic purge
            if(req.body.all) {
                sendEventNotification(`DELETION - **${req.user.name}** from **${req.user.source}** cleared their entire history! (runtime: *${req.user.runtimeId}*)`);
            }
            res.status(200).send('Success');
        }
    }
}
