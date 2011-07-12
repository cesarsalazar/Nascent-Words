require File.expand_path(File.dirname(__FILE__) + '/config/init')
require File.expand_path(File.dirname(__FILE__) + '/lib/bitly')
require 'sinatra'
require 'sinatra/content_for'
require 'sinatra/reloader' if development?
require 'haml'
require 'sass'
require 'rdiscount'

class Document 
  include MongoMapper::Document
  key         :url,           String,   :required => true
  key         :secret,        String,   :required => true
  key         :short_url,     String
  key         :title,         String
  many        :versions
end

class Version
  include MongoMapper::EmbeddedDocument
  key         :text,          String
  key         :saved,         Time
end

get '/stylesheets/*' do
  content_type 'text/css'
  sass '../styles/'.concat(params[:splat].join.chomp('.css')).to_sym
end

get '/' do
  haml :index
end

get '/bitly' do
  hash = uuid
  
  puts bitly
end

post '/' do
  hash = uuid;
  bitly = JSON.parse( Net::HTTP.get( "api.bit.ly", "/v3/shorten?login=cesarsalazar&apiKey=R_f1646f39953fe388a735b86007f535b5&longUrl=#{URI.escape('http://nascentwords.com/'+hash)}" ) )['data']['url']
  @document = Document.new( :title => params[:title], 
                            :url => hash,
                            :short_url => bitly, 
                            :secret => uuid(32) )
  @document.versions.build(:text => '', :saved => Time.now)
  raise 500 unless @document.save!
  redirect @document.url
end

get '/:url' do
  @document = Document.where(:url => params[:url]).last
  haml :doc
end

post '/:url' do
  @document = Document.where(:url => params[:url]).last
  @document.set( :title => params[:title] ) if params[:title]
  @document.reload
  @document.versions.build( :text => params[:text], :saved => Time.now ) if params[:text]
  raise 500 unless @document.save!
  content_type :json
  return [:status => 200, :response => "Great success!", :title => @document.title].to_json
end

def uuid(size=6)
  chars = ('a'..'z').to_a + ('A'..'Z').to_a + (0..9).to_a
  (0...size).collect { chars[Kernel.rand(chars.length)] }.join
end