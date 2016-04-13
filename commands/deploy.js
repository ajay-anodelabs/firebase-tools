'use strict';

var Command = require('../lib/command');
var requireAccess = require('../lib/requireAccess');
var requireConfig = require('../lib/requireConfig');
var acquireRefs = require('../lib/acquireRefs');
var deploy = require('../lib/deploy');
var previews = require('../lib/previews');
var _ = require('lodash');

// in order of least time-consuming to most time-consuming
var VALID_TARGETS = ['database', 'storage', 'functions', 'hosting'];
if (!previews.functions) {
  VALID_TARGETS.splice(2, 1);
}

module.exports = new Command('deploy')
  .description('deploy code and assets to your Firebase project')
  .option('-p, --public <path>', 'override the Hosting public directory specified in firebase.json')
  .option('-m, --message <message>', 'an optional message describing this deploy')
  .option('--only <targets>', 'only deploy to specified, comma-separated targets (e.g. "hosting,storage")')
  .before(requireConfig)
  .before(requireAccess)
  .before(acquireRefs)
  .action(function(options) {
    var targets = VALID_TARGETS;
    if (options.only) {
      targets = _.intersection(targets, options.only.split(','));
    }
    return deploy(targets, options);
  });
