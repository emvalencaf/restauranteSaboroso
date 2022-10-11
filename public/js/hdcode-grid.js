class HcodeGrid{

    constructor(configs){
        
        configs.listeners = Object.assign({
            afterUpdateClick: (e) => {
          
                $('#modal-update').modal('show');
                
              }
        }, configs.listeners);

        this.options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
        }, configs);

        this.initForms();
        this.initBtns();
    };


    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);

        this.formCreate.save()
          .then(json => {
      
            window.location.reload();
      
          })
          .catch(err => {
      
            console.error(err);
      
          });
      
        this.formUpdate = document.querySelector(this.options.formUpdate);
      
        this.formUpdate.save()
          .then(json => {
      
            window.location.reload();
      
          })
          .catch(err => {
      
            console.error(err);
      
          });
      

    };

    fireEvent(name, args){

        if(typeof this.options.listeners[name] !== 'function') return

        this.options.listeners[name].apply(this, args)

    }

    initBtns(){
      
      
        const btnsDelete = [...document.querySelectorAll(this.options.btnDelete)];
      
        btnsDelete.forEach(btn => {
      
            btn.addEventListener('click', e => {
      
        
                const tr = e.composedPath().find(el => el.tagName.toUpperCase() == 'TR');
        
                const data = JSON.parse(tr.dataset.row);
        
                if(!confirm(eval('`' + this.options.deleteMsg + '`'))) return
      
                fetch(eval('`' + this.options.deleteURL + '`'), {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(json => {
      
                        window.location.reload();
      
                    });
      
            });
      
        });
      
        const btns = [...document.querySelectorAll(this.options.btnUpdate)];
        
        btns.forEach(btn =>{
      
          btn.addEventListener('click', e => {
            
            this.fireEvent('beforeUpdateClick', [e]);

            const tr = e.composedPath().find(el => el.tagName.toUpperCase() == 'TR');
      
            const data = JSON.parse(tr.dataset.row);
      
            for(let name in data){
              
              const input = this.formUpdate.querySelector(`[name=${name}]`)
              
              switch(name){
                case 'date':
                  input.value = moment(data[name]).format('YYYY-MM-DD')
                  break;
                default:
                  if(input) input.value = data[name]
              };
      
            };
      
            this.fireEvent('afterUpdateClick', [e]);
          });
      
        });
    };
};