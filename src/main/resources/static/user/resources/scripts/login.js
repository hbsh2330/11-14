const loginForm = document.getElementById('loginForm');

if (typeof localStorage.getItem('loginEmail') === 'string') {
    loginForm['email'].value = localStorage.getItem('loginEmail');
    loginForm['password'].focus();
    loginForm['remember'].checked = true;
}

loginForm.onsubmit = function (e) {
    e.preventDefault();

    if (loginForm['email'].value === '') {
        dialog.show({
            title: '로그인',
            content: '이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    loginForm['email'].focus();
                })
            ]
        });
        return false;
    }
    if (!loginForm['email'].testRegex()) {
        dialog.show({
            title: '로그인',
            content: '올바른 이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    loginForm['email'].focus();
                    loginForm['email'].select();
                })
            ]
        });
        return false;
    }
    if (loginForm['password'].value === '') {
        dialog.show({
            title: '로그인',
            content: '비밀번호를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    loginForm['password'].focus();
                })
            ]
        });
        return false;
    }
    if (!loginForm['password'].testRegex()) {
        dialog.show({
            title: '로그인',
            content: '올바른 비밀번호를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    loginForm['password'].focus();
                    loginForm['password'].select();
                })
            ]
        });
        return false;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginForm['email'].value);
    formData.append('password', loginForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        switch (responseObject['result']) {
            case 'failure':
                dialog.show({
                    title: '경고',
                    content: '이메일 혹은 비밀번호가 올바르지 않습니다.',
                    buttons: [
                        dialog.createButton('확인', function () {
                            dialog.hide();
                            loginForm['email'].focus();
                            loginForm['email'].select();
                        })
                    ]
                });
                break;
            case 'failure_suspended':
                dialog.show({
                    title: '경고',
                    content: '해당 계정은 이용이 정지된 계정입니다.<br><br>관리자에게 문의해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                break;
            case 'success':
                if (loginForm['remember'].checked) {
                    localStorage.setItem('loginEmail', loginForm['email'].value);
                }
                location.href = '../';
                break;
            default:
                dialog.show({
                    title: '오류',
                    content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
        }
    };
    xhr.open('POST', './login');
    xhr.send(formData);
    loading.show();
}