/**
 * Tests a string to see if it's an 8-digit number
 * Ignores hyphens and spaces.
 *
 *  Returns an object with these properties:
 *  originalValue: the entry as the user supplied it
 *  value: the parsed entry (no spaces, hyphens or other chars)
 *  cleanedValue: the entry as the user typed it up to the first offending char
 *  formatted: the value with separating hyphen
 *  codepart1: the first 4 digits
 *  codepart2: the last 4 digits
 *  isValid : Bool -- true if is valid
 *  invalidChar: Bool -- true if entry contained a non-number, hyphen or space
 *  isBlank: Bool -- true if entry was empty or not a string
 *  wrongCount: Bool -- true is more or fewer than 8 numbers were provided
 *
 * @param  {string} entry the value to test. Usually the value of an input
 * @return {object}       returns an object
 */
function parseCode(entry) {
  var parsed = {
    originalValue: entry,
    value: '',
    cleanedValue: '',
    formatted: null,
    codepart1: null,
    codepart2: null,
    isValid: false,
    invalidChar: false,
    isBlank: false,
    wrongCount: true,
  };
  
  var codeFormat = /^([0-9]{4})[- ]?([0-9]{4})$/;
  var number = /[0-9]/;
  var separator = /[.,\/#!$%\^&\*;:{}=\-–—_`~()\s]/;

  // Check if entry is a string and not empty
  if (typeof entry === 'string' && entry.length) {
    // Loop over input text and check if each char is a digit or separator
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsed.value += entry[i];
        parsed.cleanedValue += entry[i];
      } else if (separator.test(entry[i])) {
        parsed.cleanedValue += entry[i];
      } else {
        // char is an illegal character so stop checking
        parsed.invalidChar = true;
        break;
      }
    }
    
    if (parsed.value.length !== 8) {
      parsed.wrongCount = true;
    } else {
      parsed.wrongCount = false;
    }
    
    if (parsed.value.length === 8 && !parsed.invalidChar) {
      parsed.isValid = true;
      parsed.formatted = parsed.value.replace(codeFormat, '$1-$2');
      parsed.codepart1 = parsed.value.replace(codeFormat, '$1');
      parsed.codepart2 = parsed.value.replace(codeFormat, '$2');
    } 
  } else {
    // Entry is blank
    parsed.isBlank = true;
  }

  return parsed;
}

/**
 * Tests a string to see if it's in the format of a U.S. phone number
 * Ignores hyphens, spaces, parens, +.
 *
 *  Returns an object with these properties:
 *  isValid : Bool, true if is valid
 *  value: the parsed entry (no spaces, hyphens or other chars)
 *  formatted: the phone number in this format: (XXX) XXX-XXXX
 *  areaCode: the area code only
 *  part1: the first three digits of the local number
 *  part2: the last 4 digits of the local number
 *  cleanedValue: the entry as the user typed it up to the first offending char
 *  originalValue: the entry as the user supplied it
 *
 * @param  {string} entry the value to test. Usually the value of an input
 * @return {object}       returns an object
 */
function parsePhone(entry) {
  var parsed = {
    originalValue: entry,
    value: '',
    cleanedValue: '',
    formatted: null,
    areaCode: null,
    part1: null,
    part2: null,
    isValid: false,
    invalidChar: false,
    isBlank: false,
    badAreaCode: null,
    wrongCount: false,
  };
  var number = /[0-9]/;
  var separator = /[.,\/#!$%\^&\*;:{}=\-–—_`~()\s+]/;
  var phoneFormat = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (typeof entry === 'string' && entry.length) {
    // Loop over input text and check if each char is a digit or separator
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsed.value += entry[i];
        parsed.cleanedValue += entry[i];
      } else if (separator.test(entry[i])) {
        parsed.cleanedValue += entry[i];
      } else {
        // char is an illegal character so stop checking
        parsed.invalidChar = true;
        break;
      }
    }

    // 11 digits must be 1 + area code + 3 + 4
    // leading 1 is stripped out
    if (parsed.value.length === 11 && parsed.value[0] === '1') {
      parsed.value = parsed.value.substring(1);
    }
    
    if (parsed.value.length !== 10) {
      parsed.wrongCount = true;
    }
    
    // 10 digits must be area code + 3 + 4
    // Area code can't start with a 0 or 1
    if (parsed.value.length === 10 && parseInt(parsed.value[0]) > 1) {
      parsed.isValid = true;
      parsed.badAreaCode = false;
    } else if (parsed.value.length === 10) {
      parsed.badAreaCode = true;
    }
  } else {
    parsed.isBlank = true;
  }
  
  if (parsed.isValid || parsed.badAreaCode) {
    parsed.formatted = parsed.value.replace(phoneFormat, '($1) $2-$3');
    parsed.areaCode = parsed.value.replace(phoneFormat, '$1');
    parsed.part1 = parsed.value.replace(phoneFormat, '$2');
    parsed.part2 = parsed.value.replace(phoneFormat, '$3');
  }
  return parsed;
}

