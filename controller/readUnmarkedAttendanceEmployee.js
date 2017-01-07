var express = require('express');
var router = express.Router();
var commonMethod = require("../common/commonMethod");
var deriveDataEvent = require("../common/events");

router.get("/", function(req, res) {
    try {
        var timeStamp = req.query.timeStamp,
            date = commonMethod.getFullTimeStamp(timeStamp),
            obj={};

        deriveDataEvent.readEmployeeUnmarkedAttendance(date).then(function(attendance){
            deriveDataEvent.readEmployeeSnapshot(attendance).then(function(data){
              obj.umarkedEmployee=data.employeeSnapshot;
              obj.timeStamp=timeStamp;
              obj.unmarkedNumber=attendance.length;
              obj.totalEmployee=data.totalEmployee;
              res.send(obj);
            });
        });
    } catch (e) {
      res.status(401).send("Bad Parameter or invalid token");
    }
});

module.exports = router;
