var util = require('util');
var sensor = require('../../model/sensor.js');
var logger = require('../../util/logger');
var sensorHelper = require('../helpers/sensor.js');

describe('Sensor Model V1', function() {
	it('TODO: there is work todo', function() {
		expect("TODO").toBe("TODO");
	})
});

describe('Sensor Model V0', function() {
	beforeEach(function(done) {
		sensorHelper.droprows(function(){
			sensorHelper.insertrows(done);
		});
	});
	
	afterAll(function(done){
		sensorHelper.droprows(done);
	});	
	
  it('should contain get and getMulti methods ', function(){
      expect(sensor).toBeA(Object);
      expect(sensor.get).toBeA(Function);
      expect(sensor.getMulti).toBeA(Function);	
  });

  it('should insert 3 rows in beforeEach ', function(){
      expect(sensorHelper.insertedIds).toBeA(Function);
      expect(sensorHelper.insertedIds()).toBeA(Array);
      expect(sensorHelper.insertedIds().length).toEqual(3);
  });

	it('get a single value - notfound', function(done) {
		sensor.get("notexistingid", function(err, result) { 
			// not found would return both err= null and result = null (or empty object{} )
			logger.info('get single - notfound - returns err=%s and result=%s', typeof(err), typeof(result));
			if (err) {
				logger.info('err = %s', JSON.stringify(err));
			}
			expect(err).not.toBeTruthy(); 
			expect(result).not.toBeTruthy();
		  done();
		});
	});
	
	it('get a single value - found', function (done) {
		sensor.get(sensorHelper.insertedIds()[0], function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).not.toBeTruthy();
				expect(result).toBeTruthy();
				expect(result._id).toEqual(sensorHelper.insertedIds()[0]);
				done();
			}
		});
	});
		
	it('get a single value - broken sensor field', function (done) {
		spyOn(logger, 'error');
		sensor.get(sensorHelper.insertedIds()[2], function (err, result) {
			expect(logger.error).toHaveBeenCalled();
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).not.toBeTruthy();
				expect(result).toBeTruthy();
				expect(result._id).toEqual(sensorHelper.insertedIds()[2]);
				logger.info('model_sensor test with broken sensor field: '+ util.inspect(util.sensor));
				expect(result.sensor).toBeA(Array); // broken sensor value should be converted to empty array
				expect(result.sensor.length).toEqual(0); 
				done();
			}
		});
	});

	it('should get an array of values', function(done) {
		spyOn(logger, 'error');
		sensor.getMulti({}, {}, function (err, result) {
			expect(logger.error).toHaveBeenCalled();
			logger.info('model_sensor test: getmulti callback reached');
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).not.toBeTruthy();
				expect(result).toBeTruthy();
				logger.info('getMulti result: ' + JSON.stringify(result));
				expect(result.length).toEqual(sensorHelper.insertedIds().length);
				done();
			}
		});
	});

	it('should get distinct hosts', function(done) {
		sensor.getUniqueHosts(function(err,result){
			if (err) {
				logger.err('sensor.js - error in distinctHosts()');
				return callback(err, null);
			};
			expect(err).not.toBeTruthy();
			expect(result).toBeTruthy();
			expect(result).toBeA(Array);
			expect(result.length).toEqual(3);
			done();
		});
	});
});
