import type {CreatesSessions, Session, SessionRepository} from "../domain/session.types.js";
import {SessionError} from "../domain/session.errors.js";

export class RepositoryAwareSessions implements CreatesSessions {
    constructor(private readonly sessionRepository: SessionRepository) {
    }

    async createASession(session: Session): Promise<void> {
        if (session.title.length <= 6) {
            throw new SessionError("Session Validation")
        }
        await this.sessionRepository.addSession(session)
    }
}