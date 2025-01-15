import {v4} from 'uuid'
import request from "supertest"
import * as http from "node:http"
import {startApplication} from '../../src/app.js'
import {ErasableInMemorySessionRepository} from "./fakes/erasable-in-memory-session-repository.js";

describe('Magic', () => {

  let app: http.Server
  let sessionRepository: ErasableInMemorySessionRepository;

  before(async () => {
    sessionRepository = new ErasableInMemorySessionRepository();
    app = await startApplication(sessionRepository)
  })

  after(async () => {
    app.close()
  })

  afterEach(async () => {
    sessionRepository.erase()
  })

  it('can start the application', async () => {
    await request(app)
      .get('/health-check')
      .expect(200)
  })

  it('can create a session', async () => {
    const id = v4()
    const sessionInformation = {title: 'First session', id}
    await request(app)
      .post('/sessions')
      .send(sessionInformation)
      .set("Content-Type", "application/json")
      .set('Accept', 'application/json')
      .expect(201)
      .expect('location', `/session/${id}`)

    await request(app)
      .get(`/session/${id}`)
      .expect(200)
      .expect(sessionInformation)
  })

})
