import type {CreatesSessions, FindsSessions, Session, SessionRepository} from "../domain/session.types.js"
import {SessionError} from "../domain/session.errors.js"

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
    return this.sessionRepository.findById(id)
  }
  async findAll(): Promise<Session[]>{
    return this.sessionRepository.findAll()
  }
}
