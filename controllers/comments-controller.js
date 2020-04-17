const { updateCommentVotes, deleteComment, fetchCommentsByArticleId, insertComment } = require('../models/comments-model');

exports.sendUpdatedComment = (req, res, next) => {
    const { comment_id } = req.params;
    const votes = req.body;

    updateCommentVotes(comment_id, votes)
        .then((comment) => {
            if (comment) {
                res.status(200).send({ comment });
            } else {
                return Promise.reject({ status: 404, msg: `Cannot find a comment with comment_id ${comment_id}!` })
            }

        })
        .catch(next);
};

exports.removeComment = (req, res, next) => {
    const { comment_id } = req.params;

    deleteComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;

    fetchCommentsByArticleId(article_id, sort_by, order)
        .then((comments) => {
            if (comments.length > 0) res.status(200).send({ comments });
            else return Promise.reject({ status: 404, msg: 'Invalid article_id!' });
        })
        .catch(next);
};

exports.postComment = (req, res, next) => {

    const { article_id } = req.params;

    insertComment(article_id, req.body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};