#!/usr/bin/env python2
# -*- coding=utf-8 -*-

from multiprocessing import Process, Queue
from lxml import etree
import requests

class DouBanSpider(Process):
    def __init__(self, url,mainnet,q):
        # 重写写父类的__init__方法
        super(DouBanSpider, self).__init__()
        self.url = url
        self.mainnet = mainnet
        self.q = q
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36',
        }

    def run(self):
        self.parse_page()

    def send_request(self,url):
        '''
        用来发送请求的方法
        :return: 返回网页源码
        '''
        # 请求出错时，重复请求３次,
        i = 0
        while i <= 3:
            try:
                print u"[INFO]请求url:"+url
                return requests.get(url=url,headers=self.headers).content
            except Exception as e:
                print u'[INFO] %s%s'% (e,url)
                i += 1

    def parse_page(self):
        '''
        解析网站源码，并采用ｘｐａｔｈ提取　电影名称和平分放到队列中
        :return:
        '''
        # try:
    	response = self.send_request(self.url)
        html = etree.HTML(response)
        #　获取到一页的电影数据
        node_list = html.xpath("//ul[@class='list']/li")
        for move in node_list:
            # 电影名称
            title = move.xpath('./a/text()')
            if len(title)!=0:
                title = title[0]
            else:
                title = move.xpath('./a/font/text()')[0]
            # 链接
            content = self.mainnet + move.xpath("./a/@href")[0]
            # print title + "\t" + content
           
            # 将每一部电影的名称跟评分加入到队列
            self.q.put(title + "\t" + content)
        # except Exception:
        # 	print self.url
        # 	print "===========网页请求超时或丢失=========="


if __name__ == '__main__':
	main()