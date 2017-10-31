"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_heartbeat_1 = require("../../src/model/model.heartbeat");
var model_sensor_1 = require("../../src/model/model.sensor");
var Rx_1 = require("rxjs/Rx");
var util = require('util');
var hb;
var logger = require('../../src/util/logger');
var db = require('../../src/util/db');
var colname = db.collectionName('model.heartbeat');
var mongodb = require("mongodb");
function getHeartbeatObject() {
    var hb = new model_heartbeat_1.Heartbeat();
    hb.host = "ESP_TEST";
    hb.uptime = (new Date()).getMinutes();
    hb.i2cDevices = 0;
    hb.values = [
        { type: "soil", val: 17 },
        { type: "temperature", val: 27.3 }
    ];
    return hb;
}
describe('Heartbeat Model', function () {
    beforeEach(function (done) {
        hb = getHeartbeatObject();
        var sensor = new model_sensor_1.SensorModel();
        hb.deleteAll().subscribe(function (hb) {
            sensor.deleteAll().subscribe(function (s) {
                sensor.get().subscribe(function (res) {
                    done();
                });
            });
        });
    });
    it('check Heartbeat Model', function () {
        expect(hb instanceof model_heartbeat_1.Heartbeat).toBe(true);
    });
    it('post(minimal obj) returns string ID', function (done) {
        var hb = new model_heartbeat_1.Heartbeat();
        hb.host = "ESP_TEST";
        hb.uptime = (new Date()).getMinutes();
        var obs = hb.post();
        expect(obs instanceof Rx_1.Observable).toBe(true);
        obs.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            db.connect(function (err, dbObj) {
                var oid = new mongodb.ObjectId.createFromHexString(s);
                dbObj.collection(colname).findOne({ _id: oid }, function (err, res) {
                    expect(err).toBeNull();
                    expect(res).toBeTruthy();
                    expect(res.host).toBe(hb.host);
                    expect(res.uptime).toBe(hb.uptime);
                    expect(res.date).toBeDefined();
                    return done();
                });
            });
        });
    });
    it('post(full obj) returns string ID', function (done) {
        hb.post().subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            db.connect(function (err, dbObj) {
                var oid = new mongodb.ObjectId.createFromHexString(s);
                dbObj.collection(colname).findOne({ _id: oid }, function (err, res) {
                    expect(err).toBeNull();
                    expect(res).toBeTruthy();
                    expect(res.host).toBe(hb.host);
                    expect(res.uptime).toBe(hb.uptime);
                    expect(res.date).toBeDefined();
                    return done();
                });
            });
        });
    });
    it('calls observeHeartbeat() and asserts observable returns 2xinserted message', function (done) {
        var s = model_heartbeat_1.MongoHeartbeat.fromHeartbeat(hb);
        var obs = model_heartbeat_1.MongoHeartbeat.observeHeartbeat(s);
        expect(obs instanceof Rx_1.Observable).toBe(true);
        var i = 0;
        obs.subscribe(function (msg) {
            expect(msg).toContain("inserted");
            i++;
            if (i == 2) {
                done();
            }
        });
    });
    it('calls observerHeartbeat() twice and asserts observable returns each 2xinserted message', function (done) {
        pending("not implemented");
        // var s = MongoHeartbeat.fromHeartbeat(hb);
        // var obs = MongoHeartbeat.observeHeartbeat(s);
        // expect(obs instanceof Observable).toBe(true);
        // var i = 0
        // obs.subscribe(msg => {
        // 	expect(msg).toContain("sensor and sensorData inserted");
        // 	i++;
        // 	if (i == 2) {
        // 		s.uptime++;
        // 		var obs2 = MongoHeartbeat.observeHeartbeat(s);
        // 		var i2 = 0;
        // 		obs2.subscribe(msg2 => {
        // 			expect(msg2).toContain("sensorData inserted");
        // 			expect(msg2).not.toContain("sensor and sensorData inserted");
        // 			i2++;
        // 			if (i2 == 2) {
        // 				done();
        // 			}
        // 		},
        // 		err => {
        // 			expect("unexpected error (2) ").toBe(err);
        // 			done();
        // 		});
        // 	}
        // },
        // err => {
        // 	expect("unexpected error").toBe(err);
        // 	done();
        // });
    });
    it('post(full obj) calls observeHeartbeat()', function (done) {
        spyOn(model_heartbeat_1.MongoHeartbeat, 'observeHeartbeat');
        hb.post().subscribe(function (s) {
            expect(model_heartbeat_1.MongoHeartbeat.observeHeartbeat).toHaveBeenCalled();
            done();
        });
    });
});
describe("heartbeat model prepopulated tests", function () {
    var insertedId;
    beforeEach(function (done) {
        hb = new model_heartbeat_1.Heartbeat();
        hb.deleteAll().subscribe(function (s) {
            hb.host = "ESP_TEST";
            hb.uptime = (new Date()).getMinutes();
            hb.i2cDevices = 0;
            hb.values = [
                { type: "soil", val: 17 },
                { type: "temperature", val: 27.3 }
            ];
            hb.post().subscribe(function (s) {
                expect(s).toEqual(jasmine.any(String));
                insertedId = s;
                done();
            });
        });
    });
    it('deleteAll', function (done) {
        var hb = new model_heartbeat_1.Heartbeat();
        hb.deleteAll().subscribe(function (d) {
            expect(d).toEqual(1);
            done();
        });
    });
    it('get by ID', function (done) {
        model_heartbeat_1.Heartbeat.getByID(insertedId).subscribe(function (d) {
            expect(typeof (d)).toBe("object");
            done();
        });
    });
    it('get by ID - NOT FOUND', function (done) {
        var hb = new model_heartbeat_1.Heartbeat();
        hb.deleteAll().subscribe(function (removed) {
            model_heartbeat_1.Heartbeat.getByID(insertedId).subscribe(function (d) {
                expect("Failed to get an exception").toBe("NOT FOUND");
                done();
            }, function (err) {
                expect(err.toString()).toBe("NOT FOUND");
                done();
            });
        });
    });
});
