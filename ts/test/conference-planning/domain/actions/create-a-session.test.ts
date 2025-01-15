import type {
  CreatesSessions,
  Session,
  SessionRepository
} from "../../../../src/conference-planning/domain/session.types.js"
import {expect, use} from "chai"
import sinonChai from 'sinon-chai'
import chaiPromised from 'chai-as-promised'
import sinon from "sinon"
import {SessionError} from "../../../../src/conference-planning/domain/errors/session.errors.js"
import {RepositoryAwareSessions} from "../../../../src/conference-planning/domain/repository-aware.sessions.js"

use(sinonChai)
use(chaiPromised)

function throwsError(message: string) {
  return () => {
    throw new Error(message)
  }
}

const fakeSessionRepositoryWith = (fakeWith: Partial<SessionRepository>): SessionRepository => {
  const repository: SessionRepository = {
    addSession: throwsError('unexpected call'),
    findAll: throwsError('unexpected call'),
    findById: throwsError('unexpected call'),
    ...fakeWith
  }
  return repository
}

describe('Creating a session', () => {

  it('creates a session', () => {
    const repository = fakeSessionRepositoryWith({
      addSession: sinon.spy()
    })
    const service: CreatesSessions = new RepositoryAwareSessions(repository)

    const session: Session = {
      title: "A Session Title",
      id: "valid UUID"
    }

    service.createASession(session)

    expect(repository.addSession).to.have.been.calledOnceWith(session)
  })

  it('has a min length of a title', async () => {
    const repository = fakeSessionRepositoryWith({
      addSession: sinon.spy()
    })
    const service: CreatesSessions = new RepositoryAwareSessions(repository)

    const fn: () => Promise<void> = async () => service.createASession({title: 'foobar', id: 'any id'})

    try {
      await fn()
      throw new Error('Should have been thrown')
    } catch (err) {
      expect(err instanceof SessionError).to.be.eql(true, `Expected type SessionError, got ${err}.`)
    }
    expect(repository.addSession).to.not.have.been.called
  })
})
