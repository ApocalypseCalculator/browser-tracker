import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export default {
    name: '/api/history/update',
    method: 'POST',
    verify: (req, res, next) => {
        return req.user && req.user.whiteListed;
    },
    execute: async (req, res, next) => {
        if(!req.body.data || !Array.isArray(req.body.data) || req.body.data.length === 0) {
            res.status(400).send('Invalid data type');
        }
        else {
            await prisma.$transaction(req.body.data.map((hitem) => {
                return prisma.historyItem.upsert({
                    where: {
                        id_userId: {
                            id: parseInt(hitem.id),
                            userId: req.user.id
                        }
                    },
                    update: {
                        url: hitem.url,
                        title: hitem.title,
                        lastVisitTime: new Date(hitem.lastVisitTime),
                        typedCount: hitem.typedCount,
                        visitCount: hitem.visitCount,
                    },
                    create: {
                        id: parseInt(hitem.id),
                        userId: req.user.id,
                        url: hitem.url,
                        title: hitem.title,
                        lastVisitTime: new Date(hitem.lastVisitTime),
                        typedCount: hitem.typedCount,
                        visitCount: hitem.visitCount,
                    }
                })
            })).catch((err) => {
                console.error(err);
                res.status(500).send('Internal server error');
            })
            res.status(200).send('Success');
        }
    }
}
