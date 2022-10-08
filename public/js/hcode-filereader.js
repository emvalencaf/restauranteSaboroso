class HcodeFileReader{

    constructor(inputEl, imgEl){
        this.inputEl = inputEl;
        this.imgEl = imgEl;
        console.log(inputEl);
        console.log(imgEl);
        this.initInputEvent();
    };


    initInputEvent(){

        document.querySelector(this.inputEl).addEventListener('change', e =>{
            console.log(document.querySelector(this.inputEl))
            this.reader(e.target.files[0])
                .then(result => {
                    document.querySelector(this.imgEl).src = result
                })
                .catch(err => console.error(err));

        });

    };

    reader(file){

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = function(){

                resolve(reader.result);

            };

            reader.onerror = function(err){
                
                console.error(err);

                reject("Não foi possível ler a imagem");
            };

            reader.readAsDataURL(file)

        });




    };

};