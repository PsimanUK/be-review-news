const connection = require('../connection');

exports.updateCommentVotes = (commentId, votes) => {

    if (!votes.inc_votes) return Promise.reject({ status: 400, msg: 'Only allowed to ammend votes!' });
    votes = { votes: votes.inc_votes };
    return connection('comments')
        .where('comment_id', '=', commentId)
        .increment(votes)
        .returning('*')
        .then((res) => {
            return res[0]
        });
};

exports.commentExists = (commentId) => {
    return connection('comments')
        .select('*')
        .where('comment_id', '=', commentId)
        .returning('*')
        .then((res) => {
            return res[0];
        })
}

exports.deleteComment = (commentId) => {
    return this.commentExists(commentId).then((res) => {
        if (res) {
            return connection('comments')
                .where('comment_id', '=', commentId)
                .delete('*')
        } else {
            return Promise.reject({ status: 404, msg: 'Comment does not exist!' })
        }

    });

};

exports.fetchCommentsByArticleId = (articleId, sort_by, order) => {

    return connection('comments')
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .where('article_id', '=', articleId)
        .orderBy(sort_by || 'created_at', order || 'desc');

};

exports.insertComment = (articleId, comment) => {

    const formattedComment = { article_id: articleId, author: comment.username, body: comment.body };
    return connection('comments')
        .insert(formattedComment)
        .returning('*')
        .then((res) => {

            return res[0];
        });
};