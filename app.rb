require File.expand_path(File.dirname(__FILE__) + '/config/init')
require 'sinatra'
require 'sinatra/content_for'
require 'sinatra/reloader' if development?
require 'haml'
require 'sass'
require 'rdiscount'
require 'net/http'
require 'uri'
require 'json'

# Bitly
BITLY_USER = ENV['BITLY_USER'] || @bitly_user
BITLY_SECRET = ENV['BITLY_SECRET'] || @bitly_secret

class Document 
  include MongoMapper::Document
  key         :url,             String,   :required => true
  key         :secret,          String,   :required => true
  key         :title,           String
  key         :short_url,       String
  key         :short_url_edit,  String
  many        :versions
end

class Version
  include MongoMapper::EmbeddedDocument
  key         :text,          String
  key         :saved,         Time
end

get '/' do
  haml :index
end

post '/' do
  hash = uuid
  secret = uuid(32)
  bitly = JSON.parse( Net::HTTP.get( "api.bit.ly", "/v3/shorten?login=#{BITLY_USER}&apiKey=#{BITLY_SECRET}&longUrl=#{URI.escape('http://nascentwords.com/'+hash)}" ) )['data']['url']
  bitly_edit = JSON.parse( Net::HTTP.get( "api.bit.ly", "/v3/shorten?login=#{BITLY_USER}&apiKey=#{BITLY_SECRET}&longUrl=#{URI.escape('http://nascentwords.com/'+hash+'?secret='+secret)}" ) )['data']['url']
  @document = Document.new( :title => params[:title], 
                            :url => hash,
                            :short_url_edit => bitly_edit, 
                            :short_url => bitly,
                            :secret => secret )
  @document.versions.build(:text => '', :saved => Time.now)
  raise 500 unless @document.save!
  redirect @document.url + '?secret=' + @document.secret
end

get '/:url' do
  @document = Document.where(:url => params[:url]).last
  if @document.secret == params[:secret]
    haml :edit 
  else
    haml :view
  end
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

get '/stylesheets/*' do
  content_type 'text/css'
  sass '../styles/'.concat(params[:splat].join.chomp('.css')).to_sym
end

def uuid(size=6)
  chars = ('a'..'z').to_a + ('A'..'Z').to_a + (0..9).to_a
  (0...size).collect { chars[Kernel.rand(chars.length)] }.join
end