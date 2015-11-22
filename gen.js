#!/usr/bin/env node

'use strict';

require('./lib.js');

const program = require('commander'),
      util    = require('util');

program
    .version('0.1.0')
    .option('-l', '--lang [lang]', 'Language to output')
    .parse(process.argv);


let parser = new Parser();

console.log(util.inspect(parser.p(parser.l('nthRoot(a^3 + b^3, 3)')), { depth: null }));
