function parseCode(inputId) {
  var entry = document.getElementById(inputId).value;
  var cleanedEntry = '';
  var parsedEntry = '';
  var isValid = true;
  var number = /[0-9]/;
  var separator = /(?:-| )/;
  
  // Check if entry is a string and not empty
  if (typeof entry === 'string' && entry.length) {
    // Loop over input text and check if each char is a digit or separator
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsedEntry += entry[i];
        cleanedEntry += entry[i];
      } 
      else if (separator.test(entry[i])) {
        cleanedEntry += entry[i];
      } 
      else {
        // char is an illegal character so not valid
        isValid = false;
        break;
      }
    }
    
    // If there were no illegal characters and there's 8 numbers then it's good
    if (isValid && parsedEntry.length === 8) {
      return {
        valid: true,
        value: parsedEntry,
        cleanedValue: cleanedEntry,
        originalValue: entry
      };
    }
  }

  // Otherwise it's bad
  alert('Invalid confirmation code. Enter the code that was emailed to you.');
  return {
    valid: false,
    value: null,
    cleanedValue: cleanedEntry,
    originalValue: entry
  };
}


function parsePhone(inputId) {
  var entry = document.getElementById(inputId).value;
  var cleanedEntry = '';
  var parsedEntry = '';
  var isValid = false;
  var number = /[0-9]/;
  var separator = /(?: |-|\+|\)|\(|\.)/;
  var length;
  
  if (typeof entry === 'string' && entry.length) {
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsedEntry += entry[i];
        cleanedEntry += entry[i];
      } 
      else if (separator.test(entry[i])) {
        cleanedEntry += entry[i];
      } 
      else {
        isValid = false;
        break;
      }
    }
    
    length = parsedEntry.length;
    
    // 10 digits must be area code + 3 + 4
    // Area code can't start with a 0 or 1
    if (length === 10 && parseInt(parsedEntry[0]) > 1) {
      isValid = true;
    }
    // 11 digits must be 1 + area code + 3 + 4
    // leading digit must be a 1
    else if (length === 11 && parsedEntry[0] === '1') {
      isValid = true;
    }
  }
  
  if (isValid) {
    return {
      valid: true,
      value: parsedEntry,
      cleanedValue: cleanedEntry,
      originalValue: entry
    };
  } 
  else {
    alert('Invalid U.S. phone number. Enter your phone number with area code.');
    return {
      valid: false,
      value: null,
      cleanedValue: cleanedEntry,
      originalValue: entry
    };
  }  
}


$('#form').submit(function(e) {
  e.preventDefault();
  
  var code = parseCode('theConfCode');
  var phone = parsePhone('thePhoneNumber');
  
  if (code.valid) {
    console.log('Valid parsed code', code.value);
  } else {
    $('#theConfCode').val(code.cleanedValue);
  }
  
  if (phone.valid) {
    console.log('Valid parsed phone', phone.value);
  } else {
    $('#thePhoneNumber').val(phone.cleanedValue);
  }
});  