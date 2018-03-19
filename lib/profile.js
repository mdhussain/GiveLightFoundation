
const db = require('./db')

var searchall = function (req, res) {
    const reqQuery = {}
    reqQuery['searchText'] = ""
    console.log('req.body: ---> ', req.body)
    Object.keys(req.body).map(reqBodKey => {
        if (reqBodKey === 'interests') {
            reqQuery['interests'] = req.body[reqBodKey]   
        }
        else if (reqBodKey === 'skills') {
            reqQuery['skills'] = req.body[reqBodKey]   
        }
        else {
            reqQuery['searchText'] += '('+req.body[reqBodKey]+'*)|'
        }
    })
    console.log("reqQuery: ----> ", reqQuery);
    if (reqQuery.searchText !== '' || reqQuery.searchText !== '(*)') {
        searchQuery = prepareSearchQuery(req.body)
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
        console.log('searchAll response', users.length);
        return res.json({ "result": users, "stats": stats });
    });
};

const prepareSearchQuery = (reqBody) => {
    console.log("prepare search query", reqBody);
    var query = { $and: [] };
    var validQuery = false;
    if (reqBody) {
        var searchTextQuery = { $or: [] };
        if (reqBody.country) {
            searchTextQuery['$or'].push({ "country": { '$regex': reqBody.country, $options: 'i' } });
        }
        if (reqBody.region) {
            searchTextQuery['$or'].push({ "region": { '$regex': reqBody.region, $options: 'i' } });
        }
        if (reqBody.name) {
            searchTextQuery['$or'].push({ "name": { '$regex': reqBody.name, $options: 'i' } });
        }
        if (reqBody.phone) {
            searchTextQuery['$or'].push({ "phone": { '$regex': reqBody.phone, $options: 'i' } });
        }
        if (searchTextQuery['$or'].length > 0) {
            query['$and'].push(searchTextQuery);
        }
        validQuery = true;
    }
    if (reqBody.interests) {
        var interestsQuery = { $and: [] };
        interestsQuery['$and'].push({ "interests": { '$all': reqBody.interests } });
        console.log('-----------')
        console.log('interests query: ', interestsQuery)
        console.log('interests query: ', interestsQuery['$and'])
        query['$and'].push(interestsQuery);
        var validQuery = true;
    }
    if (reqBody.skills) {
        const regexSkills = reqBody.skills.map( (skill) => {
            return new RegExp(skill, "gi")
        })
        var skillsQuery = { $or: [] };
        skillsQuery['$or'].push({ "skills": { '$in': regexSkills } });
        console.log('-----------')
        console.log('-----> skills query: ', skillsQuery)
        console.log('-----> skills query: ', skillsQuery['$and'])
        query['$and'].push(skillsQuery);
        var validQuery = true;
    }
    console.log('----------------------------------------')
    console.log('valid query: ', query)
    console.log('valid query: ', query['$and'])
    query['$and'].map(q => {
        if (q['$and']) {
            console.log('valid and: ', q['$and'])
        }
        if (q['$or']) {
            console.log('valid or: ', q['$or'])
        }
    })
    if (validQuery) {
        return query;
    }
    return null;
}

exports.searchall = searchall;
