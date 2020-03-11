const ceasarBrute = (plaintext) =>{
    plaintext = plaintext.trim();
  var decrypted_chiper = '';
  for (var key = 1; key < 26; key++) {
    for(var i=0;i<plaintext.length;i++){
      if(!plaintext[i].match(/^[A-Za-z][A-Za-z\s]*$/)){
        decrypted_chiper += plaintext[i];
      }else{
        if(plaintext[i] === ' '){
          decrypted_chiper += ' ';
        }
        //Simple caesar algorithm for lowercase letters and uppercase letters
        if(plaintext.charCodeAt(i)>=65 && plaintext.charCodeAt(i)<=90){
          if(plaintext.charCodeAt(i)-key>=65){
            decrypted_chiper += String.fromCharCode(plaintext.charCodeAt(i) - key);
          }else{
            decrypted_chiper += String.fromCharCode(plaintext.charCodeAt(i) +26 - key);
          }
        }
        if(plaintext.charCodeAt(i)>=97 && plaintext.charCodeAt(i)<=122){
          if(plaintext.charCodeAt(i)-key>=97){
            decrypted_chiper += String.fromCharCode(plaintext.charCodeAt(i)-key);
          }else{
            decrypted_chiper += String.fromCharCode(plaintext.charCodeAt(i)+26 - key);
          }
        }
      }
    }
    console.log("key " + key +': ' + decrypted_chiper + '\n');
    decrypted_chiper = '';
  }
}

module.exports = ceasarBrute;
