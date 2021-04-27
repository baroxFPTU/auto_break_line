const $ = document.querySelector.bind(document);

const submitBtn = $('.btn-submit');
const textarea = $('.submit-input');
const app = {
    handleEvents: function() {
        _this = this;
        submitBtn.addEventListener('click',(event) => {
            event.preventDefault();
            const subtitles = textarea.value.replace(/\r?\n/g, ' ');
            if (subtitles) {
                _this.breakLine(subtitles);
            } else {
                alert('Please enter your subtitles.');
            }

        })
    },
    breakLine: function(value) {
        const limitLetter = [8,10];
        if (value) {
            const arrWords = value.split(' ');
            console.log(arrWords.slice(0,limitLetter[0]).join(' ')+ '\n' + arrWords.slice(limitLetter[0], limitLetter[0] + limitLetter[1]).join(' '));
        }
    }, 
    start: function() {
        this.handleEvents(); //Handle all DOM events on the page
    }
}

app.start();