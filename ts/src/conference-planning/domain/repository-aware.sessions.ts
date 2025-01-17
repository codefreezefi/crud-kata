import type {CreatesSessions, FindsSessions, Session, SessionRepository} from "./session.types.js"
import {SessionError} from "./errors/session.errors.js"
import {SessionProjection} from "./actions/session-projection.js"

export class RepositoryAwareSessions implements CreatesSessions, FindsSessions {
  constructor(private readonly sessionRepository: SessionRepository) {
  }

  async createASession(session: Session): Promise<void> {
    if (session.title.length <= 6) {
      throw new SessionError("Session Validation")
    }
    await this.sessionRepository.addSession(session)
  }

  async findById(id: string): Promise<Session> {
    const session = await this.sessionRepository.findById(id)
    const x = {sessionId: session.id, type: 'session-drafted'}
    const y = {sessionId: session.id, type: 'session-proposed', title: session.title}
    const z = {sessionId: session.id, type: 'session-accepted'}
    const sessionProjection = new SessionProjection()
    sessionProjection.apply(x).apply(y).apply(z)
    return sessionProjection.findById(id)
  }

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.findAll()
  }
}
