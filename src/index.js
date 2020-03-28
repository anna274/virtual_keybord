const keyboardLayoutRus = {
  lang: 'rus',
  keysLayout: [
    [['ё'], ['1', '!'], ['2', '"'], ['3', '№'], ['4', ';'], ['5', '%'], ['6', ':'], ['7', '?'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
    [['tab'], ['й'], ['ц'], ['у'], ['к'], ['е'], ['н'], ['г'], ['ш'], ['щ'], ['з'], ['х'], ['ъ'], ['\\', '/'], ['del']],
    [['caps lock'], ['ф'], ['ы'], ['в'], ['а'], ['п'], ['р'], ['о'], ['л'], ['д'], ['ж'], ['э'], ['enter']],
    [['shift'], ['я'], ['ч'], ['с'], ['м'], ['и'], ['т'], ['ь'], ['б'], ['ю'], ['.', ','], ['shift']],
    [['ctrl'], ['win'], ['alt'], ['space'], ['alt'], ['ctrl'], ['left'], ['up'], ['right']],
  ],
};

const keyboardLayoutEng = {
  lang: 'eng',
  keysLayout: [
    [['`', '~'], ['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], ['backspace']],
    [['tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['[', '{'], [']', '}'], ['\\', '|'], ['del']],
    [['caps lock'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';', ':'], ['\'', '"'], ['enter']],
    [['shift'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [',', '<'], ['.', '>'], ['/', '?'], ['shift']],
    [['ctrl'], ['win'], ['alt'], ['space'], ['alt'], ['ctrl'], ['left'], ['up'], ['right']],
  ],
};

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
  }

  addLeftLangs(layouts) {
    layouts.forEach((layout) => {
      this.addLang(layout);
    });
  }

  createBaseLangLayout(baseLayout) {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    this.langs.push(baseLayout.lang);
    baseLayout.keysLayout.forEach((row) => {
      keyboard.append(this.createRow(row));
    });
    return keyboard;
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

  createRow(row) {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard__row');
    row.forEach((key) => {
      keyboardRow.append(this.createKey(key));
    });
    return keyboardRow;
  }

  // eslint-disable-next-line class-methods-use-this
  createKey(key) {
    const keyElement = document.createElement('div');
    keyElement.classList.add('key');
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
    lang.classList.add(this.langs[this.currentLang], 'value');
    lang.setAttribute('key-type', type);
    lang.append(this.addState('normal', normal), this.addState('shift', shift));
    keyElement.append(lang);
  }

  // eslint-disable-next-line class-methods-use-this
  addState(stateType, stateValue) {
    const state = document.createElement('div');
    state.classList.add(stateType);
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
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  keyboard.init([keyboardLayoutRus, keyboardLayoutEng]);
});
