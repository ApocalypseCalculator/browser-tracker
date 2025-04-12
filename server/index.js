const PORT = 8080;

import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/index.js";
const prisma = new PrismaClient();

import routes from './routes.js';

const app = express();
app.use(cors());
app.use(express.json({ strict: true }));

app.use(async (req, res, next) => {
    if (req.headers['tracker-source']) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    runtimeId: req.headers['tracker-source'],
                },
            });
            if (user) {
                req.user = user;
            }
        }
        catch (err) {
            // unsucessful auth
        }
    }
    next();
});

var endpoints = {};
routes.forEach((route) => {
    if (route.name == null || route.execute == null || route.method == null) {
        console.error(`\x1b[31mInvalid endpoint: ${route.method} ${route.name}\x1b[0m`);
    } else if (route.name in endpoints && endpoints[route.name] == route.method) {
        console.error(
            `\x1b[31mDuplicate endpoint: ${route.method} ${route.name}\x1b[0m`
        );
    } else {
        endpoints[route.name] = route.method;
        app[route.method.toLowerCase()](route.name, (req, res, next) => {
            if (route.verify(req, res, next)) {
                route.execute(req, res, next).catch((err) => {
                    console.error(err);
                    res.status(500).json({ status: 500, error: 'Internal server error' });
                });
            }
            else {
                res.status(403).json({ status: 403, error: 'Access denied' });
            }
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
