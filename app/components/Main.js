
export function Main() {
  const $main = document.createElement("main");
  $main.id = "main";

  let date = new Date();

  //console.log(localStorage.username);

  
  //console.log(location.hash);
  $main.innerHTML = `
  <div class="d-grid gap-2 d-md-flex d-sm-flex justify-content-md-end margin">
  <button class="btn btn-dark fw-bold"><i class="fa-solid fa-calendar me-1"></i> <span class="date">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</span></button> 
  <button class="btn btn-dark fw-bold me-auto"> <i class="fa-solid fa-clock ms-1 pe-1"></i> <span class="clock"></span> </button>
  
  <button id="tablero"  class="btn btn-primary fw-bold tablero" type="button" >Tablero de Viajes</button>
  <button id="cajas" class="btn btn-primary fw-bold cajas" type="button" >Inventario de Cajas</button>
  <button id="unidades" class="btn btn-primary fw-bold unidades" type="button" >Inventario de Unidades</button>
  <button class="btn btn-primary fw-bold  modal_xls" type="button" data-bs-toggle="modal" data-bs-target="#exportModal" style="${window.location.hash === "#/Public" ? "display: none;" : ""}" >Generar Reporte</button>
  <button class="btn btn-success fw-bold  reg" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" style="${window.location.hash === "#/Public" || window.location.hash === "#/Traffic" || window.location.hash === "#/CVehicular" ? "display: none;" : ""}">Agregar Registro</button>
  <button  class="remolque btn btn-primary fw-bold  reg" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" style="${window.location.hash === "#/Public" || window.location.hash === "#/Traffic" || window.location.hash === "#/Inhouse" || window.location.hash === "#/Tracking" ? "display: none;" : ""}">Agregar Remolque</button>
  <button  class="unidad btn btn-primary fw-bold  reg" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" style="${window.location.hash === "#/Public" || window.location.hash === "#/Traffic" || window.location.hash === "#/Inhouse" || window.location.hash === "#/Tracking" ? "display: none;" : ""}">Agregar Unidad</button>
  </div>  

  <form id="formulario">
    <div classs="container">
     <div class="modal fade" id="exampleModal" style="height: 40vh; margin-top:10rem;" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
       <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Título del modal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button id="bt-save" data-value="" type="submit" class="btn btn-primary hidden">Guardar cambios</button>
        <input type="hidden" name="id">
               </div>
             </div>
           </div>
        </div>
       </div>
  </form>



  <form id="formulario">
    <div classs="container">
     <div class="modal fade" id="exportModal" tabindex="-1" aria-labelledby="exportModal" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
       <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exportModalLabel">Generar Reporte</h5>
        <button type="button" class="btn-close report" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      <div id="exportModalXls" class="export-modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger cancelXls" data-bs-dismiss="modal">Cancelar</button>
        <button data-value="" type="submit" class="btn btn-primary generar_xls" data-bs-dismiss="modal" aria-label="Close">Aceptar</button>
        <input type="hidden" name="id">
               </div>
             </div>
           </div>
        </div>
       </div>
  </form>

  

  <form id="formulario" class="update">
  <div classs="container">
   <div class="modal fade" id="controlModal" tabindex="-1" aria-labelledby="controlModal" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
     <div class="modal-content">
      <div class="modal-header">
      <h5 class="modal-title" id="controlModalLabel">Control Vehicular</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
    <div class="control-modal-body">
      ...
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
      <button type="subtmit" id="controlV" data-unit="" data-conveyance="" class="btn btn-primary">Guardar cambios</button>
    
             </div>
           </div>
         </div>
      </div>
     </div>
</form>


  <div classs="container">
  <div class="modal fade" id="importModal" tabindex="-1" aria-labelledby="importModal" aria-hidden="true">
   <div class="modal-dialog modal-md">
    <div class="modal-content">
     <div class="modal-header">
     <h5 class="modal-title" id="importModalLabel">Generar Template desde:</h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
     </div>
   <div class="import-modal-body">
       <input class="ps-5 importModalCsv" type="file" id=""/>
   </div>
   <div class="modal-footer">
     <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
     <button data-value="" type="button" class="btn btn-primary import_csv" data-bs-dismiss="modal" aria-label="Close">Aceptar</button>
     <input type="hidden" name="id">
            </div>
          </div>
        </div>
     </div>
    </div>

<section id="thtable" class="thtable"> </section>
`;

  let clockTempo;

  clockTempo = setInterval(() => { let clockHour = new Date().toLocaleTimeString();
    document.querySelector(".clock").innerHTML=`${clockHour}`;
   }, 1000);

 

  return $main;
}
