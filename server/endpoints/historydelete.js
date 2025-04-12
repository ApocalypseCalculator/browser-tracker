import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export default {
    name: '/api/history/delete',
    method: 'POST',
    verify: (req, res, next) => {
        return req.user;
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
            }).catch((err) => {
                console.error(err);
                res.status(500).send('Internal server error');
            })
            res.status(200).send('Success');
        }
    }
}
