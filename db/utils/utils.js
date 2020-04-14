exports.formatDates = list => {

    return list.map((item) => {
        const { created_at, ...rest } = item;

        const newDate = new Date(created_at);

        const formattedDate = { ...rest, created_at: newDate };

        return formattedDate;
    })

};

exports.makeRefObj = list => {
    console.log(list);
    console.log(list.length, '<-- list length');
    if (list.length === 0) return {};


    const refObject = {};



    list.forEach((article => {
        const { title, article_id } = article;
        refObject[title] = article_id;
    }));
    return refObject;
};

exports.formatComments = (comments, articleRef) => { };
