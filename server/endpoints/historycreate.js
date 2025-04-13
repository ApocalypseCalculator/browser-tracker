import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export default {
    name: '/api/history/create',
    method: 'POST',
    verify: (req, res, next) => {
        return req.user && req.user.whiteListed;
    },
    execute: async (req, res, next) => {
        if(!req.body.data) {
            res.status(400).send('Invalid data type');
        }
        else {
            await prisma.historyItem.upsert({
                where: {
                    id_userId: {
                        id: parseInt(req.body.data.id),
                        userId: req.user.id
                    }
                },
                update: {
                    url: req.body.data.url,
                    title: req.body.data.title,
                    lastVisitTime: new Date(req.body.data.lastVisitTime),
                    typedCount: req.body.data.typedCount,
                    visitCount: req.body.data.visitCount,
                },
                create: {
                    id: parseInt(req.body.data.id),
                    userId: req.user.id,
                    url: req.body.data.url,
                    title: req.body.data.title,
                    lastVisitTime: new Date(req.body.data.lastVisitTime),
                    typedCount: req.body.data.typedCount,
                    visitCount: req.body.data.visitCount,
                }
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Internal server error');
            })
            res.status(200).send('Success');
        }
    }
}
