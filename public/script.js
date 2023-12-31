//DON'T FORGET TO CREDIT https://charactercreator.org/#

//const { get } = require("node:https");
const documentList = ['passport', 'visa', 'permit', 'vaccine'];
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const docLength = documentList.length;
var windowList = []
var maleNames = [];
var femaleNames = [];
var lastNames = [];

var wrongDoc = null;
var currentChoice;

var currentCharacter;
var currentProfile;
var currentSave;

var fails;
var rights;
var randomMoney;

function updateWindowList(){
  windowList = [];
  const divList = document.getElementsByClassName('container');
  for(var i = 0; i < divList.length; i++){
    var id = divList[i].id;
    windowList.push(id);
  }
}

function hide(element) {
  getElement(element).style.display = 'none';
}

function show(element) {
  getElement(element).style.display = 'block';
}

function hideAllWindows(){
  for(var i = 0; i < windowList.length; i++){
    hide(windowList[0]);
  }
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
  getElement('nextDayBtn').innerHTML = 'Begin day ' + (currentSave.day + 1);
  if(selector.size != 0){
    showDoc(selector.value);
  }
}

function showDoc(docType){
  hideAll(documentList);
  if(getElement('docSelector').selectedIndex >= 0){
    show(docType);
  }
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
  var length = docLength;;
  
  if(currentSave.day < 5){
    length-=2;
  }else if(currentSave.day >= 5 && currentSave.day < 15){
    length--;
  }

  for(var i = 0; i < length; i++){
    currentCharacter.docPacket.push(newDocument(currentCharacter, documentList[i]));
  }

  fillSelector(getElement('docSelector'), currentCharacter.docPacket);
  return length;
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
  getElement('approveButton').disabled = true;
  getElement('denyButton').disabled = true;
  var buttonPressed = buttonId == 'approveButton'
  if(currentCharacter.valid == buttonPressed){
    updateDecLabel(true);
    rights++;
  }else{
    updateDecLabel(false);
    fails++;
  }
  hide('docSelector');
  show('nextCharacter');
}

function updateDecLabel(choice){
  if(choice){
    getElement('decisionLabel').innerHTML = 'Right! +$20';
    getElement('decisionLabel').style.color = 'green';
  }else{
    if(currentCharacter.valid){
      if(fails == 0){
        getElement('decisionLabel').innerHTML = 'Wrong! The Person was safe! First Warning!';
        getElement('decisionLabel').style.color = 'red';
      }else if(fails == 1){
        getElement('decisionLabel').innerHTML = 'Wrong! The Person was safe! Last Warning!';
        getElement('decisionLabel').style.color = 'red';
      }else{
        getElement('decisionLabel').innerHTML = 'Wrong! The Person was safe! You got fined $10!';
        getElement('decisionLabel').style.color = 'red';
      }
      
    }else{
      if(fails == 0){
        getElement('decisionLabel').innerHTML = capsFirst(wrongDoc) + ' was invalid! First Warning!';
        getElement('decisionLabel').style.color = 'red';
      }else if(fails == 1){
        getElement('decisionLabel').innerHTML = capsFirst(wrongDoc) + ' was invalid! Last Warning!';
        getElement('decisionLabel').style.color = 'red';
      }else{
        getElement('decisionLabel').innerHTML = capsFirst(wrongDoc) + ' was invalid! You got fined $10!';
        getElement('decisionLabel').style.color = 'red';
      }
    }
    
  }
}

function nextCharacter(){
  getElement('approveButton').disabled = false;
  getElement('denyButton').disabled = false;
  newCharacter();
  fillDocPacket();
  updateAll();
  wrongDoc = null;
  getElement('fName').innerHTML = 'First Name: ' + currentCharacter.fName;
  getElement('mName').innerHTML = 'Middle Name: ' + currentCharacter.mName;
  getElement('lName').innerHTML = 'Last Name: ' + currentCharacter.lName;
  getElement('gender').innerHTML = 'Gender: ' + currentCharacter.gender;
  getElement('age').innerHTML = 'Age: ' + currentCharacter.age;
  getElement('avatar').style.backgroundImage = 'url(' + currentCharacter.picture + '.png)';

  if(!currentCharacter.valid){
    wrongDoc = spoilDoc();
    wrongDoc[0] = wrongDoc[0].toUpperCase();
  }
  getElement('docSelector').selectedIndex = -1;
  show('docSelector');
  hide('nextCharacter');
  getElement('decisionLabel').innerHTML = '';
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
  return spoiledDoc.docType;
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
        if(char == 'M'){
          return 'F';
        }
        if(char == 'F'){
          return 'M';
        }
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

async function addProfile(){
  const username = getElement('usernameInput').value;
  const password = getElement('passwordInput').value;
  if(username.indexOf(' ') >= 0 || password.indexOf(' ') >= 0){
    getElement('errorLabel').innerHTML = 'Username or Password cannot contain spaces. Try again!';
  }else if(username == '' || password == '' ){
    getElement('errorLabel').innerHTML = 'Username or Password cannot be blank. Try again!';
  }else if(username.length < 8 || password.length < 8){
    getElement('errorLabel').innerHTML = 'Username or Password must consist of at least 8 characters.';
  }else{
    const sendingData = { username, password }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(sendingData)
      
    };
    const res = await fetch('/addnewprofile', options);
    const receivedData = await res.json();
    if(receivedData.exists){
      getElement('errorLabel').innerHTML = 'Username taken. Please sign in using password or create a new account.';
      getElement('successLabel').innerHTML = '';
    }else{
      getElement('errorLabel').innerHTML = '';
      getElement('successLabel').innerHTML = 'Account successfully created. You can now log in.'
    }
  }
}

