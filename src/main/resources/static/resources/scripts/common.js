const dialog = document.getElementById('dialog');

if (dialog) {
    dialog.createButton = function (text, onclick) {
        return {
            text: text,
            onclick: onclick
        };
    }

    dialog.hide = function () {
        dialog.classList.remove('visible');
    }

    dialog.show = function (params) {
        const modal = dialog.querySelector(':scope > [rel="modal"]');
        const buttonContainer = modal.querySelector(':scope > [rel="buttonContainer"]');
        modal.querySelector(':scope > [rel="title"]').innerText = params['title'];
        modal.querySelector(':scope > [rel="content"]').innerHTML = params['content'];
        buttonContainer.innerHTML = '';
        if (params['buttons'] && params['buttons'].length > 0) {
            for (const button of params['buttons']) {
                const buttonElement = document.createElement('div');
                buttonElement.classList.add('button');
                buttonElement.innerText = button['text'];
                buttonElement.onclick = button['onclick'];
                buttonContainer.append(buttonElement);
            }
        }
        dialog.classList.add('visible');
    }
}

const loading = document.getElementById('loading');

if (loading) {
    loading.hide = function () {
        loading.classList.remove('visible');
    }

    loading.show = function () {
        loading.classList.add('visible');
    }
}

HTMLInputElement.prototype.testRegex = function() {
    return new RegExp(this.dataset.regex).test(this.value);
}











