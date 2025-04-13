import { PrismaClient } from "../generated/prisma/index.js";
import { sendEventNotification } from "../notifs.js";
const prisma = new PrismaClient();

export default {
    name: '/api/meta/uninstall',
    method: 'GET',
    verify: (req, res, next) => {
        return true;
    },
    execute: async (req, res, next) => {
        if(!req.query.runtime) {
            res.status(400).send('Invalid data type');
            return;
        }
        let user = await prisma.user.findUnique({
            where: {
                runtimeId: req.query.runtime,
            },
        })
        if (user && user.whiteListed) {
            await prisma.event.create({
                data: {
                    type: 'uninstall',
                    userId: user.id
                }
            });
            sendEventNotification(`UNINSTALL - **${req.user.name}** from **${req.user.source}** has uninstalled the extension on runtime *${req.user.runtimeId}*`);
            res.status(200).send('Success');
        }
        else {
            res.status(403).send('Access denied');
        }
    }
}
