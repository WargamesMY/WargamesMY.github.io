/*
    *** TRAVELING THROUGH SPACE ***

    An attempt of writing a space travel animation

    https://codepen.io/chrisyboy53/pen/oXZzQb
*/

const vec3 = glMatrix.vec3;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let halfW = canvas.width / 2;
let halfH = canvas.height / 2;
let speed = 0.025;

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const random = (num1, num2) => Math.floor(Math.random() * num2 * 2) + num1;

class Star {
  constructor() {
    this.v = vec3.fromValues(random(0 - halfW, halfW), random(0 - halfH, halfH), random(1, 12));
    this.color = 'hsla(200,100%,' + random(50, 100) + '%,1)';
  }

  draw() {
    this.v = vec3.add(vec3.create(), this.v, vec3.fromValues(0, 0, 0 - speed));
    const x = this.v[0] / this.v[2];
    const y = this.v[1] / this.v[2];
    const x2 = this.v[0] / (this.v[2] + speed * 0.5);
    const y2 = this.v[1] / (this.v[2] + speed * 0.5);

    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (x < 0 - halfW || x > halfW || y < 0 - halfH || y > halfH) {
      this.v = vec3.fromValues(random(0 - halfW, halfW), random(0 - halfH, halfH), random(1, 12));
      this.color = 'hsla(200,100%,' + random(50, 100) + '%,1)';
    }
  }
}

class StarField {
  constructor() {
    this.stars = Array.from({ length: 250 }, () => new Star());
  }

  draw() {
    ctx.translate(halfW, halfH);

    for (let i = 0; i < 250; i++) {
      this.stars[i].draw();
    }
  }
}

const starField = new StarField();

const draw = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  starField.draw();

  window.requestAnimationFrame(draw);
}

draw();

document.addEventListener('resize', () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  halfW = canvas.width / 2;
  halfH = canvas.height / 2;
});

// main swiper

const check = (swiper) => {
  console.log('check')
  const slide = swiper.el.querySelectorAll('.swiper-slide')[swiper.realIndex];

  if (slide.scrollHeight === slide.clientHeight) {
    return;
  }

  slide.classList.add('swiper-no-mousewheel');
  swiper.allowTouchMove = false;
  slide.style.overflow = 'hidden';
  setTimeout(() => slide.style.overflow = null, 300);

  let firstTime = Date.now();
  let lastTime;
  let lastPageY;

  const _check = (deltaY) => {
    if (
      (deltaY < -20 && slide.scrollTop === 0 && !swiper.isBeginning) ||
      (deltaY > 20 && slide.scrollTop > slide.scrollHeight - slide.clientHeight - 1 && !swiper.isEnd)
    ) {
      const now = Date.now();
      if (((!lastTime || now - lastTime < 200) && now - firstTime < 1000) || now - firstTime < 500) {
        lastTime = now;
      } else {
        slide.removeEventListener('wheel', checkWheel);
        slide.removeEventListener('touchstart', checkStart);
        slide.removeEventListener('touchmove', checkMove);
        slide.classList.remove('swiper-no-mousewheel');
        swiper.allowTouchMove = true;
      }
    } else {
      lastTime = null;
    }
  }

  const checkWheel = (event) => _check(event.deltaY);
  const checkStart = (event) => lastPageY = event.touches[0].pageY;
  const checkMove = (event) => _check(lastPageY - event.touches[0].pageY);

  slide.addEventListener('wheel', checkWheel);
  slide.addEventListener('touchstart', checkStart);
  slide.addEventListener('touchmove', checkMove);
}

const swiper = new Swiper('.swiper', {
  direction: 'vertical',
  hashNavigation: {
    watchState: true,
  },
  mousewheel: {
    forceToAxis: true,
  },
  simulateTouch: false,
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar',
  },
  on: {
    afterInit: (swiper) => check(swiper),
    activeIndexChange: (swiper) => check(swiper),
    transitionStart: (swiper) => {
      speed = 0.125;
      swiper.el.classList.add('flash');
    },
    transitionEnd: (swiper) => {
      speed = swiper.realIndex % 5 ? 0.005 : 0.025;
      swiper.el.classList.remove('flash');
    },
    resize: (swiper) => check(swiper),
  },
});

// history swiper

const swiper2 = new Swiper('.swiper2', {
  autoHeight: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  grabCursor: true,
  loop: true,
  mousewheel: {
    forceToAxis: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper2-pagination',
    clickable: true,
  },
  zoom: true,
  on: {
    activeIndexChange: () => {
      if (swiper.realIndex === 4) {
        swiper.emit('activeIndexChange');
      }
    },
  }
});
