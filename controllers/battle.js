const Battle     = require('../models/battle')

var BattleController = {}


BattleController.list = function(req, res) {
        Battle.find(function(err, battles) {
            if(err)
                res.send(err);
            res.json(battles);
        })
}

BattleController.count = function(req, res) {
    Battle.count(function(err, count) {
        if (err)
            res.send(err);
        res.json(count);
    });
}

//TODO: Error Handling 
//      Add validation for query parameters 
BattleController.search = function(req, res) {
    var searchQuery = {$and:[]}
    if(req.query.king){
        searchQuery.$and.push({ 
            $or:[
                {'attacker_king': {$eq: req.query.king }},
                {'defender_king':{$eq: req.query.king }}
            ]
        })
    }
    if(req.query.location) {
        searchQuery.$and.push({
            'location':{$eq: req.query.location}
        })
    }
    if(req.query.type) {
        searchQuery.$and.push({
            'battle_type':{$eq: req.query.type}
        })
    }
    Battle.find(searchQuery,function(err, count) {
        if (err)
            res.send(err);
        res.json(count);
    });
}

BattleController.stats = function(req, res) {
    Promise.all([getAttackerOutCome(), 
        getDefenderSizeStats(), 
        getBattleTypes(), 
        getMostActive('attacker_king'),
        getMostActive('defender_king'),
        getMostActive('region'),
        getMostActive('name'),
    ]).then(function(values) {
        var stats = {
            'most_active': {
                'attacker_king': values[3][0]._id.mostActive,
                'defender_king': values[4][0]._id.mostActive,
                'region': values[5][0]._id.mostActive,
                'name': values[6][0]._id.mostActive
            },
            'attacker_outcome': {
                'win': values[0].win,
                'loss': values[0].loss
            },
            'battle_type': values[2],
            'defender_size':{
                'average': values[1][0].avg, 
                'min': values[1][0].min,
                'max': values[1][0].max
            }
        }
        res.json(stats)        
        
    }).catch(function(err) {
        console.log(err);
        res.send('error')
    })

}

//Helper methods for stats
var getAttackerOutCome = function() {
    return new Promise((resolve, reject) => { 
        Battle.aggregate([{
            $project: {
                win: {  
                    $cond: { if: { $eq: [ '$attacker_outcome', 'win']}, then: 1, else: 0 }
                },
                loss: {
                    $cond: { if: { $eq: [ '$attacker_outcome', 'loss']}, then: 1, else: 0 }
                }
            }
        }, {
            $group: {
                _id: 'stats',
                win: { $sum: '$win' },
                loss: { $sum: '$loss' }
            }
        }],function(err, result){
            if(err)
                reject(err)
            resolve(result);
        })
    })
}

var getDefenderSizeStats = function (){
    return new Promise((resolve, reject) => { 
        Battle.aggregate([{
            $group: {
                _id: 'stats', 
                avg: { $avg: '$defender_size'},
                max: { $max: '$defender_size'},
                min: { $min: '$defender_size'}
            }
        }], function(err, result){
            if(err)
                reject(err)
            resolve(result);
        })
    })
}

var getBattleTypes = function(){
    return new Promise((resolve, reject) => { 
        Battle.distinct('battle_type', function(err, result){
            if(err)
                reject(err)
            resolve(result);
        })
    })
} 


var getMostActive = function(fieldName){
    return new Promise((resolve, reject) => { 
        Battle.aggregate([{
                $group : {
                    _id: { mostActive: '$'+fieldName} ,
                    count: { $sum: 1 }
                }
            },
            {$sort:{'count':-1}},
            {$limit:1}
        ], function(err, result) {
        if(err)
            reject(err)
            resolve(result);
        })
    })
} 

module.exports = BattleController;