# Bu araç @keyiflerolsun tarafından | @KekikAkademi için yazılmıştır.

####
from subprocess import call as OC0;from subprocess import PIPE as CO;from importlib.metadata import version as T;from requests import get as C;from parsel import Selector as B;from shutil import rmtree as X;from os import path as Y;R = None;P = "KekikTaban";from KekikTaban.konsolTaban import KekikTaban;X(P) if Y.exists(P) else R;O0 = "pip";OC0(f"{O0} install -U {P}", shell=True, stdout=CO, stderr=CO) if not bool(B(C(f"https://pypi.org/project/{P}/").text).xpath("normalize-space(//h1[@class='package-header__name'])").get().split()[-1]== T(P)) else R
####