
class CodeInterface {
    constructor() {
        this.form = document.querySelector('#comic-form');
        this.searchField = document.querySelector('#search-input');

        this.title = document.querySelector('#comic-title');
        this.createdDate = document.querySelector('#comic-created_date');
        this.image = document.querySelector('#comic-image');
        this.transcriptData = document.querySelector('#comic-transcript_data');
this.comicId=document.querySelector('#comic-id-number');

        this.error = document.querySelector('#error');
        this.formError = document.querySelector('#form-error');
        this.loader = document.querySelector('#loader');

        this.controls = {
            previous: document.querySelector('#request-prev'),
            next: document.querySelector('#request-next'),
            random: document.querySelector('#request-random'),
           
        
        };
    }

    clearResults() {
        this.title.innerHTML = 'Loading...';
        this.createdDate.innerHTML='Loading...';
        this.image.src = '';
        this.image.alt = '';
    }

    hideLoader() {
        this.loader.classList.remove('d-flex');
        this.loader.classList.add('d-none');
    }

    showLoader() {
        this.loader.classList.remove('d-none');
        this.loader.classList.add('d-flex');
    }

    showError() {
        this.hideLoader();
        this.error.innerHTML = 'There has been an error, please try again';
    }

    showFormError(message) {
        this.hideLoader();
        this.formError.innerHTML = message;
    }

    hideErrors() {
        this.error.innerHTML = '';
        this.formError.innerHTML = '';
    }

    showComics(data) {
        const { title, img, day , month , year, transcript, num } = data;
        
        this.title.innerHTML = title;
        this.comicId.innerHTML= "Comic Id - "+num;
        
        this.createdDate.innerHTML="Created on - "+ day +"/"+ month+"/"+year;
        this.image.src = img;
        var data=transcript.replace(/(?:\r\n|\r|\n)/g, '<br>');

        this.transcriptData.innerHTML=data;
        
        if (data.alt) this.image.alt = data.alt;

        this.hideLoader();
    }
}

class RequestController {
    constructor() {
        this.CodeInterface = new CodeInterface();
        
        this.corsHeader = 'https://shrouded-gorge-14113.herokuapp.com';
        this.apiUrl = 'https://xkcd.com';
        this.apiUrlFormat = 'info.0.json';
        this.superAgent = superagent;

        this.currentComicsNumber = 0;
        this.maxComicsNumber = 0;

        this.getCurrentComics();
        this.registerEvents();
    }

    setMaxComicsNumber(number) {
        this.maxComicsNumber = number;
    }

    setCurrentComicsNumber(number) {
        this.currentComicsNumber = number;
    }

    getRandomComicsNumber() {
        const min = 1;
        const max = this.maxComicsNumber;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    getCurrentComics() {
        const requestUrl = `${this.corsHeader}/${this.apiUrl}/${this.apiUrlFormat}`;

        this.superAgent.get(requestUrl).end((error, response) => {
            if (error) {
                this.CodeInterface.showError();
            }
            const data = response.body;

            this.CodeInterface.showComics(data);
            this.setCurrentComicsNumber(data.num);
            this.setMaxComicsNumber(data.num);
        });
    }
	
	
	
	
	//  getCurrentComics() {
    //   const requestUrl = `${this.corsHeader}/${this.apiUrl}/${this.apiUrlFormat}`;
    //    const requestUrl = `${this.apiUrl}/${this.apiUrlFormat}`;
    //      this.superAgent.get(requestUrl).end((error, response) => {
    //        if (error) {
    //            this.CodeInterface.showError();
    //         }
    //        const data = response.body;

    //     this.CodeInterface.showComics(data);
    //         this.setCurrentComicsNumber(data.num);
    //         this.setMaxComicsNumber(data.num);
    //     });


    //    alert(requestUrl);
    //     var xhttp = new XMLHttpRequest();
      
    //     xhttp.open("GET",requestUrl);
    //     xhttp.setRequestHeader( 'Access-Control-Allow-Origin', '*');
    //     xhttp.setRequestHeader( 'Content-Type', 'application/json' );
        
       

    //     xhttp.send();
    //     xhttp.onload = () =>{
           
              
    //            var data=JSON.parse(xhttp.response);
               
    //         this.CodeInterface.showComics(data);
    //        this.setCurrentComicsNumber(data.num);
    //       this.setMaxComicsNumber(data.num);

           
          
        
    //     }
    //     xhttp.onerror  =()=>{
    //         alert(xhttp.responseText);
    //     }

       
    // }
	
	
	
	
	
	

    getComicsByNumber(number) {
        this.CodeInterface.hideErrors();
        this.CodeInterface.showLoader();
        this.CodeInterface.clearResults();

        const requestUrl = `${this.corsHeader}/${this.apiUrl}/${number}/${this.apiUrlFormat}`;

        this.superAgent.get(requestUrl).end((error, response) => {
            if (error) {
                this.CodeInterface.showError();
            }

            const data = response.body;

            this.setCurrentComicsNumber(data.num);
            this.CodeInterface.showComics(data);
        });
    }

    requestPreviousComics() {
        const requestedComicsNumber = this.currentComicsNumber - 1;
        console.log({ requestedComicsNumber });
        if (requestedComicsNumber < 1) {
            alert("You already reached to page 1st !!");
            return;

                }        
            this.getComicsByNumber(requestedComicsNumber);
    }

    requestNextComics() {
        const requestedComicsNumber = this.currentComicsNumber + 1;
        if (requestedComicsNumber > this.maxComicsNumber) { 
            alert("You are already on the Latest comic !!");
            return;}

        this.getComicsByNumber(requestedComicsNumber);
    }

    requestComicsById(e) {
        e.preventDefault();

        const query = this.CodeInterface.searchField.value;
        if (!query || query === '') return;
        if (query < 1 || query > this.maxComicsNumber) {
            return this.CodeInterface.showFormError(`Try a number between 1 and ${this.maxComicsNumber}`);
        }

        this.getComicsByNumber(query);
    }

    registerEvents() {
        this.CodeInterface.controls.random.addEventListener('click', () =>
            this.getComicsByNumber(this.getRandomComicsNumber())
        );

        
        this.CodeInterface.controls.previous.addEventListener('click', () => this.requestPreviousComics());
        this.CodeInterface.controls.next.addEventListener('click', () => this.requestNextComics());

        this.CodeInterface.form.addEventListener('submit', e => this.requestComicsById(e));
    }
}

const comics = new RequestController();
