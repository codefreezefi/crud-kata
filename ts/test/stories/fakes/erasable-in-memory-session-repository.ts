import {InMemorySessionRepository} from "../../../src/conference-planning/infra/in-memory-session-repository.js";
import type {Session, SessionRepository} from "../../../src/conference-planning/domain/session.types.js";


export class ErasableInMemorySessionRepository implements SessionRepository {

    sessionRepository: InMemorySessionRepository;

    constructor() {
        this.sessionRepository = new InMemorySessionRepository();
    }

    addSession(session: Session): Promise<void> {
        return this.sessionRepository.addSession(session);
    }

    findById(id: string): Promise<Session> {
        return this.sessionRepository.findById(id);
    }

    findAll(): Promise<Session[]> {
        return this.sessionRepository.findAll();
    }

    erase(): void {
        this.sessionRepository = new InMemorySessionRepository();
    }
}