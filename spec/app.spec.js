process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));

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
                it('returns a 400 when trying to update without inc_votes in the body', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({})
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Bad Request!');
                        });
                });
                it('returns a 400 when trying to update with a non-integer for inc_votes', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 'banana' })
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Bad Request!');
                        });
                });
            });
        });
        describe('/api/articles/:article_id/comments', () => {
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
                it('returns a 201 and the returned comment to have the data passed', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'lurker', body: 'I love it!' })
                        .expect(201)
                        .then((res) => {
                            const { author, body } = res.body.comment;
                            expect(author).to.deep.equal('lurker');
                            expect(body).to.deep.equal('I love it!');
                        });
                });
                it('returns a 400 when passed an empty object', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({})
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot create entry without the required data!');
                        });
                });
                it('returns a 400 when passed an object without a body key', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'lurker' })
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot create entry without the required data!');
                        });
                });
                it('returns a 400 when passed an object without a username key', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ body: 'I love it!' })
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot create entry without the required data!');
                        });
                });
                it('returns a 400 when value is of the wrong data type', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ body: '1' })
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot create entry without the required data!');
                        });
                });
                it('returns a 400 and when passed an object with other columns in the table', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ votes: '1', article_id: '1' })
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot create entry without the required data!');
                        });
                });

            });
            describe('GET', () => {
                it('returns a 200 and an array of comment objects with the required keys', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            comments.forEach((comment) => {
                                expect(comment).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body')
                            });

                        });
                });
                it('returns a 200 and an array with more than one comment object', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments.length).to.deep.equal(13)

                        });
                });
                it('returns a 404 when passed a non-existant article_id', () => {
                    return request(app)
                        .get('/api/articles/360/comments')
                        .expect(404)
                });
                it('returns a 400 when passed a non-integer article_id', () => {
                    return request(app)
                        .get('/api/articles/cat/comments')
                        .expect(400)
                });
                it('returns the array of objects sorted by created_at as its default', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments).to.be.sortedBy('created_at');
                        });
                });
                it('returns the array of objects sorted by the requested column', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=author')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments).to.be.sortedBy('author');
                        });
                });
                it('returns the array of objects ordered dsecending when passed an order value', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=author&order=desc')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments).to.be.descendingBy('author');
                        });
                });
                it('returns a 400 when passed an non-existant column to sort by', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=fish&order=desc')
                        .expect(400)
                });
                it('returns a 200 and ascend array when passed an invalid order value', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=author&order=fish')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments).to.be.ascendingBy('author');
                        });
                });
            });

        });
        describe('/api/articles', () => {
            describe('GET', () => {
                it('returns an array of article objects with the required keys', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            articles.forEach((article) => {
                                expect(article).to.have.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count');
                            });
                        });
                });
                it('returns an array of article objects sorted by created_at in ascending order', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles).to.be.ascendingBy('created_at');

                        });
                });
                it('returns an array of article objects sorted by passed column in ascending order', () => {
                    return request(app)
                        .get('/api/articles?sort_by=title')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles).to.be.ascendingBy('title');

                        });
                });
                it('returns an array of article objects ordered by passed direction', () => {
                    return request(app)
                        .get('/api/articles?sort_by=title&order=desc')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles).to.be.descendingBy('title');

                        });
                });
                it('returns an array of article objects with only the passed author value', () => {
                    return request(app)
                        .get('/api/articles?author=lurker')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            articles.forEach((article) => {
                                expect(article.author).to.deep.equal('lurker');
                            });
                        });
                });
                it.only('returns an array of article objects with only the passed topic value', () => {
                    return request(app)
                        .get('/api/articles?topic=cats')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            articles.forEach((article) => {
                                expect(article.topic).to.deep.equal('cats');
                            });
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