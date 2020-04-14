exports.formatDates = list => {

    return list.map((item) => {
        const { created_at, ...rest } = item;

        const newDate = new Date(created_at);

        const formattedDate = { ...rest, created_at: newDate };

        return formattedDate;
    })

};

exports.makeRefObj = list => {

    if (list.length === 0) return {};

    const refObject = {};

    list.forEach((article => {
        const { title, article_id } = article;
        refObject[title] = article_id;
    }));

    return refObject;
};

exports.formatComments = (comments, articleRef) => {

    if (comments.length === 0) return [];

    const formattedComments = comments.map((comment) => {

        const { created_by, belongs_to, created_at, ...rest } = comment;

        formattedComment = { ...rest };

        formattedComment.author = created_by;
        formattedComment.article_id = articleRef[belongs_to];
        formattedComment.created_at = new Date(created_at);

        return formattedComment;
    });


    return formattedComments;
};
