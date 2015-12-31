var express = require('express');
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var status = require('http-status');
var env = process.env.ENVIRONMENT || 'dev';
var db = require('../util/db');
var ObjectID = require('mongodb').ObjectID;

var threescale = require('../util/threescale');
router.use(threescale);

/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

router.param('collectionName', function(req, res, next, collectionName){
	db(function(err, dbObj) {
		req.collection = dbObj.collection(env + '.'+  collectionName)
		return next()
	});
});

router.get('/', function(req, res, next) {
  res.json({ msg: 'please select a collection, e.g., /collections/messages'});
});

router.get('/collections/:collectionName', function(req, res, next) {
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

router.post('/collections/:collectionName', function(req, res, next) {
	logger.info('POST: ' + util.inspect(req.body));
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
		logger.info('POST result=%s', util.inspect(results));
    res.send(results)
  })
})

router.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

router.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

router.delete('/collections/:collectionName/:id', function(req, res, next) {
	if (!ObjectID.isValid(req.params.id)) {
		return res.sendStatus(status.BAD_REQUEST);
	}
	var oid = ObjectID.createFromHexString(req.params.id);
	db(function(err, dbObj) {
		req.collection.deleteOne({_id: oid}, function(e, r) {
			if (e) return next(e);
			if (r.deletedCount === 0) { 
				return res.sendStatus(status.NOT_FOUND);
			} else { 
				return res.status(status.OK).json(r.result);
			};
		});			
	});
});

module.exports = router;
