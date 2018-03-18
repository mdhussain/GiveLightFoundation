
const db = require('./db')

var searchall = function (req, res) {
    const reqQuery = {}
    reqQuery['searchText'] = ""
    Object.keys(req.body).map(reqBodKey => {
        reqQuery['searchText'] += req.body[reqBodKey] + ' '
    })
    console.log("reqQuery: ----> ", reqQuery);
    if (reqQuery.searchText !== '') {
        searchQuery = prepareSearchQuery(reqQuery)
    }
    else {
        searchQuery = {}
    }
    db.findAll('user', searchQuery).then(users => {
        stats = {};
        users.forEach(function (user) {
            user.interests.forEach(function (interest) {
                stats[interest] = (stats[interest] || 0) + 1;
            });
        });
        console.log('searchAll response', users);
        return res.json({ "result": users, "stats": stats });
    });
};

const prepareSearchQuery = (searchQuery) => {
    console.log("prepare search query", searchQuery);
    var query = { $or: [] };
    var validQuery = false;
    if (searchQuery.searchText) {
        var searchTextQuery = { $or: [] };
        searchTextQuery['$or'].push({ "country": { '$regex': searchQuery.searchText, $options: 'i' } });
        searchTextQuery['$or'].push({ "region": { '$regex': searchQuery.searchText, $options: 'i' } });
        searchTextQuery['$or'].push({ "name": { '$regex': searchQuery.searchText, $options: 'i' } });
        searchTextQuery['$or'].push({ "phone": { '$regex': searchQuery.searchText, $options: 'i' } });
        query['$or'].push(searchTextQuery);
        validQuery = true;
    }
    if (searchQuery.interests) {
        var skillsQuery = { $or: [] };
        skillsQuery['$or'].push({ "interests": { '$in': searchQuery.interests } });
        query['$and'].push(skillsQuery);
        var validQuery = true;
    }
    console.log('valid query: ', query)
    if (validQuery) {
        return query;
    }
    return null;
}

exports.searchall = searchall;
