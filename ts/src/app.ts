import * as http from "node:http"
import express, {Router} from 'express'
import bodyParser from "body-parser";
import {sessionRoutes} from "./conference-planning/controllers.js";


export const startApplication: () => Promise<http.Server> = async () => {
    const app = express()
    const router: Router = Router()

    app.use(bodyParser.json())

    app.get('/health-check', (_, response) => {
        response.status(200).send('OK')
    })

    sessionRoutes(router);

    app.use(router)

    return app.listen(8080)
}

