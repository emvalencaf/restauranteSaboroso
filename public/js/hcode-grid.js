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
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data) => {

                const input = form.querySelector('[name='+ name + ']');

                if(input) input.value = data[name];

            }
        }, configs);

        this.rows = [...document.querySelectorAll('table tbody tr')]

        this.initForms();
        this.initBtns();
    };


    initForms(){

        this.formCreate = document.querySelector(this.options.formCreate);

        this.formCreate.save({
            sucess: () => {
                
                this.fireEvent('afterFormCreated');
            },
            failure: (err) => {
                
                this.fireEvent('afterFormCreateError');
            }
        });
      
        this.formUpdate = document.querySelector(this.options.formUpdate);
      
        this.formUpdate.save({
            sucess: () => {

                this.fireEvent('afterFormUpdated');

            },
            failure: () => {

                this.fireEvent('afterFormUpdateError');

            }
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

    btnUpdateClick(e){

        this.fireEvent('beforeUpdateClick', [e]);

        const data = this.getTrData(e);
  
        for(let name in data){
          
            this.options.onUpdateLoad(this.formUpdate, name, data);
  
        };
  
        this.fireEvent('afterUpdateClick', [e]);

    }

    btnDeleteClick(e){

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
    
    }

    initBtns(){
      
        this.rows.forEach(row => {

            [...row.querySelectorAll('.btn')].forEach(btn => {

                btn.addEventListener('click', e => {

                    if(e.target.classList.contains(this.options.btnUpdate)){

                        this.btnUpdateClick(e);

                    } else if(e.target.classList.contains(this.options.btnDelete)){

                        this.btnDeleteClick(e);

                    } else {

                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e]);

                    };

                });

            });

        });

    };
};