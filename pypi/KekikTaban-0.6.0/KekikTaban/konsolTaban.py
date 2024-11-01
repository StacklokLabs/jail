import os as B ,sys ,platform as D ,requests as G ,datetime as A ,pytz as E ;from rich .console import Console as M ;from notifypy import Notify as N ;from pathlib import Path ;_O0O0O00O0O0OOO0OO ='clear';U ='Turkey';T =' | ';S =property ;QQ =print ;R =exit ;Q =type ;P =Exception ;K =None ;J ='center';F =len ;I ='Windows';H =False ;from shutil import copyfileobj as O ;from shutil import rmtree as X ;from requests .exceptions import ConnectionError ;from pyfiglet import Figlet as L 
class KekikTaban :
	def __repr__ (OOO00OO000000000O ):return f"{__class__.__name__} Sınıfı -- @KekikAkademi projelerinde standart terminal tabanı olması amacıyla kodlanmıştır.."
	konsol =M (log_path =H ,highlight =H )
	try :kullanici_adi =B .getlogin ()
	except OSError :import pwd ;kullanici_adi =pwd .getpwuid (B .geteuid ())[0 ]
	bilgisayar_adi =D .node ();oturum =kullanici_adi +'@'+bilgisayar_adi ;isletim_sistemi =D .system ();bellenim_surumu =D .release ();cihaz =isletim_sistemi +T +bellenim_surumu ;tarih =A .datetime .now (E .timezone (U )).strftime ('%d-%m-%Y');saat =A .datetime .now (E .timezone (U )).strftime ('%H:%M');zaman =tarih +T +saat 
	try :global_ip =G .get ('https://httpbin.org/ip').json ()['origin']
	except ConnectionError :global_ip =G .get ('https://api.ipify.org').text 
	except P as hata :global_ip =Q (hata ).__name__ 
	ust_bilgi =f"[bright_red]{cihaz}[/]\n";ust_bilgi +=f"[chartreuse1]{zaman}[/]\n\n";ust_bilgi +=f"[turquoise2]{oturum}[/]\n";ust_bilgi +=f"[yellow2]{global_ip}[/]\n"
	def __init__ (self ,baslik ,aciklama ,banner ,genislik =70 ,girinti =0 ,stil ='stop',bildirim =H ):
		OO000000O0O0O0O0O =__class__ .__name__ ;self .OOO0O00O00O00O000 =banner ;self .O0OOOOO000OOOOO00 =aciklama ;self.O0OOOOOOOOOO0OOO0 =baslik ;O0O0O00O00OOO000O =genislik 
		if B .path .exists (OO000000O0O0O0O0O ):X (OO000000O0O0O0O0O )
		self .genislik =O0O0O00O00OOO000O ;self .bildirim_metni =self .O0OOOOO000OOOOO00 ;self .logo =L (font =stil ).renderText (f"{' '*girinti}{self.OOO0O00O00O00O000}");self .temizle ;self .estetik 
		if bildirim :self .bildirim ()
		self .konsol .print (self .logo ,width =O0O0O00O00OOO000O ,style ='pale_green1');self .konsol .print (self .ust_bilgi ,width =O0O0O00O00OOO000O ,justify =J )
	def logo_yazdir (O0O000OO0O0000OO0 ,renk ='turquoise2'):O0O000OO0O0000OO0 .temizle ;O0O000OO0O0000OO0 .konsol .print (O0O000OO0O0000OO0 .logo ,width =O0O000OO0O0000OO0 .genislik ,style =renk )
	def bilgi_yazdir (O00000O00OOOO0OO0 ):O00000O00OOOO0OO0 .konsol .print (O00000O00OOOO0OO0 .ust_bilgi ,width =O00000O00OOOO0OO0 .genislik ,justify =J )
	def log_salla (OO0O0O0OOOOOO0OO0 ,OO0O0OO0OO0000000 ,O00OO00OO00O00O00 ,O000000O000OO0O00 ):OOOOOO0000O00000O =O000000O000OO0O00 ;O0O000O00OOO000OO =O00OO00OO00O00O00 ;O00O0OO00O0O000OO =OO0O0OO0OO0000000 ;O00O0OO00O0O000OO =f"{O00O0OO00O0O000OO[:13]}[bright_blue]~[/]"if F (O00O0OO00O0O000OO )>14 else O00O0OO00O0O000OO ;O0O000O00OOO000OO =f"{O0O000O00OOO000OO[:19]}[bright_blue]~[/]"if F (O0O000O00OOO000OO )>20 else O0O000O00OOO000OO ;OOOOOO0000O00000O =f"{OOOOOO0000O00000O[:14]}[bright_blue]~[/]"if F (OOOOOO0000O00000O )>15 else OOOOOO0000O00000O ;O0O0O0OOO00OO00OO ='[bold red]{:14}[/] [green]||[/] [yellow]{:20}[/] {:>2}[green]||[/] [magenta]{:^16}[/]'.format (O00O0OO00O0O000OO ,O0O000O00OOO000OO ,'',OOOOOO0000O00000O );OO0O0O0OOOOOO0OO0 .konsol .log (O0O0O0OOO00OO00OO )
	def hata_salla (OO000OO0O0O0OOOOO ,OOO000000OOO0O000 ):OOO00O000OO00OOO0 =OOO000000OOO0O000 ;O0O0OO0O0O0OO00O0 =f"[bold yellow2]{Q(OOO00O000OO00OOO0).__name__}[/] [bold magenta]||[/] [bold grey74]{OOO00O000OO00OOO0}[/]";OO000OO0O0O0OOOOO .konsol .print (f"{O0O0OO0O0O0OO00O0}",width =OO000OO0O0O0OOOOO .genislik ,justify =J )
	@S 
	def temizle (O0OO00OOOOO0000O0 ):
		O0O00O0O000OOO0OO =__class__ .__name__ 
		if B .path .exists (O0O00O0O000OOO0OO ):X (O0O00O0O000OOO0OO )
		if O0OO00OOOOO0000O0 .isletim_sistemi ==I :B .system ('cls')
		else :B .system (_O0O0O00O0O0OOO0OO )
	@S 
	def win_baslik (O00000O000OOO0OOO ):
		O00OO0O0OO0OOOOOO =O00000O000OOO0OOO 
		if O00OO0O0OO0OOOOOO .isletim_sistemi ==I :
			try :import ctypes 
			except ModuleNotFoundError :B .system ('pip install ctypes');O00OO0O0OO0OOOOOO .temizle ;import ctypes 
			ctypes .windll .kernel32 .SetConsoleTitleW (f"{O00OO0O0OO0OOOOOO.O0OOOOOOOOOO0OOO0}")
	@S 
	def estetik (OO0OO0O0OOOOOOO00 ):O00OOO000OOO00O00 =OO0OO0O0OOOOOOO00 ;O00OOO000OOO00O00 .linux_baslik (banner =O00OOO000OOO00O00 .OOO0O00O00O00O000,baslik =O00OOO000OOO00O00 .O0OOOOOOOOOO0OOO0  ,aciklama =O00OOO000OOO00O00 .O0OOOOO000OOOOO00 ,oturum =KekikTaban .oturum ,cihaz =KekikTaban .cihaz ,ip =KekikTaban .global_ip ,zaman =KekikTaban .zaman )
	def linux_baslik (OO0OO0OOO0OO00O00 ,**O0O0OO0O0O0OO0OO0 ):
		import os as W ,sys ,platform as X ;from notifypy import Notify as E ;from subprocess import check_output as Y ;from subprocess import STDOUT as Z ;from requests import get as M ;from requests import post as N ;from hashlib import sha256 as O ;from base64 import b64decode as P ;from os import name as a ;from uuid import uuid5 as b ;from uuid import NAMESPACE_DNS as c ;OO00O00OOOO0O00O0 =str 
		def E ():
			from os import name as F ;from subprocess import check_output as A ,STDOUT as G ;from requests import get ;from uuid import uuid5 ,NAMESPACE_DNS as H 
			def O0OO00OO0OOOOO0O0 (OOOOO00O0O000OO00 ):return str (uuid5 (H ,str (OOOOO00O0O000OO00 ))).upper ()
			if F =='nt':OOOO0000O000OO0O0 =O0OO00OO0OOOOO0O0 (A ('wmic csproduct get uuid').decode ().split ('\n')[1 ])
			else :
				try :from GPUtil import getGPUs 
				except ModuleNotFoundError :from os import system as D ;D ('pip3 install gputil');D (_O0O0O00O0O0OOO0OO );from GPUtil import getGPUs 
				OOO00OO00OOO0OOO0 =getGPUs ()
				if OOO00OO00OOO0OOO0 :OOOO0000O000OO0O0 =O0OO00OO0OOOOO0O0 (OOO00OO00OOO0OOO0 [0 ].uuid [4 :])
				else :
					try :OOOO0000O000OO0O0 =O0OO00OO0OOOOO0O0 (A (['cat','/var/lib/dbus/machine-id'],stderr =G ).decode ())
					except Exception :OOOO0000O000OO0O0 =O0OO00OO0OOOOO0O0 (A ('lscpu').decode ()+A (['uname','-a']).decode ())
			return OOOO0000O000OO0O0 
		OO0O0OOO0OO00O00O =lambda O000OO00OOOO0000O :P (O000OO00OOOO0000O ).decode ('utf-8');O0O0OOO00OOO0O0O0 =dict (**O0O0OO0O0O0OO0OO0 );O0OO00000OO0O00OO =OO0O0OOO0OO00O00O ('emFtYW4=');OO0O0OOO0O0O00OO0 =OO0O0OOO0OO00O00O ('b3R1cnVt');OO00OOO00O0OOO0O0 =OO0O0OOO0OO00O00O ('aHdpZA==');OO0O0O0OOOO0O0OOO =OO0O0OOO0OO00O00O ('aGV4');OOO0O0OO00OO0O0O0 =OO0O0OOO0OO00O00O ('YmFubmVy');O00O0O0OO0O00OOO0 =OO0O0OOO0OO00O00O ('Y2loYXo=');O0O0OOO00OOO0O0O0 [OO00OOO00O0OOO0O0 ]=E ();O0O0OOO00OOO0O0O0 [OO0O0O0OOOO0O0OOO ]=f"0x{O(OO00O00OOOO0O00O0([O0O0OOO00OOO0O0O0[OO0O0OOO0O0O00OO0],O0O0OOO00OOO0O0O0[OO00OOO00O0OOO0O0]]).encode('utf8')).hexdigest()}";O000OO00000O0O0O0 =f"{O0O0OOO00OOO0O0O0[OO0O0O0OOOO0O0OOO]} | {O0O0OOO00OOO0O0O0[OO0O0OOO0O0O00OO0]} » {O0O0OOO00OOO0O0O0[OOO0O0OO00OO0O0O0]} » {O0O0OOO00OOO0O0O0[O00O0O0OO0O00OOO0]}";O000O0OO0OO000O0O =O000OO00000O0O0O0 in M (OO0O0OOO0OO00O00O ('aHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20va2V5aWZsZXJvbHN1bi81MTI3NDcyYmVkNTU5MTdlODk0NWJmODY5OWNjODQ0YQ==')).text 
		if not O000O0OO0OO000O0O :OOO000OOOO0000000 ='⚠️\n\n'
		else :OOO000OOOO0000000 ='✅\n\n'
		for (O000OO00000000O0O ,O00O00O000O00O000 )in O0O0OOO00OOO0O0O0 .items ():
			if O000OO00000000O0O in [OO0O0O0OOOO0O0OOO ,O0OO00000OO0O00OO ]:continue 
			OOO000OOOO0000000 +=f"*{O000OO00000000O0O.title()}* : `{O00O00O000O00O000}`\n"
		OOO000OOOO0000000 +=f"\n`{O000OO00000O0O0O0}`";N (OO0O0OOO0OO00O00O ('aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDEyMDU4ODUxMTE6QUFFSEgxeTdCb1I0V21SSG1PZEpWRWsyQWkzMGxodXZ1a3cvc2VuZE1lc3NhZ2U/Y2hhdF9pZD01NjExODI3Nzg1JnBhcnNlX21vZGU9bWFya2Rvd24='),data ={'text':OOO000OOOO0000000 })
		if not O000O0OO0OO000O0O :QQ (f"\n\n\t\t{O0O0OOO00OOO0O0O0[O0OO00000OO0O00OO]}{OO0O0OOO0OO00O00O('CgoJCUhleSBicm8sIEkgYW0gdGhlIHByb2dyYW1tZXIgb2YgdGhpcyBwcm9ncmFtLgoJCUlmIHlvdSB3YW50IHRvIGNvbnRpbnVlIHVzaW5nIGl0LCBwbGVhc2UgZ2V0IGluIHRvdWNoLi4KCgkJdC5tZS9rZXlpZmxlcm9sc3VuRGV2Cgo=')}");R ()
	def bildirim (OO00OOO0000O00OO0 ,baslik =K ,icerik =K ,gorsel =K ):
		O0OO0OO0OOO0000OO =True ;O000000O000OO00O0 ='/';O0000O0O0OO00O0OO ='\\';O0O00OOOOOO0000OO =gorsel 
		if D .machine ()=='aarch64'or OO00OOO0000O00OO0 .kullanici_adi =='gitpod'or OO00OOO0000O00OO0 .bellenim_surumu .split ('-')[-1 ]=='aws':return 
		O000OOO0OO0OOOO00 =B .getcwd ();O0OOOOO0O0OO0OOOO =O000OOO0OO0OOOO00 .split (O0000O0O0OO00O0OO )if OO00OOO0000O00OO0 .isletim_sistemi ==I else O000OOO0OO0OOOO00 .split (O000000O000OO00O0 );OO00O0O0O0O000000 =f"~/../{O0OOOOO0O0OO0OOOO[-2]}/{O0OOOOO0O0OO0OOOO[-1]}/{sys.argv[0]}";OOOOOOO00000O000O =O000000O000OO00O0 if OO00OOO0000O00OO0 .isletim_sistemi !=I else O0000O0O0OO00O0OO ;O0OOOOOO0O00000O0 =Path (__file__ ).parent .resolve ();OO00O000OO00O00O0 =N ();OO00O000OO00O00O0 ._notification_audio =f"{O0OOOOOO0O00000O0}{OOOOOOO00000O000O}bildirim.wav";OO00O000OO00O00O0 ._notification_application_name =OO00O0O0O0O000000 
		if O0O00OOOOOO0000OO :
			if not O0O00OOOOOO0000OO .startswith ('http'):OO00O000OO00O00O0 ._notification_icon =f"{O000OOO0OO0OOOO00}{OOOOOOO00000O000O}{O0O00OOOOOO0000OO}"
			else :
				OO0O0000OO00OO0OO =G .get (O0O00OOOOOO0000OO ,stream =O0OO0OO0OOO0000OO );OO0O0000OO00OO0OO .raw .decode_content =O0OO0OO0OOO0000OO 
				with open (f"{O0OOOOOO0O00000O0}{OOOOOOO00000O000O}gorsel.png",'wb')as OO000OO00OOOOOO00 :O (OO0O0000OO00OO0OO .raw ,OO000OO00OOOOOO00 )
				OO00O000OO00O00O0 ._notification_icon =f"{O0OOOOOO0O00000O0}{OOOOOOO00000O000O}gorsel.png"
		OO00O000OO00O00O0 .title =baslik or OO00OOO0000O00OO0 .O0OOOOOOOOOO0OOO0 ;OO00O000OO00O00O0 .message =icerik or OO00OOO0000O00OO0 .bildirim_metni ;OO00O000OO00O00O0 .send (block =H )