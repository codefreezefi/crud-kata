import express, {type Router} from "express";
import type {CreatesSessions, FindsSessions} from "../domain/session.types.js";
import {looksLikeASession} from "../domain/session-type-assertions.js";
import {SessionError} from "../domain/session.errors.js";

export const sessionRoutes = (router: Router, createsSessions: CreatesSessions, findsSessions: FindsSessions) => {
    router.post('/sessions', addASessionHandler(createsSessions))

    router.get('/session/:id', findASessionHandler(findsSessions))
};
export const findASessionHandler: (x: FindsSessions) => express.RequestHandler = findsSessions => async (req, res) => {
    let id = req.params.id;
    // TODO: AkS: Add some tests
    if(id){
        const s = await findsSessions.findById(id)
        res.status(200).send(s)
        return
    }

    res.status(400).send("missing param")
};

export const addASessionHandler: (x: CreatesSessions) => express.RequestHandler = (service: CreatesSessions) => async (req, res) => {
    const session = req.body
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