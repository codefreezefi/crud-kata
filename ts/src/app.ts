import * as http from "node:http"
import express, {Router} from 'express'
import bodyParser from "body-parser";
import {sessionRoutes} from "./conference-planning/controllers.js";
import type {CreatesSessions, Session, SessionRepository} from "./domain/session.types.js";
import {RepositoryAwareSessions} from "./conference-planning/repository-aware.sessions.js";


export const startApplication: () => Promise<http.Server> = async () => {
    const app = express()
    const router: Router = Router()

    app.use(bodyParser.json())

    app.get('/health-check', (_, response) => {
        response.status(200).send('OK')
    })

    const sessionRepository: SessionRepository = {
        addSession(_session: Session): Promise<void> {
            return Promise.resolve(undefined);
        }
    };
    const createsSessions: CreatesSessions = new RepositoryAwareSessions( sessionRepository);

    sessionRoutes(router, createsSessions);

    app.use(router)

    return app.listen(8080)
}

