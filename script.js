const $ = document.querySelector.bind(document);
const submitBtn = $('.btn-submit');
const textarea = $('.submit-input');
const results = $('.results');
const boxSubmit = $('.box-input');
const clearBtn = $('.btn-clear');
const notification = $('.notification');
const btnClose = $('.btn-close');
const btnActionGroup = $('.btn-action');
const numberWordsElm = $('.number-words .value');
const countBreakLine = $('.count-break-line');

const app = {
  isCustom: false,
  limitLetter: [8, 10],
  isBreak: false,
  countBreakLine: 0,
  sumLetter() {
    return this.limitLetter.reduce((acc, cur) => acc + cur, 0);
  },
  showCountBreakLine(elm, count) {
    if ($('.count-break-line')) {
      $('.count-break-line').remove();
    }

    elm.insertAdjacentHTML('beforebegin', `
    <span class="count-break-line">${count} break line.</span>`);
    
  },
  handleEvents() {
    const _this = this;

    // Submit and handle the SUBTITLES
    submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      let text = textarea.value.trim();
      let textHandled = _this.handleText(text,_this.isCustom);
      
      // Reset the array
      _this.array.splice(0, _this.array.length);
      
      // Push the all the text was handled into the array
      _this.array.push(...textHandled);

      // Update the count break line
      _this.countBreakLine = textHandled.length;
      
     _this.showCountBreakLine(results, _this.countBreakLine);

      // Render the result after handles
      _this.render(_this.array);

      // If have more than 5 result start scale the result container.
      if (_this.array.length > 5) {
        _this.scaleElm();
      }
    });

    // Copy to clipboard on click
    results.onclick = (e) => {
      const codeElm = e.target.closest('code');
      const elmValue = +codeElm.dataset.index;

      _this.copyOnClick(_this.array[elmValue]);
      codeElm.classList.add('copied');
      _this.showNotificationOnCopy();
    };

    // When click on the textarea
    textarea.onfocus = () => {
      if (_this.isBreak) {
        boxSubmit.classList.remove('sm-w');
      }
    };

    // Update number words when user interacts with textarea/input
    textarea.oninput = () => {
        let numberWords = _this.countWords(textarea.value);
        numberWordsElm.innerText = numberWords;
    }

    // Clear and reset all.
    clearBtn.addEventListener('click', () => {
      // clear textarea
      textarea.value = '';

      // clear array & results
      _this.array.splice(0, _this.array.length);
      results.innerHTML = '';
    //   reset number words
      numberWordsElm.innerText = '0';
      // Clear the count break line
      $('.count-break-line').remove();

      // change isBreak to false and scaleElm;
      _this.isBreak = false;
      boxSubmit.classList.remove('sm-w');
    });

    // Close the results tab on mobile.
    btnClose.onclick = function () {
      results.classList.remove('active');
    };

    // Active the auto and custom button
    btnActionGroup.onclick = function (e) {
      const btn = e.target.closest('.btn');
      const activedBtn = btnActionGroup.querySelector('.active');

      if (btn) {
        const dataAction = btn.dataset.action.toLowerCase();
        // Reset the actived btn
        activedBtn.classList.remove('active');

        // set the active btn
        btn.classList.add('active');
        _this.showNotificationChangeMode();
        // check isCustom or not
        _this.isCustom = (dataAction == 'custom');

        window.localStorage.setItem('isCustom', _this.isCustom);
      }
    };
  },
  countWords(text){
    return  text.split(' ').filter(sub => (sub !== '')).length;
  },
  handleText(text, isCustom) {
    if (!text) {
        // reset the isBreak and alert if don't have value inside the text
        this.isBreak = false;
        alert('Please enter your text.');
        return;
    }

   return (isCustom) ? this.customMode(text) : this.autoMode(text);
  },
