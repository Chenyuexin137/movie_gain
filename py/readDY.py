#!/usr/bin/env python
# -*- coding:utf-8 -*-

import urllib.request as urllib2
import urllib
import json
import os
from lxml import etree
from InformationScraping import InfoScraping

def getMovie(url):
	firlePath = '../data/movie.json'
	url = url
	headers = {"User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1;"}
	request = urllib2.Request(url,headers=headers)

	html = urllib2.urlopen(request).read().decode('gbk')
	jsonMovie = InfoScraping(html)

	if (os.path.exists(firlePath)):
		os.remove(firlePath)
	with open(firlePath,'w',encoding="utf-8") as f:
		json.dump(jsonMovie,f,indent=2,sort_keys=True, ensure_ascii=False)

def main():
	url = "http://www.hao6v.com/jddy/2019-12-11/YGSBYYDPY.html"
	getMovie(url)
	firle = open("../data/movie.json",encoding='utf-8')
	setting = json.load(firle)
	print(setting)

if __name__ == '__main__':
	main()