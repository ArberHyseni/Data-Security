#!/usr/bin/env node
const program = require('commander');
const pkg = require('./package.json')
const {cencrypt,cdecrypt} = require('./CryptoAlgorithms/caesarChiper');
const ceasarBrute = require('./CryptoAlgorithms/caesarBruteForce');
const {bencrypt,bdecrypt} = require('./CryptoAlgorithms/bealeChiper');
const {tencrypt,tdecrypt} = require('./CryptoAlgorithms/tap-codeChiper');
const {generateKeys,deleteKeys} = require('./ModernEncryption/keyGenerator');
const {exportKey, importKey} = require('./ModernEncryption/keyPathChange');
const {encryptMessage,decryptMessage} = require('./ModernEncryption/sendEncryptedMessage');

program
  .version(pkg.version)
  .description('Simple Encryption Algorithms')

program
  .command('caesar <command> <key> <text>')
  .description('Encrypts or Decrypts given text with Caesar chiper\nOptions:\nencrypt - Encrypt Plaintext with Caesar method\ndecrypt - Decrypt Chipertext with Caesar method\nkey - number of letters to shift\n')

if(process.argv.slice(5).length != 0){ //check if 5th argument exists to run the below code. References are on references.txt
  program
    .command('caesar <command> <key> <text>')
    .description('Encrypts or Decrypts given text with Caesar chiper\nCommands:\nencrypt - Encrypt Plaintext with Caesar method\ndecrypt - Decrypt Chipertext with Caesar method\n')
    .action((command,key,text)=>{
      if(command=='encrypt'){
        cencrypt(key,text);
      }else if(command == 'decrypt'){
        cdecrypt(key,text);
      }
      else{
        console.log('Unknown Command at: caesar ' + command);
        process.exit();
      }
    })
}else{
  program
    .command('caesar <brute-force> <chipertext>')
    .description('Brute forces decrypts a chipertext with Ceasar method\n')
    .action((bf,chipertext)=>{
      ceasarBrute(chipertext)
    })
}

program
  .command('tap-code <command> <plaintext>')
  .description('Tap-Code Encryption\nOptions:\nencode - Encodes Plaintext with Tap-Code method\ndecode = Decodes Ciphertext with Tap-Code method\n')
  .action((command,plaintext)=>{
    if(command == 'encode'){
      tencrypt(plaintext);
    }else if(command=='decode'){
      tdecrypt(plaintext);
    }else{
      console.log('Unknown Command at: tap-code ' + command);
    }
  })

program
  .command('beale <command> <file> <plaintext>')
  .description('Beale Encryption\nOptions:\nencrypt - Encrypts a plaintext with Beale Cipher Method\ndecrypt - Decrypts a ciphertext whith Beale Cipher Method\nfile - specifies a file that is the key to decrypt the ciphertext\n')
  .action((command,file,plaintext)=>{
    if(command=='encrypt'){
      bencrypt(file,plaintext);
    }else if(command == 'decrypt'){
      bdecrypt(file,plaintext);
    }else{
      console.log('Unknown Command at: beale ' + command);
    }
  })

program
  .command('create-user <name>')
  .description('')
  .action(name=>{
    generateKeys(name)
  })

program
  .command('delete-user <name>')
  .description('')
  .action(name=>{
    deleteKeys(name)
  })

program
  .command('export-key <public|private> <name> [file]')
  .description('')
  .action((visibility,name,file)=>{
    exportKey(visibility,name,file)
  })

program
  .command('import-key <name> <path>')
  .description('')
  .action((name,path)=>{
    importKey(name,path);
  })

program
  .command('write-message <name> <message> [file]')
  .description('')
  .action((name,message,file)=>{
    encryptMessage(name,message,file)
  })

program
  .command('read-message <encrypted-message>')
  .description('')
  .action(message=>{
    decryptMessage(message)
  })

program.parse(process.argv); //parsing the array of line arguments
