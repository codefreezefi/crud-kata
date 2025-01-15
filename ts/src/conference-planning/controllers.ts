import type {Router} from "express";

export const sessionRoutes = (router: Router) => {
    let session: { title: string, id: string } | undefined = undefined
    router.post('/sessions', (req, res) => {
        // createASession(req.body)
        session = req.body

        // @ts-ignore
        res.status(201).header('location', `/session/${session.id}`).send()
    })

    router.get('/session/:id', (_req, res) => {

        res.status(200).send(session)
    })
};