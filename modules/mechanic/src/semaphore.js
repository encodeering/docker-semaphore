/**
 * Date: 27.05.2016
 * Time: 14:07
 *
 * @author Michael Clausen
 * @version $Id: $Id
 */
'use strict';

const { die, print, trydie, promisefy } = require ('./utility');

const q         = require ('q');
const r         = require ('ramda');
const semaphore = require ('semaphore-api') ({ logger : console }).withOptions ({
    authToken    : process.env['SEMAPHORECI_API_KEY'],
    errorHandler : die
});

q.onerror = e => die ({ statusCode : 0, body : e.message });

const projects =         promisefy ((...args) =>        semaphore.projects                 (...args));
const builds   = type => promisefy ((...args) =>        semaphore.builds   (args[0])[type] (...args.slice (1)));
const branches = type => promisefy ((...args) => type ? semaphore.branches (args[0])[type] (...args.slice (1))
                                                      : semaphore.branches                 (...args));

const pick = keys => {
    // pick requires: (value, key) => true or false
    return r.pickBy (r.isEmpty (keys) ?            r.always
                                      : r.compose (r.partialRight (r.contains, [keys]), r.nthArg (1)))
};

const search = name => {
    return projects ().then (response => response.find (project => project.name === name));
};

module.exports = {

    get project () {
        return trydie ((cmd, project, options) => { // destructuring would be nice
           const branch = options.branch;
           const attributes = options.attributes;

           if (cmd === 'branch') return search (project).get ('hash_id').then (      branches (   )             ).then (pick (attributes)).then (print).done ();
           else
                                 return search (project).get ('hash_id').then (id => branches (cmd) (id, branch)).then (pick (attributes)).then (print).done ();
       });
    },

    get job () {
        return trydie ((cmd, project, options) => { // destructuring would be nice
           const branch  = options.branch;
           const build   = options.build;
           const attributes = options.attributes;

           return search (project).get ('hash_id').then (id => builds (cmd) (id, branch, build)).then (pick (attributes)).then (print).done ();
       });
    }

};
