
const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.deep.equal([]);
  });
  it('returns the correct time stamp when passed an array of one object', () => {
    const input = [{
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    }];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.instanceOf(Date);
  });
  it('returns an array of date formatted objects when passed an array with multiple objects', () => {
    const input = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    },
    {
      title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
      created_at: 1500584273256,
    },
    {
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    }];
    const output = formatDates(input);
    expect(output.length).to.deep.equal(3);
    output.forEach((obj) => {
      expect(obj.created_at).to.be.instanceOf(Date);
    });
  });
  it('does not mutate the original array', () => {
    const input = [{
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    }];
    const output = formatDates(input);
    expect(input[0]).to.deep.equal({
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    });
  });
});

describe('makeRefObj', () => {
  it('returns an empty ogject when passed an empty array', () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it('returns an object with one key/value pair when passed an arry with one object', () => {
    const input = [{
      article_id: 1,
      title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
      created_at: 1500584273256,
    }];
    expect(makeRefObj(input)).to.deep.equal({ "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 1 })
  });
  it('returns a reference object when passed an array of multiple objects', () => {
    const input = [{
      article_id: 1,
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    },
    {
      article_id: 2,
      title: 'Making sense of Redux',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
      created_at: 1514093931240,
    },
    {
      article_id: 3,
      title: 'Please stop worrying about Angular 3',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Another Angular version planned already? Whaaaat? Didn’t Angular 2 just ship? Why Angular 3? What? Why? First off, there is no massive rewrite, and won’t be for Angular 3. Secondly, let me explain the future of Angular 2 and what Angular 3, Angular 4 will mean for you.',
      created_at: 1477282382648,
    }];
    expect(makeRefObj(input)).to.deep.equal({ '22 Amazing open source React projects': 1, 'Making sense of Redux': 2, 'Please stop worrying about Angular 3': 3 })
  });
  it('does not mutate the original array', () => {
    const input = [{
      article_id: 2,
      title: 'Making sense of Redux',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
      created_at: 1514093931240,
    }];
    makeRefObj(input);
    expect(input).to.deep.equal([{
      article_id: 2,
      title: 'Making sense of Redux',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
      created_at: 1514093931240,
    }]);
  })
});

describe('formatComments', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatComments([])).to.deep.equal([]);
  });
  it('returns an array with one correctly formatted comment when passed an array with one comment', () => {
    const comment = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }];
    const refTable = { 'Making sense of Redux': 1 };
    const output = formatComments(comment, refTable)
    expect(output[0]).to.have.keys('article_id', 'author', 'votes', 'created_at', 'body');
  });
  it('converts UNIX time into a JavaScript date object', () => {
    const comment = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }];
    const refTable = { 'Making sense of Redux': 1 };
    const output = formatComments(comment, refTable)

    expect(Object.prototype.toString.call(output[0].created_at)).to.deep.equal('[object Date]');
  });
  it('returns an array of formatted comments when passed an array of comments', () => {
    const comments = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    },
    {
      body: 'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
      belongs_to: '22 Amazing open source React projects',
      created_by: 'grumpy19',
      votes: 3,
      created_at: 1504183900263,
    },
    {
      body: 'Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.',
      belongs_to: 'The People',
      created_by: 'happyamy2016',
      votes: 4,
      created_at: 1467709215383,
    }];
    const refTable = { 'Making sense of Redux': 1, '22 Amazing open source React projects': 2, 'The People': 3 };
    const output = formatComments(comments, refTable);
    output.forEach((comment) => {
      expect(comment).to.have.keys('article_id', 'author', 'votes', 'created_at', 'body');
      expect(Object.prototype.toString.call(comment.created_at)).to.deep.equal('[object Date]');
    });
  });
  it('does not mutate the original array', () => {
    const input = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }];
    const refTable = { 'Making sense of Redux': 1 };
    formatComments(input, refTable);
    expect(input).to.deep.equal([{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }]);
  });
  it('output array does not refer to the original array', () => {
    const input = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }];
    const refTable = { 'Making sense of Redux': 1 };
    const output = formatComments(input, refTable);
    expect(output).to.not.equal(input);
  });
});
