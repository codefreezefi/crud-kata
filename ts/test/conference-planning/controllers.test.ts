import type {CreatesSessions, Session} from "../../src/domain/session.types.js";
import sinon, {stub} from "sinon";
import {expect} from "chai";

import {addASessionHandler} from "../../src/conference-planning/controllers.js";
import express from "express";

describe('conference-planning controller', () => {

    it('Adds a session', async () => {
        const serviceLike: CreatesSessions = {
            createASession: sinon.spy()
        }
        const sessionInfo: Session = {title: 'valid title', id: 'valid id'}


        let requestWithASessionBody: express.Request = {
            body: sessionInfo
        } as express.Request
        let responseLike: express.Response = {
            header: () => {
                return responseLike
            },
            send: () => {
                return this;
            }
        } as unknown as express.Response

        const stubbed = stub().returns(responseLike)
        responseLike.status = stubbed
        await addASessionHandler(serviceLike)(requestWithASessionBody, responseLike, () => {
        })

        expect(serviceLike.createASession).to.have.been.calledWith(sessionInfo)
        expect(responseLike.status).to.have.been.calledWith(201)
    })


    // test list
    // - calls service
    // - if service throws, then 500 by default
    // - if error has a code, return that.
});