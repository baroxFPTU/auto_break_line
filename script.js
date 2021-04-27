const $ = document.querySelector.bind(document);

const submitBtn = $('.btn-submit');
const textarea = $('.submit-input');
const app = {
    limitLetter: [8,10],// the first value is the value of first line, and the other is the value of second line.
    sumLetter: function() {
        return this.limitLetter.reduce((acc,cur) => acc + cur,0);
    },
    handleEvents: function() {
        const _this = this;

        submitBtn.addEventListener('click',(event) => {
            event.preventDefault();
            const subtitles = textarea.value.replace(/\r?\n/g, ' '); //flat the string, delete the '/n' letter
            const arr = [];
            if (subtitles) {
                const arrWords = subtitles.split(' '); //split every letter by the spaces

                while (arrWords.length > 0) {
                    arr.push(_this.breakLine(arrWords));
                    arrWords.splice(0, _this.sumLetter());
                }

                arr.forEach(value => console.log(value));
            } else {
                alert('Please enter your subtitles.');
            }

        })
    },
    breakLine: function(arr) {
        if (arr) {
            
            const firstLine = arr.splice(0,this.limitLetter[0]).join(' ').trim();
            const secondLine = arr.slice(this.limitLetter[0], this.limitLetter[0] + this.limitLetter[1]).join(' ').trim();
            const breakLine = `${firstLine}\n${secondLine}` ;

            return breakLine;
        } else {
            console.error('Something was wrong.')
        };
    }, 
    start: function() {
        this.handleEvents(); //Handle all DOM events on the page
    }
}

app.start();