async function loginUser(){
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
    
    if(receivedData == null){
      getElement('errorLabel').innerHTML = 'Credentials do not match. Try again or create a new profile.';
    }else{
      currentProfile = receivedData;
      getElement('loggedInAs').innerHTML = 'Logged in as: ' + currentProfile.userName;
      hide('loginPageWindow');
      show('mainMenuWindow');
    }

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

function updateSaveLabel(hoverButtonId){
  var day = currentProfile.progress["progressDay_" + hoverButtonId.split('').pop()];
  var balance = currentProfile.progress["progressBalance_" + hoverButtonId.split('').pop()];
  if(day == -1 && balance == -1){
    getElement('saveInfoLabel').innerHTML = 'Save#' + hoverButtonId.split('').pop() + '<br/>' + 'Empty.';
    getElement('saveInfoLabel').style.color = 'red';
  }else{
    getElement('saveInfoLabel').innerHTML = 'Day: ' + day + '<br/>' + "Balance: " + balance;
    getElement('saveInfoLabel').style.color = 'black';
  }
}

function loadSave(buttonId){
  const saveNumber = buttonId.split('').pop()
  if(currentProfile.progress['progressDay_' + saveNumber] < 0){
    addSave(saveNumber);
    getElement('saveInfoLabel').style.color = 'black';
    getElement('saveInfoLabel').innerHTML = 'New save created! Click the button again to start the game.'
  }else{
    const day = currentProfile.progress["progressDay_" + saveNumber];
    const balance = currentProfile.progress["progressBalance_" + saveNumber];
    const loan = currentProfile.progress["loanPending_" + saveNumber];
    currentSave = {saveNumber: saveNumber, day: day, balance: balance, loan: loan};

    hide('loginPageWindow');
    hide('saveContainer');
    show('statsWindow');
  }

  
  resetStats();
  updateStats();
  uploadProfile();
}

function logOut(){
  currentSave = null;
  currentProfile = null;
  hide('mainMenuWindow');
  show('loginPageWindow');
}

function nextDay(){
  startTimer();
  resetStats();
  currentSave.day++;
  addInterest();
  hide('statsWindow');
  show('gameWindow');
  nextCharacter();
}

function resetStats(){
  rights = 0;
  fails = 0;
  randomMoney = 0;
}

function updateStats(){
  var todayEarnings;
  var todayLosses;
  
  todayEarnings = rights * 20;

  if(fails <= 2){
    todayLosses = 0;
  }else{
    todayLosses = (fails) * -10;
  }

  var todayTotal = todayEarnings + todayLosses + randomMoney;
  currentSave.balance += todayTotal;
  
  getElement('currentDay').innerHTML = 'Day ' + currentSave.day;
  getElement('gainedMoney').innerHTML = 'Earned today: ' + todayEarnings;
  getElement('lostMoney').innerHTML = 'Deductions: ' + todayLosses;
  getElement('unpredictMoney').innerHTML = 'Unpredicted earnings/losses: ' + randomMoney;
  getElement('totalMoney').innerHTML = 'Total today: ' + todayTotal;
  getElement('balanceMoney').innerHTML = 'Balance: ' + currentSave.balance;
  getElement('nextDayBtn').innerHTML = 'Begin day ' + (currentSave.day + 1);
  hide('loanMoney');
  if(currentSave.loan > 0){
    getElement('loanMoney').innerHTML = 'Loan Pending: ' + currentSave.loan;
    show('loanMoney');
  }

  //isGameOver();
  uploadProfile();
}

function endDay(){
  hide('gameWindow');
  currentCharacter = null;
  newRandomEvent();
  updateStats();
  offerLoan();
  show('statsWindow');
}

async function uploadProfile(){
  const username = currentProfile.userName;
  const sendingData = { number: currentSave.saveNumber, username: username, day: currentSave.day, balance: currentSave.balance, loan: currentSave.loan};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'

    },
    body: JSON.stringify(sendingData)
    
  };
    
  const res = await fetch('/updateProfile', options);
  const receivedData = await res.json();
  currentProfile = receivedData;
}

