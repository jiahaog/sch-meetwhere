# import requests
# import urllib
# import time
import sklearn.cluster

# autocomplete_url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyD0uW4hBjaVJ23PZ3NDTL3EAiANNElrD0A&components=country:sg&input="

# place_details_url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyD0uW4hBjaVJ23PZ3NDTL3EAiANNElrD0A&placeid="

# nearby_search_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?types=food&radius=5000&key=AIzaSyD0uW4hBjaVJ23PZ3NDTL3EAiANNElrD0A&location='

# def pause():
# 	time.sleep(5)	

# data_set = set()

# out = open("out","w+")

# with open('district','r') as districts:
# 	for district in districts:
# 		r = requests.get(autocomplete_url+district.rstrip())
# 		# print r.json()
# 		if(len(r.json()['predictions'])>0):
# 			place_id = r.json()['predictions'][0]['place_id']
# 			pause()
# 			r1 = requests.get(place_details_url+place_id)
# 			latlng = str(r1.json()['result']['geometry']['location']['lat']) +','+ str(r1.json()['result']['geometry']['location']['lng'])
# 			pause()
# 			r2 = requests.get(nearby_search_url+latlng)
# 			for result in r2.json()['results']:
# 				data_set.add((result['geometry']['location']['lat'],result['geometry']['location']['lng'],result['place_id']))
# 				out.write(str((result['geometry']['location']['lat'],result['geometry']['location']['lng'],result['place_id'])))
# 			end = False
# 			while(not end):
# 				pause()
# 				if u'next_page_token' not in r2.json():
# 					end = True
# 				else:
# 					r2 = requests.get(nearby_search_url+latlng+"&pagetoken="+r2.json()[u'next_page_token'])
# 					for result in r2.json()['results']:
# 						data_set.add((result['geometry']['location']['lat'],result['geometry']['location']['lng'],result['place_id']))
# 						out.write(str((result['geometry']['location']['lat'],result['geometry']['location']['lng'],result['place_id'])))
# 			pause()
# 			print "End cycle"

# data_set = set()

# with open('out','r') as data:
# 	for line in data:
# 		data_tuple = tuple(line.rstrip(')').lstrip('(').split(','))
# 		print data_tuple
# 		data_set.add(data_tuple)

# out_no_dupes = open('parsed_out','w+')
# for data_tuple in data_set:
# 	out_no_dupes.write(data_tuple[0]+" "+data_tuple[1]+"\n")

data_set = []

with open('parsed_out', 'r') as data:
	for line in data:
		data_set.append([float(i) for i in line.split()])

print len(data_set)
centroid, label, inertia = sklearn.cluster.k_means(data_set, 19)

print centroid
# print label

outf = open('clustered_out','w+')

for i in range(len(data_set)):
	# data_set[i].append(label[i])
	f = open(str(label[i]),'a')
	f.write(str(data_set[i][0])+" "+str(data_set[i][1])+"\n")
	# outf.write(str(data_set[i][0])+" "+str(data_set[i][1])+" "+str(label[i])+"\n")

# data_set.sort(key=lambda x: x[2])

# with open('clustered_out') as f:


