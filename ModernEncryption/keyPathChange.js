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
    if(file.includes(':/')) {
      if(fs.existsSync(findDir(file))) {
        if(visibility=='private'){
          moveFile(__dirname + '/Keys/' + name + '.pem', file,visibility)
        }
        else if(visibility=='public'){
          moveFile(__dirname + '/Keys/' + name + '.pub.pem', file,visibility)
        }
      }
      else {
        console.log("ENOENT: Directory does not exist!")
      }
    }else if(fs.existsSync(os.homedir() + '/' + file)){
      console.log('Ekziston nje file tjeter me kete emer ne direktoriumin qe deshironi zhvendosjen e celesit');
    }
    else if(file.startsWith('~/')){
      if(visibility=='public'){
        moveFile(__dirname + '/Keys/' + name + '.pub.pem',os.homedir() + '/' + file.substring(2),visibility)
      }
      else{
        moveFile(__dirname + '/Keys/' + name + '.pem',os.homedir() + '/' + file.substring(2),visibility)
      }
    }else{
      if(visibility=='public'){
        moveFile(__dirname + '/Keys/' + name + '.pub.pem',os.homedir() + '/' + file,visibility)
      }else{
        moveFile(__dirname + '/Keys/' + name + '.pem',os.homedir() + '/' + file,visibility)
      }
    }
  }
}

const importKey = (name, file) => {
  if(file.includes(':/') || file.startsWith('~/')){
    if(file.startsWith('~/')){
      if(fs.existsSync(os.homedir() + '/' + file.substring(2))){
        var text = fs.readFileSync(os.homedir() + '/' + file.substring(2),(err,text)=>{
          if(err) throw err
        })
        if(text.toString().includes('PRIVATE')){
          moveFile(os.homedir() + '/' + file.substring(2),__dirname + '/Keys/' + name + '.pem','private');
          setTimeout(()=>{
            //
          }, 1000);
          let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem');
          var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
          var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
          fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
            if(err) throw err;
            console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
          })
        }
      }
    }
    if(fs.existsSync(findDir(file))){
      if(fs.existsSync(file)){
        var text = fs.readFileSync(file,(err,text)=>{
          if(err) throw err
        })
        if(text.toString().includes('PRIVATE')){
          moveFile(file,__dirname + '/Keys/' + name + '.pem','private');
          setTimeout(()=>{
            //
          }, 1000);
          let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem');
          var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
          var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
          fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
            if(err) throw err;
            console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
          })
        }
        else if(text.toString().includes('PUBLIC')){
          moveFile(file,__dirname+ '/Keys/' + name + '.pub.pem',visibility)
        }
        else{
          console.log('Invalid key format');
        }
      }else{
        console.log('ENOENT: File does not exist!');
      }
    }else{
      console.log('ENOENT: Directory does not exist!');
    }
  }
  else if(fs.existsSync(os.homedir() + '/' + file)){
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
  else{
    console.log('Invalid path - please check you syntax');
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

const findDir = (pathname) => {
  var fileDir = pathname.split('/')
  fileDir.pop()
  fileDir = fileDir.join('/')
  return fileDir
}

module.exports = {exportKey,importKey};
