module.exports = {
  cencrypt: (key, plaintext) =>{
    plaintext = plaintext.trim();
    var encrypted_text = '';
    key = Number(key)%26;
    if(key<0){
      key = Math.abs(key);
    }
    for(var i=0;i<plaintext.length;i++){
      if(!plaintext[i].match(/^[A-Za-z\s][A-Za-z\s]*$/)){
        encrypted_text += plaintext[i];
      }
      if(plaintext[i] === ' '){
        encrypted_text += plaintext[i]; 
      }
      if(plaintext.charCodeAt(i)>=65 && plaintext.charCodeAt(i)<=90){
        if(plaintext.charCodeAt(i)+key<=90){
           encrypted_text += String.fromCharCode(plaintext.charCodeAt(i) + key);
        }
        else{
          encrypted_text += String.fromCharCode(plaintext.charCodeAt(i)-26 + key);
        }
      }
      if(plaintext.charCodeAt(i)>=97 && plaintext.charCodeAt(i)<=122){
        if(plaintext.charCodeAt(i)+key<=122){
          encrypted_text += String.fromCharCode(plaintext.charCodeAt(i)+key);
        }else{
          encrypted_text += String.fromCharCode(plaintext.charCodeAt(i)-26+key);
        }
      }
    }
    console.log(encrypted_text);
  },
  cdecrypt: (key, ciphertext) =>{
    ciphertext = ciphertext.trim();
    var decrypted_text = '';
    key = Number(key)%26;
    if(key<0){
      key = Math.abs(key);
    }
    if(!ciphertext.match(/^[A-Za-z\s][A-Za-z\s]*$/)){
      decrypted_text += '';
    }
    for(var i=0;i<ciphertext.length;i++){
      if(ciphertext[i]===' '){
        decrypted_text += ciphertext[i];
      }
      if(ciphertext.charCodeAt(i)>=65 && ciphertext.charCodeAt(i)<=90){
        if(ciphertext.charCodeAt(i)-key>=65){
          decrypted_text += String.fromCharCode(ciphertext.charCodeAt(i) - key);
        }else{
          decrypted_text += String.fromCharCode(ciphertext.charCodeAt(i) +26 - key);
        }
      }
      if(ciphertext.charCodeAt(i)>=97 && ciphertext.charCodeAt(i)<=122){
        if(ciphertext.charCodeAt(i)-key>=97){
          decrypted_text += String.fromCharCode(ciphertext.charCodeAt(i)-key);
        }else{
          decrypted_text += String.fromCharCode(ciphertext.charCodeAt(i)+26 - key);
        }
      }
    }
    console.log(decrypted_text);
  }
}

