# this must be a location that scp can parse
UPLOAD_TO = 'download.nubic.northwestern.edu:/var/www/sites/download.nubic/ncs_navigator'
HOST = UPLOAD_TO.split(':').first

desc "Deploy working copies of schemata to #{HOST}"
task :deploy do
  sh "scp *_schema.json #{UPLOAD_TO}"
end

desc "Validate schemata against draft 03"
task :validate do
  sh "ruby util/validate.rb"
end
