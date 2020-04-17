const connection = require('../connection');

exports.updateCommentVotes = (commentId, votes) => {
    console.log('Using the comments model...')
    return connection('comments')
        .where('comment_id', '=', commentId)
        .increment(votes)
        .returning('*')
        .then((res) => {
            return res[0]
        });
};