const { updateCommentVotes, deleteComment } = require('../models/comments-model');

exports.sendUpdatedComment = (req, res, next) => {
    const { comment_id } = req.params;
    const votes = req.body;
    console.log('Using the comments controller...')
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