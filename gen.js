#!/usr/bin/env node

'use strict';

require('./lib.js');

const program = require('commander'),
      util    = require('util'),
      fs      = require('fs'),
      path    = require('path');

program
    .version('0.1.0')
    .usage('[options] <language>')
    .parse(process.argv);

let language = path.join('lang', program.args[0] + '.js');
let exists = false;
try {
    let stats = fs.lstatSync(language);

    if (stats.isFile())
        exists = true;
} catch (e) {}

if (!exists) {
    console.error('MathGen: Supplied language does not exist');
    process.exit(2);
}

language = require('./' + language).handler;

process.stdin.setEncoding('utf8');
process.stdin.resume();
let input = [];
process.stdin.on('data', function (chunk) {
    input.push(chunk);
});
process.stdin.on('end', function () {
    input = input.join();

    let parser = new Parser();

    let output = language(parser.p(parser.l(input)));

    console.log(output);
});
