var JSV = require('vendor/jsv').JSV,
    fs = require('fs'),
    env = JSV.createEnvironment(),
    schemaFile = process.argv[2],
    schemaBase = 'http://download.nubic.northwestern.edu/ncs_navigator',
    incomingJSON = "";

// Hook up related schemata.
fs.readFile('entity_id_schema.json', function (err, data) {
  if (!data) {
    console.error('Unable to read entity ID schema');
    process.exit(1);
  }

  env.createSchema(JSON.parse(data), undefined, schemaBase + '/entity_id_schema.json#');
});

fs.readFile('versioned_entity_schema.json', function (err, data) {
  if (!data) {
    console.error('Unable to read versioned entity schema');
    process.exit(1);
  }

  env.createSchema(JSON.parse(data), undefined, schemaBase + '/versioned_entity_schema.json#');
});

process.stdin.resume();

process.stdin.on('data', function (chunk) {
  incomingJSON = incomingJSON + chunk;
});

process.stdin.on('end', function (chunk) {
  fs.readFile(schemaFile, function (err, data) {
    var schema = JSON.parse(data),
        instance = JSON.parse(incomingJSON),
        result = env.validate(instance, schema),
        valid = result.errors.length === 0;

    console.info('Valid:', valid);
    console.info('Errors:', result.errors);

    process.exit(valid ? 0 : 1);
  });
});

// vim: ts=2:sw=2:et:tw=80
