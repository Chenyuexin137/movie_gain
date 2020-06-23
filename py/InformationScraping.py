def InfoScraping(html):
	# print(type(html))
	a = html.find('.jpg" />')
	b = html.find('.jpg" />',a+1)
	c = html.find('<img alt="" src="')
	e = html.find('<table')
	f = html.find('</table>',e)
	image = html[c+17:a+4]
	url = html[e:f+8]
	i = url.find('磁力')
	g = url.find('href="',i)
	h = url.find('"',g+6)
	url = url[g+6:h]
	# print(url)
	content = html[a+17:b-57].replace('\n','').replace('\t','').replace("&nbsp;","\n").replace("<br />","\n")

	while True:
		e = content.find('<')
		f = content.find('>',e)
		if e==-1 or f== -1:
			break 
		content = content.replace(content[e:f+2],"")

	content = content.replace("\>","").replace('p>',"").replace('<',"").replace('>','').replace('\r','')
	# print(content)
	data = {
		"img":image,
		"content":content,
		"url":url
	}
	return data

def main():
	with open("../data/temporaty.html","r") as f:
		content = f.read()
	print(InfoScraping(content))

if __name__ == '__main__':
	main()