from threading import Thread
from readDY import getMovie
# from dyType import dyType
import struct
import time
import hashlib
import base64
import socket
import types
import multiprocessing
import os
import json
mode = "initialize"
pic_size = 0
pic_receive = 0
pic = ""
pic_repeat = []

class returnCrossDomain(Thread):
	def __init__(self,connection):
		Thread.__init__(self)
		self.con = connection
		self.isHandleShake = False
		self.jsonData = "6666666666"

	def run(self):
		global mode
		while True:
			if not self.isHandleShake:
				#开始握手阶段
				header = self.analyzeReq()
				secKey = header['Sec-WebSocket-Key']
				acceptKey = self.generateAcceptKey(secKey)
				response = "HTTP/1.1 101 Switching Protocols\r\n"
				response += "Upgrade: websocket\r\n"
				response += "Connection: Upgrade\r\n"
				response += "Sec-WebSocket-Accept: %s\r\n\r\n" % (acceptKey.decode('utf-8'))
				self.con.send(response.encode())
				self.isHandleShake = True
				if(mode=="initialize"):
					mode = "get_order"
				print('response:\r\n' + response)
                #握手阶段结束

			elif mode == "get_order":
				#开始读取命令
				opcode = self.getOpcode()#读取操作码
				if opcode == 8:
					self.con.close()#断开连接
					print("连接已断开")
				self.getDataLength()
				clientData = self.readClientData()#获取客户端JS传回数据
				print("客户端数据："+str(clientData))
				#对数据进行处理
				ans = self.answer(clientData)
				self.sendDataToClient(ans)

	def analyzeReq(self):
		reqData = self.con.recv(1024).decode()
		reqList = reqData.split('\r\n')
		headers = {}
		for reqItem in reqList:
			if ': ' in reqItem:
				unit = reqItem.split(': ')
				headers[unit[0]] = unit[1]
		return headers

	#生成连接
	def generateAcceptKey(self, secKey):
		sha1 = hashlib.sha1()
		sha1.update((secKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode())
		sha1_result = sha1.digest()
		acceptKey = base64.b64encode(sha1_result)
		return acceptKey

	#获取操作码
	def getOpcode(self):
		first8Bit = self.con.recv(1)
		first8Bit = struct.unpack('B', first8Bit)[0]
		opcode = first8Bit & 0b00001111
		return opcode

	#获取数据长度
	def getDataLength(self):
		second8Bit = self.con.recv(1)
		second8Bit = struct.unpack('B', second8Bit)[0]
		masking = second8Bit >> 7
		dataLength = second8Bit & 0b01111111
		#print("dataLength:",dataLength)
		if dataLength <= 125:
		    payDataLength = dataLength
		elif dataLength == 126:
		    payDataLength = struct.unpack('H', self.con.recv(2))[0]
		elif dataLength == 127:
		    payDataLength = struct.unpack('Q', self.con.recv(8))[0]
		self.masking = masking
		self.payDataLength = payDataLength
		#print("payDataLength:", payDataLength)


	#获取客户端数据
	def readClientData(self):

		if self.masking == 1:
			maskingKey = self.con.recv(4)
		data = self.con.recv(self.payDataLength)

		if self.masking == 1:
			i = 0
			trueData = ''
			for d in data:
				trueData += chr(d ^ maskingKey[i % 4])
				i += 1
			return trueData
		else:
			return data

	def sendDataToClient(self, text):
		sendData = ''
		sendData = struct.pack('!B', 0x81)

		length = len(text)
		if length <= 125:
			sendData += struct.pack('!B', length)
		elif length <= 65536:
			sendData += struct.pack('!B', 126)
			sendData += struct.pack('!H', length)
		elif length == 127:
			sendData += struct.pack('!B', 127)
			sendData += struct.pack('!Q', length)

		sendData += struct.pack('!%ds' % (length), text.encode())
		dataSize = self.con.send(sendData)

	def answer(self,data):
		if(data[0:3]=="DY|"):
			return self.getMovie(data)
		elif(data[0:3]=="DZ|"):
			return self.getJSON("DZ|")
		elif (data[0:3] == "AQ|"):
			return self.getJSON("AQ|")
		elif (data[0:3] == "XJ|"):
			return self.getJSON("XJ|")
		elif (data[0:3]=="JS|"):
			return self.getJSON("JS|")
		elif(data[0:3]=="KH|"):
			return self.getJSON("KH|")
		elif (data[0:3] == "QH|"):
			return self.getJSON("QH|")
		elif (data[0:3] == "SM|"):
			return self.getJSON("SM|")
		elif (data[0:3]=="HX|"):
			return self.getJSON("HX|")
		elif(data[0:3]=="KB|"):
			return self.getJSON("KB|")
		elif (data[0:3] == "ZZ|"):
			return self.getJSON("ZZ|")
		elif (data[0:3] == "MX|"):
			return self.getJSON("MX|")
		elif (data[0:3]=="JS|"):
			return self.getJSON("JS|")
		elif(data[0:3]=="JQ|"):
			return self.getJSON("JQ|")
		elif (data[0:3] == "ZJ|"):
			return self.getJSON("ZJ|")
		elif (data[0:3] == "LS|"):
			return self.getJSON("LS|")
		elif (data[0:3]=="JL|"):
			return self.getJSON("JL|")
		else:
			return "Unresolvable Command!"

	def padding(self,data):
		missing_padding = 4 - len(data) % 4
		if missing_padding:
			data += '='*missing_padding
		return data

	def getJSON(self,typeDY):
		if typeDY == "DZ|":
			firle = open("../data/dz.json",encoding='utf-8')
		elif typeDY == "AQ|":
			firle = open("../data/aq.json",encoding='utf-8')
		elif typeDY == "XJ|":
			firle = open("../data/xj.json",encoding='utf-8')
		elif typeDY == "KH|":
			firle = open("../data/kh.json",encoding='utf-8')
		elif typeDY == "QH|":
			firle = open("../data/qh.json",encoding='utf-8')
		elif typeDY == "SM|":
			firle = open("../data/sm.json",encoding='utf-8')
		elif typeDY == "HX|":
			firle = open("../data/hx.json",encoding='utf-8')
		elif typeDY == "KB|":
			firle = open("../data/kb.json",encoding='utf-8')
		elif typeDY == "ZZ|":
			firle = open("../data/zz.json",encoding='utf-8')
		elif typeDY == "MX|":
			firle = open("../data/mx.json",encoding='utf-8')
		elif typeDY == "JS|":
			firle = open("../data/js.json",encoding='utf-8')
		elif typeDY == "JQ|":
			firle = open("../data/jq.json",encoding='utf-8')
		elif typeDY == "ZJ|":
			firle = open("../data/zj.json",encoding='utf-8')
		elif typeDY == "LS|":
			firle = open("../data/ls.json",encoding='utf-8')
		elif typeDY == "JL|":
			firle = open("../data/jl.json",encoding='utf-8')
		else:
			firle = open("../data/6vdy_url.json",encoding='utf-8')
		setting = json.load(firle)
		return json.dumps(setting)

	def getMovie(self,data):
		print("===正在获取数据===")
		url = data[3:]
		getMovie(url)
		firle = open("../data/movie.json",encoding='utf-8')
		setting = json.load(firle)
		print("===获取数据成功===")
		return json.dumps(setting)



def main():
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sock.bind(('127.0.0.1', 9999))
	sock.listen(5)
	while True:
		try:
			connection, address = sock.accept()
			returnCrossDomain(connection).start()
		except:
			if 'Y' == input("是否退出？(Y)"):
				break
			time.sleep(1)

if __name__ == "__main__":
	main()