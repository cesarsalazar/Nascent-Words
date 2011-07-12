# Tiny bit.ly API library for Ruby
# http://github.com/hermit/ruby-bitly
# 
# License: The MIT License
# Copyright (c) 2010 Akio Kitano <akio.kitano.00@gmail.com>

require 'rubygems'
require 'json'
require 'net/http'
require 'cgi'

class BitLy
  def initialize(login = nil, api_key = nil)
    @login = login
    @api_key = api_key
    unless @login or @api_key
      o = eval(File.read("#{ENV['HOME']}/config/.bitly.rb"))
      @login = o[:login]
      @api_key = o[:api_key]
    end
  end

  def ly(url)
    r = JSON.parse(Net::HTTP.get('api.bitly.com',
       "/v3/shorten?login=#@login&apiKey=#@api_key&longUrl=#{CGI.escape url}"))
    unless r['status_code'] == 200
      raise BitLy::Error, r
    end
    r['data']['url']
  end

  class Error < RuntimeError
    def initialize(x)
      @result = x
    end
    attr :result
  end
end