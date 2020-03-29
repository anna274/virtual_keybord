const keyboardLayoutRus = {
  lang: 'rus',
  keysLayout: [
    [['ё'], ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
    [['tab'], ['й'], ['ц'], ['у'], ['к'], ['е'], ['н'], ['г'], ['ш'], ['щ'], ['з'], ['х'], ['ъ'], ['\\', '/'], ['del']],
    [['caps lock'], ['ф'], ['ы'], ['в'], ['а'], ['п'], ['р'], ['о'], ['л'], ['д'], ['ж'], ['э'], ['enter']],
    [['shift'], ['я'], ['ч'], ['с'], ['м'], ['и'], ['т'], ['ь'], ['б'], ['ю'], ['.', ','], ['shift']],
    [['ctrl'], ['alt'], ['space'], ['alt'], ['ctrl'], ['left'], ['up'], ['right']],
  ],
};

const keyboardLayoutEng = {
  lang: 'eng',
  keysLayout: [
    [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
    [['tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['[', '{'], [']', '}'], ['\\', '|'], ['del']],
    [['caps lock'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';', ':'], ['\'', '"'], ['enter']],
    [['shift'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<'], ['.', '>'], ['/', '?'], ['shift']],
    [['ctrl'], ['alt'], ['space'], ['alt'], ['ctrl'], ['left'], ['up'], ['right']],
  ],
};

const eventKeysLayout = [
  ['Backqoute', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
];

class Keyboard {
  constructor() {
    this.main = null;
    this.rows = [];
    this.keys = [];
    this.caps = false;
    this.langs = [];
    this.currentLang = 0;
  }

  init(layouts) {
    this.main = this.createBaseLangLayout(layouts[0]);
    this.rows = this.main.querySelectorAll('.keyboard__row');
    this.keys = this.main.querySelectorAll('.key');
    this.addLeftLangs(layouts.slice(1, layouts.length));
    this.switchLang();
    document.querySelector('.wrapper').append(this.main);
    this.addEvents();
  }

  addEvents() {
    let shiftPressed = false;
    document.addEventListener('keydown', (event) => {
      if (shiftPressed) return;
      if (event.code === 'ShiftLeft' || event.code === 'ShiftLeft') {
        shiftPressed = true;
      }
      this.keydownHandler(event.code);
    }, false);
    document.addEventListener('keyup', (event) => {
      if (event.code === 'ShiftLeft' || event.code === 'ShiftLeft') {
        shiftPressed = false;
      }
      this.keyupHandler(event.code);
    }, false);
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
      case 'shift':
      case 'backspace':
      case 'enter':
        keyElement.classList.add('key_2-wide');
        break;
      case 'space':
        keyElement.classList.add('key_4-wide');
        break;
      default:
    }
  }

  switchLang() {
    document.querySelectorAll(`.${this.langs[this.currentLang]}`).forEach((el) => {
      el.classList.remove('open');
    });
    this.currentLang = (this.currentLang + 1) % this.langs.length;
    this.main.querySelectorAll(`.${this.langs[this.currentLang]}`).forEach((el) => {
      el.classList.add('open');
    });
    console.log(this.langs[this.currentLang]);
    this.switchCase();
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
    this.main.querySelectorAll('.key > .open').forEach((key) => {
      key.querySelector('.normal').classList.toggle('open');
      key.querySelector('.shift').classList.toggle('open');
    });
  }

  clickHandler(key) {
    if (!key.hasAttribute('key-type', 'function')) {
      const keyValue = key.querySelector('.open .open').textContent;
      document.querySelector('.textarea').value += keyValue.toString();
    } else {
      switch (key.classList[1]) {
        case 'ShiftRight':
        case 'ShiftLeft':
          this.shiftHandler();
          break;
        case 'CapsLock':
          this.caps = !this.caps;
          this.switchCase();
          break;
        default:
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  keyIsHandled(keyCode) {
    return eventKeysLayout.some((row) => row.some((layoutCode) => layoutCode === keyCode));
  }

  keydownHandler(keyCode) {
    if (this.keyIsHandled(keyCode)) {
      const keyboardKey = this.main.querySelector(`.${keyCode}`);
      keyboardKey.classList.add('active');
      switch (keyCode) {
        case 'CapsLock':
          this.caps = !this.caps;
          this.switchCase();
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.switchShift();
          break;
        default:
          this.inputHandler(keyboardKey);
      }
    }
  }

  keyupHandler(keyCode) {
    if (this.keyIsHandled(keyCode)) {
      const keyboardKey = this.main.querySelector(`.${keyCode}`);
      keyboardKey.classList.remove('active');
    }
    if (keyCode === 'ShiftLeft' || keyCode === 'ShiftRight') {
      this.switchShift();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  inputHandler(key) {
    const keyValue = key.querySelector('.open .open').textContent;
    document.querySelector('.textarea').value += keyValue.toString();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  keyboard.init([keyboardLayoutRus, keyboardLayoutEng]);
  keyboard.main.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('key')) {
      keyboard.clickHandler(event.target);
    }
  });
});
