import {v4} from 'uuid'
import request from "supertest"
import * as http from "node:http"
import {startApplication} from '../../src/app.js'

describe('Magic', () => {

    let app: http.Server

    before(async () => {
        app = await startApplication()
    })

    after(async () => {
        app.close()
    })

    it('can start the application', async () => {
        await request(app)
            .get('/health-check')
            .expect(200)

    })

    it.skip('can create a session', async () => {
        // POST call to create a session with session details
        const id = v4();
        const sessionInformation = {title: 'First session', id}
        await request(app)
            .post('/sessions')
            .send(sessionInformation)
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .expect(201)
            .expect('location', `/session/${id}`)

        // Verify by Getting list of sessions and seeing it.
        await request(app)
            .get('/session/${id}')
            .expect(200)
            .expect(sessionInformation)
    })
})
