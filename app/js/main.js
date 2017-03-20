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
  var cleanedEntry = '';
  var parsedEntry = '';
  var isValid = true;
  var codeFormat = /^([0-9]{4})[- ]?([0-9]{4})$/;
  var number = /[0-9]/;
  var separator = /(?:-| )/;
  var formatted;
  var codepart1;
  var codepart2;

  // Check if entry is a string and not empty
  if (typeof entry === 'string' && entry.length) {
    // Loop over input text and check if each char is a digit or separator
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsedEntry += entry[i];
        cleanedEntry += entry[i];
      } else if (separator.test(entry[i])) {
        cleanedEntry += entry[i];
      } else {
        // char is an illegal character so stop checking
        isValid = false;
        break;
      }
    }

    // If there were no illegal characters and there's 8 numbers then it's good
    if (isValid && parsedEntry.length === 8) {
      isValid = true;
      formatted = parsedEntry.replace(codeFormat, '$1-$2');
      codepart1 = parsedEntry.replace(codeFormat, '$1');
      codepart2 = parsedEntry.replace(codeFormat, '$2');
    } else {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  
  return {
    isValid: isValid,
    value: parsedEntry,
    formatted: formatted,
    codepart1: codepart1,
    codepart2: codepart2,
    cleanedValue: cleanedEntry,
    originalValue: entry,
  };
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
  var cleanedEntry = '';
  var parsedEntry = '';
  var isValid = false;
  var number = /[0-9]/;
  var separator = /(?: |-|\+|\)|\(|\.|\*|\#)/;
  var phoneFormat = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  var length;
  var formatted;
  var areaCode;
  var part1;
  var part2;

  if (typeof entry === 'string' && entry.length) {
    for (var i = 0; i < entry.length; i += 1) {
      if (number.test(entry[i])) {
        parsedEntry += entry[i];
        cleanedEntry += entry[i];
      } else if (separator.test(entry[i])) {
        cleanedEntry += entry[i];
      } else {
        isValid = false;
        break;
      }
    }

    length = parsedEntry.length;

    // 10 digits must be area code + 3 + 4
    // Area code can't start with a 0 or 1
    if (length === 10 && parseInt(parsedEntry[0]) > 1) {
      isValid = true;
    } else if (length === 11 && parsedEntry[0] === '1') {
      // 11 digits must be 1 + area code + 3 + 4
      // leading 1 is stripped out
      parsedEntry = parsedEntry.substring(1);
      isValid = true;
    } else {
      isValid = false;
    }
  }
  
  if (isValid) {
    formatted = parsedEntry.replace(phoneFormat, '($1) $2-$3');
    areaCode = parsedEntry.replace(phoneFormat, '$1');
    part1 = parsedEntry.replace(phoneFormat, '$2');
    part2 = parsedEntry.replace(phoneFormat, '$3');
  }

  return {
    isValid: isValid,
    value: parsedEntry,
    formatted: formatted,
    areaCode: areaCode,
    part1: part1,
    part2: part2,
    cleanedValue: cleanedEntry,
    originalValue: entry,
  };
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

// // Test the code validation on blur
// // ---------------------------
// $('#theConfCode').blur(function() {
//   var theConfCodeValue = $('#theConfCode').val();
//   var code = parseCode(theConfCodeValue);
  
//   if (code.isValid) {
//     console.log(code.formatted + ' is a valid code');
//     console.log('Code part 1', code.codepart1);
//     console.log('Code part 2', code.codepart2);
//   } else {
//     alert('Invalid code. Enter the code that was emailed to you.');
//     $('#theConfCode').val(code.cleanedValue);
//   }   
// })

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


function validCode() {
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
}

function validePhone() {

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
}