//   Return the array of text was auto handled
  autoMode(text) {
    let array = [];
    let splitText = text.split(' ').filter((sub) => (sub !== ''));

    if (!splitText) {
      console.error('Something was wrong.');
      return;
    }

    while (splitText.length > 0) {
        // split every letter by the spaces x
        let brokeLine = this.autoBreak(splitText);

        array.push(brokeLine);
        splitText.splice(0, this.sumLetter());
    }

    return array;
  },
//   Return string of text was break.
  autoBreak(arr) {
    let middle = this.limitLetter[0];
    let end = this.limitLetter[0] + this.limitLetter[1];

    const firstLine = arr.slice(0, middle).join(' ').trim();
    const secondLine = arr.slice(middle, end).join(' ').trim();

    const brokeLine = `${firstLine}<br/>${secondLine}`;
    return brokeLine;
  },
  customMode(text) {
    let splitText = text.split('\\').filter((sub) => (sub !== ''));

    return splitText.map((item) => {
      const arrWords = item.split(' ').filter((sub) => (sub !== ''));
      const numberWords = arrWords.length;

      const middle = Math.floor(arrWords.length / 2);
      const end = arrWords.length;

      let firstLine = arrWords.slice(0, middle).join(' ').trim();
      let secondLine = arrWords.slice(middle, end).join(' ').trim();
      let brokeLine = `${firstLine}<br/>${secondLine}`;

      return brokeLine;
    });
  },
  copyOnClick(value) {
    const brRegex = /<br\s*[\/]?>/gi;
    const tempTextarea = document.createElement('textarea');

    $('body').appendChild(tempTextarea);
    tempTextarea.innerHTML = value.replace(brRegex, '\r\n');
    tempTextarea.select();
    document.execCommand('copy');
    $('body').removeChild(tempTextarea);
  },
  showNotificationOnCopy() {
    notification.classList.add('active');
    setTimeout(() => {
      notification.classList.remove('active');
    }, 1000);
  },
  showNotificationChangeMode() {
    // if (!$('.notification-change')) {
      $('body').insertAdjacentHTML('beforeend', '<div class="notification-change">');
    // }
    const notificationChangeElm = $('.notification-change');
    let customModeDesc = ' On this mode you can use <strong>\\</strong> to break follow your own.';
    let autoModeDesc = 'You don\'t need to do anything now. It\'s automatically'
    notificationChangeElm.innerHTML = `
    <div class="container">

    <div class="icon">

    </div>
    <div class="content">
        <h3>${(!this.isCustom) ? 'Custom' : 'Auto'} mode</h3>
        <p>${(!this.isCustom) ? customModeDesc : autoModeDesc}</p>
    </div>
    <div class="close">&#43;</div>`;
    setTimeout(() => {
      notificationChangeElm.classList.add('active');
    }, 0);

    setTimeout(() => {
      notificationChangeElm.remove();
    }, 5000);
  }
  ,
  scaleElm() {
    const isValid = !!(textarea.value);

    if (this.isBreak) {
      boxSubmit.classList.toggle('sm-w', isValid);
    }
  },
  render(arr) {
    const htmls = arr.map((text, index) => 
    `<code class="border-radius break-line transition" data-index="${index}">${text}</code>`);

    results.innerHTML = htmls.join('');
    // Show the result
    results.classList.add('active');
    //
    this.isBreak = true;
  },
  defineProperties() {
    Object.defineProperty(this, 'array', {
      value: [],
    });
  },
  start() {
    // Handle all DOM events on the page
    this.handleEvents();

    // Define the array to stores the results
    this.defineProperties();
  },
};


window.onload = () => {
  // Get the value of the isCustom from localStorage
  let isCustom = (window.localStorage.getItem('isCustom') === 'true');
  // Update isCustom into the object 'app'
  app.isCustom = isCustom;

  let classBtn = (isCustom) ? '.btn-custom' : '.btn-auto';

  setTimeout(() => {
    //active the button follow the 'isCustom'
    $(classBtn).classList.add('active');
  },0)
}

app.start();
