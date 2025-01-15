import * as http from "node:http"
import express, {Router} from 'express'
import bodyParser from "body-parser";
import {sessionRoutes} from "./conference-planning/controllers.js";
import type {SessionRepository} from "./domain/session.types.js";
import {RepositoryAwareSessions} from "./conference-planning/repository-aware.sessions.js";
import {InMemorySessionRepository} from "./conference-planning/in-memory-session-repository.js";


export const startApplication: () => Promise<http.Server> = async () => {
    const app = express()
    const router: Router = Router()

    app.use(bodyParser.json())

    app.get('/health-check', (_, response) => {
        response.status(200).send('OK')
    })

    const sessionRepository: SessionRepository = new InMemorySessionRepository();
    const createsSessions = new RepositoryAwareSessions(sessionRepository);

    sessionRoutes(router, createsSessions, createsSessions);

    app.use(router)

    return app.listen(8080)
}

