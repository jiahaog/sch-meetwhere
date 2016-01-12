import httplib
import urllib2
import urllib

token = "169186697:AAF4ZwiaZvhzYDssV18vlfLRU9sFRr2zOto"
template = "https://api.telegram.org/bot"
update = "/getUpdates"
forward = "/sendMessage"
keyboard = "/ReplyKeyboardMarkup"


r1 = urllib2.urlopen(template + token + update)
# r1 = urllib2.urlopen(template + token + forward, data=urllib.urlencode({"chat_id": 46596436, "text": "[1,2,3,4]", "reply_markup": {"keyboard": '["1","2"]'}}))
print r1.read()
