import express, {type Router} from "express";
import type {CreatesSessions} from "../domain/session.types.js";
import {looksLikeASession} from "../domain/session-type-assertions.js";
import {SessionError} from "../domain/session.errors.js";

let session: { title: string, id: string } | undefined = undefined

export const sessionRoutes = (router: Router, createsSessions: CreatesSessions) => {
    router.post('/sessions', addASessionHandler(createsSessions))

    router.get('/session/:id', (_req, res) => {
        res.status(200).send(session)
    })
};

export const addASessionHandler: (x: CreatesSessions) => express.RequestHandler = (service: CreatesSessions) => async (req, res) => {
    session = req.body
    if (!looksLikeASession(session)) {
        res.status(400).send('body does not look like a session')
    } else {
        try {
            await service.createASession(session)

            res.status(201).header('location', `/session/${session.id}`).send()
        } catch (error) {
            if(looksLikeADomainError(error)){
                res.status(error.toReturnCode()).send("Internal server error")
            }

            res.status(500).send("Internal server error")
        }
    }
};

function looksLikeADomainError(err: unknown): err is SessionError {
    return err instanceof SessionError
}