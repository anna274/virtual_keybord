const keyboardLayoutRus = {
  lang: 'rus',
  keysLayout: [
    [['ё'], ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
    [['tab'], ['й'], ['ц'], ['у'], ['к'], ['е'], ['н'], ['г'], ['ш'], ['щ'], ['з'], ['х'], ['ъ'], ['\\', '/'], ['del']],
    [['caps lock'], ['ф'], ['ы'], ['в'], ['а'], ['п'], ['р'], ['о'], ['л'], ['д'], ['ж'], ['э'], ['enter']],
    [['shift'], ['я'], ['ч'], ['с'], ['м'], ['и'], ['т'], ['ь'], ['б'], ['ю'], ['.', ','], ['up'], ['shift']],
    [['ctrl'], ['win'], ['alt'], ['space'], ['alt'], ['left'], ['down'], ['right'], ['ctrl']],
  ],
};

const keyboardLayoutEng = {
  lang: 'eng',
  keysLayout: [
    [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
    [['tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['[', '{'], [']', '}'], ['\\', '|'], ['del']],
    [['caps lock'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';', ':'], ['\'', '"'], ['enter']],
    [['shift'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<'], ['.', '>'], ['/', '?'], ['up'], ['shift']],
    [['ctrl'], ['win'], ['alt'], ['space'], ['alt'], ['left'], ['down'], ['right'], ['ctrl']],
  ],
};

const eventKeysLayout = [
  ['Backqoute', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
];

class Keyboard {
  constructor() {
    this.main = null;
    this.rows = [];
    this.keys = [];
    this.caps = false;
    this.langs = [];
    this.currentLang = 0;
    this.shift = false;
    this.alt = false;
    this.textarea = null;
  }

  init(layouts, textarea) {
    this.main = this.createBaseLangLayout(layouts[0]);
    this.rows = this.main.querySelectorAll('.keyboard__row');
    this.keys = this.main.querySelectorAll('.key');
    this.addLeftLangs(layouts.slice(1, layouts.length));
    this.switchLang(localStorage.getItem('lang'));
    this.switchCase();
    document.querySelector('.wrapper').append(this.main);
    this.textarea = textarea;
    this.addEvents();
  }

  addEvents() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      if ((event.code === 'ShiftLeft' || event.code === 'ShiftLeft') && this.shift) return;
      if (event.code === 'ShiftLeft' || event.code === 'ShiftLeft') {
        this.shift = true;
      }
      if (event.code === 'AltLeft' || event.code === 'AltLeft') {
        this.alt = true;
      }
      this.handleKeydown(event.code);
    }, false);
    document.addEventListener('keyup', (event) => {
      if (event.code === 'ShiftLeft' || event.code === 'ShiftLeft') {
        this.shift = false;
      }
      if (event.code === 'AltLeft' || event.code === 'AltLeft') {
        this.alt = false;
      }
      this.handleKeyup(event.code);
    }, false);
    this.main.addEventListener('mousedown', (event) => {
      if (event.target.classList.contains('key')) {
        this.handleMousedown(event.target);
      }
    });
    this.main.addEventListener('mouseup', (event) => {
      if (event.target.classList.contains('key')) {
        this.handleMouseup(event.target);
      }
    });
  }

  createBaseLangLayout(baseLayout) {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    this.langs.push(baseLayout.lang);
    baseLayout.keysLayout.forEach((row, i) => {
      keyboard.append(this.createRow(row, eventKeysLayout[i]));
    });
    return keyboard;
  }

  addLeftLangs(layouts) {
    layouts.forEach((layout) => {
      this.addLang(layout);
    });
  }

  addLang(langLayout) {
    this.langs.push(langLayout.lang);
    this.currentLang += 1;
    langLayout.keysLayout.forEach((row, i) => {
      const keyboardKeys = this.rows[i].querySelectorAll('.key');
      row.forEach((key, j) => {
        if (!(key.length === 1 && key[0].length !== 1)) {
          if (key.length === 1 && key[0].length === 1) {
            this.addOutputtedKeyInner(keyboardKeys[j], 'letter', key[0].toLowerCase(), key[0].toUpperCase());
          } else {
            this.addOutputtedKeyInner(keyboardKeys[j], 'sign', key[0], key[1]);
          }
        }
      });
    });
  }

  createRow(row, eventKeyRow) {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard__row');
    row.forEach((key, i) => {
      keyboardRow.append(this.createKey(key, eventKeyRow[i]));
    });
    return keyboardRow;
  }

  // eslint-disable-next-line class-methods-use-this
  createKey(key, eventKey) {
    const keyElement = document.createElement('div');
    keyElement.classList.add('key', eventKey);
    if (key.length === 1 && key[0].length === 1) {
      this.addOutputtedKeyInner(keyElement, 'letter', key[0].toLowerCase(), key[0].toUpperCase());
    } else if (key.length === 2) {
      this.addOutputtedKeyInner(keyElement, 'sign', key[0], key[1]);
    } else {
      this.addFunctionKeyInner(keyElement, key[0]);
    }
    return keyElement;
  }


  addOutputtedKeyInner(keyElement, type, normal, shift) {
    const lang = document.createElement('div');
    lang.classList.add(this.langs[this.currentLang]);
    lang.setAttribute('key-type', type);
    lang.append(this.addState(['normal', 'open'], normal), this.addState(['shift'], shift));
    keyElement.append(lang);
  }

  // eslint-disable-next-line class-methods-use-this
  addState(states, stateValue) {
    const state = document.createElement('div');
    state.classList.add(...states);
    state.textContent = stateValue;
    return state;
  }

  // eslint-disable-next-line class-methods-use-this
  addFunctionKeyInner(keyElement, value) {
    // eslint-disable-next-line no-param-reassign
    keyElement.textContent = value;
    keyElement.setAttribute('key-type', 'function');
    switch (value) {
      case 'caps lock':
        keyElement.classList.add('key_2-wide', 'key_activatable');
        break;
      case 'shift':
      case 'backspace':
      case 'enter':
        keyElement.classList.add('key_2-wide');
        break;
      case 'space':
        keyElement.classList.add('key_4-wide');
        keyElement.textContent = '';
        break;
      case 'up':
      case 'down':
      case 'left':
      case 'right': {
        const img = document.createElement('img');
        img.classList.add('key__ico');
        img.setAttribute('src', `./src/assets/img/${value}.png`);
        keyElement.textContent = '';
        keyElement.append(img);
        break;
      }
      default:
    }
  }

  switchLang(savedLang) {
    this.switchShift();
    document.querySelectorAll(`.${this.langs[this.currentLang]}`).forEach((el) => {
      el.classList.remove('open');
    });
    this.currentLang = savedLang || (this.currentLang + 1) % this.langs.length;
    this.main.querySelectorAll(`.${this.langs[this.currentLang]}`).forEach((el) => {
      el.classList.add('open');
    });
    this.switchCase();
    this.switchShift();
  }

  switchCase() {
    if (this.caps) {
      this.main.querySelectorAll('.key .open[key-type="letter"]').forEach((key) => {
        key.querySelector('.normal').classList.remove('open');
        key.querySelector('.shift').classList.add('open');
      });
    } else {
      this.main.querySelectorAll('.key .open[key-type="letter"]').forEach((key) => {
        key.querySelector('.shift').classList.remove('open');
        key.querySelector('.normal').classList.add('open');
      });
    }
  }

  switchShift() {
    const letters = this.main.querySelectorAll('.key > .open[key-type="letter"]');
    const signs = this.main.querySelectorAll('.key > .open[key-type="sign"]');
    letters.forEach((key) => {
      key.querySelector('.normal').classList.toggle('open');
      key.querySelector('.shift').classList.toggle('open');
    });
    if (this.shift) {
      signs.forEach((key) => {
        key.querySelector('.normal').classList.remove('open');
        key.querySelector('.shift').classList.add('open');
      });
    } else {
      signs.forEach((key) => {
        key.querySelector('.normal').classList.add('open');
        key.querySelector('.shift').classList.remove('open');
      });
    }
  }

  handleMousedown(key) {
    if (key.hasAttribute('key-type', 'function')) {
      this.handleFunction(key.classList[1]);
    } else {
      this.display(key.querySelector('.open .open').textContent);
    }
  }

  handleMouseup(key) {
    if (key.classList[1] === 'ShiftLeft' || key.classList[1] === 'ShiftRight') {
      this.switchShift();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  keyIsHandled(keyCode) {
    return eventKeysLayout.some((row) => row.some((layoutCode) => layoutCode === keyCode));
  }

  handleKeydown(keyCode) {
    if (this.keyIsHandled(keyCode)) {
      const keyboardKey = this.main.querySelector(`.${keyCode}`);
      keyboardKey.classList.add('active');
      if (keyboardKey.hasAttribute('key-type')) {
        this.handleFunction(keyCode);
      } else {
        this.display(keyboardKey.querySelector('.open .open').textContent);
      }
    }
  }

  handleFunction(keyCode) {
    switch (keyCode) {
      case 'CapsLock':
        document.querySelector('.key_activatable').classList.toggle('on');
        this.caps = !this.caps;
        this.switchCase();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.switchShift();
        if (this.alt) {
          this.switchLang();
        }
        break;
      case 'AltLeft':
      case 'AltRight':
        if (this.shift) {
          this.switchLang();
        }
        break;
      case 'Backspace':
        this.handleBackspace();
        break;
      case 'Delete':
        this.handleDelete();
        break;
      case 'Space':
        this.display(' ');
        break;
      case 'Tab':
        this.display(' ', 4);
        break;
      case 'Enter':
        this.display('\n');
        break;
      case 'ArrowLeft':
        this.moveArrow(this.textarea.selectionStart - 1);
        break;
      case 'ArrowRight':
        this.moveArrow(this.textarea.selectionStart + 1);
        break;
      case 'ArrowUp': {
        this.moveArrow(this.defineUpperPos(this.textarea.selectionStart));
        break;
      }
      case 'ArrowDown': {
        this.moveArrow(this.defineDownPos(this.textarea.selectionStart));
        break;
      }
      default:
    }
  }

  handleKeyup(keyCode) {
    if (this.keyIsHandled(keyCode)) {
      const keyboardKey = this.main.querySelector(`.${keyCode}`);
      keyboardKey.classList.remove('active');
    }
    if (keyCode === 'ShiftLeft' || keyCode === 'ShiftRight') {
      this.switchShift();
    }
  }

  // eslint-disable-next-line class-methods-use-this

  handleBackspace() {
    if (this.textarea.selectionStart === this.textarea.selectionEnd) {
      if (this.textarea.selectionStart > 0) {
        this.textarea.setRangeText('', this.textarea.selectionEnd - 1, this.textarea.selectionEnd, 'end');
      }
    } else {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    }
  }

  handleDelete() {
    if (this.textarea.selectionStart === this.textarea.selectionEnd) {
      if (this.textarea.selectionStart <= this.textarea.value.length) {
        this.textarea.setRangeText('', this.textarea.selectionEnd, this.textarea.selectionEnd + 1, 'end');
      }
    } else {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    }
  }

  display(value, repetition = 1) {
    this.textarea.setRangeText(value.repeat(repetition), this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
  }

  moveArrow(offset) {
    this.textarea.selectionEnd = offset;
    this.textarea.selectionStart = offset;
  }

  defineUpperPos(currentPos) {
    const lineStart = this.textarea.value.lastIndexOf('\n', currentPos - 1);
    if (lineStart !== -1) {
      const prevLineStart = this.textarea.value.lastIndexOf('\n', lineStart - 1);
      if (currentPos - lineStart > lineStart - prevLineStart) {
        return lineStart;
      }
      return prevLineStart + currentPos - lineStart;
    }
    return currentPos;
  }

  defineDownPos(currentPos) {
    const nextLineStart = this.textarea.value.indexOf('\n', currentPos);
    if (nextLineStart !== -1) {
      const lineStart = this.textarea.value.lastIndexOf('\n', currentPos - 1);
      let nextLineEnd = this.textarea.value.indexOf('\n', nextLineStart + 1);
      if (nextLineEnd === -1) {
        nextLineEnd = this.textarea.value.length;
      }
      if (nextLineEnd - nextLineStart < currentPos - lineStart) {
        return nextLineEnd;
      }
      return nextLineStart + (currentPos - lineStart);
    }
    return currentPos;
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  keyboard.init([keyboardLayoutRus, keyboardLayoutEng], document.querySelector('.textarea'));
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('lang', keyboard.currentLang);
  });
});
