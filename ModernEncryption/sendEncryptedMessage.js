const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const os = require('os')

const encryptMessage = (name,message,file) => {
  //
}

const decryptMessage = (message) =>{
  //
}

const decodeMessage = (message) =>{
  var keyName = new Buffer.from(message[0], 'base64').toString('ascii');
  var derivedIV = Buffer.from(message[1],'base64')
  if(fs.existsSync(__dirname + '/Keys/' + keyName + '.pem')){
    var privateKey = fs.readFileSync(__dirname + '/Keys/' + keyName + '.pem');
    var buffer = Buffer.from(message[2], "base64");
    var derivedKey = crypto.privateDecrypt({"key": privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'},buffer);
    var decipher = crypto.createDecipheriv('des-ecb',derivedKey,null);
    let decrypted = decipher.update(message[3], 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('Marresi: ' + keyName);
    console.log('Mesazhi: ' + decrypted.toString('utf8'));
  }else{
    console.log('Celesi privat /Keys/' + keyName + ' nuk ekziston');
  }
}
module.exports = {encryptMessage,decryptMessage};
