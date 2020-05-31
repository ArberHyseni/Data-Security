#!/usr/bin/env node
const cmd = require('./Commands/index')
const pkg = require('./package.json')
const {cencrypt,cdecrypt} = require('./CryptoAlgorithms/caesarChiper');
const ceasarBrute = require('./CryptoAlgorithms/caesarBruteForce');
const {bencrypt,bdecrypt} = require('./CryptoAlgorithms/bealeChiper');
const {tencrypt,tdecrypt} = require('./CryptoAlgorithms/tap-codeChiper');
const {generateKeys,deleteKeys} = require('./ModernEncryption/keyGenerator');
const {exportKey, importKey} = require('./ModernEncryption/keyPathChange');
const {encryptMessage,decryptMessage} = require('./ModernEncryption/sendEncryptedMessage');
const {showlistkeys} = require('./ModernEncryption/getAndSendRequest.js');

cmd.setVersion(pkg.version)

if(process.argv[2]=='caesar' && (process.argv[3]=='encrypt' || process.argv[3]=='decrypt')){ //check if 5th argument exists to run the below code. References are on references.txt
    cmd.parse(process.argv)
    cmd.description('Encrypts or Decrypts given text with Caesar chiper\nCommands:\nencrypt - Encrypt Plaintext with Caesar method\ndecrypt - Decrypt Chipertext with Caesar method\n')
    cmd.set('caesar <command> <key> [text]').action((command,key,text)=>{
      if(command=='encrypt'){
        cencrypt(key,text);
      }else if(command == 'decrypt'){
        cdecrypt(key,text);
      }
      else{
        console.log('Unknown Command at: caesar ' + command);
        process.exit();
      }
    }).description('test');
    cmd.close()
}
else if(process.argv[2]=='caesar' && process.argv[3]=='brute-force'){
  cmd.parse(process.argv)
  cmd.description('Brute forces decrypts a chipertext with Ceasar method\n')
  cmd.set('caesar brute-force <chipertext>').action((chipertext)=>{
    ceasarBrute(chipertext)
  })
}
else if(process.argv[2]=='tap-code'){
  cmd.parse(process.argv)
  cmd.set('tap-code <command> <plaintext>').action((command,plaintext)=>{
    if(command == 'encode'){
      tencrypt(plaintext);
    }else if(command=='decode'){
      tdecrypt(plaintext);
    }else{
      console.log('Unknown Command at: tap-code ' + command);
    }
  })
}
else if(process.argv[2]=='beale'){
  cmd.parse(process.argv)
  cmd.set('beale <command> <file> <plaintext>').action((command,file,plaintext)=> {
    if(command=='encrypt'){
      bencrypt(file,plaintext);
    }else if(command == 'decrypt'){
      bdecrypt(file,plaintext);
    }else{
      console.log('Unknown Command at: beale ' + command);
    }
  })
}
else if(process.argv[2].includes('user')){
  cmd.parse(process.argv)
  cmd.set('<command> <name>').action((command,name)=> {
    if(command=='create-user'){
      generateKeys(name)
    }
    else if(command==='delete-user'){
      deleteKeys(name)
    }
  })
}
else if(process.argv[2]=='export-key'){
  cmd.parse(process.argv)
  cmd.set('export-key <public|private> <name> [file]').action((visibility,name,file)=> {
    exportKey(visibility,name,file)
  })
}
else if(process.argv[2]=='import-key'){
  cmd.parse(process.argv)
  cmd.set('import-key <name> <path>').action((name,path)=>{
    importKey(name,path)
	//import_file('file1','https://pastebin.com/raw/s0gvcti0');
  })
}else if(process.argv[2]=='write-message'){
  cmd.parse(process.argv)
  cmd.set('write-message <name> <message> [file]').action((name,message,file)=>{
    encryptMessage(name,message,file)
  })
}
else if(process.argv[2]=='read-message'){
  cmd.parse(process.argv)
  cmd.set('read-message <encrypted-message>').action((message)=>{
    decryptMessage(message)
  })
}else if(process.argv[2]=='list-keys'){
  cmd.parse(process.argv)
  cmd.set('list-keys').action((message)=>{
    showlistkeys();
  })
}else {
  console.log('Unknown command at: ' + process.argv[2]);
}
