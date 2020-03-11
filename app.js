#!/usr/bin/env node
const program = require('commander');
const {cencrypt,cdecrypt} = require('./CryptoAlgorithms/caesarChiper');
const ceasarBrute = require('./CryptoAlgorithms/caesarBruteForce');
const {bencrypt,bdecrypt} = require('./CryptoAlgorithms/bealeChiper');
const {tencrypt,tdecrypt} = require('./CryptoAlgorithms/tap-codeChiper');

program
  .version('1.0.6')
  .description('Simple Encryption Algorithms')

program
  .command('caesar <command> <key> <text>')
  .description('Encrypts or Decrypts given text with Caesar chiper\nOptions:\nencrypt - Encrypt Plaintext with Caesar method\ndecrypt - Decrypt Chipertext with Caesar method\nkey - number of letters to shift')

if(process.argv.slice(5).length != 0){ //check if 5th argument exists to run the below code. References are on references.txt
  program
    .command('caesar <command> <key> <text>')
    .description('Encrypts or Decrypts given text with Caesar chiper\nCommands:\nencrypt - Encrypt Plaintext with Caesar method\ndecrypt - Decrypt Chipertext with Caesar method')
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
  .description('Tap-Code Encryption\nOptions:\nencode - Encodes Plaintext with Tap-Code method\ndecode = Decodes Ciphertext with Tap-Code method')
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
  .description('Beale Encryption\nOptions:\nencrypt - Encrypts a plaintext with Beale Cipher Method\ndecrypt - Decrypts a ciphertext whith Beale Cipher Method\nfile - specifies a file that is the key to decrypt the ciphertext')
  .action((command,file,plaintext)=>{
    if(command=='encrypt'){
      bencrypt(file,plaintext);
    }else if(command == 'decrypt'){
      bdecrypt(file,plaintext);
    }else{
      console.log('Unknown Command at: beale ' + command);
    }
  })

program.parse(process.argv); //parsing the array of line arguments

