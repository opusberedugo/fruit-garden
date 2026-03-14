const crypto = require('crypto');

class TextCypher {
    constructor(algorithm,randomKeyLength, ivLength) {
      this.algorithm = algorithm;
      this.randomKeyLength = randomKeyLength;
      this.ivLength = ivLength;
      this.key = this.generateKey();
      this.iv = this.generateIV();
    }

    generateKey() {
      return crypto.randomBytes(this.randomKeyLength);
    }

    generateIV() {
      return crypto.randomBytes(this.ivLength);
    }

    encrypt(text) {
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    }

    decrypt(encryptedText) {
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }

    generateRandomEmailCode(){
      return crypto.randomInt(10000000, 99999999);
    }
}

let testCypher = new TextCypher('aes-256-cbc', 32, 16);

let encryptedText = testCypher.encrypt('69b3318ae34dd5f469c28824');
console.log('Encrypted Text:', encryptedText);

let decryptedText = testCypher.decrypt(encryptedText);
console.log('Decrypted Text:', decryptedText);

module.exports = { TextCypher };