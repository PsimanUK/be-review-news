process.env.NODE_ENV = 'test';

const { expect } = require('chai');

const request = require('supertest');

const app = require('../app');

const connection = require('../connection');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('app', () => {
    describe('/api', () => {
        describe('/topics', () => {
            describe('GET', () => {
                it('returns a 200 and an array of objects', () => {
                    return request(app)
                        .get('/api/topics')
                        .expect(200)
                        .then((res) => {
                            console.log(res.body.allTopics, '<-- all the topics');
                            expect(res.body.allTopics.length).to.deep.equal(3);
                            expect(typeof res.body.allTopics[0].slug).to.equal('string');
                        });
                });
            });
        });
    });
});