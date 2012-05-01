var JSV = require('vendor/JSV').JSV,
    fs = require('fs'),
    env = JSV.createEnvironment(),
    schemaFile = process.argv[2],
    incomingJSON = "";

// Hook up refs.
fs.readFile('refs.json', function (err, data) {
  var refs, r;

  if (!data) {
    console.error('Unable to read referenced schema map (error:', err, ')');
    process.exit(1);
  }

  refs = JSON.parse(data);

  for (r in refs) {
    if (refs.hasOwnProperty(r)) {
      (function () {
        var ref = r, fn;

        fn = refs[ref];

        fs.readFile(fn, function (err, data) {
          if (!data) {
            console.error('Unable to read', fn, '(error:', err, ')');
            process.exit(1);
          }

          env.createSchema(JSON.parse(data), undefined, ref);
        });
      })();
    }
  }
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

// vim: ts=2:sw=2:et:tw=80:nocindent
