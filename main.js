class UserService {
    // уберем идентификатор var перед публичными полями и добавим нижнее подчеркивание в названиях переменных
    _username;
    _password;

    constructor(username, password) {
        this._username = username;
        this._password = password;
    }

    get username() {
        return this._username;
        // заменим UserService -> this, поскольку поле username определялось не как статичное
    }

    get password() {
        throw "You are not allowed to get password";
    }

    static authenticate_user(username, password) {
        return (async () => {
            let result = await new Promise(resolve => {
                let xhr = new XMLHttpRequest();
                // Заменяем UserService.username и UserService.password на username и password(локальные переменные, передаваемые в функцию authenticate_user)
                xhr.open('GET', 'https://examples.com/api/user/authenticate?username=' +
                    username + '&password=' + password, true);
                xhr.responseType = 'json';

                xhr.onload = function () {
                    // Заменяем "200" на 200, поскольку xhr.status имеет тип number
                    if (xhr.status !== 200) {
                        resolve(xhr.response);
                    } else {
                        resolve(true);
                    }
                };

                // Добавляем строку отправки запроса
                xhr.send();
            });
            return result;
        })();
    }
}

$('form #login').click(async () => {
    var username = $('#username');
    var password = $('#password');

    var res = await UserService.authenticate_user(username, password);

    // заменим == на === так как возвращается либо true, либо объект, который приводится к true
    if(res === true) {
        document.location.href = '/home';
    } else {
        alert(res.error);
    }
})