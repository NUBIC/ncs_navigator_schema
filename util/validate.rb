require 'jsv'
require 'json'
require 'pp'

schema_dir = File.expand_path('../..', __FILE__)
schema_fns = Dir["#{schema_dir}/*schema.json"]

refs = File.read(File.expand_path('../refs.json', __FILE__))
draft03 = File.read(File.expand_path('../../vendor/json-schema/draft-03/schema', __FILE__))

ctx = JSV::Context.new
env = ctx.create_environment('json-schema-draft-03')
refs = JSON.parse(refs)['refs']

refs.each do |ref|
  puts "Loading #{ref['fn']}"
  data = File.read("#{schema_dir}/#{ref['fn']}")
  env.create_schema(data, nil, ref['$ref'])
end

ok = schema_fns.map do |fn|
  schema = File.read(fn)
  report = env.validate(schema, draft03)

  (!report.has_errors?).tap do
    puts fn
    puts '-' * fn.length
    if report.has_errors?
      pp errors
    else
      puts 'No errors'
    end

    puts
  end
end

if ok.all?
  puts 'All OK'
  exit 0
else
  puts 'Errors detected'
  exit 1
end
