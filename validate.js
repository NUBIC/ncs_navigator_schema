var validate = require('vendor/json-schema'),
    fs = require('fs'),
    schemaFile = process.argv[2],
    incomingJSON = "";

process.stdin.resume();

process.stdin.on('data', function (chunk) {
  incomingJSON = incomingJSON + chunk;
});

process.stdin.on('end', function (chunk) {
  fs.readFile(schemaFile, function (err, data) {
    var schema = JSON.parse(data),
        instance = JSON.parse(incomingJSON),
        result = validate(instance, schema);

    console.info('Valid:', result.valid);
    console.info('Errors:', result.errors);
  });
});

// vim: ts=2:sw=2:et:tw=80
