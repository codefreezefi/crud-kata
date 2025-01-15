import type {CreatesSessions, Session, SessionRepository} from "../../src/domain/session.types.js";
import {expect, use} from "chai";
import sinonChai from 'sinon-chai'
import chaiPromised from 'chai-as-promised'
import sinon from "sinon";
import {SessionError} from "../../src/domain/session.errors.js";

use(sinonChai)
use(chaiPromised)

class RepositoryAwareSessions implements CreatesSessions {
    constructor(private readonly sessionRepository: SessionRepository) {
    }

    async createASession(session: Session): Promise<void> {
        if(session.title.length <= 6){
            throw new SessionError("Session Validation")
        }
        await this.sessionRepository.addSession(session)
    }
}

describe('Creating a session', () => {

    it('creates a session', () => {
        const repository: SessionRepository = {addSession: sinon.spy()}
        const service: CreatesSessions = new RepositoryAwareSessions(repository)

        const session: Session = {
            title: "A Session Title",
            id: "valid UUID"
        };

        service.createASession(session)

        expect(repository.addSession).to.have.been.calledOnceWith(session)
    })

    it('has a min length of a title', async () => {
        const repository: SessionRepository = {addSession: sinon.spy()}
        const service: CreatesSessions = new RepositoryAwareSessions(repository)

        const fn: () => Promise<void> = async () => service.createASession({title: 'foobar', id: 'any id'});

        try {
            await fn()
            throw new Error('Should have been thrown')
        } catch (err) {
            expect(err instanceof SessionError).to.be.eql(true, `Expected type SessionError, got ${err}.`)
        }
        expect(repository.addSession).to.not.have.been.called
    })
});