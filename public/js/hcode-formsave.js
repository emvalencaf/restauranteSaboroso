HTMLFormElement.prototype.save = function(config){
    
    let form = this;

    form.addEventListener('submit', e =>{
    
      e.preventDefault();
      
      const formData = new FormData(form);

      console.log(formData)

      fetch(form.action, {
        method: form.method,
        body: formData
      })
        .then(response => response.json())
        .then(json => {

          if(json.error) {
            
            if(typeof config.failure !== 'function') return
            
            return config.failure(json.error);
          }

          if(typeof config.sucess !== 'function') return

          return config.sucess(json);
        })
        .catch(err => {
  
          if(typeof config.failure !== 'function') return

          return config.failure(err);
  
        });
  
    });

  //return new Promise((resolve, reject) =>{
      


  //})


}