const fs = require('fs');

module.exports = {
  bencrypt: (file,plaintext) =>{
    plaintext = plaintext.trim();
    var encrypted_text = '';
    var a = [];
    var double_removed_array = []
    fs.readFile(__dirname + '/bealeBook/' + file,'utf-8',(err,data)=>{
      if(err) throw err;
      for(var i=0;i<data.length;i++){
        if(double_removed_array.includes(data[i])){
          double_removed_array.push(' ');
        }else{
          double_removed_array.push(data[i]);
        }
      }
      for(var i=0;i<plaintext.length;i++){
        for(var j=0;j<double_removed_array.length;j++){
          if(plaintext.charAt(i) == ' '){
            continue;
          }
          if(plaintext.charAt(i)===double_removed_array[j]){
            encrypted_text += j + 1 + ' ';
          }
        }
      }
      console.log(encrypted_text);
    });
  },
  bdecrypt: (file,ciphertext) =>{
    ciphertext = ciphertext.trim();
    var decrypted_text = '';
    var plaintext = ciphertext.split(' ');
    fs.readFile(__dirname + '/bealeBook/' + file,'utf-8',(err,data)=>{
      if(err) throw err;
      for(var i=0;i<plaintext.length;i++){
        for(var j=0;j<data.length;j++){
          if(plaintext[i]==j){
            decrypted_text += data.charAt(j-1);
          }
        }
      }
      console.log(decrypted_text);
    });
  }
}
