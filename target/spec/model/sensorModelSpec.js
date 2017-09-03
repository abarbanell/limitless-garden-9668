"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sensor_model_1 = require("../../src/model/sensor.model");
var Rx_1 = require("rxjs/Rx");
var util = require('util');
//var sensor = require('../../model/sensor.js');
var sensor;
var logger = require('../../src/util/logger');
var sensorHelper = require('../helpers/sensor.js');
describe('Sensor Model V1', function () {
    beforeEach(function () {
        sensor = new sensor_model_1.SensorModel();
    });
    it('check SensorModel', function () {
        expect(sensor instanceof sensor_model_1.SensorModel).toBe(true);
    });
    it('get returns ISensor array', function (done) {
        var sut = sensor.get();
        sut.subscribe(function (s) {
            expect(s instanceof Array).toBe(true);
            done();
        }, function (e) {
            expect(e).toBe("you-should-not-get-here");
            done();
        });
    });
    it('getById valid id', function (done) {
        var id = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        id.subscribe(function (strId) {
            expect(strId).toEqual(jasmine.any(String));
            logger.info("id = ", strId);
            var sut = sensor.getById(strId);
            sut.subscribe(function (s) {
                expect(s._id).toBe(strId);
                done();
            }, function (e) {
                expect(e.toString()).toContain("you should not get here");
                done();
            });
            done();
        }, function (e) {
            expect(e).toBe("you-should-not-get-here-either");
            done();
        });
    });
    it('getById missing id', function (done) {
        var id = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        id.subscribe(function (strId) {
            var nonExistingId = "58cd177e9900ff4a2a741bbc";
            expect(strId).toEqual(jasmine.any(String));
            logger.info("inserted id = ", strId);
            logger.info("non-existing id = ", nonExistingId);
            expect(strId).not.toBe(nonExistingId);
            var sut = sensor.getById(nonExistingId);
            sut.subscribe(function (s) {
                logger.info("got s = ", s);
                expect(s).toBeNull();
                done();
            }, function (e) {
                logger.error('got e = ', e);
                expect(e.toString()).toContain("you should not get here");
                done();
            });
        }, function (e) {
            logger.error('could not insert before get, e = ', e);
            expect(e).toBe("you-should-not-get-here-either");
            done();
        });
    });
    it('getById invalid id', function (done) {
        var sut = sensor.getById("invalid-ID");
        sut.subscribe(function (s) {
            // you should not get here
            expect(s).toBeNull();
            done();
        }, function (e) {
            expect(e.toString()).toContain("Argument passed");
            done();
        });
    });
    it('collectionName is sane', function () {
        var sut = sensor.getCollectionName();
        expect(sut).toContain("model");
        expect(sut).toContain("sensor");
    });
    it('post(obj) returns string ID', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            done();
        });
    });
    it('post(obj) can getByID again', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.getById(s).subscribe(function (d) {
                expect(d._id.toString()).toEqual(s);
                done();
            });
        });
    });
    it('post(obj) can get again', function (done) {
        var sut = sensor.post({
            name: "sensor 4",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.get().subscribe(function (d) {
                expect(d.length).toBeGreaterThan(0);
                expect(d[0]._id.toString().length).toEqual(24);
                done();
            });
        });
    });
    it('post(obj) can delete again', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.delete(s).subscribe(function (d) {
                expect(d).toEqual(1);
                done();
            });
        });
    });
    it('post(obj) and deleteAll', function (done) {
        var sut = sensor.post({
            name: "sensor 3",
            host: "rpi99",
            type: {
                name: "soil"
            }
        });
        expect(sut instanceof Rx_1.Observable).toBe(true);
        sut.subscribe(function (s) {
            expect(s).toEqual(jasmine.any(String));
            sensor.deleteAll().subscribe(function (d) {
                expect(d).toEqual(1);
                done();
            });
        });
    });
});
