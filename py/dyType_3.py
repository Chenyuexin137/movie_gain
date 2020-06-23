#!/usr/bin/env python2
# -*- coding=utf-8 -*-

from DouBanSpider_3 import DouBanSpider
from multiprocessing import Process, Queue
# from importlib import reload
import urllib.request as urllib2
import urllib
import json
import sys

# reload(sys)
# sys.setdefaultencoding('utf8')

class dyType():
	def __init__(self,typeName):
		self.typeName = typeName
		self.url = ""
		self.pageNum = 1
		self.urlList = []
		self.mainnet = ""

	def getURL(self):
		# with open("../data/6vdy_url.json","r") as f:
		# 	data = json.load(f)
			# urls = data["links"]
			# suffix = data["suffix"]
			# self.mainnet = data["mainnet"]
		f = open("../data/6vdy_url.json",encoding='utf-8')
		data = json.load(f)
		urls = data["links"]
		suffix = data["suffix"]
		self.mainnet = data["mainnet"]

		for x in urls:
			if x["name"] == self.typeName:
				self.url = x["url"]
		if self.pageNum == 1:
			self.urlList = [self.url + str(self.pageNum) + suffix for self.pageNum in range(self.pageNum+1,self.pageNum+5)]
			self.urlList.append(self.url[:-1] + suffix)
		else:
			self.urlList = [self.url + str(self.pageNum) + suffix for self.pageNum in range(self.pageNum,self.pageNum+5)]

	def Start(self):
		while True:
			self.getURL()
			q = Queue()
			Process_list = []
			for url in self.urlList:
				p = DouBanSpider(url,self.mainnet,q)
				p.start()
				Process_list.append(p)

			for i in Process_list:
				i.join()

			while not q.empty():
				print(q.get())

			self.pageNum = self.pageNum + 5
			yield

def main():
	dytype = dyType(input("请输入电影类型:"))
	start = dytype.Start()
	while True:
		if input("more") == 'quit':
			break
		start.__next__()

if __name__ == '__main__':
	main()