// ---------------------------
// Error message helper
// ---------------------------
function getErrorMessage(error, fieldName) {
  switch (error) {
    case 'isBlank':
      return 'The ' + fieldName + ' field is required and can not be blank';
      break;
    case 'invalidChar':
      return 'The ' + fieldName + ' field contains invalid characters. Check your entry and try again';
      break;
    case 'wrongCount':
      return 'The ' + fieldName + ' field is not valid. Check your entry and try again.';
      break;
    default:
      return 'The ' + fieldName + ' field is not valid. Check your entry and try again.';
  }
}

// ---------------------------
// Test the code validation on submit
// ---------------------------
$('#testCode').submit(function(e) {
  e.preventDefault();

  var theConfCodeValue = $('#theConfCode').val();
  var code = parseCode(theConfCodeValue);
  fieldName = 'confirmation code'
  var message;

  if (code.isValid) {
    $('.codeResults').html(
      '<p class="lead">✅ Valid</p>' +
      '<p>User entered: ' + code.originalValue + '</p>' +
      '<p>Formatted code: ' + code.formatted + '</p>' +
      '<p>First 4 digits: ' + code.codepart1 + '</p>' +
      '<p>Last four digits: ' + code.codepart2 + '</p>');
  } else {
    $('.codeResults').html(
      '<p class="lead">🙅 Invalid</p>' +
      '<p>User entered: ' + code.originalValue + '</p>' +
      '<p>The good bit: ' + code.cleanedValue + '</p>' +
      '<p>Is blank: ' + code.isBlank + '</p>' +
      '<p>Wrong length: ' + code.wrongCount + '</p>' +
      '<p>Invalid chars: ' + code.invalidChar + '</p>');
    if (code.isBlank) {
      message = getErrorMessage('isBlank', fieldName);
    } else if (code.invalidChar) {
      message = getErrorMessage('invalidChar', fieldName);
    } else {
      message = getErrorMessage('wrongCount', fieldName);
    }
    alert(message);
  }
  console.log(code);
});

// ---------------------------
// Test the phone validation
// ---------------------------
$('#testPhone').submit(function(e) {
  e.preventDefault();

  var thePhoneNumberValue = $('#thePhoneNumber').val();
  var phone = parsePhone(thePhoneNumberValue);
  fieldName = 'phone number'
  var message;

  if (phone.isValid) {
    $('.phoneResults').html(
      '<p class="lead">✅ Valid</p>' +
      '<p>User entered: ' + phone.originalValue + '</p>' +
      '<p>Formatted number: ' + phone.formatted + '</p>' +
      '<p>Area code: ' + phone.areaCode + '</p>' +
      '<p>Local part 1: ' + phone.part1 + '</p>' +
      '<p>Local part 2: ' + phone.part2 + '</p>');
  } else {
    $('.phoneResults').html(
      '<p class="lead">🙅 Invalid</p>' +
      '<p>User entered: ' + phone.originalValue + '</p>' +
      '<p>The good bit: ' + phone.cleanedValue + '</p>' +
      '<p>Is blank: ' + phone.isBlank + '</p>' +
      '<p>Bad area code: ' + phone.badAreaCode + '</p>' +
      '<p>Wrong length: ' + phone.wrongCount + '</p>' +
      '<p>Invalid chars: ' + phone.invalidChar + '</p>');
    if (phone.isBlank) {
      message = getErrorMessage('isBlank', fieldName);
    } else if (phone.invalidChar) {
      message = getErrorMessage('invalidChar', fieldName);
    } else if (phone.badAreaCode) {
      message = phone.areaCode + ' is not a valid area code. Check the phone number field and try again.'
    } else {
      message = getErrorMessage('wrongCount', fieldName);
    }
    alert(message);
  }
  console.log(phone);
});