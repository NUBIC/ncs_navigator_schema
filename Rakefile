# this must be a location that scp can parse
UPLOAD_TO = 'download.nubic.northwestern.edu:/var/www/sites/download.nubic/ncs_navigator'
HOST = UPLOAD_TO.split(':').first

desc "Deploy working copies of schemata to #{HOST}"
task :deploy do
  sh "scp *_schema.json #{UPLOAD_TO}"
end

desc "Validate schemata against draft 03"
task :validate do
  schemata = Dir['*_schema.json']

  schemata.each do |schema|
    sh "cat #{schema} | node validate.js vendor/JSV/schemas/json-schema-draft-03/schema.json"
  end
end
