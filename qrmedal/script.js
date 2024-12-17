const randomString = length => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*=+';
    let result = '';
    const charsLength = chars.length;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
}

const getCharWidth = (font) => {
    const canvas = getCharWidth.canvas || (getCharWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    return Math.ceil(context.measureText('a').width);
}

const chars = document.getElementById('chars');
const input = document.getElementById('input');
const message = document.getElementById('message');
const content = document.getElementById('content');

let messageTimer = null;
let contentTimer = null;

message.addEventListener('transitionend', e => {
    if (e.propertyName === 'opacity' && !message.classList.contains('fade-in')) {
        message.innerHTML = '';
    }
});

const startRefresh = highlight => {
    let str = randomString(15000);
    if (highlight) {
        str = str.replaceAll(highlight, `<b>${highlight}</b>`);
    }
    if (message.innerHTML) {
        message.classList.remove('fade-in');
        content.classList.remove('sink');
    }
    chars.innerHTML = str;
    contentTimer = setTimeout(startRefresh, 4000);
}
startRefresh();

input.addEventListener('input', e => {
    clearTimeout(contentTimer);
    startRefresh(e.data);
});

input.addEventListener('keydown', async e => {
    if (e.key !== 'Enter') {
        return;
    }

    clearTimeout(messageTimer);
    clearTimeout(contentTimer);

    chars.innerHTML = randomString(15000);

    try {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: Uint8Array.from(atob('XIX0revFjyLM9dnchybiav6vB9avQQimGmf/NoomWRk='), c => c.charCodeAt(0))
            },
            await window.crypto.subtle.importKey('raw', await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value + 'Wargames.MY')), 'AES-GCM', false, ['decrypt']),
            Uint8Array.from(atob('Yxth3W87BM9LykI1Aae8SqGRii452sxZ4j5Ib1kc0T6/93MUyLxtttWsjjzJhhwZ/y/kkNCsVkOKaKhddBvKG0rCuwzTwiql5bZyCDG23KIOhoPaiY0ycvY4lURBhNO5QWvFwkhrEilJrdxE7OntW2uWAkT0yJ4LC6j2y0qVhe9l07PDersKZkzROKPa9gvTeb5KMbxVWZwg7pHH'), c => c.charCodeAt(0))
        );
        message.innerHTML = `<br><b class="success">${new TextDecoder().decode(decrypted)}</b><br><br>`;
        content.classList.add('sink');
    } catch {
        message.innerHTML = '<br><b class="error">Incorrect</b><br><br>';
        contentTimer = setTimeout(startRefresh, 4000);
    }

    const charWidth = getCharWidth('16px "Ubuntu Mono", monospace') + 8;

    if ((Math.round(chars.clientWidth / charWidth) - Math.round(message.clientWidth / charWidth)) % 2) {
        message.style.transform = `translateX(${Math.round(charWidth/2)}px)`;
    } else {
        message.style.transform = '';
    }

    message.style.padding = `0 ${charWidth}px`;
    message.style.margin = `1.25em ${charWidth * 3}px`;
    message.classList.add('fade-in');
});
