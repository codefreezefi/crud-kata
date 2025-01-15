import type {CreatesSessions, FindsSessions, Session} from "../../src/domain/session.types.js";
import sinon, {stub} from "sinon";
import {expect} from "chai";

import {addASessionHandler, findASessionHandler} from "../../src/conference-planning/controllers.js";
import express from "express";
import {SessionError} from "../../src/domain/session.errors.js";

describe('conference-planning controller', () => {
    const sessionInfo: Session = {title: 'valid title', id: 'valid-id'}
    let requestWithASessionBody: express.Request;
    let responseLike: express.Response;
    let sessionHandler: express.RequestHandler;
    beforeEach(() => {
        responseLike = fakeResponseToFake();
    })

    describe('Adds sessions', () => {
        let createsSessions: CreatesSessions;
        beforeEach(() => {
            createsSessions = {
                createASession: sinon.spy()
            };
            sessionHandler = addASessionHandler(createsSessions);

            requestWithASessionBody = fakeAddSessionRequestWith(sessionInfo);
        })

        it('Calls create a session and returns 201', async () => {
            await sessionHandler(requestWithASessionBody, responseLike, noop)

            expect(createsSessions.createASession).to.have.been.calledWith(sessionInfo)
            expect(responseLike.status).to.have.been.calledWith(201)
        })

        it('returns location header', async () => {
            await sessionHandler(requestWithASessionBody, responseLike, noop)

            expect(responseLike.header).to.have.been.calledWith('location', '/session/valid-id')
        })

        it('return 400 for invalid data', async () => {
            await sessionHandler(fakeAddSessionRequestWith({invalid: 'content'}), responseLike, noop)

            expect(responseLike.status).to.have.been.calledWith(400)
            expect(responseLike.send).to.have.been.calledWith('body does not look like a session')
        })
    });

    describe('Finds sessions', () => {

        it('can find a session', async () => {
            responseLike = fakeResponseToFake();

            let x = {
                params: {id: "valid-id"}
            } as unknown as express.Request;

            const sessionRepository: FindsSessions = {
                findAll: () => Promise.resolve([]),
                findById: (_id: string) => Promise.resolve(sessionInfo)
            };
            await findASessionHandler(sessionRepository)(x, responseLike, noop);

            expect(responseLike.status).to.have.been.calledWith(200);
            expect(responseLike.send).to.have.been.calledWith(sessionInfo);
        })
    });


    describe('when service is throwing errors', () => {
        it('returns 500 by default', async () => {
            const createsSessions = fakeServiceToThrowError(new Error("any error"));
            sessionHandler = addASessionHandler(createsSessions);

            await sessionHandler(requestWithASessionBody, responseLike, noop)

            expect(responseLike.status).to.have.been.calledWith(500)
        })

        it('return error status from custom error', async () => {
            const createsSessions = fakeServiceToThrowError(new ErrorWithCustomReturnCode(405));
            sessionHandler = addASessionHandler(createsSessions);

            await sessionHandler(requestWithASessionBody, responseLike, noop)

            expect(responseLike.status).to.have.been.calledWith(405)
        })
    });
});

class ErrorWithCustomReturnCode extends SessionError {
    constructor(private readonly errorCode: number) {
        super("Custom error in test");
    }

    toReturnCode() {
        return this.errorCode
    }
}

let noop = () => {
    /* no-op */
};

const fakeAddSessionRequestWith = (sessionInfo: unknown): express.Request => ({
    body: sessionInfo
} as express.Request);

const fakeResponseToFake = (): express.Response => {
    let responseLike: express.Response = <express.Response>{}

    responseLike.status = stub().returns(responseLike)
    responseLike.header = stub().returns(responseLike)
    responseLike.send = stub().returns(responseLike)
    return responseLike;
};

function fakeServiceToThrowError(error: Error) {
    return {
        createASession: () => {
            throw error
        }
    };
}

