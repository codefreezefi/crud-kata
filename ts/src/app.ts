import * as http from "node:http"
import express from 'express'


export const startApplication: () => Promise<http.Server> = async () => {
    const app = express()

    app.get('/health-check', (_, response) => {
        response.status(200).send('OK')
    })

    return app.listen(8080)
}

