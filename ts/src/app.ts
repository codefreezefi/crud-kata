import * as http from "node:http"
import express, {Router} from 'express'
import bodyParser from "body-parser"
import {sessionRoutes} from "./conference-planning/delivery/controllers.js"
import type {SessionRepository} from "./conference-planning/domain/session.types.js"
import {RepositoryAwareSessions} from "./conference-planning/domain/repository-aware.sessions.js"

export const startApplication: (r: SessionRepository) => Promise<http.Server> = async sessionRepository => {
  const app = express()
  const router: Router = Router()

  app.use(bodyParser.json())

  app.get('/health-check', (_, response) => {
    response.status(200).send('OK')
  })

  const createsSessions = new RepositoryAwareSessions(sessionRepository)

  sessionRoutes(router, createsSessions, createsSessions)

  app.use(router)

  return app.listen(8080)
}

