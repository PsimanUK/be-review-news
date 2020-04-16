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

                            expect(res.body.topics.length).to.deep.equal(3);
                            expect(typeof res.body.topics[0].slug).to.equal('string');
                        });
                });
                it('returns a 200 and the objects have the required keys', () => {
                    return request(app)
                        .get('/api/topics')
                        .expect(200)
                        .then((res) => {
                            const { topics } = res.body;
                            topics.forEach((topic) => {
                                expect(topic).to.have.keys('slug', 'description');
                            });
                        });
                });
            });
        });
        describe('/user/:username', () => {
            describe('GET', () => {
                it('returns a 200 and an object on the key of user', () => {
                    return request(app)
                        .get('/api/users/lurker')
                        .expect(200)
                        .then((res) => {
                            const { user } = res.body;
                            expect(user.username).to.deep.equal('lurker');

                        });
                });
                it('returns a 200 and the object contains the required keys', () => {
                    return request(app)
                        .get('/api/users/lurker')
                        .expect(200)
                        .then((res) => {
                            const { user } = res.body;
                            expect(user).to.have.keys('username', 'name', 'avatar_url');
                        });
                });
                it('returns a 404 and an error message when passed an invalid username', () => {
                    return request(app)
                        .get('/api/users/INVALID')
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Invalid Username!');
                        });
                });
            });
        });
        describe('/articles/:article_id', () => {
            describe('GET', () => {
                it('returns an object with the required keys', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then((res) => {
                            const { article } = res.body;
                            expect(article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count');
                        });
                });
                it('returns an object with a comment count greater than 1', () => {
                    return request(app)
                        .get('/api/articles/1')
                        .expect(200)
                        .then((res) => {
                            const { article } = res.body;
                            expect(article.comment_count).to.deep.equal('13');
                        });
                });
                it('returns a 404 and an error message when passed a non-existant article_id', () => {
                    return request(app)
                        .get('/api/articles/1414')
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot find article for article_id 1414!');
                        });
                });
                it('returns a 400 and an error message when passed a non-integer article_id', () => {
                    return request(app)
                        .get('/api/articles/article_id')
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Bad Request!');
                        });
                });
            });
            describe('PATCH', () => {
                it('returns an article with the votes property increased when passed newVote object with a positive number', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: '1' })
                        .expect(200)
                        .then((res) => {
                            const { votes } = res.body;
                            expect(votes).to.deep.equal(101);
                        });
                });
                it('returns an article with the votes property decreased when passed newVote object with a negative number', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: '-50' })
                        .expect(200)
                        .then((res) => {
                            const { votes } = res.body;
                            expect(votes).to.deep.equal(50);
                        });
                });
                it('returns a 404 when trying to update a non-existant article', () => {
                    return request(app)
                        .patch('/api/articles/1414')
                        .send({ inc_votes: '-50' })
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal(`Cannot find article 1414 to ammend vote!`);
                        });
                });
                it('returns a 400 when trying to update a non-existant article', () => {
                    return request(app)
                        .patch('/api/articles/1414')
                        .send({ inc_votes: '-50' })
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal(`Cannot find article 1414 to ammend vote!`);
                        });
                });
            });
        });
        describe.only('/api/articles/:article_id/comments', () => {
            describe('POST', () => {
                it('returns a 201 and the posted comment with the required keys', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'lurker', body: 'I love it!' })
                        .expect(201)
                        .then((res) => {
                            expect(res.body.comment).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body', 'article_id');
                        });
                });
            });
        });
    });
    describe('INVALID PATHS', () => {
        it('returns a 404 and an error message is a request is made to an invalid endpoint', () => {
            return request(app)
                .get('/INVALID')
                .expect(404)
                .then((res) => {
                    const { msg } = res.body;
                    expect(msg).to.deep.equal('Invalid Path!');
                });
        });
    });
});