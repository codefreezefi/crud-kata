import type {CreatesSessions, Session} from "../../src/domain/session.types.js";
import sinon, {stub} from "sinon";
import {expect} from "chai";

import {addASessionHandler} from "../../src/conference-planning/controllers.js";
import express from "express";
import {SessionError} from "../../src/domain/session.errors.js";

function fakeRequestToContain(sessionInfo: unknown): express.Request {
    return {
        body: sessionInfo
    } as express.Request;
}

function fakeResponseToFake(): express.Response {
    let responseLike: express.Response = <express.Response>{}

    responseLike.status = stub().returns(responseLike)
    responseLike.header = stub().returns(responseLike)
    responseLike.send = stub().returns(responseLike)
    return responseLike;
}

function fakeServiceToThrowError(error: Error) {
    return {
        createASession: () => {
            throw error
        }
    };
}

describe('conference-planning controller', () => {
    let serviceLike: CreatesSessions;
    const sessionInfo: Session = {title: 'valid title', id: 'valid-id'}
    let requestWithASessionBody: express.Request;
    let responseLike: express.Response;
    let sessionHandler: express.RequestHandler;

    beforeEach(() => {
        serviceLike = {
            createASession: sinon.spy()
        };
        sessionHandler = addASessionHandler(serviceLike);

        requestWithASessionBody = fakeRequestToContain(sessionInfo);
        responseLike = fakeResponseToFake();
    })

    it('Calls create a session and returns 201', async () => {
        await sessionHandler(requestWithASessionBody, responseLike, noop)

        expect(serviceLike.createASession).to.have.been.calledWith(sessionInfo)
        expect(responseLike.status).to.have.been.calledWith(201)
    })

    it('returns location header', async () => {
        await sessionHandler(requestWithASessionBody, responseLike, noop)

        expect(responseLike.header).to.have.been.calledWith('location', '/session/valid-id')
    })

    it('return 400 for invalid data', async () => {
        await sessionHandler(fakeRequestToContain({invalid: 'content'}), responseLike, noop)

        expect(responseLike.status).to.have.been.calledWith(400)
        expect(responseLike.send).to.have.been.calledWith('body does not look like a session')
    })


    describe('when service is throwing errors', () => {
        it('returns 500 by default', async () => {
            serviceLike = fakeServiceToThrowError(new Error("any error"));
            sessionHandler = addASessionHandler(serviceLike);

            await sessionHandler(requestWithASessionBody, responseLike, noop)

            expect(responseLike.status).to.have.been.calledWith(500)
        })

        it('return error status from custom error', async () => {
            serviceLike = fakeServiceToThrowError(new ErrorWithCustomReturnCode(405));
            sessionHandler = addASessionHandler(serviceLike);

            await sessionHandler(requestWithASessionBody, responseLike, noop)

            expect(responseLike.status).to.have.been.calledWith(405)
        })
    });
});

let noop = () => {
    /* no-op */
};

class ErrorWithCustomReturnCode extends SessionError {
    constructor(private readonly errorCode: number) {
        super("Custom error in test");
    }

    toReturnCode() {
        return this.errorCode
    }
}