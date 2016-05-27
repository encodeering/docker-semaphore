/**
 * Date: 27.05.2016
 * Time: 14:07
 *
 * @author Michael Clausen
 * @version $Id: $Id
 */
'use strict';

const debug   = (...args) => console.log (...args);

const q         = require ('q');
const r         = require ('ramda');
const yaml      = require ('js-yaml');

const print   = r.compose (debug, yaml.dump);
const die     = r.compose (() => process.exit (1), print, r.partial (r.props, [['statusCode', 'body']]));

const semaphore = require ('semaphore-api') ({ logger : console }).withOptions ({
    authToken    : process.env['SEMAPHORECI_API_KEY'],
    errorHandler : die
});

q.onerror = e => die ({ statusCode : 0, body : e.message });

const trydie = callback => {
    return function (...args) {
       try {
           callback (...args);
       } catch                                 (e) {
           return die ({ statusCode : 0, body : e.message });
       }
    }
};

const promisefy = callback => {
    return function () {
        let deferred = q.defer ();

        let args = [].slice.call (arguments);
            args.push (deferred.resolve);

        callback (...args);

        return deferred.promise;
    }
};

const projects =         promisefy ((...args) =>        semaphore.projects                 (...args));
const builds   = type => promisefy ((...args) =>        semaphore.builds   (args[0])[type] (...args.slice (1)));
const branches = type => promisefy ((...args) => type ? semaphore.branches (args[0])[type] (...args.slice (1))
                                                      : semaphore.branches                 (...args));

const search = name => {
    return projects ().then (response => response.find (project => project.name === name));
};

module.exports = {

    get general () {
        return trydie ((cmd, project, options) => { // destructuring would be nice
           const branch = options.branch;

           if (cmd === 'branch') return search (project).get ('hash_id').then (      branches (   )             ).then (print).done ();
           else
                                 return search (project).get ('hash_id').then (id => branches (cmd) (id, branch)).then (print).done ();
       });
    },

    get build () {
        return trydie ((cmd, project, options) => { // destructuring would be nice
           const branch  = options.branch;
           const build   = options.build;

           return search (project).get ('hash_id').then (id => builds (cmd) (id, branch, build)).then (print).done ();
       });
    }

};
