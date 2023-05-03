export function Login () {


    document.getElementById("login").innerHTML = `
    <section id="form" class="vh-100" style="background-color: #508bfc;">
     <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <form id="form" class="card shadow-2-strong" style="border-radius: 1rem;">
              <div class="card-body p-5 text-center">

               <h3 class="">Iniciar Sesión</h3>
               <h2><b>INTLOGIS - ON TIME</b></h2>

               <div class="form-outline mb-4">
                 <input type="text" id="typeEmailX-2" class="form-control form-control-lg" placeholder="Usuario" required/>
                  </div>

                <div class="form-outline mb-4">
                    <input type="password" id="typePasswordX-2" class="form-control form-control-lg" placeholder="Contraseña" required/>
                </div>

                  <button class="btn btn-primary btn-lg btn-block log-user" type="submit">Aceptar</button>

                  <hr class="my-4">


                 </div>
              </form>
            </div>
         </div>
      </div>
     </section>
          `;
    
   
    return 
}


