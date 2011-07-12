require 'rubygems'
require 'yaml'
require 'mongo_mapper'
require 'log_buddy'

# Else read the local configuration
@config = YAML.load_file("config/database.yaml")
  
@environment = @config["environment"]

@db_host = @config[@environment]["host"]
@db_port = @config[@environment]["port"]
@db_name = @config[@environment]["database"]
@db_log = @config[@environment]["logfile"]

# Configure the environment

if ENV['MONGOHQ_URL']
  DB_ENV = nil
  MongoMapper.config = {DB_ENV => {'uri' => ENV['MONGOHQ_URL']}}
  MongoMapper.database = @db_name
  MongoMapper.connect(DB_ENV)
else
  log_dir = File.expand_path('../log/', __FILE__)
  logger = Logger.new(log_dir + @db_log)
  
  LogBuddy.init(:logger => logger)
  MongoMapper.connection = Mongo::Connection.new(@db_host, @db_port, :logger => logger)
  MongoMapper.database = @db_name

  MongoMapper.connection.connect
end