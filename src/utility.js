/**
 * Date: 28.05.2016
 * Time: 16:11
 *
 * @author Michael Clausen
 * @version $Id: $Id
 */
'use strict';

const q       = require ('q');
const r       = require ('ramda');
const yaml    = require ('js-yaml');

const debug   = (...args) => console.log (...args);

const print   = r.compose (debug, yaml.dump);
const die     = r.compose (() => process.exit (1), print, r.partial (r.props, [['statusCode', 'body']]));

module.exports = {

    die,

    print,

    promisefy (callback) {
        return function (...args) {
            let deferred = q.defer ();

            q.fcall (callback, ...args, deferred.resolve).fail (deferred.reject);

            return deferred.promise;
        }
    },

    trydie (callback) {
        return function (...args) {
           try {
               callback (...args);
           } catch                                 (e) {
               return die ({ statusCode : 0, body : e.message });
           }
        }
    }

};
