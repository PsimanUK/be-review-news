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
                            expect(article).to.have.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'view_count', 'comment_count');
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
                            const { votes } = res.body.article;
                            expect(votes).to.deep.equal(101);
                        });
                });
                it('returns an article with the votes property decreased when passed newVote object with a negative number', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: '-50' })
                        .expect(200)
                        .then((res) => {
                            const { votes } = res.body.article;
                            expect(votes).to.deep.equal(50);
                        });
                });
                it('returns an article with the view_count property increased when passed viewed object', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ viewed: '1' })
                        .expect(200)
                        .then((res) => {
                            const { view_count } = res.body.article;
                            expect(view_count).to.deep.equal(1);
                        });
                });
                it('returns a 404 when trying to update a non-existant article', () => {
                    return request(app)
                        .patch('/api/articles/1414')
                        .send({ inc_votes: '-50' })
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal(`Article does not exist!`);
                        });
                });
                it('returns a 200 when trying to update without information in the req.body', () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({})
                        .expect(200)
                        .then((res) => {
                            const { article } = res.body;
                            expect(article).to.deep.equal({
                                article_id: 1,
                                title: 'Living in the shadow of a great man',
                                topic: 'mitch',
                                author: 'butter_bridge',
                                body: 'I find this existence challenging',
                                created_at: "2018-11-15T12:21:54.171Z",
                                votes: 100,
                                view_count: 0
                            });
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
                            expect(comments).to.be.descendingBy('created_at');
                        });
                });
                it('returns the array of object ordered by desc as its default', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments).to.be.descendingBy('created_at');
                        });
                });
                it('returns the array of objects sorted by the requested column', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=author')
                        .expect(200)
                        .then((res) => {
                            const { comments } = res.body;
                            expect(comments).to.be.descendingBy('author');
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
                it('returns an array of article objects sorted by created_at in descending order', () => {
                    return request(app)
                        .get('/api/articles')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles).to.be.descendingBy('created_at');

                        });
                });
                it('returns an array of article objects sorted by passed column in ascending order', () => {
                    return request(app)
                        .get('/api/articles?sort_by=title')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles).to.be.descendingBy('title');

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
                        .get('/api/articles?author=rogersop')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            articles.forEach((article) => {
                                expect(article.author).to.deep.equal('rogersop');
                            });
                        });
                });
                it('returns an array of article objects with only the passed topic value', () => {
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
                it('returns a 400 when trying to sort by a column that does not exist', () => {
                    return request(app)
                        .get('/api/articles?sort_by=cats')
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot query a non-existant column!');
                        });
                });
                it('returns a 200 and the articles in ascending order when trying to use an invalid order value', () => {
                    return request(app)
                        .get('/api/articles?order=cats')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles).to.be.ascendingBy('created_at');
                        });
                });
                it('returns a 200 and an empty array when passed an author does not exist', () => {
                    return request(app)
                        .get('/api/articles?author=bob')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles.length).to.deep.equal(0);
                        });
                });
                it('returns a 200 an an empty array when passed an topic does not exist', () => {
                    return request(app)
                        .get('/api/articles?topic=bob')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles.length).to.deep.equal(0);
                        });
                });
                it('returns a 200 and all of the available articles when passed a filter value that is not allowed', () => {
                    return request(app)
                        .get('/api/articles?created_at=1037708514171')
                        .expect(200)
                        .then((res) => {
                            const { articles } = res.body;
                            expect(articles.length).to.deep.equal(12);
                        });
                });
            });
        });
        describe('/api/comments/:comment_id', () => {
            describe('PATCH', () => {
                it('returns a 200 an updated comment which has the required keys', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 1 })
                        .expect(200)
                        .then((res) => {
                            const { comment } = res.body;
                            expect(comment).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body', 'article_id')
                        })
                });
                it('returns a comment with its voted increased by 1', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 1 })
                        .expect(200)
                        .then((res) => {
                            const { comment } = res.body;
                            expect(comment.votes).to.deep.equal(17);
                        });
                });
                it('returns a comment with its voted decreased by 1', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: -1 })
                        .expect(200)
                        .then((res) => {
                            const { comment } = res.body;
                            expect(comment.votes).to.deep.equal(15);
                        });
                });
                it('returns a 404 when trying to update using an invalid comment_id', () => {
                    return request(app)
                        .patch('/api/comments/300')
                        .send({ inc_votes: -1 })
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Cannot find a comment with comment_id 300!');
                        });
                });
                it('returns a 400 when trying to update votes using a non-integer value', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 'cats' })
                        .expect(400)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Bad Request!');
                        });
                });
                it('returns a 400 when trying to update something other than votes', () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ created_at: 1 })
                        .expect(400)
                        .then(() => {
                            return connection('comments')
                                .select('*')
                                .where('comment_id', '=', '1')
                                .then((res) => {
                                    expect(res[0].created_at.getTime()).to.deep.equal(1511354163389)
                                });

                        });
                });
            });
            describe('DELETE', () => {
                it('returns a 204 when passed a comment to delete', () => {
                    return request(app)
                        .delete('/api/comments/1')
                        .expect(204)
                });
                it('returns a 204 when passed a comment to delete and the table no longer contains the comment', () => {
                    return request(app)
                        .delete('/api/comments/1')
                        .expect(204)
                        .then(() => {
                            return connection('comments')
                                .select('*')
                                .then((comments) => {
                                    comments.forEach((comment) => {
                                        expect(comment.comment_id).to.not.equal(1)
                                    })


                                });
                        });
                });
                it('returns a 404 when passed a non-existant comment_id to delete', () => {
                    return request(app)
                        .delete('/api/comments/1414')
                        .expect(404)
                        .then((res) => {
                            const { msg } = res.body;
                            expect(msg).to.deep.equal('Comment does not exist!')
                        })
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
    describe('INVALID METHODS', () => {
        it('returns a 405 when an invalid request is made to the api/topics endpoint', () => {
            return request(app)
                .post('/api/topics')
                .send({ slug: 'dogs', description: 'Not cats' })
                .expect(405)

        });
        it('returns a 405 when an invalid request is made to the api/users/:username endpoint', () => {
            return request(app)
                .post('/api/users/1')
                .send({ slug: 'dogs', description: 'Not cats' })
                .expect(405)

        });
        it('returns a 405 when an invalid request is made to the api/comments/:comment_id endpoint', () => {
            return request(app)
                .get('/api/comments/1')
                .expect(405)

        });
        it('returns a 405 when an invalid request is made to the api/articles endpoint', () => {
            return request(app)
                .post('/api/articles')
                .send({ article_id: 1, body: 'This is a great article!' })
                .expect(405)

        });
        it('returns a 405 when an invalid request is made to the api/articles/:article_id endpoint', () => {
            return request(app)
                .post('/api/articles/1')
                .send({ article_id: 1, body: 'This is a great article!' })
                .expect(405)

        });
        it('returns a 405 when an invalid request is made to the api/articles/commments endpoint', () => {
            return request(app)
                .delete('/api/articles/comments')
                .expect(405)

        });

    });
});