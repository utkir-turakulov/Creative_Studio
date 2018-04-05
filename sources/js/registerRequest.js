let sendUserData = function () {
    let secondName = document.querySelector('#validationCustom01'),
        name = document.querySelector('#validationCustom02'),
        email = document.querySelector('#validationCustomUsername'),
        password = document.querySelector(('#inputPassword')),
        confirmPassword = document.querySelector('#inputSecPassword'),
        send = document.querySelector('#submit');

    let xhr = new XMLHttpRequest();

    let body = {
        email: email.value,
        username: name.value + " " + secondName.value,
        password: password.value,
        confirmationPassword: confirmPassword.value
    };


    xhr.open("POST", '/registration', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    xhr.send(JSON.stringify(body));
};

let signIn = function () {
  let email = document.querySelector('#sign-in .username'),
      password = document.querySelector('#sign-in .password');
    let xhr = new XMLHttpRequest();
  let body = {
      email: email.value,
      password: password.value
  };
    xhr.open("POST", '/sign-in', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(body));

};