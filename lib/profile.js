
const db = require('./db')

var searchall = function (req, res) {
    console.log("Inside searchAll", req.body);
    searchQuery = prepareSearchQuery(req.body)
    console.log("Search Query " + JSON.stringify(searchQuery));
    db.findAll('user', searchQuery).then(users => {
        stats = {};
        users.forEach(function (user) {
            user.interests.forEach(function (interest) {
                stats[interest] = (stats[interest] || 0) + 1;
            });
        });
        return res.json({ "result": users, "stats": stats, "timestamp": Date.now()});
    }).catch( error => {
        return res.status(500).json({ "error": error });
    });
};

const prepareSearchQuery = (searchQuery) => {
    console.log("prepare search query", searchQuery);
    var query = { $and: [] };
    var validQuery = false;
    if (searchQuery.searchText) {
        var searchTextQuery = { $or: [] };
        searchTextQuery['$or'].push({ "country": { '$regex': searchQuery.searchText, $options: 'i' } });
        searchTextQuery['$or'].push({ "region": { '$regex': searchQuery.searchText, $options: 'i' } });
        searchTextQuery['$or'].push({ "name": { '$regex': searchQuery.searchText, $options: 'i' } });
        searchTextQuery['$or'].push({ "phone": { '$regex': searchQuery.searchText, $options: 'i' } });
        query['$and'].push(searchTextQuery);
        validQuery = true;
    }
    if (searchQuery.interests) {
        var skillsQuery = { $or: [] };
        skillsQuery['$or'].push({ "interests": { '$in': searchQuery.interests } });
        query['$and'].push(skillsQuery);
        var validQuery = true;
    }
    if (validQuery) {
        return query
    }
    else {
        return {}
    }
    
}

exports.searchall = searchall;