function startTimer(){
  const defaultTime = 120;
  var timeLeft = defaultTime;
  
  var timer = setInterval(function(){
    timeLeft-=0.1;
    getElement('timeLine').style.width = timeLeft/defaultTime*100 + '%';
    if(timeLeft <= 0.01){
      clearInterval(timer);
      endDay();
    }
  }, 100);

}

function newRandomEvent(){
  const happened = Math.random() > .90;
  const positive = Math.random() > .50;
  const goodPhrases = [
    "On the way home you've found some cash. Lucky Day!",
    "Your boss is happy with you today. Here's your bonus",
    "While cleaning your workspace you found a bunch of crumpled paper. Looks like some dollar bills!",
    "Your friend sent you a present!",
    "After the hard work you decided to go to the casino. Not much but at least something."
  ];
  const badPhrases = [
    "On the way home the brick fell on your head. Insurance expired yesterday. How unlucky!",
    "You accidentally dropped your phone. Time for reapirs!",
    "Your dog ate your stash. How nice of him!",
    "You flooded your neighbor's apartment. Who's gonna pay?",
    "You lost your wallet. Some of your money is gone."
  ];
  var change;
  var phrase;
  if(happened){
    show('randomEventContainer');
    const textLabel = getElement('eventText');
    const changeLabel = getElement('eventChange');
    change = randInt(10, 300);
    if(positive){
      phrase = goodPhrases[randInt(0, goodPhrases.length)];
      textLabel.innerHTML = phrase;
      changeLabel.innerHTML = '+$' + change;
      changeLabel.style.color = 'green';
      randomMoney = change;
    }else{
      phrase = badPhrases[randInt(0, badPhrases.length)];
      textLabel.innerHTML = phrase;
      changeLabel.innerHTML = '-$' + change;
      changeLabel.style.color = 'red';
      change*=-1;
      randomMoney = change;
    }
  }else{
    randomMoney = 0;
    hide('randomEventContainer');
  }
  
}

function capsFirst(text){
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function offerLoan(){
  const hasLoan = currentSave.loan > 0;
  const balance = currentSave.balance;
  if(hasLoan && balance < 0){
    isGameOver();
  }else{
    if(balance < 0){
      show('loanContainer');
      hide('statsContainer');
    }
  }
}

function setLoan(buttonId){
  const hasLoan = currentSave.loan > 0;
  if(hasLoan && buttonId == 'declineLoan'){
    gameOver();
  }else{
    currentSave.balance += 1000;
    currentSave.loan = 1000;
    updateStats();
    hide('loanContainer');
    show('statsContainer');
    show('loanMoney');
    show('payLoanBtn');
  }  
}

function payLoan(){
  const hasLoan = currentSave.loan > 0;
  const loan = currentSave.loan;
  const balance = currentSave.balance;
  if(hasLoan){
    if(balance > loan){
      currentSave.balance = balance - loan;
      currentSave.loan -= loan;
    }else{
      currentSave.loan = loan - balance;
      currentSave.balance -= balance;
    }

    if(currentSave.loan <= 0){
      hide('loanMoney');
      hide('payLoanBtn');
    }
    updateStats();
  }
}

function addInterest(){
  const interest = 10.5;
  const multipiler = interest/100;
  currentSave.loan = Math.ceil(currentSave.loan + currentSave.loan * multipiler);
}

function deleteSave(){
  currentSave.balance = -1;
  currentSave.day = -1;
  currentSave.loan = 0;
  uploadProfile();
  hide('statsWindow');
  show('mainMenuWindow');
  hide('buttonContainer');
  show('saveContainer');
}

function addSave(saveNumber){
  const day = 0;
  const balance = randInt(100, 300);
  const loan = 0;
  currentSave = {saveNumber: saveNumber, day: day, balance: balance, loan: loan};
  uploadProfile();
}

function isGameOver(){
  const balance = currentSave.balance;
  const hasLoan = currentSave.loan > 0;
  const day = currentSave.day;
  deleteSave();

  if(balance >= 100000){
    showGoodEnding();
  }else{
    showBadEnding();
  }

  hide('statsWindow');
  hide('mainMenuWindow');
  hide('saveContainer');
  show('gameOverWindow');
  show('buttonContainer');
}

function showBadEnding(){
  getElement('gameOverString').innerHTML = 'You cant pay your bills anymore. How it feels to be broke?';
  getElement('backFromOverBtn').innerText = 'Start Over';  
}

function showGoodEnding(){
  getElement('gameOverString').innerHTML = 'Dreams come true! Hope $100,000 in your wallet will make you happy.';
  getElement('backFromOverBtn').innerText = 'New Game';
}
