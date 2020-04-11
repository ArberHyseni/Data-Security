const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto')

const exportKey = (visibility,name,file) => {
  if((visibility !== 'public' && visibility !== 'private') || !name.match(/^[a-zA-Z0-9_]*$/)){
    console.log('There is an invalid argument');
  }
  if(typeof file == 'undefined'){
    if(visibility === 'public'){
      var text = fs.readFileSync(__dirname + '/Keys/' + name + '.pub.pem',(err)=>{
        if(err) throw err;
      })
      console.log(text.toString());
    }
    else if(visibility === 'private'){
      var text = fs.readFileSync(__dirname + '/Keys/' + name + '.pem',(err,text)=>{
        if(err) throw err;
      })
      console.log(text.toString());
    }
  }
  if(file){
    if(file.includes('C:/') || file.includes('c:/')){
      moveFile(__dirname + '/Keys/' + name + '.pub.pem', file,visibility)
    }else if(fs.existsSync(os.homedir() + '/' + file)){
      console.log('Ekziston nje file tjeter me kete emer ne direktoriumin qe deshironi zhvendosjen e celesit');
    }else{
      moveFile(__dirname + '/Keys/' + name + '.pem',os.homedir() + '/' + file,visibility)
    }
  }
}

const importKey = (name, file) => {
  if(file.includes('C:/')|| file.includes('c:/')){

  }else if(fs.existsSync(os.homedir() + '/' + file)){
    var text = fs.readFileSync(os.homedir() + '/' + file,(err,text)=>{
      if(err) throw err;
    })
    if(text.toString().includes('PRIVATE')){
      moveFile(os.homedir() + '/' + file,__dirname + '/Keys/' + file,'public');
      setTimeout(()=>{
        //
      }, 1000);
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem');
      var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pem\'')
      })
    }else if(text.toString().includes('PUBLIC')){
      moveFile(os.homedir() + '/' + file,__dirname + '/Keys/' + file,'private')
    }
  }
}

const moveFile = (oldpath,newpath,visibility) =>{
  if(visibility=='public'){
    fs.rename(oldpath, newpath, (err)=>{
      if(err) throw err;
      console.log('Celesi publik u ruajt ne fajllin ' + '.pub.pem');
    })
  }else if(visibility=='private'){
    fs.rename(oldpath, newpath, (err)=>{
      if(err) throw err;
      console.log('Celesi privat u ruajt ne fajllin '  + '.pem');
    })
  }
}

module.exports = {exportKey,importKey};
