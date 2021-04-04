const reader = new FileReader();
const documentList = ['passport', 'visa', 'permit', 'vaccine'];
const docLength = documentList.length;
var maleNames = ['Bob', 'Mike', 'John'];
var femaleNames = ['Alice', 'Abby', 'Ellie'];
var lastNames = ['White', 'Johnson', 'Fletcher'];
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
var currentCharacter;
var currentProfile;

function hide(element) {
  getElement(element).style.display = 'none';
}

function show(element) {
  getElement(element).style.display = 'block';
}

function getElement(id) {
  return document.getElementById(id);
}

function hideAll(list){
  for(var i = 0; i < documentList.length; i++){
    getElement(documentList[i]).style.display = 'none';
  }
}

function updateGUI(){
  var selector = getElement('docSelector');
  var docSelected = selector.value;
  if(selector.size != 0){
    showDoc(selector.value);
  }
}

function showDoc(docType){
  hideAll(documentList);
  show(docType);
}

function newCharacter(){
  var gender = Math.random() < 0.5; //true - male; false - female
  var genderLetter;
  var age = randInt(18, 60);
  var fisrtName;
  var middleName;
  var lastName;
  var picture;
  var isValid = Math.random() < 0.75;
  var status = null; //null - not evaluated; true - Approved; false - Denied;
  var myDocs = [];

  if(gender){
    genderLetter = 'M';
    picture = '/Characters/Faces/male/male_' + (randInt(0, 10) + 1);
    fisrtName = maleNames[randInt(0, maleNames.length)];
  } else {
    genderLetter = 'F';
    picture = '/Characters/Faces/female/female_' + (randInt(0, 10) + 1);
    fisrtName = femaleNames[randInt(0, femaleNames.length)];
  }
  middleName = letters.charAt(randInt(0, letters.length));
  lastName = lastNames[randInt(0, lastNames.length)];
  
  var character = {fName: fisrtName, mName: middleName, lName: lastName, 
    gender: genderLetter, age: age, picture: picture, valid: isValid, passportNumber: newPassportNumber(), docPacket: myDocs, status: status};

  currentCharacter = character;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function newPassportNumber(){
  var number = '';
  for(var i = 0; i < 13; i++ ){
    if(Math.random() > 0.8){
      number += letters[randInt(0, letters.length)];
    }else{
      number += numbers[randInt(0, numbers.length)];
    }
  }
  return number;
}

function newDocument(character, docType){
    switch(docType) {
      case 'passport':
        return {docType: docType, docLabel: 'Passport', pNumber: character.passportNumber, docfName: character.fName, docmName: character.mName, doclName: character.lName, docGender: character.gender, docAge: character.age};
      case 'visa':
        return {docType: docType, docLabel: 'Visa', pNumber: character.passportNumber, docfName: character.fName, docmName: character.mName, doclName: character.lName, docGender: character.gender, docAge: character.age};
      case 'permit':
        return {docType: docType, docLabel: 'Entry Permit', pNumber: character.passportNumber, docfName: character.fName, docmName: character.mName, doclName: character.lName};
      case 'vaccine':
        return {docType: docType, docLabel: 'Vaccine Card', pNumber: character.passportNumber, docfName: character.fName, docmName: character.mName, doclName: character.lName};
      default:
        break;
    }
      
}

function fillDocPacket(){
  currentCharacter.docPacket = [];

  for(var i = 0; i < docLength; i++){
    currentCharacter.docPacket.push(newDocument(currentCharacter, documentList[i]));
  }

  fillSelector(getElement('docSelector'), currentCharacter.docPacket);

}

function fillSelector(seleclor, list){
  seleclor.size = list.length;
  for(var i = 0; i < list.length; i++) {
    var value = list[i];
    var newOption = document.createElement("option");
    newOption.textContent = value.docLabel;
    newOption.value = value.docType;
    newOption.onclick = updateGUI;
    seleclor.options[i] = newOption;
  }
}

function clearSelector(){
  var selector = getElement('docSelector');

  for(var i = 0; i < selector.options.length; i++) {
    selector.options;
  }
}

function fillDocument(document, type){
  getElement(document + 'fName').innerHTML = 'First Name: ' + currentCharacter.fName;
  getElement(document + 'mName').innerHTML = 'Middle Name: ' + currentCharacter.mName;
  getElement(document + 'lName').innerHTML = 'Last Name: ' + currentCharacter.lName;
  getElement(document + 'Gender').innerHTML = 'Gender: ' + currentCharacter.gender;
  getElement(document + 'Age').innerHTML = 'Age: ' + currentCharacter.age;
  getElement(document + 'pNumber').innerHTML = 'P.N.: ' + currentCharacter.passportNumber;
  getElement(document + 'Picture').style.backgroundImage = 'url(' + currentCharacter.picture + '.png)';
}

function updateAll(){
  for(var i = 0; i < currentCharacter.docPacket.length; i++){
    var docType = currentCharacter.docPacket[i].docType;
    fillDocument(docType);
  }
}

function evaluateChoice(buttonId){
  var buttonPressed = buttonId == 'approveButton'

  if(currentCharacter.valid == buttonPressed){
    alert('Right!');
  }else{
    alert('Wrong');
  }
}

function nextCharacter(){
  newCharacter();
  fillDocPacket();
  updateAll();
  getElement('fName').innerHTML = 'First Name: ' + currentCharacter.fName;
  getElement('mName').innerHTML = 'Middle Name: ' + currentCharacter.mName;
  getElement('lName').innerHTML = 'Last Name: ' + currentCharacter.lName;
  getElement('gender').innerHTML = 'Gender: ' + currentCharacter.gender;
  getElement('age').innerHTML = 'Age: ' + currentCharacter.age;
  getElement('avatar').style.backgroundImage = 'url(' + currentCharacter.picture + '.png)';

  if(!currentCharacter.valid){
    spoilDoc();
  }

  getElement('docSelector').selectedIndex = -1;
  updateGUI();
}

function randomValue(array){
  return array[Math.floor(Math.random() * array.length)];
}

function spoilDoc(){
  //Documnet to be changed
  var spoiledDoc = randomValue(currentCharacter.docPacket);
  var docIndex = currentCharacter.docPacket.indexOf(spoiledDoc);
  var keys = Object.keys(spoiledDoc);
  var spliced = keys.splice(0, 2);
  //key of the value to be changed
  var spoiledValueKey = randomValue(keys);
  var spoiledValue = spoiledDoc[spoiledValueKey];
  var toBeReplaced = getElement(spoiledDoc.docType + spoiledValueKey.replace('doc', '')).innerHTML;
  var replacingWith = spoilValue(spoiledValue);
  getElement(spoiledDoc.docType + spoiledValueKey.replace('doc', '')).innerHTML = toBeReplaced.replace(spoiledValue, replacingWith);
}

function spoilValue(value){
  switch(typeof value){
    case 'string':
      var char = value[randInt(0, value.length)];
      if (!isNaN(char * 1)){
        //If number
        var possible = numbers.replace(numbers.indexOf(char), '');
        return value.replace(char, possible[randInt(0, possible.length)]);
      }else{
        var possible = letters.replace(letters.indexOf(char.toUpperCase()), '');
        if (char == char.toUpperCase()) {
            //If uppercase letter
            return value.replace(char, possible[randInt(0, possible.length)]);
        }
        if (char == char.toLowerCase()){
            //If lowercase letter
            return value.replace(char, possible[randInt(0, possible.length)].toLowerCase());
        }
      }
    case 'number':
      return value + randInt(-5, 10);

    default:
      break;
  }
}

async function sendUserData(){
  const username = getElement('usernameInput').value;
  const password = getElement('passwordInput').value;

  if(username.indexOf(' ') >= 0 || password.indexOf(' ') >= 0){
    getElement('errorLabel').innerHTML = 'Username or Password cannot contain spaces. Try again!';
  }else if(username == '' || password == '' ){
    getElement('errorLabel').innerHTML = 'Username or Password cannot be blank. Try again!';
  }else{
    getElement('errorLabel').innerHTML = '';
    const sendingData = { username, password }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(sendingData)
      
    };
    const res = await fetch('/loginuser', options);
    const receivedData = await res.json();
    currentProfile = receivedData;
  }
}

async function getNames(type){

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({type: type})
  }
  const res = await fetch('/updatenames', options);
  const receivedData = await res.json();
  switch(type){
    case 'male':
      maleNames = receivedData;
      break;
    case 'female':
      femaleNames = receivedData;
      break;
    default:
      lastNames = receivedData;
      break;
  }
}

async function updateNames(){
  femaleNames = getNames('female');  
  maleNames = getNames('male');
  lastNames = getNames('last')
}