const connection = require('../connection');

exports.updateCommentVotes = (commentId, votes) => {
    console.log('Using the comments model...')
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