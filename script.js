const $ = document.querySelector.bind(document);

const submitBtn = $('.btn-submit');
const textarea = $('.submit-input');
const results = $('.results');
const boxSubmit = $('.box-input');
const clearBtn = $('.btn-clear');

const app = {
    limitLetter: [8,10],// the first value is the value of first line, and the other is the value of second line.
    isBreak: false,
    sumLetter: function() {
        return this.limitLetter.reduce((acc,cur) => acc + cur,0);
    },
    handleEvents: function() {
        const _this = this;

        // Submit and handle the subtitles
        submitBtn.addEventListener('click',(event) => {
            event.preventDefault();

            // Reset the array
            _this.array.splice(0, _this.array.length);

            //flat the string, delete the '/n' letter
            const subtitles = textarea.value.replace(/\r?\n/g, ' ').trim(); 

            //split every letter by the spaces
            const arrWords = subtitles.split(' ');
            const arrStores = _this.array;

            if (subtitles) {
                while (arrWords.length > 0) {
                    arrStores.push(_this.breakLine(arrWords));
                    arrWords.splice(0, _this.sumLetter());
                }

                _this.render(arrStores);
                _this.isBreak = true;
                _this.scaleElm();
            } else {
                // reset the isBreak and alert if dont have value inside the textarea
                _this.isBreak = false;
                alert('Please enter your subtitles.');
            }
        });

        // Copy to clipboard on click
        results.onclick = (e) => {
            const elmValue = +e.target.closest('code').dataset.index;
            console.log([elmValue]);
            _this.copyOnClick(_this.array[elmValue]);                     
        }

        // Scale the box-submit when focusin and focusout the textarea
        
            // When click out or focus out
            textarea.addEventListener('focusout', () => {
                if (_this.isBreak) {
                    boxSubmit.classList.add('sm-w');
                }
            });

            // When click on the textarea
            textarea.onfocus = () => {
                if (_this.isBreak) {
                    boxSubmit.classList.remove('sm-w');
                }
            };

        clearBtn.addEventListener('click', () => {
            // clear textarea
            textarea.value = '';

            // clear array & results
            _this.array.splice(0, _this.array.length);
            results.innerHTML = '';

            // change isBreak to false and scaleElm;
            _this.isBreak = false;
            boxSubmit.classList.remove('sm-w');

        })
    },
    breakLine: function(arr) {
        if (arr) {
            const firstLine = arr.splice(0,this.limitLetter[0]).join(' ').trim();
            const secondLine = arr.slice(this.limitLetter[0], this.limitLetter[0] + this.limitLetter[1]).join(' ').trim();
            const breakLine = `${firstLine}<br/>${secondLine}` ;

            return breakLine;
        } else {
            console.error('Something was wrong.')
        };
    }, 
    copyOnClick: function(value) {
        const brRegex = /<br\s*[\/]?>/gi;
        const tempTextarea = document.createElement('textarea');
        
        $('body').appendChild(tempTextarea);
        tempTextarea.innerHTML = value.replace(brRegex, "\r\n");
        tempTextarea.select();
        document.execCommand('copy');
        $('body').removeChild(tempTextarea);
    },
    scaleElm: function() {
        const isValid = (textarea.value) ? true : false;

        if (this.isBreak) {
            boxSubmit.classList.toggle('sm-w', isValid);
        }
    },
    render: function(arr) {
        const htmls = arr.map((text, index) => {
            return `
            <code class="border-radius break-line" data-index="${index}">${text}</code>`;
        });

        results.innerHTML = htmls.join('');
    },
    defineProperties: function()  {
        Object.defineProperty(this, 'array', {
            value: []
        })
    },
    start: function() {
        //Handle all DOM events on the page
        this.handleEvents(); 

        // Define the array to stores the results
        this.defineProperties();
    }
}

app.start();