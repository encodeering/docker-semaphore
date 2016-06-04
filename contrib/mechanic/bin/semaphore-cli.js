#!/usr/bin/env node
/**
 * Date: 27.05.2016
 * Time: 22:19
 *
 * @author Michael Clausen
 * @version $Id: $Id
 */
'use strict';

let r         = require ('ramda');
let program   = require ('commander');
let semaphore = require ('../dist/semaphore');

program.command ('project <cmd> <project>')
       .option  ('--branch [string]', '', r.identity, 'master')
       .option  ('--attributes [list]', '', r.split (','), [])
       .action  (semaphore.project).on ('--help', function () {
           debug ('  Examples:');
           debug ('');
           debug ('    $ project branch                    <project>');
           debug ('    $ project status  [--branch=master] <project>');
           debug ('    $ project history [--branch=master] <project>');
           debug ('');
       });

program.command ('job <cmd> <project>')
       .option  ('--branch [string]', '', r.identity, 'master')
       .option  ('--build <number>',  '', parseInt)
       .option  ('--attributes [list]', '', r.split (','), [])
       .action  (semaphore.job).on ('--help', function () {
           debug ('  Examples:');
           debug ('');
           debug ('    $ job info    [--branch=master] --build=1 <project>');
           debug ('    $ job log     [--branch=master] --build=1 <project>');
           debug ('    $ job rebuild [--branch=master] --build=1 <project>');
           debug ('    $ job launch  [--branch=master] --build=1 <project>');
           debug ('    $ job deploy  [--branch=master] --build=1 <project>');
           debug ('    $ job stop    [--branch=master] --build=1 <project>');
           debug ('');
       });

program.parse (process.argv);
