const handleError = (message) => {
  $('#errorMessage').text(message);
  $('#pokeMessage').animate({ width: 'toggle' }, 350);
};

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data,
    dataType: 'json',
    success: (result, status, xhr) => {
      $('#pokeMessage').animate({ width: 'hide' }, 350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    },
  });
};

$(document).ready(() => {
  $('#signupForm').on('submit', (e) => {
    e.preventDefault();

    $('#pokeMessage').animate({ width: 'hide' }, 350);

    if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
      handleError('RAWR! Passwords do not match');
      return false;
    }

    sendAjax($('#signupForm').attr('action'), $('#signupForm').serialize());

    return false;
  });

  $('#loginForm').on('submit', (e) => {
    e.preventDefault();

    $('#pokeMessage').animate({ width: 'hide' }, 350);

    if ($('#user').val() == '' || $('#pass').val() == '') {
      handleError('RAWR! Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  $('#pokeForm').on('submit', (e) => {
    e.preventDefault();

    $('#pokeMessage').animate({ width: 'hide' }, 350);

    sendAjax($('#pokeForm').attr('action'), $('#pokeForm').serialize());

    return false;
  });
});
