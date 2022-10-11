class HcodeGrid{

    constructor(configs){
        
        configs.listeners = Object.assign({
            afterUpdateClick: (e) => {
          
                $('#modal-update').modal('show');
                
              },
            afterDeleteClick: (e) => {
                
                window.location.reload();

            },
            afterFormCreated: (e) => {

                window.location.reload();

            },
            afterFormUpdated: (e) => {

                window.location.reload();

            },
            afterFormCreateError: (e) => {

                alert('Não foi possível enviar o formulário')

            },
            afterFormUpdateError: e => {

                alert('Não foi possível enviar o formulário')

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
      
            this.fireEvent('afterFormCreated');
      
          })
          .catch(err => {
      
            this.fireEvent('afterFormCreateError');
            console.error(err);
      
          });
      
        this.formUpdate = document.querySelector(this.options.formUpdate);
      
        this.formUpdate.save()
          .then(json => {
      
            this.fireEvent('afterFormUpdated');
      
          })
          .catch(err => {
            
            this.fireEvent('afterFormUpdateError');
            console.error(err);
      
          });
      

    };

    fireEvent(name, args){

        if(typeof this.options.listeners[name] !== 'function') return

        this.options.listeners[name].apply(this, args)

    };

    getTrData(e){

        const tr = e.composedPath().find(el => el.tagName.toUpperCase() == 'TR');
        
        return JSON.parse(tr.dataset.row);

    }

    initBtns(){
      
      
        const btnsDelete = [...document.querySelectorAll(this.options.btnDelete)];
      
        btnsDelete.forEach(btn => {
      
            btn.addEventListener('click', e => {
      
                this.fireEvent('beforeDeleteClick')
        
                const data = this.getTrData(e);

                if(!confirm(eval('`' + this.options.deleteMsg + '`'))) return
      
                fetch(eval('`' + this.options.deleteURL + '`'), {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(json => {
                        
                        this.fireEvent('afterDeleteClick');
      
                    });
      
            });
      
        });
      
        const btns = [...document.querySelectorAll(this.options.btnUpdate)];
        
        btns.forEach(btn =>{
      
          btn.addEventListener('click', e => {
            
            this.fireEvent('beforeUpdateClick', [e]);

            const data = this.getTrData(e);
      
            for(let name in data){
              
                this.options.onUpdateLoad(this.formUpdate, name, data);
      
            };
      
            this.fireEvent('afterUpdateClick', [e]);
          });
      
        });
    };
};