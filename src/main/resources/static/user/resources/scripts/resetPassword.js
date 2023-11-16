const resetPasswordForm = document.getElementById('resetPasswordForm');

resetPasswordForm['emailSend'].onclick = function () {
    if (resetPasswordForm['email'].value === '') {
        dialog.show({
            title: '이메일',
            content: '이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    resetPasswordForm['email'].focus();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (!new RegExp(resetPasswordForm['email'].dataset.regex).test(resetPasswordForm['email'].value)) {
        dialog.show({
            title: '이메일',
            content: '올바른 이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    resetPasswordForm['email'].focus();
                    resetPasswordForm['email'].select();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', resetPasswordForm['email'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status >= 200 && xhr.status < 300) {
            const responseObject = JSON.parse(xhr.responseText);
            switch (responseObject['result']) {
                case 'failure':
                    dialog.show({
                        title: '오류',
                        content: '알 수 없는 이유로 인증번호를 전송하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    break;
                case 'failure_non_email':
                    dialog.show({
                        title: '오류',
                        content: '가입된 이메일이 없습니다.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                resetPasswordForm['email'].focus();
                                resetPasswordForm['email'].select();
                                dialog.hide();
                            })
                        ]
                    });
                    break;
                case 'success':
                    resetPasswordForm['emailSalt'].value = responseObject['salt'];
                    resetPasswordForm['email'].setAttribute('disabled', '');
                    resetPasswordForm['emailSend'].setAttribute('disabled', '');
                    resetPasswordForm['emailCode'].removeAttribute('disabled');
                    resetPasswordForm['emailVerify'].removeAttribute('disabled');
                    dialog.show({
                        title: '성공',
                        content: '입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다.<br><br>해당 인증번호는 <b>5분간만 유효</b>하니 유의해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                resetPasswordForm['emailCode'].focus();
                            })
                        ]
                    });
                    break;
                default:
                    dialog.show({
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        } else {
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
        }
    }
    xhr.open('POST', './resetPasswordEmail');
    xhr.send(formData);
    loading.show();
}

resetPasswordForm['emailVerify'].onclick = function () {
    if (resetPasswordForm['emailCode'].value === '') {
        dialog.show({
            title: '이메일 인증번호',
            content: '이메일 인증번호를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    resetPasswordForm['emailCode'].focus();
                })
            ]
        });
        return;
    }
    if (!new RegExp(resetPasswordForm['emailCode'].dataset.regex).test(resetPasswordForm['emailCode'].value)) {
        dialog.show({
            title: '이메일 인증번호',
            content: '올바른 이메일 인증번호를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    dialog.hide();
                    resetPasswordForm['emailCode'].focus();
                    resetPasswordForm['emailCode'].select();
                })
            ]
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', resetPasswordForm['email'].value);
    formData.append('code', resetPasswordForm['emailCode'].value);
    formData.append('salt', resetPasswordForm['emailSalt'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
            const responseObject = JSON.parse(xhr.responseText);
            switch (responseObject['result']) {
                case 'failure':
                    dialog.show({
                        title: '오류',
                        content: '알 수 없는 이유로 이메일 인증번호를 확인하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    break;
                case 'failure_expired':
                    dialog.show({
                        title: '오류',
                        content: '이메일 인증번호 세션이 만료되었습니다.<br><br>아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                resetPasswordForm['emailSalt'].value = '';
                                resetPasswordForm['email'].removeAttribute('disabled');
                                resetPasswordForm['email'].focus();
                                resetPasswordForm['email'].select();
                                resetPasswordForm['emailSend'].removeAttribute('disabled');
                                resetPasswordForm['emailCode'].value = '';
                                resetPasswordForm['emailCode'].setAttribute('disabled', '');
                                resetPasswordForm['emailVerify'].setAttribute('disabled', '');
                            })
                        ]
                    });
                    break;
                case 'failure_invalid_code':
                    dialog.show({
                        title: '오류',
                        content: '이메일 인증번호가 올바르지 않습니다.<br><br>입력하신 인증번호를 다시 확인해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                resetPasswordForm['emailCode'].focus();
                                resetPasswordForm['emailCode'].select();
                            })
                        ]
                    });
                    break;
                case 'success':
                    resetPasswordForm.querySelector('[rel="emailComplete"]').classList.add('visible');
                    dialog.show({
                        title: '이메일 인증',
                        content: '이메일 및 인증번호를 확인하였습니다.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                dialog.hide();
                                resetPasswordForm['emailCode'].setAttribute('disabled', '');
                                resetPasswordForm['emailVerify'].setAttribute('disabled', '');
                                resetPasswordForm['password'].removeAttribute('disabled');
                                resetPasswordForm['passwordCheck'].removeAttribute('disabled');
                                resetPasswordForm['submit'].removeAttribute('disabled');
                            })
                        ]
                    });
                    break;
                default:
                    dialog.show({
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        } else {
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
        }
    };
    xhr.open('PATCH', './resetPasswordEmail');
    xhr.send(formData);
}

resetPasswordForm.onsubmit = function (e) {
    e.preventDefault();
    if (!resetPasswordForm['email'].hasAttribute('disabled') || !resetPasswordForm['emailCode'].hasAttribute('disabled')) {
        dialog.show({
            title: '경고',
            content: '이메일 인증을 완료해 주세요.',
            buttons: [dialog.createButton('확인', dialog.hide)]
        });
        return;
    }
    if (resetPasswordForm['password'].value === '') {
        dialog.show({
            title: '경고',
            content: '패스워드를 입력해주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    resetPasswordForm['password'].focus();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (!new RegExp(resetPasswordForm['password'].dataset.regex).test(resetPasswordForm['password'].value)) {
        dialog.show({
            title: '경고',
            content: '올바른 패스워드를 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    resetPasswordForm['password'].focus();
                    resetPasswordForm['password'].select();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (resetPasswordForm['passwordCheck'].value === '') {
        dialog.show({
            title: '경고',
            content: '패스워드 재입력을 입력해주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    resetPasswordForm['password'].focus();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (!new RegExp(resetPasswordForm['passwordCheck'].dataset.regex).test(resetPasswordForm['passwordCheck'].value)) {
        dialog.show({
            title: '경고',
            content: '올바른 패스워드 재입력을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    resetPasswordForm['passwordCheck'].focus();
                    resetPasswordForm['passwordCheck'].select();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (resetPasswordForm['password'].value !== resetPasswordForm['passwordCheck'].value) {
        dialog.show({
            title: '경고',
            content: '비밀번호가 일치하지 않습니다.',
            buttons: [dialog.createButton('확인', function () {
                dialog.hide();
                resetPasswordForm['passwordCheck'].focus();
                resetPasswordForm['passwordCheck'].select();
            })
            ]
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', resetPasswordForm['email'].value);
    // formData.append('code', resetPasswordForm['emailCode'].value);
    // formData.append('salt', resetPasswordForm['emailSalt'].value);
    formData.append('password', resetPasswordForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
            const responseObject = JSON.parse(xhr.responseText);
            switch (responseObject['result']) {
                case 'failure':
                    dialog.show({
                        title: '오류',
                        content: '알 수 없는 이유로 이메일 인증번호를 확인하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    break;
                case 'success':
                    dialog.show({
                        title: '비밀번호 재설정',
                        content: '비밀번호 재설정이 완료되었습니다.',
                        buttons: [dialog.createButton('확인', function () {
                            location.href = './login';
                        })]
                    });
                    break;
                default:
                    dialog.show({
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        } else {
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
        }
    }
    xhr.open('PATCH', './resetPassword');
    xhr.send(formData);
}


