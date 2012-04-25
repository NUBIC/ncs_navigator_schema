var JSV = require('vendor/jsv').JSV,
    fs = require('fs'),
    env = JSV.createEnvironment(),
    schemaFile = process.argv[2],
    incomingJSON = "",
    relatedSchemata = [
      'http://download.nubic.northwestern.edu/surveyor/api_id_schema.json',
      'http://download.nubic.northwestern.edu/ncs_navigator/entity_id_schema.json',
      'http://download.nubic.northwestern.edu/ncs_navigator/response_set_schema.json',
      'http://download.nubic.northwestern.edu/ncs_navigator/versioned_entity_schema.json'
    ];

// Hook up related schemata.
relatedSchemata.forEach(function (schema) {
  var file = schema.split('/').reverse()[0]

  fs.readFile(file, function (err, data) {
    if (!data) {
      console.error('Unable to read', schema);
      process.exit(1);
    }

    env.createSchema(JSON.parse(data), undefined, schema + '#');
  });
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
