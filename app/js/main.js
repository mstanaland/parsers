/**
 * Tests a string to see if it's an 8-digit number
 * Ignores hyphens and spaces.
 *
 *  Returns an object with these properties:
 *  isValid : Bool, true if is valid
 *  value: the parsed entry (no spaces, hyphens or other chars)
 *  formatted: the value with separating hyphen
 *  codepart1: the first 4 digits
 *  codepart2: the last 4 digits
 *  cleanedValue: the entry as the user typed it up to the first offending char
 *  originalValue: the entry as the user supplied it
 *
 * @param  {string} entry the value to test. Usually the value of an input
 * @return {object}       returns an object
 */
function parseCode(entry) {
  var parsed = {
    isValid: true,
    originalValue: entry,
    cleanedEntry: '',
    value: '',
    formatted: null,
    codepart1: null,
    codepart2: null,
  };
  
  var codeFormat = /^([0-9]{4})[- ]?([0-9]{4})$/;
  var number = /[0-9]/;
  var separator = /(?:-| )/;


  // Check if entry is a string and not empty
  if (typeof entry === 'string' && entry.length) {
    // Loop over input text and check if each char is a digit or separator
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsed.value += entry[i];
        parsed.cleanedEntry += entry[i];
      } else if (!separator.test(entry[i])) {
        parsed.cleanedEntry += entry[i];
      } else {
        // char is an illegal character so stop checking
        parsed.isValid = false;
        break;
      }
    }

    // If there were no illegal characters and there's 8 numbers then it's good
    if (parsed.isValid && parsed.value.length === 8) {
      parsed.formatted = parsed.value.replace(codeFormat, '$1-$2');
      parsed.codepart1 = parsed.value.replace(codeFormat, '$1');
      parsed.codepart2 = parsed.value.replace(codeFormat, '$2');
    } else {
      parsed.isValid = false;
    }
  } else {
    parsed.isValid = false;
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
    isValid: false,
    cleanedEntry: '',
    value: '',
    formatted: null,
    areaCode: null,
    part1: null,
    part2: null,
  };
  var number = /[0-9]/;
  var separator = /(?: |-|\+|\)|\(|\.|\*|\#)/;
  var phoneFormat = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (typeof entry === 'string' && entry.length) {
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsed.value += entry[i];
        parsed.cleanedEntry += entry[i];
      } else if (separator.test(entry[i])) {
        parsed.cleanedEntry += entry[i];
      } else {
        parsed.isValid = false;
        break;
      }
    }

    // 11 digits must be 1 + area code + 3 + 4
    // leading 1 is stripped out
    if (parsed.value.length === 11 && parsed.value[0] === '1') {
      parsed.value = parsed.value.substring(1);
    }
    
    // 10 digits must be area code + 3 + 4
    // Area code can't start with a 0 or 1
    if (parsed.value.length === 10 && parseInt(parsed.value[0]) > 1) {
      parsed.isValid = true;
    } else {
      parsed.isValid = false;
    }
  }
  
  if (parsed.isValid) {
    parsed.formatted = parsed.value.replace(phoneFormat, '($1) $2-$3');
    parsed.areaCode = parsed.value.replace(phoneFormat, '$1');
    parsed.part1 = parsed.value.replace(phoneFormat, '$2');
    parsed.part2 = parsed.value.replace(phoneFormat, '$3');
  }

  return parsed;
}

// Test the code validation on submit
// ---------------------------
$('#testCode').submit(function(e) {
  e.preventDefault();

  var theConfCodeValue = $('#theConfCode').val();
  var code = parseCode(theConfCodeValue);

  if (code.isValid) {
    console.log(code.formatted + ' is a valid code');
    console.log('Code part 1', code.codepart1);
    console.log('Code part 2', code.codepart2);
  } else {
    alert('Invalid code. Enter the code that was emailed to you.');
    $('#theConfCode').val(code.cleanedValue);
  }
});

// Test the code validation on blur
// ---------------------------
$('#theConfCode').blur(function() {
  var theConfCodeValue = $('#theConfCode').val();
  var code = parseCode(theConfCodeValue);
  
  if (code.isValid) {
    console.log(code.formatted + ' is a valid code');
    console.log('Code part 1', code.codepart1);
    console.log('Code part 2', code.codepart2);
  } else if (theConfCodeValue.length) {
    alert('Invalid code. Enter the code that was emailed to you.');
    $('#theConfCode').val(code.cleanedValue);
  }   
})

// Test the phone validation
// ---------------------------
$('#testPhone').submit(function(e) {
  e.preventDefault();

  var thePhoneNumberValue = $('#thePhoneNumber').val();
  var phone = parsePhone(thePhoneNumberValue);

  if (phone.isValid) {
    console.log(phone.formatted + ' is a valid U.S. phone number format');
    console.log('Area code', phone.areaCode);
    console.log('Part 1', phone.part1);
    console.log('Part 2', phone.part2);
  } else {
    alert('Invalid U.S. phone number. Enter your phone number with area code.');
  }
});