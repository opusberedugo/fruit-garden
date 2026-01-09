class User {
  constructor(firstName, lastName, dateOfBirth, phoneNumber, password, email,) {
    this.password = password;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = dateOfBirth;
  }



}

module.exports = { User };
