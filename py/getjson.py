import json

def loadFont():
	f = open("../data/6vdy_url.json",encoding='utf-8')
	setting = json.load(f)
	print(setting["links"])

print(loadFont())