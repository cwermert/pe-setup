#!/usr/bin/env node

'use strict';
var inquirer = require('inquirer');
var replace = require('replace');
var pkg = 'package.json';
var cfg = 'config/default.js';
var git = require('git-rev');

// Make sure they're not on the master branch before we do anything.
git.branch(function(str){
  console.log('branch', str)
})

var config = {
  "messages": {
    "web_port": "<SUPPLY A PORT FOR THE APPLICATION WEB SERVER>",
    "socket_port": "<SUPPLY A PORT FOR THE APPLICATION SOCKET SERVER>",
    "rest_port": "<SUPPLY A PORT FOR THE APPLICATION REST SERVER>",
    "entry_point": "MAINENTRYPOINT",
    "log_file": "<USE THE SAME NAME AS THE MAIN ENTRY POINT FILE>"
  }
}

var swap = function swap(str, newVal, file){
  replace({
    regex: str,
    replacement: newVal,
    paths: [file],
    recursive: true,
    silent: false,
  });
}

var validatePort = function validatePort(port) {
  var pass = port >= 1025 && port <= 49342
  if(pass) {
    return true;
  } else {
    return "Please enter a valid port (1025 - 49342)";
  }
}

var questions = [{
    type: "input",
    name: "app_name",
    message: "What do you want to name your entry file?",
    default: function () { return "new-app"; }
  },
  {
    type: "input",
    name: "web_port",
    message: "What port should your web server run on?",
    validate: function(port){
      return validatePort(port)
    },
    default: function () { return "1337"; }
  },
  {
    type: "input",
    name: "socket_port",
    message: "What port should your socket server run on?",
    validate: function(port){
      return validatePort(port)
    },
    default: function () { return "1338"; }
  },
  {
    type: "input",
    name: "rest_port",
    message: "What port should your REST server run on?",
    validate: function(port){
      return validatePort(port)
    },
    default: function () { return "1339"; }
  }];

  inquirer.prompt(questions, function(answers){
    fs.rename('./content/app.js', './content/' + answers.app_name + '.js', function (err) {
      if (err) throw err;
    });
    swap(config.messages.entry_point, answers.app_name + '.js', pkg)
    swap('peseed', answers.app_name, pkg)
    swap(config.messages.web_port, answers.web_port, cfg)
    swap(config.messages.socket_port, answers.socket_port, cfg)
    swap(config.messages.rest_port, answers.rest_port, cfg)
    swap(config.messages.log_file, answers.app_name, cfg)
    console.log('\n\n\nDone configuring!\n\n\n');
  });
