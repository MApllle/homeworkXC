const CryptoJS = require("crypto-js");
//密码加密解密 使用AES ECB模式
const encrypt = (word) => {
  const key = CryptoJS.enc.Utf8.parse("maple1952972500w"); //16位随机公钥
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

const decrypt = (word) => {
  const key = CryptoJS.enc.Utf8.parse("maple1952972500w"); //16位随机公钥
  const srcs = CryptoJS.enc.Utf8.stringify(word);
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  console.log(decrypt);
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

module.exports = {
  encrypt,
  decrypt,
};

