/**
 * Tests a string to see if it's an 8-digit number
 * Ignores hyphens and spaces.
 *
 *  Returns an object with these properties:
 *  isValid : Bool, true if is valid
 *  value: the parsed entry (no spaces, hyphens or other chars)
 *  cleanedValue: the entry as the user typed it up to the first offending char
 *  originalValue: the entry as the user supplied it
 *  
 * @param  {string} entry the value to test. Usually the value of an input
 * @return {object}       returns an object
 */
function parseCode(entry) {
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
        // char is an illegal character so stop checking
        isValid = false;
        break;
      }
    }
    
    // If there were no illegal characters and there's 8 numbers then it's good
    if (isValid && parsedEntry.length === 8) {
      isValid = true;
    } else {
      isValid = false;
    }
    
    return {
      isValid: isValid,
      value: parsedEntry,
      cleanedValue: cleanedEntry,
      originalValue: entry
    };
  }
}

/**
 * Tests a string to see if it's in the format of a U.S. phone number
 * Ignores hyphens, spaces, parens, +.
 *
 *  Returns an object with these properties:
 *  isValid : Bool, true if is valid
 *  value: the parsed entry (no spaces, hyphens or other chars)
 *  cleanedValue: the entry as the user typed it up to the first offending char
 *  originalValue: the entry as the user supplied it
 *  
 * @param  {string} entry the value to test. Usually the value of an input
 * @return {object}       returns an object
 */
function parsePhone(entry) {
  var cleanedEntry = '';
  var parsedEntry = '';
  var isValid = false;
  var number = /[0-9]/;
  var separator = /(?: |-|\+|\)|\(|\.|\*|\#)/;
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
    // leading 1 is stripped out
    else if (length === 11 && parsedEntry[0] === '1') {
      parsedEntry = parsedEntry.substring(1);
      isValid = true;
    }
  }
  
  return {
    isValid: isValid,
    value: parsedEntry,
    cleanedValue: cleanedEntry,
    originalValue: entry
  };
  
}

// Test the code validation
// ---------------------------
$('#testCode').submit(function(e) {
  e.preventDefault();
  
  var theConfCodeValue = $('#theConfCode').val();
  var code = parseCode(theConfCodeValue);
  
  if (code.isValid) {
    console.log('Valid parsed code', code.value);
  } else {
    alert('Invalid code. Enter the code that was emailed to you.');
    $('#theConfCode').val(code.cleanedValue);
  }
});

// Test the phone validation
// ---------------------------
$('#testPhone').submit(function(e) {
  e.preventDefault();
  
  var thePhoneNumberValue = $('#thePhoneNumber').val();
  var phone = parsePhone(thePhoneNumberValue);
  
  if (phone.isValid) {
    console.log('Valid parsed phone', phone.value);
  } else {
    alert('Invalid U.S. phone number. Enter your phone number with area code.');
  }
});  