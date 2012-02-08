var JSV = require('vendor/jsv').JSV,
    fs = require('fs'),
    env = JSV.createEnvironment(),
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
        result = env.validate(instance, schema);

    console.info('Valid:', result.errors.length === 0);
    console.info('Errors:', result.errors);
  });
});

// vim: ts=2:sw=2:et:tw=80
