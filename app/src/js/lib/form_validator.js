function formValidator(formId, inputsConfig) {
  const $form = $(`#${formId}`);

  if ($form.length === 0) {
    console.error(`Form with ID "${formId}" not found.`);
    return;
  }

  $form.on('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    let errors = [];
    let passwordValue = null;

    for (const [inputId, config] of Object.entries(inputsConfig)) {
      const $input = $(`#${inputId}`);
      const value = $input.val()?.trim();
      const type = config.type;
      const message = config.message || {};

      if ($input.length === 0) {
        errors.push(message.notFound || `Input "${inputId}" not found.`);
        isValid = false;
        continue;
      }

      if (!value) {
        errors.push(message.required || `"${inputId}" is required.`);
        isValid = false;
        continue;
      }

      switch (type) {
        case 'email':
          if (!validator.isEmail(value)) {
            errors.push(message.invalid || `"${inputId}" must be a valid email.`);
            isValid = false;
          }
          break;
        case 'number':
          if (!validator.isNumeric(value)) {
            errors.push(message.invalid || `"${inputId}" must be a number.`);
            isValid = false;
          }
          break;
        case 'text':
          if (!validator.isLength(value, { min: 2 })) {
            errors.push(message.invalid || `"${inputId}" must be at least 2 characters.`);
            isValid = false;
          }
          break;
        case 'date':
          if (!validator.isDate(value)) {
            errors.push(message.invalid || `"${inputId}" must be a valid date.`);
            isValid = false;
          }
          break;
        case 'url':
          if (!validator.isURL(value)) {
            errors.push(message.invalid || `"${inputId}" must be a valid URL.`);
            isValid = false;
          }
          break;
        case 'password':
          passwordValue = value;
          if (!validator.isStrongPassword(value)) {
            errors.push(message.invalid || `"${inputId}" must be a strong password.`);
            isValid = false;
          }
          break;
        case 'password-confirm':
          if (value !== passwordValue) {
            errors.push(message.invalid || `"${inputId}" does not match the password.`);
            isValid = false;
          }
          break;
      }
    }

    if (!isValid) {
      alert(errors.join('\n'));
      return;
    }

    console.log('Form is valid. Submitting...');
    $form.off('submit');
    $form.submit();
  });
}


// formValidator('registerForm', {
//   'signupName': {
//     type: 'text',
//     messageKey: {
//       required: 'form.name.required',
//       invalid: 'form.name.invalid'
//     }
//   },
//   'signupEmail': {
//     type: 'email',
//     messageKey: {
//       required: 'form.email.required',
//       invalid: 'form.email.invalid'
//     }
//   },
//   'signupPassword': {
//     type: 'password',
//     messageKey: {
//       required: 'form.password.required',
//       invalid: 'form.password.weak'
//     }
//   },
//   'signupConfirmPassword': {
//     type: 'password-confirm',
//     messageKey: {
//       required: 'form.confirm.required',
//       invalid: 'form.confirm.mismatch'
//     }
//   }
// });
