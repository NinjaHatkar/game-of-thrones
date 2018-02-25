const router    = require('express').Router()
const Battle     = require('../models/battle')
const log       = require('../utils/logger')

router.get('/list', function(req, res) {
    Battle.find(function(err, battles) {
        if (err) {
            log.err(err)
            res.send(err);
        }
        res.json(battles);
    });
});

router.get('/count', function(req, res) {
    Battle.count(function(err, count) {
        if (err)
            res.send(err);
        res.json(count);
    });
});

router.get('/search', function(req, res) {
    var searchQuery = {$and:[]}
    console.log(req.query.king )
    if(req.query.king){
        searchQuery.$and.push({ 
            $or:[
                {"attacker_king": {$eq: req.query.king }},
                {"defender_king":{$eq: req.query.king }}
            ]
        })
    }
    if(req.query.location) {
        searchQuery.$and.push({
            "location":{$eq: req.query.location}
        })
    }
    if(req.query.type) {
        searchQuery.$and.push({
            "battle_type":{$eq: req.query.type}
        })
    }
    console.log(JSON.stringify(searchQuery))
    Battle.find(searchQuery,function(err, count) {
        if (err)
            res.send(err);
        res.json(count);
    });
});


module.exports = router