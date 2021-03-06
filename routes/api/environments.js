const express = require("express");
const router = express.Router();
var fs = require("fs");

// @route   GET api/environment/test
// @desc    Tests Environment route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Environment Works" }));

// @route   POST api/environment/machine
// @desc    Add machine to Environment
// @access  Private

router.post("/machine", (req, res) => {
  fs.readFile("environments.json", "utf8", function(err, envs) {
    if (envs) {
      envs = JSON.parse(envs);
      const { release, environment, machineName } = req.body;
      if (envs[release]) {
        let machineNames = envs[release][environment];
        machineNames[machineName] = {};
        newExp = {
          [release]: {
            [environment]: machineNames
          }
        };
        let allEnvsList = Object.keys(envs);
        let updatedEnvs = {};
        allEnvsList.map(env => {
          updatedEnvs[env] = envs[env];
        });
        fs.writeFile("environments.json", JSON.stringify(updatedEnvs), function(
          err
        ) {
          if (err) throw err;
          console.log("UPDATED MACHINES!!!!!!!!!!!", envs);
        });
      } else {
        let allEnvsList = Object.keys(envs);
        let updatedEnvs = {};
        allEnvsList.map(env => {
          updatedEnvs[env] = envs[env];
        });
        updatedEnvs[release] = {
          [environment]: {
            [machineName]: {}
          }
        };
        fs.writeFile("environments.json", JSON.stringify(updatedEnvs), function(
          err
        ) {
          if (err) throw err;
          console.log("CREATED RELEASE!!!!!!!!!!!!!", envs);
        });
      }
    } else {
      let updatedEnvs = {};
      updatedEnvs[release] = {
        [environment]: {
          [machineName]: {}
        }
      };
      fs.writeFile("environments.json", JSON.stringify(updatedEnvs), function(
        err
      ) {
        if (err) throw err;
        console.log("CREATED FILE & RELEASE.....!!!!", updatedEnvs);
      });
    }
  });
});

// @route   DELETE api/environment/machine/:exp_id
// @desc    Delete machine from environment
// @access  Private

router.delete("/machine/delete", (req, res) => {
  fs.readFile("environments.json", "utf8", function(err, data) {
    if (data) {
      let envs = JSON.parse(data);
      console.log(req.body, Object.keys(envs));
      const { release, environment, machineName } = req.body;
      if (!envs[release]) {
        console.log("release not found");
      } else if (!envs[release][environment]) {
        console.log("machine not found");
      } else if (envs[release][environment][machineName]) {
        delete envs[release][environment][machineName];
        fs.writeFile("environments.json", JSON.stringify(envs), function(err) {
          if (err) throw err;
          console.log("DELETED.....!!!!", machineName);
        });
      }
    } else {
      console.log("not found");
    }
  });
});

router.get("/all-machines", (req, res) => {
  fs.readFile("environments.json", "utf8", function(err, data) {
    if (data) {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
