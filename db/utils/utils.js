exports.formatDates = list => {

    return list.map((item) => {
        const { created_at, ...rest } = item;

        const newDate = new Date(created_at);

        const formattedDate = { ...rest, created_at: newDate };

        return formattedDate;
    })

};

exports.makeRefObj = list => { };

exports.formatComments = (comments, articleRef) => { };
