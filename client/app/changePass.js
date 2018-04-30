const handleChangePass = (e) => {
  e.preventDefault();

  $('#pokeMessage').animate({ width: 'hide' }, 350);

  if ($('#oldPass').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError('All fields are required');
    return false;
  }

  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('Passwords do no match');
    return false;
  }

  sendAjax('POST', $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize(), redirect);

  return false;
};


const ChangePassWindow = (props) => {
    return (      
    <form id="changePasswordForm" name="changePasswordForm" onSubmit={handleChangePass} action="/changePassword" method="POST" className="mainForm">
      <label for="oldPass">Password: </label>
      <input id="oldPass" type="password" name="oldPass" placeholder="old password"/>
      <label for="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="new password"/>
      <label for="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype new password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <button type="submit" className="btn btn-primary btn-lg">Change Password</button>
    </form>
    );
};

const renderChangePassWindow = (csrf) => {
    ReactDOM.render(
        <ChangePassWindow csrf={csrf} />,
        document.querySelector("#changePassBox")
    );
};
