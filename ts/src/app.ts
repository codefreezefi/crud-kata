import * as http from "node:http"
import express from 'express'
import bodyParser from "body-parser";


export const startApplication: () => Promise<http.Server> = async () => {
    const app = express()
    app.use(bodyParser.json())
    let session : {title: string, id: string} | undefined = undefined

    app.get('/health-check', (_, response) => {
        response.status(200).send('OK')
    })

    app.post('/sessions', (req, res) => {
        session = req.body

        // @ts-ignore
        res.status(201).header('location', `/session/${session.id}`).send()
    })

    app.get('/session/:id', (_req, res) => {

        res.status(200).send(session)
    })

    return app.listen(8080)
}

