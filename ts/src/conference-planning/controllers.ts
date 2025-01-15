import express, {type Router} from "express";
import type {CreatesSessions, Session} from "../domain/session.types.js";
let session: { title: string, id: string } | undefined = undefined

export const sessionRoutes = (router: Router, createsSessions: CreatesSessions) => {
    router.post('/sessions', addASessionHandler(createsSessions))

    router.get('/session/:id', (_req, res) => {

        res.status(200).send(session)
    })
};

export const addASessionHandler: (x: CreatesSessions) => express.RequestHandler = (service: CreatesSessions) => async (req, res) => {
    // TODO: Make an type assertion here
    session = req.body as unknown as Session

    await service.createASession(session)

    // @ts-ignore
    res.status(201).header('location', `/session/${session.id}`).send()
};
