import api from "../helpers/wp_api.js";
import { ajax } from "../helpers/ajax.js";
import { generar_xls } from "../helpers/generar_xls.js";
import { renderTable } from "./renderTable.js";
import { renderTableCV } from "./renderTableCV.js";
import { renderTableUnits } from "./renderTableUnits.js";
import { renderTableEV } from "./renderTableEV.js";
import { renderTableHistory } from "./renderTableHistory.js";
import { tabActive } from "./tabActive.js";


export async function Router() {
  const d = document,
       w = window;
   d.addEventListener("keyup", e => {
  //console.log(e);
  if(e.key === "Escape"){
    location.reload();
  }
   });

  let { hash } = w.location;   
  let newArray, listenItemsArray, dbXlsx;

  function handleFile(event) {

    const fileInput = event.target;
    const file = fileInput.files[0];
  
    if (file) {
        const reader = new FileReader();
  
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
  
            // Puedes acceder a las hojas del libro de trabajo
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
  
            // Convertir el contenido de la hoja a un objeto JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
       // console.log(jsonData);
          dbXlsx = jsonData;
  
        };
  
        reader.readAsArrayBuffer(file);
    }
  
  
  }

 //console.log(localStorage.username);
 let user = localStorage.username;

  if (!hash || hash === "#" || hash === "#/" || hash === `#/${user}`) {
    if(localStorage.username === "Public") {
      window.location.hash = "/Public/productivo";
      location.reload();
    } else
    if(localStorage.username === "Tracking") {
      window.location.hash = "/Tracking/productivo";
      location.reload();
    }else
      if(localStorage.username === "InhouseHMO") {
        window.location.hash = "/InhouseHMO/productivo";
        location.reload();
      }else
      if(localStorage.username === "InhouseMX") {
        window.location.hash = "/InhouseMX/productivo";
        location.reload();
      }else
      if(localStorage.username === "InhouseTOL") {
        window.location.hash = "/InhouseTOL/productivo";
        location.reload();
      }else
      if(localStorage.username === "InhouseGTO") {
        window.location.hash = "/InhouseGTO/productivo";
        location.reload();
      }else
      if(localStorage.username === "Traffic") {
        window.location.hash = "/Traffic/productivo";
        location.reload();
      }else
      if(localStorage.username === "TrafficH") {
        window.location.hash = "/TrafficH/productivo";
        location.reload();
      }else 
      if(localStorage.username === "CVehicular") {
        window.location.hash = "/CVehicular/cajas";
        location.reload();
      }
    return;
  } else
  if (!user || user === "Public" || user === "Tracking" || user === "Traffic" || user === "TrafficH" || user === "InhouseTOL" || user === "InhouseHMO" || user === "InhouseMX" || user === "InhouseGTO" || user === "CVehicular") {
           
   if (hash === "#/" + user + "/productivo") {
    tabActive("tablero");
    localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;

        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTable(newArray);
          },
        });

        const updateData = setInterval(  () => {
      
          ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {
              
                //console.log(Object.values(items));
                  listenItemsArray = Object.values(items);
                  let firstArray = Object.values(newArray);
                   // console.log(Object.entries(itemsArray).length);
    
                   if(listenItemsArray.length === firstArray.length){
    
                    
                      for (let i = 0; i < firstArray.length; i++) {
                        let e = firstArray[i];
                         let e2 = listenItemsArray[i];
                  
                       if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                        || e.unidad != e2.unidad || e.bol != e2.bol 
                        || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                        || e.cliente != e2.cliente || e.cporte != e2.cporte
                        || e.tracking != e2.tracking || e.llegada != e2.llegada
                        || e.status != e2.status || e.llegadareal != e2.llegadareal
                        || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                        || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                        ) {
                        //  console.log("UPDATE")
                        renderTable(items);
                         }
         
                       }
                     } 
                     else {
                     // console.log("UPDATE");
                     renderTable(items);
    
                      
                     }
    
    
                 
                 //console.log(listenItemsArray);
               }       
            })
    
        }, 10000);
           
        updateData;   
       

        
      d.getElementById('excelFileInput').addEventListener('change', e => {
   
        if(e.target.matches("#excelFileInput")){
        //  console.log(e.target); 
             handleFile(e);            
        }
         
     });
 
     d.addEventListener("click", async (e) => {    
      //console.log(e.target);
     //LEER CSV / XLS
     let date = new Date;
     if (e.target.matches(".importModal")) {
       clearInterval(updateData);
     }else
     if(e.target.matches(".importXlsx")){


       dbXlsx.forEach((item)=>{
         // console.log(item);
       let hora = item[3].slice(11, 17),
           arrF = item[3].slice(1,-6).split("/"),
            concatF ="";
            item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
        });

        
             // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
         dbXlsx.forEach(async (element) => {
            //  console.log(element[1]);

     if (element[1].match("24") || element[1].match("HS")) {
         //console.log(element[1]);
        
         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "FORD HERMOSILLO",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "A TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           },
         });
             

     } else 
     if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
       
         //console.log(element[1]);

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "FORD CUAUTITLAN",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "A TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           }
         });
             
     }  else 
     if (element[1].match("GMMEX")) {
       
         //console.log(element[1]);

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "GM",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "A TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           }
         });
             
     } else 
     if (element[2].match("MEX3")) {
       
         //console.log(element[1]);

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "AMAZON",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "A TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           }
         });
             
     }  else 
     if (element[1].match("BRP")) {
       
         //console.log(element[1]);

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "BRP",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "A TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           }
         });
             
     } 


       setTimeout(() => {
         location.reload();
       }, 3000);
 
          });
          
      }else
      //GENERAR REPORTE XLS 
      if (e.target.matches(".modal_xls")){
       if(localStorage.tabViajes === "true"){
         clearInterval(updateData);

      d.querySelector(".export-modal-body").innerHTML = `
        <section id="thtable" class="thtable">
        <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
        </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">CAJA</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">C.PORTE</th>
        <th scope="col">TRACKING</th>
        <th scope="col">BOL / SHIPPER</th>
        <th scope="col">RUTA</th>
        <th scope="col">CLIENTE</th>
        <th scope="col">PROVEEDOR</th>
        <th scope="col">CITA PROGRAMADA</th>
        <th scope="col">LLEGADA REAL</th>
        <th scope="col">SALIDA REAL</th>
        <th scope="col">ETA</th>
        <th scope="col">LLEGADA A DESTINO</th>
        <th scope="col">SALIDA A DESTINO</th>
        <th scope="col">LLEGADA</th>
        <th scope="col">ESTATUS</th>
        <th scope="col">COMENTARIOS</th>  
        </tr>
        </thead>
        <tbody id="table_bodyX" class="body_table">
        </tbody>     
        </table>
        </section>
        `;

         //Helper de acceso a los items
           const $tr = d.querySelectorAll(".item");
           const lisTr = Array.from($tr);
       
           lisTr.forEach((e) => {
            if(e.classList[5] === "filter"){
             return
            }
            d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
           });
   
           d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
       } else {
         location.reload();
       }
       
      
      }else
      if (e.target.matches(".cancelXls") || e.target.matches(".report")){
       location.reload();
     }else
      if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
       // console.log(e.target);

        let isConfirm = confirm("¿Eliminar Registro?");

        if (isConfirm) {
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
            options: {
              method: "DELETE",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
            },
            cbSuccess: (res) => {
              //console.log(res);
             
            },
          });
          location.reload();
        }
      }else
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
       clearInterval(updateData);
       const tabConv = (item) => {

        d.getElementById("formulario").classList.add("edit");
        d.getElementById("formulario").classList.remove("register");
        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
        d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid font"> 
        <table class="table table-sm " >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th id="cajas" scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
        <th scope="col">VERIFICACION</th>
        <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap" >
    <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
    <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
    <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
    <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
    <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
    <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
    <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
    <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
    <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
        <option value="${item.circuito}">${item.circuito}</option> 
        <option value="FORDC - HILEX">FORDC - HILEX</option>  
        <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
        <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
        <option value="FORDC - MUBEA">FORDC - MUBEA</option>
        <option value="FORDC - BROSE">FORDC - BROSE</option>
        <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
        <option value="FORDC - STANDAR">FORDC - STANDAR</option>
        <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
        <option value="FORDC - DHL">FORDC - DHL</option>
        <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
        <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
        <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
        <option value="FORDH - BROSE">FORDH - BROSE MX</option>
        <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
        <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
        <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
        <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
        <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
        <option value="AMAZON">AMAZON</option>
        <option value="BRP">BRP</option>
        <option value="GM">GM</option>
        <option value="ACTIVE ON D">ACTIVE ON D</option>
        <option value="FCA - NARMEX">FCA - NARMEX</option>
        <option value="FCA - TI GROUP">FCA - TI GROUP</option>
        <option value="FCA - WEBASTO">FCA - WEBASTO</option>
        <option value="FCA - TENNECO">FCA - TENNECO</option>
        </select>
    </td>
    <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
        <option value="${item.ubicacion}">${item.ubicacion}</option> 
        <option value="BP NORTE">BP NORTE</option>  
        <option value="BP SUR">BP SUR</option>
        <option value="BP CLOSURES">BP CLOSURES</option>
        <option value="BP TRIM">BP TRIM</option>
        <option value="BP CLC">BP CLC</option>
        <option value="FRAMING">FRAMING</option>
        <option value="PATIO RAMOS">PATIO RAMOS</option>
        <option value="PATIO MX">PATIO MX</option>
        <option value="PPATIO HMO">PATIO HMO</option>
        <option value="PATIO PEDRO E">PATIO PEDRO E</option>
        <option value="PATIO SILAO">PATIO SILAO</option>
        <option value="EN TRANSITO">EN TRANSITO</option>
        </select>
    </td>
    <td>      
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
      <option value="${item.comentarios}">${item.comentarios}</option> 
      <option value="CARGADA MP">CARGADA MP</option>  
      <option value="PARCIAL">PARCIAL</option>
      <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
      <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
      <option value="VACIA">VACIA</option>
      <option value="DAÑADA">DAÑADA</option>
      <option value="MANTENIMIENTO">MANTENIMIENTO</option>
      <option value="DISPONIBLE">DISPONIBLE</option>
      </select>
    </td>  
    </tbody>
    
  </table>
  </div>
        `;
      }

      const tabUnit = (item) => {

        d.getElementById("formulario").classList.add("edit");
        d.getElementById("formulario").classList.remove("register");
        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
        d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid font"> 
        <table class="table table-sm" >
    <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
  <th scope="col">OPERADOR</th>
  <th scope="col">MODELO</th>
  <th scope="col">PLACA</th>
  <th scope="col">AÑO</th>
   <th scope="col">VERIFICACION</th>
   <th scope="col">NO. POLIZA</th>
  <th scope="col">INCISO</th>
  <th scope="col">KILOMETRAJE</th>
  <th scope="col">CIRCUITO</th>
  <th scope="col">FECHA</th>
  <th scope="col">UBICACION</th> 
  <th scope="col">ESTATUS</th>

      </tr>
    </thead>
    <tbody class="text-center text-wrap" >
    <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
    <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
    <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
    <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
    <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
    <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
    <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
    <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
    <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
    <option value="${item.circuito}">${item.circuito}</option> 
    <option value="FORDC - HILEX">FORDC - HILEX</option>  
    <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
    <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
    <option value="FORDC - MUBEA">FORDC - MUBEA</option>
    <option value="FORDC - BROSE">FORDC - BROSE</option>
    <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
    <option value="FORDC - STANDAR">FORDC - STANDAR</option>
    <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
    <option value="FORDC - DHL">FORDC - DHL</option>
    <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
    <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
    <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
    <option value="FORDH - BROSE">FORDH - BROSE MX</option>
    <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
    <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
    <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
    <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
    <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
    <option value="AMAZON">AMAZON</option>
    <option value="BRP">BRP</option>
    <option value="GM">GM</option>
    <option value="ACTIVE ON D">ACTIVE ON D</option>
    <option value="FCA - NARMEX">FCA - NARMEX</option>
    <option value="FCA - TI GROUP">FCA - TI GROUP</option>
    <option value="FCA - WEBASTO">FCA - WEBASTO</option>
    <option value="FCA - TENNECO">FCA - TENNECO</option>
    </select>
    </td>
    <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
        <option value="${item.ubicacion}">${item.ubicacion}</option> 
        <option value="BP NORTE">BP NORTE</option>  
        <option value="BP SUR">BP SUR</option>
        <option value="BP CLOSURES">BP CLOSURES</option>
        <option value="BP TRIM">BP TRIM</option>
        <option value="BP CLC">BP CLC</option>
        <option value="FRAMING">FRAMING</option>
        <option value="PATIO RAMOS">PATIO RAMOS</option>
        <option value="PATIO MX">PATIO MX</option>
        <option value="PATIO HMO">PATIO HMO</option>
        <option value="PATIO PEDRO E">PATIO PEDRO E</option>
        <option value="PATIO SILAO">PATIO SILAO</option>
        <option value="EN TRANSITO">EN TRANSITO</option>
        </select>
    </td>
    <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
    </tbody>
    
  </table>
  </div>
        `;
      }


       //  console.log();
       if(localStorage.tabViajes === "true"){
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       await ajax({
          url: `${api.ITEMS}/${e.target.id}.json`,
          method: "GET",
          cbSuccess: (item) => {
            // console.log(item);
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("/"),
               concatF ="";
               
               return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
            };

            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font" style="padding: 0;"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>
            
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap">
          <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
          <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
          <option value="${item.operador}">${item.operador}</option> 
          <option value="ASIGNAR">ASIGNAR</option>
          <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
          <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
          <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
          <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
          <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
          <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
          <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
          <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
          <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
          <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
          <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
          <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
          <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
          <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
          <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
          <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
          <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
          <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
          <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
          <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
          <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
          <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
          <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
          <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
          <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
          <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
          <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
          <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
          <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
          <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
          <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
          <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
          <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
          <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
          <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
          <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
          <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
          <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
          <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
          <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
          <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
          <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
          <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
          <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
          <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
          <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
          <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
          <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
          <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
          <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
          <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
          <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
          <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
          <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
          <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
          <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
          <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
          <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
          <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
          </select>
          </td>
          <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
          <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
          <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
          <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" ${user === "Traffic" || user === "TrafficH" ? "disabled" : ""} required></td>
          <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
          <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
          <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
          <option value="${item.llegada}">${item.llegada}</option> 
          <option value="A TIEMPO">A TIEMPO</option>  
          <option value="TARDE">TARDE</option>
          <option value="DESFASADA">DESFASADA</option>
          <option value="CRITICA">CRITICA</option>
          </select>
          </td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
          <option value="${item.status}">${item.status}</option> 
          <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
          <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
          <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
          <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
          <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
          <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
          <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
          <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
          <option value="TRANSITO A GM">TRANSITO A GM</option>
          <option value="TRANSITO A BRP">TRANSITO A BRP</option>
          <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
          <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
          <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
          <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
          <option value="DETENIDO">DETENIDO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CARGANDO">CARGANDO</option>
          <option value="DESCARGANDO">DESCARGANDO</option>
          <option value="EN ESPERA">EN ESPERA</option>
          <option value="DRY RUN">DRY RUN</option>
          <option value="BROKEREADO">BROKEREADO</option>
          <option value="TONU">TONU</option>
          <option value="CANCELADO">CANCELADO</option>
          <option value="COMPLETO">COMPLETO</option>
          </td>
          <td>
          <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
          },
        });
       }
        if(localStorage.tabConveyance === "true"){
         d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
           url: `${api.SUBITEMS1}/${e.target.id}.json`,
           method: "GET",
           cbSuccess: (item) => {
             // console.log(item);
             tabConv(item);
           },
         });
        }
        if(localStorage.tabUnit === "true"){
         d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       
         await ajax({
           url: `${api.SUBITEMS}/${e.target.id}.json`,
           method: "GET",
           cbSuccess: (item) => {
             // console.log(item);
             tabUnit(item);
           },
         });

        }

      }else
      if (e.target.matches(".remolque")) {
        //  console.log(e.target);
  
        const tabConv = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
        d.getElementById("exampleModalLabel").classList.add("convoy");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="caja" style="width: 35px;" type="text"></td>
      <td><input name="tipo" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };      
  
        tabConv();
        
      }else
      if (e.target.matches(".unidad")) {
        const tabUnit = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
        d.getElementById("exampleModalLabel").classList.add("unit");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="unidad" style="width: 35px;" type="text"></td>
      <td><input name="operador" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };
  
        tabUnit();
      } else
      if (e.target.matches(".tablero")) {
       clearInterval(updateData);
       window.location.hash = "/"+ user+"/productivo";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;


       await ajax({
         url: `${api.ITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
           //console.log(itemsArray)   
           renderTable(newArray);
         },
       });

       d.getElementById("tablero").style.color = "#ffffffe8";
       d.getElementById("tablero").style.backgroundColor = "#10438e";
       d.getElementById("tablero").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";


       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
     }else
     if (e.target.matches(".equipov")) {
       clearInterval(updateData);
       window.location.hash = "/"+ user +"/equipov";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;


       await ajax({
         url: `${api.ITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
           //console.log(itemsArray)   
           renderTableEV(newArray);
         },
       });

       d.getElementById("equipov").style.color = "#ffffffe8";
       d.getElementById("equipov").style.backgroundColor = "#10438e";
       d.getElementById("equipov").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
     }else
     if (e.target.matches(".history")) {
       clearInterval(updateData);
       window.location.hash = "/"+user+"/history";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;


       await ajax({
         url: `${api.ITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
           //console.log(itemsArray)   
           renderTableHistory(newArray);
         },
       });

       d.getElementById("history").style.color = "#ffffffe8";
       d.getElementById("history").style.backgroundColor = "#10438e";
       d.getElementById("history").style.borderColor = "#094fb5";

       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
     }else
     if (e.target.matches(".cajas")) {
       clearInterval(updateData);
       window.location.hash = "/"+user+"/cajas";
       localStorage.tabConveyance = true;
       localStorage.tabViajes = false;
     localStorage.tabUnit = false;


       await ajax({
         url: `${api.SUBITEMS1}.json`,
         cbSuccess: (items) => {   
           newArray = items;
         //  console.log(newArray)   
          renderTableCV(newArray);
         },
       });

       d.getElementById("cajas").style.color = "#ffffffe8";
       d.getElementById("cajas").style.backgroundColor = "#10438e";
       d.getElementById("cajas").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";

       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
       
     }else
     if (e.target.matches(".unidades")) {
       clearInterval(updateData);
       window.location.hash = "/"+user+"/unidades";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = false;
       localStorage.tabUnit = true;


       await ajax({
         url: `${api.SUBITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
     //      console.log(newArray);   
           renderTableUnits(newArray);
         },
       });

       d.getElementById("unidades").style.color = "#ffffffe8";
       d.getElementById("unidades").style.backgroundColor = "#10438e";
       d.getElementById("unidades").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";

       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";
       
     }  else
     if (e.target.matches(".reg")) {
       clearInterval(updateData);
       //  console.log(e.target);
       //MODAL REGISTRO DE VIAJES
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("formulario").classList.add("register");
       d.getElementById("formulario").classList.remove("edit");
       d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
       d.querySelector(".modal-body").innerHTML = `
           <div class="container-fluid font"> 
           <table class="table table-sm" >
       <thead class="table-dark text-center">
         <tr class="text-wrap">
         <th scope="col">UNIDAD</th>
         <th scope="col">CAJA</th>
         <th scope="col">OPERADOR</th>
         <th scope="col">C.PORTE</th>
         <th scope="col">TRACKING</th>
         <th scope="col">BOL / SHIPPER</th>
         <th scope="col">RUTA</th>
         <th scope="col">CLIENTE</th>
         <th scope="col">PROVEEDOR</th>
         <th scope="col">CITA PROGRAMADA</th>
         <th scope="col">LLEGADA REAL</th>
         <th scope="col">SALIDA REAL</th>
         <th scope="col">ETA A DESTINO</th>
         <th scope="col">LLEGADA A DESTINO</th>
         <th scope="col">SALIDA A DESTINO</th>
         <th scope="col">LLEGADA</th>
         <th scope="col">ESTATUS</th>
         <th scope="col">COMENTARIOS</th>
         
     
         </tr>
       </thead>
       <tbody class="text-center text-wrap" >
       <td><input name="unidad" style="width: 35px;" type="text"></input></td>
       <td><input name="caja" style="width: 60px;" type="text"></input></td>
       <td><input name="operador" style="width: 130px;" type="text"></input></td>
       <td><input name="cporte" style="width: 70px;" type="text"></input></td>
       <td><input name="tracking" style="width: 80px;" type="text"></input></td>
       <td><input name="bol" style="width: 75px;" type="text"></input></td>
       <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
       <td>
       <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="cliente" id="cliente">
         <option value="FORD CUAUTITLAN">FORD CUAUTITLAN</option>
         <option value="FORD HERMOSILLO">FORD HERMOSILLO</option>
         <option value="MULTILOG">MULTILOG</option>
         <option value="GM">GM</option>
         <option value="STELLANTIS">STELLANTIS</option>
         <option value="ACTIVE">ACTIVE</option>
         <option value="BRP">BRP</option>
         <option value="AMAZON">AMAZON</option>
       </td>
       <td><input id="proveedor" name="proveedor" type="text" style="width: 80px;"></input></td>
       <td><input id="citaprogramada" name="citaprogramada" type="datetime-local" ></td>
       <td><input id="llegadareal" name="llegadareal" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td><input id="salidareal" name="salidareal" style="width: 90px;" type="text" value="01/01/0001 00:00"disabled></td>
       <td><input id="eta" name="eta" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td><input id="llegadadestino" name="llegadadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td><input id="salidadestino" name="salidadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td>
       <select class="form-select form-select-sm" name="llegada" id="arribo" style="width: 100px; height: 24px; font-size: 12px;">
        <option value="A TIEMPO" selected>A TIEMPO</option>
       <option value="TARDE" >TARDE</option>
       <option value="DESFASADA" >DESFASADA</option>
       <option value="CRITICA" >CRITICA</option>
       </select>
       </td>
       <td>
       <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="status" id="status">
         <option value="PENDIENTE">PENDIENTE</option>
         <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
         <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
         <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
         <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
         <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
         <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
         <option value="DETENIDO">DETENIDO</option>
         <option value="CARGANDO">CARGANDO</option>
         <option value="EN ESPERA">EN ESPERA</option>
         <option value="DRY RUN">DRY RUN</option>
         <option value="TONU">TONU</option>
         <option value="CANCELADO">CANCELADO</option>
         <option value="COMPLETO">COMPLETO</option>
       </td>
       <td>
       <input name="comentarios" style="width: 130px;" type="text"  value="SIN COMENTARIOS">
       </td>    
       </tbody>
       
     </table>
     </div>
           `;
     }else
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
            location.reload();
 
      }
      return;
    });
 
     d.addEventListener("submit", async (e) => {
       e.preventDefault();
       clearInterval(updateData);
    // console.log(e.target);
     
    if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
      //console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();

     //console.log(query);

      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
        //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } else if (
          e.dataset.unit.includes(query) ||
            e.dataset.box.includes(query) ||
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.proveedor.includes(query) ||
            e.dataset.citaprogramada.includes(query) ||
            e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
                      });
      }
      else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
       //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

       //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
      } 
      else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
   // console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

    //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
    //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } 
      else if (e.dataset.unit.includes(query) ||
      e.dataset.circuito.includes(query) ||
      e.dataset.ubicacion.includes(query)
      ) {
        e.classList.remove("filter");
      } 
      else {
        e.classList.add("filter");
      }
                    });
      }  
       
      else if (e.target.matches(".register")) {
         //Create Register
        

         if (!e.target.id.value) {

          
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("-"),
             concatF ="";
             
             return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
          };

          let fecha = dateConvert(e.target.citaprogramada.value);

           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: e.target.unidad.value.toUpperCase(),
               caja: e.target.caja.value.toUpperCase(),
               cporte: e.target.cporte.value.toUpperCase(),
               tracking: e.target.tracking.value.toUpperCase(),
               bol: e.target.bol.value.toUpperCase(),
               ruta: e.target.ruta.value.toUpperCase(),
               operador: e.target.operador.value.toUpperCase(),
               cliente: e.target.cliente.value.toUpperCase(),
               proveedor: e.target.proveedor.value.toUpperCase(),
               citaprogramada: fecha,
               llegadareal: e.target.llegadareal.value,
               salidareal: e.target.salidareal.value,
               eta: e.target.eta.value,
               llegadadestino: e.target.llegadadestino.value,
               salidadestino: e.target.salidadestino.value,
               llegada: e.target.llegada.value.toUpperCase(),
               status: e.target.status.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
             }),
           };
         await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
           });
           location.reload();
         }
         // console.log(e.target);
      } 
       
      else if (e.target.matches(".edit")) {

        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
        }    
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
          
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
    
    
        } 
        else if(localStorage.tabViajes === "true") {
          if (!e.target.id.value) {
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("-"),
               concatF ="";
               
               return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
            };

            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                unidad: e.target.unidad.value.toUpperCase(),
                caja: e.target.caja.value.toUpperCase(),
                cporte: e.target.cporte.value.toUpperCase(),
                tracking: e.target.tracking.value.toUpperCase(),
                bol: e.target.bol.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                operador: e.target.operador.value.toUpperCase(),
                cliente: e.target.cliente.value.toUpperCase(),
                proveedor: e.target.proveedor.value.toUpperCase(),
               llegadaprogramada: e.target.llegadaprogramada.value,
               llegadareal: dateConvert(e.target.llegadareal.value),
               salidareal: dateConvert(e.target.salidareal.value),
               eta: dateConvert(e.target.eta.value),
               llegadadestino: dateConvert(e.target.llegadadestino.value),
               salidadestino: dateConvert(e.target.salidadestino.value),
               llegada: e.target.llegada.value.toUpperCase(),
               status: e.target.status.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
               url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
             //   console.log(res);
              },
            });
            location.reload();
          }
        }
          }

      else if (e.target.matches(".update")) {
          //console.log(e.target);

        //UPDATE
         //console.log(e.target.textarea[0].value.toUpperCase());
         //console.log(e.target.textarea[1].value.toUpperCase());

         let keyUnit = d.getElementById("controlV").dataset.unit;
         let keyConv = d.getElementById("controlV").dataset.conveyance;

        // console.log(keyUnit);

         
         if (!e.target.id.value) {
         
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              comentarios: e.target.textarea.value.toUpperCase()
            }),
          };

            await ajax({
               url: `${api.SUBITEMS}/${keyUnit}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });

           options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };

            await ajax({
               url: `${api.SUBITEMS1}/${keyConv}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });

             location.reload();
        }
        

      }

          
     });
 
     d.addEventListener("keyup", (e) => {
       //  console.log(d.getElementById("ruta"));
       //limpiar busqueda
       let query = localStorage.getItem("apiSearch");
       if (e.key === "Escape") localStorage.removeItem("apiSearch");
       let item = d.querySelectorAll(".item");
       item.forEach((e) => {
         if (!query) {
           e.classList.remove("filter");
           return false;
         }
       });
     });
   }else
   if (hash === "#/" + user + "/equipov") {
    tabActive("equipov");
    localStorage.tabConveyance = false;
    localStorage.tabViajes = true;
     localStorage.tabUnit = false;


    await ajax({
      url: `${api.ITEMS}.json`,
      cbSuccess: (items) => {   
        newArray = items;
        //console.log(itemsArray)   
        renderTableEV(newArray);
      },
    });

    const updateData = setInterval(  () => {
      
      ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {
          
            //console.log(Object.values(items));
              listenItemsArray = Object.values(items);
              let firstArray = Object.values(newArray);
               // console.log(Object.entries(itemsArray).length);

               if(listenItemsArray.length === firstArray.length){

                
                  for (let i = 0; i < firstArray.length; i++) {
                    let e = firstArray[i];
                     let e2 = listenItemsArray[i];
              
                   if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                    || e.unidad != e2.unidad || e.bol != e2.bol 
                    || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                    || e.cliente != e2.cliente || e.cporte != e2.cporte
                    || e.tracking != e2.tracking || e.llegada != e2.llegada
                    || e.status != e2.status || e.llegadareal != e2.llegadareal
                    || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                    || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                    ) {
                    //  console.log("UPDATE")
                    renderTableEV(items);
                     }
     
                   }
                 } 
                 else {
                 // console.log("UPDATE");
                 renderTableEV(items);

                  
                 }


             
             //console.log(listenItemsArray);
           }       
        })

    }, 10000);
       
    updateData;

    
    
    d.getElementById('excelFileInput').addEventListener('change', e => {
   
      if(e.target.matches("#excelFileInput")){
      //  console.log(e.target); 
           handleFile(e);            
      }
       
   });

   d.addEventListener("click", async (e) => {    
    //console.log(e.target);
   //LEER CSV / XLS
   let date = new Date;
   if (e.target.matches(".importModal")) {
     clearInterval(updateData);
   }else
   if(e.target.matches(".importXlsx")){


     dbXlsx.forEach((item)=>{
       // console.log(item);
     let hora = item[3].slice(11, 17),
         arrF = item[3].slice(1,-6).split("/"),
          concatF ="";
          item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
      });

      
           // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
       dbXlsx.forEach(async (element) => {
          //  console.log(element[1]);

   if (element[1].match("24") || element[1].match("HS")) {
       //console.log(element[1]);
      
       let options = {
         method: "POST",
         headers: {
           "Content-type": "application/json; charset=utf-8",
         },
         body: JSON.stringify({
           unidad: "",
           caja: "",
           cporte: "",
           tracking: `${element[0]}`,
           bol: "",
           ruta: `${element[1]}`,
           operador: "",
           cliente: "FORD HERMOSILLO",
           proveedor: `${element[2]}`,
           citaprogramada: `${element[3]}`,
           llegadareal: "01/01/0001 00:00",
           salidareal: "01/01/0001 00:00",
           eta: "01/01/0001 00:00",
           llegadadestino: "01/01/0001 00:00",
           salidadestino: "01/01/0001 00:00",
           llegada: "EN TIEMPO",
           status: "PENDIENTE",
           comentarios: "SIN COMENTARIOS"
         }),
       };
       await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         },
       });
           

   } else 
   if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
     
       //console.log(element[1]);

       let options = {
         method: "POST",
         headers: {
           "Content-type": "application/json; charset=utf-8",
         },
         body: JSON.stringify({
           unidad: "",
           caja: "",
           cporte: "",
           tracking: `${element[0]}`,
           bol: "",
           ruta: `${element[1]}`,
           operador: "",
           cliente: "FORD CUAUTITLAN",
           proveedor: `${element[2]}`,
           citaprogramada: `${element[3]}`,
           llegadareal: "01/01/0001 00:00",
           salidareal: "01/01/0001 00:00",
           eta: "01/01/0001 00:00",
           llegadadestino: "01/01/0001 00:00",
           salidadestino: "01/01/0001 00:00",
           llegada: "EN TIEMPO",
           status: "PENDIENTE",
           comentarios: "SIN COMENTARIOS"
         }),
       };
       await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         }
       });
           
   }
     setTimeout(() => {
       location.reload();
     }, 3000);

        });
        
    }else
    //GENERAR REPORTE XLS 
    if (e.target.matches(".modal_xls")){
     if(localStorage.tabViajes === "true"){
       clearInterval(updateData);

    d.querySelector(".export-modal-body").innerHTML = `
      <section id="thtable" class="thtable">
      <table class="table table-hover table-sm" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr style="background-color:black; color:white;">
      <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
      <th scope="col">UNIDAD</th>
      <th scope="col">CAJA</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">C.PORTE</th>
      <th scope="col">TRACKING</th>
      <th scope="col">BOL / SHIPPER</th>
      <th scope="col">RUTA</th>
      <th scope="col">CLIENTE</th>
      <th scope="col">PROVEEDOR</th>
      <th scope="col">CITA PROGRAMADA</th>
      <th scope="col">LLEGADA REAL</th>
      <th scope="col">SALIDA REAL</th>
      <th scope="col">ETA</th>
      <th scope="col">LLEGADA A DESTINO</th>
      <th scope="col">SALIDA A DESTINO</th>
      <th scope="col">LLEGADA</th>
      <th scope="col">ESTATUS</th>
      <th scope="col">COMENTARIOS</th>  
      </tr>
      </thead>
      <tbody id="table_bodyX" class="body_table">
      </tbody>     
      </table>
      </section>
      `;

       //Helper de acceso a los items
         const $tr = d.querySelectorAll(".item");
         const lisTr = Array.from($tr);
     
         lisTr.forEach((e) => {
          if(e.classList[5] === "filter"){
           return
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
         });
 
         d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
     } else {
       location.reload();
     }
     
    
    }else
    if (e.target.matches(".cancelXls") || e.target.matches(".report")){
     location.reload();
   }else
    if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
     // console.log(e.target);

      let isConfirm = confirm("¿Eliminar Registro?");

      if (isConfirm) {
       await ajax({
          url: `${api.ITEMS}/${e.target.id}.json`,
          options: {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          cbSuccess: (res) => {
            //console.log(res);
           
          },
        });
        location.reload();
      }
    }else
    if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
     clearInterval(updateData);
     const tabConv = (item) => {

      d.getElementById("formulario").classList.add("edit");
      d.getElementById("formulario").classList.remove("register");
      d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      d.querySelector(".modal-body").innerHTML = `
      <div class="container-fluid font"> 
      <table class="table table-sm " >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th id="cajas" scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
      <th scope="col">VERIFICACION</th>
      <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>

    </tr>
  </thead>
  <tbody class="text-center text-wrap" >
  <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
  <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
  <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
  <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
  <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
  <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
  <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
  <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
  <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option> 
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
  </td>
  <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
      <option value="${item.ubicacion}">${item.ubicacion}</option> 
      <option value="BP NORTE">BP NORTE</option>  
      <option value="BP SUR">BP SUR</option>
      <option value="BP CLOSURES">BP CLOSURES</option>
      <option value="BP TRIM">BP TRIM</option>
      <option value="BP CLC">BP CLC</option>
      <option value="FRAMING">FRAMING</option>
      <option value="PATIO RAMOS">PATIO RAMOS</option>
      <option value="PATIO MX">PATIO MX</option>
      <option value="PPATIO HMO">PATIO HMO</option>
      <option value="PATIO PEDRO E">PATIO PEDRO E</option>
      <option value="PATIO SILAO">PATIO SILAO</option>
      <option value="EN TRANSITO">EN TRANSITO</option>
      </select>
  </td>
  <td>      
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
    <option value="${item.comentarios}">${item.comentarios}</option> 
    <option value="CARGADA MP">CARGADA MP</option>  
    <option value="PARCIAL">PARCIAL</option>
    <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
    <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
    <option value="VACIA">VACIA</option>
    <option value="DAÑADA">DAÑADA</option>
    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
    <option value="DISPONIBLE">DISPONIBLE</option>
    </select>
  </td>  
  </tbody>
  
</table>
</div>
      `;
    }

    const tabUnit = (item) => {

      d.getElementById("formulario").classList.add("edit");
      d.getElementById("formulario").classList.remove("register");
      d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      d.querySelector(".modal-body").innerHTML = `
      <div class="container-fluid font"> 
      <table class="table table-sm" >
  <thead class="table-dark text-center">
    <tr class="text-wrap">
    <th scope="col">UNIDAD</th>
<th scope="col">OPERADOR</th>
<th scope="col">MODELO</th>
<th scope="col">PLACA</th>
<th scope="col">AÑO</th>
 <th scope="col">VERIFICACION</th>
 <th scope="col">NO. POLIZA</th>
<th scope="col">INCISO</th>
<th scope="col">KILOMETRAJE</th>
<th scope="col">CIRCUITO</th>
<th scope="col">FECHA</th>
<th scope="col">UBICACION</th> 
<th scope="col">ESTATUS</th>

    </tr>
  </thead>
  <tbody class="text-center text-wrap" >
  <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
  <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
  <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
  <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
  <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
  <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
  <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
  <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
  <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
  <option value="${item.circuito}">${item.circuito}</option> 
  <option value="FORDC - HILEX">FORDC - HILEX</option>  
  <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
  <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
  <option value="FORDC - MUBEA">FORDC - MUBEA</option>
  <option value="FORDC - BROSE">FORDC - BROSE</option>
  <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
  <option value="FORDC - STANDAR">FORDC - STANDAR</option>
  <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
  <option value="FORDC - DHL">FORDC - DHL</option>
  <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
  <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
  <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
  <option value="FORDH - BROSE">FORDH - BROSE MX</option>
  <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
  <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
  <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
  <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
  <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
  <option value="AMAZON">AMAZON</option>
  <option value="BRP">BRP</option>
  <option value="GM">GM</option>
  <option value="ACTIVE ON D">ACTIVE ON D</option>
  <option value="FCA - NARMEX">FCA - NARMEX</option>
  <option value="FCA - TI GROUP">FCA - TI GROUP</option>
  <option value="FCA - WEBASTO">FCA - WEBASTO</option>
  <option value="FCA - TENNECO">FCA - TENNECO</option>
  </select>
  </td>
  <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
      <option value="${item.ubicacion}">${item.ubicacion}</option> 
      <option value="BP NORTE">BP NORTE</option>  
      <option value="BP SUR">BP SUR</option>
      <option value="BP CLOSURES">BP CLOSURES</option>
      <option value="BP TRIM">BP TRIM</option>
      <option value="BP CLC">BP CLC</option>
      <option value="FRAMING">FRAMING</option>
      <option value="PATIO RAMOS">PATIO RAMOS</option>
      <option value="PATIO MX">PATIO MX</option>
      <option value="PATIO HMO">PATIO HMO</option>
      <option value="PATIO PEDRO E">PATIO PEDRO E</option>
      <option value="PATIO SILAO">PATIO SILAO</option>
      <option value="EN TRANSITO">EN TRANSITO</option>
      </select>
  </td>
  <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
  </tbody>
  
</table>
</div>
      `;
    }


     //  console.log();
     if(localStorage.tabViajes === "true"){
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     await ajax({
        url: `${api.ITEMS}/${e.target.id}.json`,
        method: "GET",
        cbSuccess: (item) => {
          // console.log(item);
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("/"),
             concatF ="";
             
             return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
          };

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font" style="padding: 0;"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>
            
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap">
          <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
          <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
          <option value="${item.operador}">${item.operador}</option> 
          <option value="ASIGNAR">ASIGNAR</option>
          <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
          <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
          <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
          <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
          <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
          <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
          <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
          <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
          <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
          <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
          <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
          <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
          <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
          <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
          <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
          <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
          <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
          <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
          <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
          <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
          <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
          <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
          <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
          <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
          <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
          <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
          <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
          <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
          <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
          <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
          <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
          <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
          <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
          <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
          <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
          <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
          <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
          <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
          <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
          <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
          <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
          <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
          <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
          <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
          <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
          <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
          <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
          <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
          <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
          <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
          <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
          <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
          <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
          <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
          <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
          <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
          <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
          <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
          <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
          </select>
          </td>
          <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
          <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
          <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
          <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" ${user === "Traffic" || user === "TrafficH" ? "disabled" : ""} required></td>
          <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
          <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
          <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
          <option value="${item.llegada}">${item.llegada}</option> 
          <option value="A TIEMPO">A TIEMPO</option>  
          <option value="TARDE">TARDE</option>
          <option value="DESFASADA">DESFASADA</option>
          <option value="CRITICA">CRITICA</option>
          </select>
          </td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
          <option value="${item.status}">${item.status}</option> 
          <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
          <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
          <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
          <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
          <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
          <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
          <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
          <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
          <option value="TRANSITO A GM">TRANSITO A GM</option>
          <option value="TRANSITO A BRP">TRANSITO A BRP</option>
          <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
          <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
          <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
          <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
          <option value="DETENIDO">DETENIDO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CARGANDO">CARGANDO</option>
          <option value="DESCARGANDO">DESCARGANDO</option>
          <option value="EN ESPERA">EN ESPERA</option>
          <option value="DRY RUN">DRY RUN</option>
          <option value="BROKEREADO">BROKEREADO</option>
          <option value="TONU">TONU</option>
          <option value="CANCELADO">CANCELADO</option>
          <option value="COMPLETO">COMPLETO</option>
          </td>
          <td>
          <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
        },
      });
     }
      if(localStorage.tabConveyance === "true"){
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       await ajax({
         url: `${api.SUBITEMS1}/${e.target.id}.json`,
         method: "GET",
         cbSuccess: (item) => {
           // console.log(item);
           tabConv(item);
         },
       });
      }
      if(localStorage.tabUnit === "true"){
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     
       await ajax({
         url: `${api.SUBITEMS}/${e.target.id}.json`,
         method: "GET",
         cbSuccess: (item) => {
           // console.log(item);
           tabUnit(item);
         },
       });

      }

    }else
    if (e.target.matches(".remolque")) {
      //  console.log(e.target);

      const tabConv = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
      d.getElementById("exampleModalLabel").classList.add("convoy");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="caja" style="width: 35px;" type="text"></td>
    <td><input name="tipo" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };      

      tabConv();
      
    }else
    if (e.target.matches(".unidad")) {
      const tabUnit = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
      d.getElementById("exampleModalLabel").classList.add("unit");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">CONTACTO DEL SEGURO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="unidad" style="width: 35px;" type="text"></td>
    <td><input name="operador" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };

      tabUnit();
    } else
    if (e.target.matches(".tablero")) {
     clearInterval(updateData);
     window.location.hash = "/"+ user+"/productivo";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTable(newArray);
       },
     });

     d.getElementById("tablero").style.color = "#ffffffe8";
     d.getElementById("tablero").style.backgroundColor = "#10438e";
     d.getElementById("tablero").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";


     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".equipov")) {
     clearInterval(updateData);
     window.location.hash = "/"+ user +"/equipov";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTableEV(newArray);
       },
     });

     d.getElementById("equipov").style.color = "#ffffffe8";
     d.getElementById("equipov").style.backgroundColor = "#10438e";
     d.getElementById("equipov").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".history")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/history";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTableHistory(newArray);
       },
     });

     d.getElementById("history").style.color = "#ffffffe8";
     d.getElementById("history").style.backgroundColor = "#10438e";
     d.getElementById("history").style.borderColor = "#094fb5";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".cajas")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/cajas";
     localStorage.tabConveyance = true;
     localStorage.tabViajes = false;
   localStorage.tabUnit = false;


     await ajax({
       url: `${api.SUBITEMS1}.json`,
       cbSuccess: (items) => {   
         newArray = items;
       //  console.log(newArray)   
        renderTableCV(newArray);
       },
     });

     d.getElementById("cajas").style.color = "#ffffffe8";
     d.getElementById("cajas").style.backgroundColor = "#10438e";
     d.getElementById("cajas").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
     
   }else
   if (e.target.matches(".unidades")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/unidades";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = false;
     localStorage.tabUnit = true;


     await ajax({
       url: `${api.SUBITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
   //      console.log(newArray);   
         renderTableUnits(newArray);
       },
     });

     d.getElementById("unidades").style.color = "#ffffffe8";
     d.getElementById("unidades").style.backgroundColor = "#10438e";
     d.getElementById("unidades").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";
     
   }  else
   if (e.target.matches(".reg")) {
     clearInterval(updateData);
     //  console.log(e.target);
     //MODAL REGISTRO DE VIAJES
     d.querySelector(".hidden").style.display = "block";
     d.getElementById("formulario").classList.add("register");
     d.getElementById("formulario").classList.remove("edit");
     d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
     d.querySelector(".modal-body").innerHTML = `
         <div class="container-fluid font"> 
         <table class="table table-sm" >
     <thead class="table-dark text-center">
       <tr class="text-wrap">
       <th scope="col">UNIDAD</th>
       <th scope="col">CAJA</th>
       <th scope="col">OPERADOR</th>
       <th scope="col">C.PORTE</th>
       <th scope="col">TRACKING</th>
       <th scope="col">BOL / SHIPPER</th>
       <th scope="col">RUTA</th>
       <th scope="col">CLIENTE</th>
       <th scope="col">PROVEEDOR</th>
       <th scope="col">CITA PROGRAMADA</th>
       <th scope="col">LLEGADA REAL</th>
       <th scope="col">SALIDA REAL</th>
       <th scope="col">ETA A DESTINO</th>
       <th scope="col">LLEGADA A DESTINO</th>
       <th scope="col">SALIDA A DESTINO</th>
       <th scope="col">LLEGADA</th>
       <th scope="col">ESTATUS</th>
       <th scope="col">COMENTARIOS</th>
       
   
       </tr>
     </thead>
     <tbody class="text-center text-wrap" >
     <td><input name="unidad" style="width: 35px;" type="text"></input></td>
     <td><input name="caja" style="width: 60px;" type="text"></input></td>
     <td><input name="operador" style="width: 130px;" type="text"></input></td>
     <td><input name="cporte" style="width: 70px;" type="text"></input></td>
     <td><input name="tracking" style="width: 80px;" type="text"></input></td>
     <td><input name="bol" style="width: 75px;" type="text"></input></td>
     <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
     <td>
     <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="cliente" id="cliente">
       <option value="FORD CUAUTITLAN">FORD CUAUTITLAN</option>
       <option value="FORD HERMOSILLO">FORD HERMOSILLO</option>
       <option value="MULTILOG">MULTILOG</option>
       <option value="GM">GM</option>
       <option value="STELLANTIS">STELLANTIS</option>
       <option value="ACTIVE">ACTIVE</option>
       <option value="BRP">BRP</option>
       <option value="AMAZON">AMAZON</option>
     </td>
     <td><input id="proveedor" name="proveedor" type="text" style="width: 80px;"></input></td>
     <td><input id="citaprogramada" name="citaprogramada" type="datetime-local" ></td>
     <td><input id="llegadareal" name="llegadareal" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="salidareal" name="salidareal" style="width: 90px;" type="text" value="01/01/0001 00:00"disabled></td>
     <td><input id="eta" name="eta" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="llegadadestino" name="llegadadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="salidadestino" name="salidadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td>
     <select class="form-select form-select-sm" name="llegada" id="arribo" style="width: 100px; height: 24px; font-size: 12px;">
      <option value="A TIEMPO" selected>A TIEMPO</option>
     <option value="TARDE" >TARDE</option>
     <option value="DESFASADA" >DESFASADA</option>
     <option value="CRITICA" >CRITICA</option>
     </select>
     </td>
     <td>
     <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="status" id="status">
       <option value="PENDIENTE">PENDIENTE</option>
       <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
       <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
       <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
       <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
       <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
       <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
       <option value="DETENIDO">DETENIDO</option>
       <option value="CARGANDO">CARGANDO</option>
       <option value="EN ESPERA">EN ESPERA</option>
       <option value="DRY RUN">DRY RUN</option>
       <option value="TONU">TONU</option>
       <option value="CANCELADO">CANCELADO</option>
       <option value="COMPLETO">COMPLETO</option>
     </td>
     <td>
     <input name="comentarios" style="width: 130px;" type="text"  value="SIN COMENTARIOS">
     </td>    
     </tbody>
     
   </table>
   </div>
         `;
   }else
    if(e.target.matches(".generar_xls")){
      //let $dataTable = d.getElementById("table_xls");
          generar_xls('table_xls', 'Reporte');
          location.reload();

    }
    return;
  });

   d.addEventListener("submit", async (e) => {
     e.preventDefault();
     clearInterval(updateData);
  // console.log(e.target);
   
  if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
    //console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

   //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
      //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } else if (
        e.dataset.unit.includes(query) ||
          e.dataset.box.includes(query) ||
          e.dataset.operador.includes(query) ||
          e.dataset.track.includes(query) ||
          e.dataset.ruta.includes(query) ||
          e.dataset.cliente.includes(query) ||
          e.dataset.proveedor.includes(query) ||
          e.dataset.citaprogramada.includes(query) ||
          e.dataset.status.includes(query)
      ) {
        e.classList.remove("filter");
      } else {
        e.classList.add("filter");
      }
                    });
    }
    else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
     //   console.log(e.target);
   let query = localStorage.getItem("apiSearch").toUpperCase();

     //  console.log(query);

   let item = d.querySelectorAll(".item");
       item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
     if (!query) {
       e.classList.remove("filter");
       return false;
     } 
     else if (e.dataset.conv.includes(query) ||
     e.dataset.circuito.includes(query) ||
     e.dataset.ubicacion.includes(query)
     ) {
       e.classList.remove("filter");
     } 
     else {
       e.classList.add("filter");
     }
                   });
    } 
    else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
 // console.log(e.target);
  let query = localStorage.getItem("apiSearch").toUpperCase();

  //console.log(query);

  let item = d.querySelectorAll(".item");
      item.forEach((e) => {
  //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
    if (!query) {
      e.classList.remove("filter");
      return false;
    } 
    else if (e.dataset.unit.includes(query) ||
    e.dataset.circuito.includes(query) ||
    e.dataset.ubicacion.includes(query)
    ) {
      e.classList.remove("filter");
    } 
    else {
      e.classList.add("filter");
    }
                  });
    }  
     
    else if (e.target.matches(".register")) {
       //Create Register
      

       if (!e.target.id.value) {

        
        const dateConvert = (date) => {
          let hora = date.slice(11, 17),
          arrF = date.slice(0,10).split("-"),
           concatF ="";
           
           return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
        };

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: e.target.unidad.value.toUpperCase(),
             caja: e.target.caja.value.toUpperCase(),
             cporte: e.target.cporte.value.toUpperCase(),
             tracking: e.target.tracking.value.toUpperCase(),
             bol: e.target.bol.value.toUpperCase(),
             ruta: e.target.ruta.value.toUpperCase(),
             operador: e.target.operador.value.toUpperCase(),
             cliente: e.target.cliente.value.toUpperCase(),
             proveedor: e.target.proveedor.value.toUpperCase(),
             citaprogramada: dateConvert(e.target.citaprogramada.value),
             llegadareal: e.target.llegadareal.value,
             salidareal: e.target.salidareal.value,
             eta: e.target.eta.value,
             llegadadestino: e.target.llegadadestino.value,
             salidadestino: e.target.salidadestino.value,
             llegada: e.target.llegada.value.toUpperCase(),
             status: e.target.status.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
           }),
         };
       await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           },
         });
         location.reload();
       }
       // console.log(e.target);
    } 
     
    else if (e.target.matches(".edit")) {

      if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
        if (!e.target.id.value) {
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
            url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
            },
          });
          location.reload();
        }
      }    
      if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
        
        if (!e.target.id.value) {
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
            url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
            },
          });
          location.reload();
        }
  
  
      } 
      else if(localStorage.tabViajes === "true") {
        if (!e.target.id.value) {
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("-"),
             concatF ="";
             
             return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
          };

          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              unidad: e.target.unidad.value.toUpperCase(),
              caja: e.target.caja.value.toUpperCase(),
              cporte: e.target.cporte.value.toUpperCase(),
              tracking: e.target.tracking.value.toUpperCase(),
              bol: e.target.bol.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              operador: e.target.operador.value.toUpperCase(),
              cliente: e.target.cliente.value.toUpperCase(),
              proveedor: e.target.proveedor.value.toUpperCase(),
             llegadaprogramada: e.target.llegadaprogramada.value,
             llegadareal: dateConvert(e.target.llegadareal.value),
             salidareal: dateConvert(e.target.salidareal.value),
             eta: dateConvert(e.target.eta.value),
             llegadadestino: dateConvert(e.target.llegadadestino.value),
             salidadestino: dateConvert(e.target.salidadestino.value),
             llegada: e.target.llegada.value.toUpperCase(),
             status: e.target.status.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
             url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
           //   console.log(res);
            },
          });
          location.reload();
        }
      }
        }

    else if (e.target.matches(".update")) {
        //console.log(e.target);

      //UPDATE
       //console.log(e.target.textarea[0].value.toUpperCase());
       //console.log(e.target.textarea[1].value.toUpperCase());

       let keyUnit = d.getElementById("controlV").dataset.unit;
       let keyConv = d.getElementById("controlV").dataset.conveyance;

      // console.log(keyUnit);

       
       if (!e.target.id.value) {
       
        let options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            comentarios: e.target.textarea.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS}/${keyUnit}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

         options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
              circuito: e.target.circuito.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              ubicacion: e.target.ubicacion.value.toUpperCase(),
              comentarios: e.target.comentarios.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS1}/${keyConv}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

           location.reload();
      }
      

    }

        
   });

   d.addEventListener("keyup", (e) => {
     //  console.log(d.getElementById("ruta"));
     //limpiar busqueda
     let query = localStorage.getItem("apiSearch");
     if (e.key === "Escape") localStorage.removeItem("apiSearch");
     let item = d.querySelectorAll(".item");
     item.forEach((e) => {
       if (!query) {
         e.classList.remove("filter");
         return false;
       }
     });
   });
   } else
   if (hash === "#/" + user + "/history") {
    tabActive("history");
    localStorage.tabConveyance = false;
    localStorage.tabViajes = true;
     localStorage.tabUnit = false;


    await ajax({
      url: `${api.ITEMS}.json`,
      cbSuccess: (items) => {   
        newArray = items;
        //console.log(itemsArray)   
        renderTableHistory(newArray);
      },
    });

    const updateData = setInterval(  () => {
      
      ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {
          
            //console.log(Object.values(items));
              listenItemsArray = Object.values(items);
              let firstArray = Object.values(newArray);
               // console.log(Object.entries(itemsArray).length);

               if(listenItemsArray.length === firstArray.length){

                
                  for (let i = 0; i < firstArray.length; i++) {
                    let e = firstArray[i];
                     let e2 = listenItemsArray[i];
              
                   if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                    || e.unidad != e2.unidad || e.bol != e2.bol 
                    || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                    || e.cliente != e2.cliente || e.cporte != e2.cporte
                    || e.tracking != e2.tracking || e.llegada != e2.llegada
                    || e.status != e2.status || e.llegadareal != e2.llegadareal
                    || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                    || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                    ) {
                    //  console.log("UPDATE")
                    renderTableHistory(items);
                     }
     
                   }
                 } 
                 else {
                 // console.log("UPDATE");
                 renderTableHistory(items);

                  
                 }


             
             //console.log(listenItemsArray);
           }       
        })

    }, 10000);
       
    updateData;
    
    d.getElementById('excelFileInput').addEventListener('change', e => {
   
      if(e.target.matches("#excelFileInput")){
      //  console.log(e.target); 
           handleFile(e);            
      }
       
   });

   d.addEventListener("click", async (e) => {    
    //console.log(e.target);
   //LEER CSV / XLS
   let date = new Date;
   if (e.target.matches(".importModal")) {
     clearInterval(updateData);
   }else
   if(e.target.matches(".importXlsx")){


     dbXlsx.forEach((item)=>{
       // console.log(item);
     let hora = item[3].slice(11, 17),
         arrF = item[3].slice(1,-6).split("/"),
          concatF ="";
          item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
      });

      
           // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
       dbXlsx.forEach(async (element) => {
          //  console.log(element[1]);

   if (element[1].match("24") || element[1].match("HS")) {
       //console.log(element[1]);
      
       let options = {
         method: "POST",
         headers: {
           "Content-type": "application/json; charset=utf-8",
         },
         body: JSON.stringify({
           unidad: "",
           caja: "",
           cporte: "",
           tracking: `${element[0]}`,
           bol: "",
           ruta: `${element[1]}`,
           operador: "",
           cliente: "FORD HERMOSILLO",
           proveedor: `${element[2]}`,
           citaprogramada: `${element[3]}`,
           llegadareal: "01/01/0001 00:00",
           salidareal: "01/01/0001 00:00",
           eta: "01/01/0001 00:00",
           llegadadestino: "01/01/0001 00:00",
           salidadestino: "01/01/0001 00:00",
           llegada: "EN TIEMPO",
           status: "PENDIENTE",
           comentarios: "SIN COMENTARIOS"
         }),
       };
       await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         },
       });
           

   } else 
   if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
     
       //console.log(element[1]);

       let options = {
         method: "POST",
         headers: {
           "Content-type": "application/json; charset=utf-8",
         },
         body: JSON.stringify({
           unidad: "",
           caja: "",
           cporte: "",
           tracking: `${element[0]}`,
           bol: "",
           ruta: `${element[1]}`,
           operador: "",
           cliente: "FORD CUAUTITLAN",
           proveedor: `${element[2]}`,
           citaprogramada: `${element[3]}`,
           llegadareal: "01/01/0001 00:00",
           salidareal: "01/01/0001 00:00",
           eta: "01/01/0001 00:00",
           llegadadestino: "01/01/0001 00:00",
           salidadestino: "01/01/0001 00:00",
           llegada: "EN TIEMPO",
           status: "PENDIENTE",
           comentarios: "SIN COMENTARIOS"
         }),
       };
       await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         }
       });
           
   }
     setTimeout(() => {
       location.reload();
     }, 3000);

        });
        
    }else
    //GENERAR REPORTE XLS 
    if (e.target.matches(".modal_xls")){
     if(localStorage.tabViajes === "true"){
       clearInterval(updateData);

    d.querySelector(".export-modal-body").innerHTML = `
      <section id="thtable" class="thtable">
      <table class="table table-hover table-sm" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr style="background-color:black; color:white;">
      <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
      <th scope="col">UNIDAD</th>
      <th scope="col">CAJA</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">C.PORTE</th>
      <th scope="col">TRACKING</th>
      <th scope="col">BOL / SHIPPER</th>
      <th scope="col">RUTA</th>
      <th scope="col">CLIENTE</th>
      <th scope="col">PROVEEDOR</th>
      <th scope="col">CITA PROGRAMADA</th>
      <th scope="col">LLEGADA REAL</th>
      <th scope="col">SALIDA REAL</th>
      <th scope="col">ETA</th>
      <th scope="col">LLEGADA A DESTINO</th>
      <th scope="col">SALIDA A DESTINO</th>
      <th scope="col">LLEGADA</th>
      <th scope="col">ESTATUS</th>
      <th scope="col">COMENTARIOS</th>  
      </tr>
      </thead>
      <tbody id="table_bodyX" class="body_table">
      </tbody>     
      </table>
      </section>
      `;

       //Helper de acceso a los items
         const $tr = d.querySelectorAll(".item");
         const lisTr = Array.from($tr);
     
         lisTr.forEach((e) => {
          if(e.classList[5] === "filter"){
           return
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
         });
 
         d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
     } else {
       location.reload();
     }
     
    
    }else
    if (e.target.matches(".cancelXls") || e.target.matches(".report")){
     location.reload();
   }else
    if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
     // console.log(e.target);

      let isConfirm = confirm("¿Eliminar Registro?");

      if (isConfirm) {
       await ajax({
          url: `${api.ITEMS}/${e.target.id}.json`,
          options: {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          cbSuccess: (res) => {
            //console.log(res);
           
          },
        });
        location.reload();
      }
    }else
    if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
     clearInterval(updateData);
     const tabConv = (item) => {

      d.getElementById("formulario").classList.add("edit");
      d.getElementById("formulario").classList.remove("register");
      d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      d.querySelector(".modal-body").innerHTML = `
      <div class="container-fluid font"> 
      <table class="table table-sm " >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th id="cajas" scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
      <th scope="col">VERIFICACION</th>
      <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>

    </tr>
  </thead>
  <tbody class="text-center text-wrap" >
  <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option> 
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
  </td>
  <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
      <option value="${item.ubicacion}">${item.ubicacion}</option> 
      <option value="BP NORTE">BP NORTE</option>  
      <option value="BP SUR">BP SUR</option>
      <option value="BP CLOSURES">BP CLOSURES</option>
      <option value="BP TRIM">BP TRIM</option>
      <option value="BP CLC">BP CLC</option>
      <option value="FRAMING">FRAMING</option>
      <option value="PATIO RAMOS">PATIO RAMOS</option>
      <option value="PATIO MX">PATIO MX</option>
      <option value="PPATIO HMO">PATIO HMO</option>
      <option value="PATIO PEDRO E">PATIO PEDRO E</option>
      <option value="PATIO SILAO">PATIO SILAO</option>
      <option value="EN TRANSITO">EN TRANSITO</option>
      </select>
  </td>
  <td>      
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
    <option value="${item.comentarios}">${item.comentarios}</option> 
    <option value="CARGADA MP">CARGADA MP</option>  
    <option value="PARCIAL">PARCIAL</option>
    <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
    <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
    <option value="VACIA">VACIA</option>
    <option value="DAÑADA">DAÑADA</option>
    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
    <option value="DISPONIBLE">DISPONIBLE</option>
    </select>
  </td>  
  </tbody>
  
</table>
</div>
      `;
    }

    const tabUnit = (item) => {

      d.getElementById("formulario").classList.add("edit");
      d.getElementById("formulario").classList.remove("register");
      d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      d.querySelector(".modal-body").innerHTML = `
      <div class="container-fluid font"> 
      <table class="table table-sm" >
  <thead class="table-dark text-center">
    <tr class="text-wrap">
    <th scope="col">UNIDAD</th>
<th scope="col">OPERADOR</th>
<th scope="col">MODELO</th>
<th scope="col">PLACA</th>
<th scope="col">AÑO</th>
 <th scope="col">VERIFICACION</th>
 <th scope="col">NO. POLIZA</th>
<th scope="col">INCISO</th>
<th scope="col">KILOMETRAJE</th>
<th scope="col">CIRCUITO</th>
<th scope="col">FECHA</th>
<th scope="col">UBICACION</th> 
<th scope="col">ESTATUS</th>

    </tr>
  </thead>
  <tbody class="text-center text-wrap" >
  <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
  <option value="${item.circuito}">${item.circuito}</option> 
  <option value="FORDC - HILEX">FORDC - HILEX</option>  
  <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
  <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
  <option value="FORDC - MUBEA">FORDC - MUBEA</option>
  <option value="FORDC - BROSE">FORDC - BROSE</option>
  <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
  <option value="FORDC - STANDAR">FORDC - STANDAR</option>
  <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
  <option value="FORDC - DHL">FORDC - DHL</option>
  <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
  <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
  <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
  <option value="FORDH - BROSE">FORDH - BROSE MX</option>
  <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
  <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
  <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
  <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
  <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
  <option value="AMAZON">AMAZON</option>
  <option value="BRP">BRP</option>
  <option value="GM">GM</option>
  <option value="ACTIVE ON D">ACTIVE ON D</option>
  <option value="FCA - NARMEX">FCA - NARMEX</option>
  <option value="FCA - TI GROUP">FCA - TI GROUP</option>
  <option value="FCA - WEBASTO">FCA - WEBASTO</option>
  <option value="FCA - TENNECO">FCA - TENNECO</option>
  </select>
  </td>
  <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
      <option value="${item.ubicacion}">${item.ubicacion}</option> 
      <option value="BP NORTE">BP NORTE</option>  
      <option value="BP SUR">BP SUR</option>
      <option value="BP CLOSURES">BP CLOSURES</option>
      <option value="BP TRIM">BP TRIM</option>
      <option value="BP CLC">BP CLC</option>
      <option value="FRAMING">FRAMING</option>
      <option value="PATIO RAMOS">PATIO RAMOS</option>
      <option value="PATIO MX">PATIO MX</option>
      <option value="PATIO HMO">PATIO HMO</option>
      <option value="PATIO PEDRO E">PATIO PEDRO E</option>
      <option value="PATIO SILAO">PATIO SILAO</option>
      <option value="EN TRANSITO">EN TRANSITO</option>
      </select>
  </td>
  <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
  </tbody>
  
</table>
</div>
      `;
    }


     //  console.log();
     if(localStorage.tabViajes === "true"){
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     await ajax({
        url: `${api.ITEMS}/${e.target.id}.json`,
        method: "GET",
        cbSuccess: (item) => {
          // console.log(item);
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("/"),
             concatF ="";
             
             return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
          };

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font" style="padding: 0;"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>
            
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap">
          <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
          <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
          <option value="${item.operador}">${item.operador}</option> 
          <option value="ASIGNAR">ASIGNAR</option>
          <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
          <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
          <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
          <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
          <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
          <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
          <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
          <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
          <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
          <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
          <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
          <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
          <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
          <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
          <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
          <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
          <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
          <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
          <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
          <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
          <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
          <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
          <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
          <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
          <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
          <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
          <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
          <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
          <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
          <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
          <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
          <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
          <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
          <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
          <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
          <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
          <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
          <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
          <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
          <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
          <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
          <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
          <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
          <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
          <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
          <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
          <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
          <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
          <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
          <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
          <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
          <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
          <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
          <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
          <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
          <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
          <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
          <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
          <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
          </select>
          </td>
          <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
          <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
          <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
          <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" ${user === "Traffic" || user === "TrafficH" ? "disabled" : ""} required></td>
          <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
          <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
          <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
          <option value="${item.llegada}">${item.llegada}</option> 
          <option value="A TIEMPO">A TIEMPO</option>  
          <option value="TARDE">TARDE</option>
          <option value="DESFASADA">DESFASADA</option>
          <option value="CRITICA">CRITICA</option>
          </select>
          </td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
          <option value="${item.status}">${item.status}</option> 
          <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
          <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
          <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
          <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
          <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
          <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
          <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
          <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
          <option value="TRANSITO A GM">TRANSITO A GM</option>
          <option value="TRANSITO A BRP">TRANSITO A BRP</option>
          <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
          <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
          <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
          <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
          <option value="DETENIDO">DETENIDO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CARGANDO">CARGANDO</option>
          <option value="DESCARGANDO">DESCARGANDO</option>
          <option value="EN ESPERA">EN ESPERA</option>
          <option value="DRY RUN">DRY RUN</option>
          <option value="BROKEREADO">BROKEREADO</option>
          <option value="TONU">TONU</option>
          <option value="CANCELADO">CANCELADO</option>
          <option value="COMPLETO">COMPLETO</option>
          </td>
          <td>
          <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
        },
      });
     }
      if(localStorage.tabConveyance === "true"){
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       await ajax({
         url: `${api.SUBITEMS1}/${e.target.id}.json`,
         method: "GET",
         cbSuccess: (item) => {
           // console.log(item);
           tabConv(item);
         },
       });
      }
      if(localStorage.tabUnit === "true"){
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     
       await ajax({
         url: `${api.SUBITEMS}/${e.target.id}.json`,
         method: "GET",
         cbSuccess: (item) => {
           // console.log(item);
           tabUnit(item);
         },
       });

      }

    }else
    if (e.target.matches(".remolque")) {
      //  console.log(e.target);

      const tabConv = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
      d.getElementById("exampleModalLabel").classList.add("convoy");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="caja" style="width: 35px;" type="text"></td>
    <td><input name="tipo" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };      

      tabConv();
      
    }else
    if (e.target.matches(".unidad")) {
      const tabUnit = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
      d.getElementById("exampleModalLabel").classList.add("unit");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">CONTACTO DEL SEGURO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="unidad" style="width: 35px;" type="text"></td>
    <td><input name="operador" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };

      tabUnit();
    } else
    if (e.target.matches(".tablero")) {
     clearInterval(updateData);
     window.location.hash = "/"+ user+"/productivo";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTable(newArray);
       },
     });

     d.getElementById("tablero").style.color = "#ffffffe8";
     d.getElementById("tablero").style.backgroundColor = "#10438e";
     d.getElementById("tablero").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";


     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".equipov")) {
     clearInterval(updateData);
     window.location.hash = "/"+ user +"/equipov";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTableEV(newArray);
       },
     });

     d.getElementById("equipov").style.color = "#ffffffe8";
     d.getElementById("equipov").style.backgroundColor = "#10438e";
     d.getElementById("equipov").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".history")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/history";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTableHistory(newArray);
       },
     });

     d.getElementById("history").style.color = "#ffffffe8";
     d.getElementById("history").style.backgroundColor = "#10438e";
     d.getElementById("history").style.borderColor = "#094fb5";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".cajas")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/cajas";
     localStorage.tabConveyance = true;
     localStorage.tabViajes = false;
   localStorage.tabUnit = false;


     await ajax({
       url: `${api.SUBITEMS1}.json`,
       cbSuccess: (items) => {   
         newArray = items;
       //  console.log(newArray)   
        renderTableCV(newArray);
       },
     });

     d.getElementById("cajas").style.color = "#ffffffe8";
     d.getElementById("cajas").style.backgroundColor = "#10438e";
     d.getElementById("cajas").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
     
   }else
   if (e.target.matches(".unidades")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/unidades";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = false;
     localStorage.tabUnit = true;


     await ajax({
       url: `${api.SUBITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
   //      console.log(newArray);   
         renderTableUnits(newArray);
       },
     });

     d.getElementById("unidades").style.color = "#ffffffe8";
     d.getElementById("unidades").style.backgroundColor = "#10438e";
     d.getElementById("unidades").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";
     
   }  else
   if (e.target.matches(".reg")) {
     clearInterval(updateData);
     //  console.log(e.target);
     //MODAL REGISTRO DE VIAJES
     d.querySelector(".hidden").style.display = "block";
     d.getElementById("formulario").classList.add("register");
     d.getElementById("formulario").classList.remove("edit");
     d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
     d.querySelector(".modal-body").innerHTML = `
         <div class="container-fluid font"> 
         <table class="table table-sm" >
     <thead class="table-dark text-center">
       <tr class="text-wrap">
       <th scope="col">UNIDAD</th>
       <th scope="col">CAJA</th>
       <th scope="col">OPERADOR</th>
       <th scope="col">C.PORTE</th>
       <th scope="col">TRACKING</th>
       <th scope="col">BOL / SHIPPER</th>
       <th scope="col">RUTA</th>
       <th scope="col">CLIENTE</th>
       <th scope="col">PROVEEDOR</th>
       <th scope="col">CITA PROGRAMADA</th>
       <th scope="col">LLEGADA REAL</th>
       <th scope="col">SALIDA REAL</th>
       <th scope="col">ETA A DESTINO</th>
       <th scope="col">LLEGADA A DESTINO</th>
       <th scope="col">SALIDA A DESTINO</th>
       <th scope="col">LLEGADA</th>
       <th scope="col">ESTATUS</th>
       <th scope="col">COMENTARIOS</th>
       
   
       </tr>
     </thead>
     <tbody class="text-center text-wrap" >
     <td><input name="unidad" style="width: 35px;" type="text"></input></td>
     <td><input name="caja" style="width: 60px;" type="text"></input></td>
     <td><input name="operador" style="width: 130px;" type="text"></input></td>
     <td><input name="cporte" style="width: 70px;" type="text"></input></td>
     <td><input name="tracking" style="width: 80px;" type="text"></input></td>
     <td><input name="bol" style="width: 75px;" type="text"></input></td>
     <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
     <td>
     <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="cliente" id="cliente">
       <option value="FORD CUAUTITLAN">FORD CUAUTITLAN</option>
       <option value="FORD HERMOSILLO">FORD HERMOSILLO</option>
       <option value="MULTILOG">MULTILOG</option>
       <option value="GM">GM</option>
       <option value="STELLANTIS">STELLANTIS</option>
       <option value="ACTIVE">ACTIVE</option>
       <option value="BRP">BRP</option>
       <option value="AMAZON">AMAZON</option>
     </td>
     <td><input id="proveedor" name="proveedor" type="text" style="width: 80px;"></input></td>
     <td><input id="citaprogramada" name="citaprogramada" type="datetime-local" ></td>
     <td><input id="llegadareal" name="llegadareal" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="salidareal" name="salidareal" style="width: 90px;" type="text" value="01/01/0001 00:00"disabled></td>
     <td><input id="eta" name="eta" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="llegadadestino" name="llegadadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="salidadestino" name="salidadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td>
     <select class="form-select form-select-sm" name="llegada" id="arribo" style="width: 100px; height: 24px; font-size: 12px;">
      <option value="A TIEMPO" selected>A TIEMPO</option>
     <option value="TARDE" >TARDE</option>
     <option value="DESFASADA" >DESFASADA</option>
     <option value="CRITICA" >CRITICA</option>
     </select>
     </td>
     <td>
     <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="status" id="status">
       <option value="PENDIENTE">PENDIENTE</option>
       <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
       <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
       <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
       <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
       <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
       <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
       <option value="DETENIDO">DETENIDO</option>
       <option value="CARGANDO">CARGANDO</option>
       <option value="EN ESPERA">EN ESPERA</option>
       <option value="DRY RUN">DRY RUN</option>
       <option value="TONU">TONU</option>
       <option value="CANCELADO">CANCELADO</option>
       <option value="COMPLETO">COMPLETO</option>
     </td>
     <td>
     <input name="comentarios" style="width: 130px;" type="text"  value="SIN COMENTARIOS">
     </td>    
     </tbody>
     
   </table>
   </div>
         `;
   }else
    if(e.target.matches(".generar_xls")){
      //let $dataTable = d.getElementById("table_xls");
          generar_xls('table_xls', 'Reporte');
          location.reload();

    }
    return;
  });

   d.addEventListener("submit", async (e) => {
     e.preventDefault();
     clearInterval(updateData);
  // console.log(e.target);
   
  if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
    //console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

   //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
      //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } else if (
        e.dataset.unit.includes(query) ||
          e.dataset.box.includes(query) ||
          e.dataset.operador.includes(query) ||
          e.dataset.track.includes(query) ||
          e.dataset.ruta.includes(query) ||
          e.dataset.cliente.includes(query) ||
          e.dataset.proveedor.includes(query) ||
          e.dataset.citaprogramada.includes(query) ||
          e.dataset.status.includes(query)
      ) {
        e.classList.remove("filter");
      } else {
        e.classList.add("filter");
      }
                    });
    }
    else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
     //   console.log(e.target);
   let query = localStorage.getItem("apiSearch").toUpperCase();

     //  console.log(query);

   let item = d.querySelectorAll(".item");
       item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
     if (!query) {
       e.classList.remove("filter");
       return false;
     } 
     else if (e.dataset.conv.includes(query) ||
     e.dataset.circuito.includes(query) ||
     e.dataset.ubicacion.includes(query)
     ) {
       e.classList.remove("filter");
     } 
     else {
       e.classList.add("filter");
     }
                   });
    } 
    else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
 // console.log(e.target);
  let query = localStorage.getItem("apiSearch").toUpperCase();

  //console.log(query);

  let item = d.querySelectorAll(".item");
      item.forEach((e) => {
  //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
    if (!query) {
      e.classList.remove("filter");
      return false;
    } 
    else if (e.dataset.unit.includes(query) ||
    e.dataset.circuito.includes(query) ||
    e.dataset.ubicacion.includes(query)
    ) {
      e.classList.remove("filter");
    } 
    else {
      e.classList.add("filter");
    }
                  });
    }  
     
    else if (e.target.matches(".register")) {
       //Create Register
      

       if (!e.target.id.value) {

        
        const dateConvert = (date) => {
          let hora = date.slice(11, 17),
          arrF = date.slice(0,10).split("-"),
           concatF ="";
           
           return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
        };

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: e.target.unidad.value.toUpperCase(),
             caja: e.target.caja.value.toUpperCase(),
             cporte: e.target.cporte.value.toUpperCase(),
             tracking: e.target.tracking.value.toUpperCase(),
             bol: e.target.bol.value.toUpperCase(),
             ruta: e.target.ruta.value.toUpperCase(),
             operador: e.target.operador.value.toUpperCase(),
             cliente: e.target.cliente.value.toUpperCase(),
             proveedor: e.target.proveedor.value.toUpperCase(),
             citaprogramada: dateConvert(e.target.citaprogramada.value),
             llegadareal: e.target.llegadareal.value,
             salidareal: e.target.salidareal.value,
             eta: e.target.eta.value,
             llegadadestino: e.target.llegadadestino.value,
             salidadestino: e.target.salidadestino.value,
             llegada: e.target.llegada.value.toUpperCase(),
             status: e.target.status.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
           }),
         };
       await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           },
         });
         location.reload();
       }
       // console.log(e.target);
    } 
     
    else if (e.target.matches(".edit")) {

      if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
        if (!e.target.id.value) {
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
            url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
            },
          });
          location.reload();
        }
      }    
      if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
        
        if (!e.target.id.value) {
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
            url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
            },
          });
          location.reload();
        }
  
  
      } 
      else if(localStorage.tabViajes === "true") {
        if (!e.target.id.value) {
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("-"),
             concatF ="";
             
             return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
          };

          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              unidad: e.target.unidad.value.toUpperCase(),
              caja: e.target.caja.value.toUpperCase(),
              cporte: e.target.cporte.value.toUpperCase(),
              tracking: e.target.tracking.value.toUpperCase(),
              bol: e.target.bol.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              operador: e.target.operador.value.toUpperCase(),
              cliente: e.target.cliente.value.toUpperCase(),
              proveedor: e.target.proveedor.value.toUpperCase(),
             llegadaprogramada: e.target.llegadaprogramada.value,
             llegadareal: dateConvert(e.target.llegadareal.value),
             salidareal: dateConvert(e.target.salidareal.value),
             eta: dateConvert(e.target.eta.value),
             llegadadestino: dateConvert(e.target.llegadadestino.value),
             salidadestino: dateConvert(e.target.salidadestino.value),
             llegada: e.target.llegada.value.toUpperCase(),
             status: e.target.status.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
             url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
           //   console.log(res);
            },
          });
          location.reload();
        }
      }
        }

    else if (e.target.matches(".update")) {
        //console.log(e.target);

      //UPDATE
       //console.log(e.target.textarea[0].value.toUpperCase());
       //console.log(e.target.textarea[1].value.toUpperCase());

       let keyUnit = d.getElementById("controlV").dataset.unit;
       let keyConv = d.getElementById("controlV").dataset.conveyance;

      // console.log(keyUnit);

       
       if (!e.target.id.value) {
       
        let options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            comentarios: e.target.textarea.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS}/${keyUnit}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

         options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
              circuito: e.target.circuito.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              ubicacion: e.target.ubicacion.value.toUpperCase(),
              comentarios: e.target.comentarios.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS1}/${keyConv}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

           location.reload();
      }
      

    }

        
   });

   d.addEventListener("keyup", (e) => {
     //  console.log(d.getElementById("ruta"));
     //limpiar busqueda
     let query = localStorage.getItem("apiSearch");
     if (e.key === "Escape") localStorage.removeItem("apiSearch");
     let item = d.querySelectorAll(".item");
     item.forEach((e) => {
       if (!query) {
         e.classList.remove("filter");
         return false;
       }
     });
   });
   }else
   if (hash === "#/" + user + "/cajas") { 
    tabActive("cajas");
    localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.SUBITEMS1}.json`,
          cbSuccess: (items) => {   
            newArray = items;
          //  console.log(newArray)   
           renderTableCV(newArray);
          },
        });

        const updateData = setInterval(  () => {
      
          ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {
              
                //console.log(Object.values(items));
                  listenItemsArray = Object.values(items);
                  let firstArray = Object.values(newArray);
                   // console.log(Object.entries(itemsArray).length);
    
                   if(listenItemsArray.length === firstArray.length){
    
                    
                      for (let i = 0; i < firstArray.length; i++) {
                        let e = firstArray[i];
                         let e2 = listenItemsArray[i];
                  
                       if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                        || e.unidad != e2.unidad || e.bol != e2.bol 
                        || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                        || e.cliente != e2.cliente || e.cporte != e2.cporte
                        || e.tracking != e2.tracking || e.llegada != e2.llegada
                        || e.status != e2.status || e.llegadareal != e2.llegadareal
                        || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                        || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                        ) {
                        //  console.log("UPDATE")
                        renderTableCV(items);
                         }
         
                       }
                     } 
                     else {
                     // console.log("UPDATE");
                     renderTableCV(items);
    
                      
                     }
    
    
                 
                 //console.log(listenItemsArray);
               }       
            })
    
        }, 10000);
           
        updateData;
        
      d.getElementById('excelFileInput').addEventListener('change', e => {
   
        if(e.target.matches("#excelFileInput")){
        //  console.log(e.target); 
             handleFile(e);            
        }
         
     });
 
     d.addEventListener("click", async (e) => {    
      //console.log(e.target);
     //LEER CSV / XLS
     let date = new Date;
     if (e.target.matches(".importModal")) {
       clearInterval(updateData);
     }else
     if(e.target.matches(".importXlsx")){


       dbXlsx.forEach((item)=>{
         // console.log(item);
       let hora = item[3].slice(11, 17),
           arrF = item[3].slice(1,-6).split("/"),
            concatF ="";
            item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
        });

        
             // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
         dbXlsx.forEach(async (element) => {
            //  console.log(element[1]);

     if (element[1].match("24") || element[1].match("HS")) {
         //console.log(element[1]);
        
         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "FORD HERMOSILLO",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "EN TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           },
         });
             

     } else 
     if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
       
         //console.log(element[1]);

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: "",
             caja: "",
             cporte: "",
             tracking: `${element[0]}`,
             bol: "",
             ruta: `${element[1]}`,
             operador: "",
             cliente: "FORD CUAUTITLAN",
             proveedor: `${element[2]}`,
             citaprogramada: `${element[3]}`,
             llegadareal: "01/01/0001 00:00",
             salidareal: "01/01/0001 00:00",
             eta: "01/01/0001 00:00",
             llegadadestino: "01/01/0001 00:00",
             salidadestino: "01/01/0001 00:00",
             llegada: "EN TIEMPO",
             status: "PENDIENTE",
             comentarios: "SIN COMENTARIOS"
           }),
         };
         await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           }
         });
             
     }
       setTimeout(() => {
         location.reload();
       }, 3000);
 
          });
          
      }else
      //GENERAR REPORTE XLS 
      if (e.target.matches(".modal_xls")){
       if(localStorage.tabViajes === "true"){
         clearInterval(updateData);

      d.querySelector(".export-modal-body").innerHTML = `
        <section id="thtable" class="thtable">
        <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
        </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">CAJA</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">C.PORTE</th>
        <th scope="col">TRACKING</th>
        <th scope="col">BOL / SHIPPER</th>
        <th scope="col">RUTA</th>
        <th scope="col">CLIENTE</th>
        <th scope="col">PROVEEDOR</th>
        <th scope="col">CITA PROGRAMADA</th>
        <th scope="col">LLEGADA REAL</th>
        <th scope="col">SALIDA REAL</th>
        <th scope="col">ETA</th>
        <th scope="col">LLEGADA A DESTINO</th>
        <th scope="col">SALIDA A DESTINO</th>
        <th scope="col">LLEGADA</th>
        <th scope="col">ESTATUS</th>
        <th scope="col">COMENTARIOS</th>  
        </tr>
        </thead>
        <tbody id="table_bodyX" class="body_table">
        </tbody>     
        </table>
        </section>
        `;

         //Helper de acceso a los items
           const $tr = d.querySelectorAll(".item");
           const lisTr = Array.from($tr);
       
           lisTr.forEach((e) => {
            if(e.classList[5] === "filter"){
             return
            }
            d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
           });
   
           d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
       } else {
         location.reload();
       }
       
      
      }else
      if (e.target.matches(".cancelXls") || e.target.matches(".report")){
       location.reload();
     }else
      if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
       // console.log(e.target);

        let isConfirm = confirm("¿Eliminar Registro?");

        if (isConfirm) {
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
            options: {
              method: "DELETE",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
            },
            cbSuccess: (res) => {
              //console.log(res);
             
            },
          });
          location.reload();
        }
      }else
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
       clearInterval(updateData);
       const tabConv = (item) => {

        d.getElementById("formulario").classList.add("edit");
        d.getElementById("formulario").classList.remove("register");
        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
        d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid font"> 
        <table class="table table-sm " >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th id="cajas" scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
        <th scope="col">VERIFICACION</th>
        <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap" >
    <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="tipo" style="width: 120px;" type="text"   value="${item.tipo}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="poliza" style="width: 100px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="inciso" style="width: 100px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 150px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
        <option value="${item.circuito}">${item.circuito}</option> 
        <option value="FORDC - HILEX">FORDC - HILEX</option>  
        <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
        <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
        <option value="FORDC - MUBEA">FORDC - MUBEA</option>
        <option value="FORDC - BROSE">FORDC - BROSE</option>
        <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
        <option value="FORDC - STANDAR">FORDC - STANDAR</option>
        <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
        <option value="FORDC - DHL">FORDC - DHL</option>
        <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
        <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
        <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
        <option value="FORDH - BROSE">FORDH - BROSE MX</option>
        <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
        <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
        <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
        <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
        <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
        <option value="AMAZON">AMAZON</option>
        <option value="BRP">BRP</option>
        <option value="GM">GM</option>
        <option value="ACTIVE ON D">ACTIVE ON D</option>
        <option value="FCA - NARMEX">FCA - NARMEX</option>
        <option value="FCA - TI GROUP">FCA - TI GROUP</option>
        <option value="FCA - WEBASTO">FCA - WEBASTO</option>
        <option value="FCA - TENNECO">FCA - TENNECO</option>
        </select>
    </td>
    <td><input name="fecha" style="width: 90px;" type="text"  value="${item.fecha}"></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
        <option value="${item.ubicacion}">${item.ubicacion}</option> 
        <option value="BP NORTE">BP NORTE</option>  
        <option value="BP SUR">BP SUR</option>
        <option value="BP CLOSURES">BP CLOSURES</option>
        <option value="BP TRIM">BP TRIM</option>
        <option value="BP CLC">BP CLC</option>
        <option value="FRAMING">FRAMING</option>
        <option value="PATIO RAMOS">PATIO RAMOS</option>
        <option value="PATIO MX">PATIO MX</option>
        <option value="PPATIO HMO">PATIO HMO</option>
        <option value="PATIO PEDRO E">PATIO PEDRO E</option>
        <option value="PATIO SILAO">PATIO SILAO</option>
        <option value="EN TRANSITO">EN TRANSITO</option>
        </select>
    </td>
    <td>      
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
      <option value="${item.comentarios}">${item.comentarios}</option> 
      <option value="CARGADA MP">CARGADA MP</option>  
      <option value="PARCIAL">PARCIAL</option>
      <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
      <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
      <option value="VACIA">VACIA</option>
      <option value="DAÑADA">DAÑADA</option>
      <option value="MANTENIMIENTO">MANTENIMIENTO</option>
      <option value="DISPONIBLE">DISPONIBLE</option>
      </select>
    </td>  
    </tbody>
    
  </table>
  </div>
        `;
      }

      const tabUnit = (item) => {

        d.getElementById("formulario").classList.add("edit");
        d.getElementById("formulario").classList.remove("register");
        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
        d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid font"> 
        <table class="table table-sm" >
    <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
  <th scope="col">OPERADOR</th>
  <th scope="col">MODELO</th>
  <th scope="col">PLACA</th>
  <th scope="col">AÑO</th>
   <th scope="col">VERIFICACION</th>
   <th scope="col">NO. POLIZA</th>
  <th scope="col">INCISO</th>
  <th scope="col">KILOMETRAJE</th>
  <th scope="col">CIRCUITO</th>
  <th scope="col">FECHA</th>
  <th scope="col">UBICACION</th> 
  <th scope="col">ESTATUS</th>

      </tr>
    </thead>
    <tbody class="text-center text-wrap" >
    <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
    <option value="${item.circuito}">${item.circuito}</option> 
    <option value="FORDC - HILEX">FORDC - HILEX</option>  
    <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
    <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
    <option value="FORDC - MUBEA">FORDC - MUBEA</option>
    <option value="FORDC - BROSE">FORDC - BROSE</option>
    <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
    <option value="FORDC - STANDAR">FORDC - STANDAR</option>
    <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
    <option value="FORDC - DHL">FORDC - DHL</option>
    <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
    <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
    <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
    <option value="FORDH - BROSE">FORDH - BROSE MX</option>
    <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
    <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
    <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
    <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
    <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
    <option value="AMAZON">AMAZON</option>
    <option value="BRP">BRP</option>
    <option value="GM">GM</option>
    <option value="ACTIVE ON D">ACTIVE ON D</option>
    <option value="FCA - NARMEX">FCA - NARMEX</option>
    <option value="FCA - TI GROUP">FCA - TI GROUP</option>
    <option value="FCA - WEBASTO">FCA - WEBASTO</option>
    <option value="FCA - TENNECO">FCA - TENNECO</option>
    </select>
    </td>
    <td><input name="fecha" style="width: 100px;" type="text"  value="${item.fecha}"></td>
    <td>
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
        <option value="${item.ubicacion}">${item.ubicacion}</option> 
        <option value="BP NORTE">BP NORTE</option>  
        <option value="BP SUR">BP SUR</option>
        <option value="BP CLOSURES">BP CLOSURES</option>
        <option value="BP TRIM">BP TRIM</option>
        <option value="BP CLC">BP CLC</option>
        <option value="FRAMING">FRAMING</option>
        <option value="PATIO RAMOS">PATIO RAMOS</option>
        <option value="PATIO MX">PATIO MX</option>
        <option value="PATIO HMO">PATIO HMO</option>
        <option value="PATIO PEDRO E">PATIO PEDRO E</option>
        <option value="PATIO SILAO">PATIO SILAO</option>
        <option value="EN TRANSITO">EN TRANSITO</option>
        </select>
    </td>
    <td><input name="comentarios" style="width: 250px;" type="text""  value="${item.comentarios}"></td>  
    </tbody>
    
  </table>
  </div>
        `;
      }


       //  console.log();
       if(localStorage.tabViajes === "true"){
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       await ajax({
          url: `${api.ITEMS}/${e.target.id}.json`,
          method: "GET",
          cbSuccess: (item) => {
            // console.log(item);
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("/"),
               concatF ="";
               
               return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
            };

            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font" style="padding: 0;"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>
            
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap">
          <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
          <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
          <option value="${item.operador}">${item.operador}</option> 
          <option value="ASIGNAR">ASIGNAR</option>
          <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
          <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
          <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
          <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
          <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
          <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
          <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
          <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
          <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
          <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
          <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
          <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
          <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
          <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
          <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
          <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
          <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
          <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
          <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
          <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
          <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
          <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
          <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
          <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
          <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
          <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
          <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
          <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
          <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
          <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
          <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
          <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
          <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
          <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
          <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
          <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
          <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
          <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
          <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
          <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
          <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
          <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
          <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
          <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
          <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
          <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
          <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
          <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
          <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
          <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
          <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
          <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
          <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
          <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
          <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
          <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
          <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
          <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
          <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
          </select>
          </td>
          <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
          <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
          <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
          <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" ${user === "Traffic" || user === "TrafficH" ? "disabled" : ""} required></td>
          <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
          <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
          <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
          <option value="${item.llegada}">${item.llegada}</option> 
          <option value="A TIEMPO">A TIEMPO</option>  
          <option value="TARDE">TARDE</option>
          <option value="DESFASADA">DESFASADA</option>
          <option value="CRITICA">CRITICA</option>
          </select>
          </td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
          <option value="${item.status}">${item.status}</option> 
          <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
          <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
          <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
          <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
          <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
          <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
          <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
          <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
          <option value="TRANSITO A GM">TRANSITO A GM</option>
          <option value="TRANSITO A BRP">TRANSITO A BRP</option>
          <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
          <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
          <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
          <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
          <option value="DETENIDO">DETENIDO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CARGANDO">CARGANDO</option>
          <option value="DESCARGANDO">DESCARGANDO</option>
          <option value="EN ESPERA">EN ESPERA</option>
          <option value="DRY RUN">DRY RUN</option>
          <option value="BROKEREADO">BROKEREADO</option>
          <option value="TONU">TONU</option>
          <option value="CANCELADO">CANCELADO</option>
          <option value="COMPLETO">COMPLETO</option>
          </td>
          <td>
          <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
          },
        });
       }
        if(localStorage.tabConveyance === "true"){
         d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
           url: `${api.SUBITEMS1}/${e.target.id}.json`,
           method: "GET",
           cbSuccess: (item) => {
             // console.log(item);
             tabConv(item);
           },
         });
        }
        if(localStorage.tabUnit === "true"){
         d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       
         await ajax({
           url: `${api.SUBITEMS}/${e.target.id}.json`,
           method: "GET",
           cbSuccess: (item) => {
             // console.log(item);
             tabUnit(item);
           },
         });

        }

      }else
      if (e.target.matches(".remolque")) {
        //  console.log(e.target);
  
        const tabConv = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
        d.getElementById("exampleModalLabel").classList.add("convoy");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="caja" style="width: 35px;" type="text"></td>
      <td><input name="tipo" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };      
  
        tabConv();
        
      }else
      if (e.target.matches(".unidad")) {
        const tabUnit = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
        d.getElementById("exampleModalLabel").classList.add("unit");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="unidad" style="width: 35px;" type="text"></td>
      <td><input name="operador" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };
  
        tabUnit();
      } else
      if (e.target.matches(".tablero")) {
       clearInterval(updateData);
       window.location.hash = "/"+ user+"/productivo";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;


       await ajax({
         url: `${api.ITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
           //console.log(itemsArray)   
           renderTable(newArray);
         },
       });

       d.getElementById("tablero").style.color = "#ffffffe8";
       d.getElementById("tablero").style.backgroundColor = "#10438e";
       d.getElementById("tablero").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";


       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
     }else
     if (e.target.matches(".equipov")) {
       clearInterval(updateData);
       window.location.hash = "/"+ user +"/equipov";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;


       await ajax({
         url: `${api.ITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
           //console.log(itemsArray)   
           renderTableEV(newArray);
         },
       });

       d.getElementById("equipov").style.color = "#ffffffe8";
       d.getElementById("equipov").style.backgroundColor = "#10438e";
       d.getElementById("equipov").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
     }else
     if (e.target.matches(".history")) {
       clearInterval(updateData);
       window.location.hash = "/"+user+"/history";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;


       await ajax({
         url: `${api.ITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
           //console.log(itemsArray)   
           renderTableHistory(newArray);
         },
       });

       d.getElementById("history").style.color = "#ffffffe8";
       d.getElementById("history").style.backgroundColor = "#10438e";
       d.getElementById("history").style.borderColor = "#094fb5";

       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
     }else
     if (e.target.matches(".cajas")) {
       clearInterval(updateData);
       window.location.hash = "/"+user+"/cajas";
       localStorage.tabConveyance = true;
       localStorage.tabViajes = false;
     localStorage.tabUnit = false;


       await ajax({
         url: `${api.SUBITEMS1}.json`,
         cbSuccess: (items) => {   
           newArray = items;
         //  console.log(newArray)   
          renderTableCV(newArray);
         },
       });

       d.getElementById("cajas").style.color = "#ffffffe8";
       d.getElementById("cajas").style.backgroundColor = "#10438e";
       d.getElementById("cajas").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";

       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";

       d.getElementById("unidades").style.color = "";
       d.getElementById("unidades").style.backgroundColor = "";
       d.getElementById("unidades").style.borderColor = "";
       
     }else
     if (e.target.matches(".unidades")) {
       clearInterval(updateData);
       window.location.hash = "/"+user+"/unidades";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = false;
       localStorage.tabUnit = true;


       await ajax({
         url: `${api.SUBITEMS}.json`,
         cbSuccess: (items) => {   
           newArray = items;
     //      console.log(newArray);   
           renderTableUnits(newArray);
         },
       });

       d.getElementById("unidades").style.color = "#ffffffe8";
       d.getElementById("unidades").style.backgroundColor = "#10438e";
       d.getElementById("unidades").style.borderColor = "#094fb5";

       d.getElementById("history").style.color = "";
       d.getElementById("history").style.backgroundColor = "";
       d.getElementById("history").style.borderColor = "";

       d.getElementById("equipov").style.color = "";
       d.getElementById("equipov").style.backgroundColor = "";
       d.getElementById("equipov").style.borderColor = "";

       d.getElementById("cajas").style.color = "";
       d.getElementById("cajas").style.backgroundColor = "";
       d.getElementById("cajas").style.borderColor = "";

       d.getElementById("tablero").style.color = "";
       d.getElementById("tablero").style.backgroundColor = "";
       d.getElementById("tablero").style.borderColor = "";
       
     }  else
     if (e.target.matches(".reg")) {
       clearInterval(updateData);
       //  console.log(e.target);
       //MODAL REGISTRO DE VIAJES
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("formulario").classList.add("register");
       d.getElementById("formulario").classList.remove("edit");
       d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
       d.querySelector(".modal-body").innerHTML = `
           <div class="container-fluid font"> 
           <table class="table table-sm" >
       <thead class="table-dark text-center">
         <tr class="text-wrap">
         <th scope="col">UNIDAD</th>
         <th scope="col">CAJA</th>
         <th scope="col">OPERADOR</th>
         <th scope="col">C.PORTE</th>
         <th scope="col">TRACKING</th>
         <th scope="col">BOL / SHIPPER</th>
         <th scope="col">RUTA</th>
         <th scope="col">CLIENTE</th>
         <th scope="col">PROVEEDOR</th>
         <th scope="col">CITA PROGRAMADA</th>
         <th scope="col">LLEGADA REAL</th>
         <th scope="col">SALIDA REAL</th>
         <th scope="col">ETA A DESTINO</th>
         <th scope="col">LLEGADA A DESTINO</th>
         <th scope="col">SALIDA A DESTINO</th>
         <th scope="col">LLEGADA</th>
         <th scope="col">ESTATUS</th>
         <th scope="col">COMENTARIOS</th>
         
     
         </tr>
       </thead>
       <tbody class="text-center text-wrap" >
       <td><input name="unidad" style="width: 35px;" type="text"></input></td>
       <td><input name="caja" style="width: 60px;" type="text"></input></td>
       <td><input name="operador" style="width: 130px;" type="text"></input></td>
       <td><input name="cporte" style="width: 70px;" type="text"></input></td>
       <td><input name="tracking" style="width: 80px;" type="text"></input></td>
       <td><input name="bol" style="width: 75px;" type="text"></input></td>
       <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
       <td>
       <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="cliente" id="cliente">
         <option value="FORD CUAUTITLAN">FORD CUAUTITLAN</option>
         <option value="FORD HERMOSILLO">FORD HERMOSILLO</option>
         <option value="MULTILOG">MULTILOG</option>
         <option value="GM">GM</option>
         <option value="STELLANTIS">STELLANTIS</option>
         <option value="ACTIVE">ACTIVE</option>
         <option value="BRP">BRP</option>
         <option value="AMAZON">AMAZON</option>
       </td>
       <td><input id="proveedor" name="proveedor" type="text" style="width: 80px;"></input></td>
       <td><input id="citaprogramada" name="citaprogramada" type="datetime-local" ></td>
       <td><input id="llegadareal" name="llegadareal" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td><input id="salidareal" name="salidareal" style="width: 90px;" type="text" value="01/01/0001 00:00"disabled></td>
       <td><input id="eta" name="eta" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td><input id="llegadadestino" name="llegadadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td><input id="salidadestino" name="salidadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
       <td>
       <select class="form-select form-select-sm" name="llegada" id="arribo" style="width: 100px; height: 24px; font-size: 12px;">
        <option value="A TIEMPO" selected>A TIEMPO</option>
       <option value="TARDE" >TARDE</option>
       <option value="DESFASADA" >DESFASADA</option>
       <option value="CRITICA" >CRITICA</option>
       </select>
       </td>
       <td>
       <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="status" id="status">
         <option value="PENDIENTE">PENDIENTE</option>
         <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
         <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
         <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
         <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
         <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
         <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
         <option value="DETENIDO">DETENIDO</option>
         <option value="CARGANDO">CARGANDO</option>
         <option value="EN ESPERA">EN ESPERA</option>
         <option value="DRY RUN">DRY RUN</option>
         <option value="TONU">TONU</option>
         <option value="CANCELADO">CANCELADO</option>
         <option value="COMPLETO">COMPLETO</option>
       </td>
       <td>
       <input name="comentarios" style="width: 130px;" type="text"  value="SIN COMENTARIOS">
       </td>    
       </tbody>
       
     </table>
     </div>
           `;
     }else
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
            location.reload();
 
      }
      return;
    });
 
     d.addEventListener("submit", async (e) => {
       e.preventDefault();
       clearInterval(updateData);
    // console.log(e.target);
     
    if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
      //console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();

     //console.log(query);

      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
        //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } else if (
          e.dataset.unit.includes(query) ||
            e.dataset.box.includes(query) ||
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.proveedor.includes(query) ||
            e.dataset.citaprogramada.includes(query) ||
            e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
                      });
      }
      else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
       //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

       //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
      } 
      else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
   // console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

    //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
    //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } 
      else if (e.dataset.unit.includes(query) ||
      e.dataset.circuito.includes(query) ||
      e.dataset.ubicacion.includes(query)
      ) {
        e.classList.remove("filter");
      } 
      else {
        e.classList.add("filter");
      }
                    });
      }  
       
      else if (e.target.matches(".register")) {
         //Create Register
        

         if (!e.target.id.value) {

          
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("-"),
             concatF ="";
             
             return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
          };

           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: e.target.unidad.value.toUpperCase(),
               caja: e.target.caja.value.toUpperCase(),
               cporte: e.target.cporte.value.toUpperCase(),
               tracking: e.target.tracking.value.toUpperCase(),
               bol: e.target.bol.value.toUpperCase(),
               ruta: e.target.ruta.value.toUpperCase(),
               operador: e.target.operador.value.toUpperCase(),
               cliente: e.target.cliente.value.toUpperCase(),
               proveedor: e.target.proveedor.value.toUpperCase(),
               citaprogramada: dateConvert(e.target.citaprogramada.value),
               llegadareal: e.target.llegadareal.value,
               salidareal: e.target.salidareal.value,
               eta: e.target.eta.value,
               llegadadestino: e.target.llegadadestino.value,
               salidadestino: e.target.salidadestino.value,
               llegada: e.target.llegada.value.toUpperCase(),
               status: e.target.status.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
             }),
           };
         await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
           });
           location.reload();
         }
         // console.log(e.target);
      } 
       
      else if (e.target.matches(".edit")) {

        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                contacto: e.target.contacto.value.toUpperCase(),
                circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
        }    
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
          
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                contacto: e.target.contacto.value.toUpperCase(),
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
    
    
        } 
        else if(localStorage.tabViajes === "true") {
          if (!e.target.id.value) {
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("-"),
               concatF ="";
               
               return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
            };

            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                unidad: e.target.unidad.value.toUpperCase(),
                caja: e.target.caja.value.toUpperCase(),
                cporte: e.target.cporte.value.toUpperCase(),
                tracking: e.target.tracking.value.toUpperCase(),
                bol: e.target.bol.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                operador: e.target.operador.value.toUpperCase(),
                cliente: e.target.cliente.value.toUpperCase(),
                proveedor: e.target.proveedor.value.toUpperCase(),
               llegadaprogramada: e.target.llegadaprogramada.value,
               llegadareal: dateConvert(e.target.llegadareal.value),
               salidareal: dateConvert(e.target.salidareal.value),
               eta: dateConvert(e.target.eta.value),
               llegadadestino: dateConvert(e.target.llegadadestino.value),
               salidadestino: dateConvert(e.target.salidadestino.value),
               llegada: e.target.llegada.value.toUpperCase(),
               status: e.target.status.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
               url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
             //   console.log(res);
              },
            });
            location.reload();
          }
        }
          }

      else if (e.target.matches(".update")) {
          //console.log(e.target);

        //UPDATE
         //console.log(e.target.textarea[0].value.toUpperCase());
         //console.log(e.target.textarea[1].value.toUpperCase());

         let keyUnit = d.getElementById("controlV").dataset.unit;
         let keyConv = d.getElementById("controlV").dataset.conveyance;

        // console.log(keyUnit);

         
         if (!e.target.id.value) {
         
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              comentarios: e.target.textarea.value.toUpperCase()
            }),
          };

            await ajax({
               url: `${api.SUBITEMS}/${keyUnit}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });

           options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };

            await ajax({
               url: `${api.SUBITEMS1}/${keyConv}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });

             location.reload();
        }
        

      }

          
     });
 
     d.addEventListener("keyup", (e) => {
       //  console.log(d.getElementById("ruta"));
       //limpiar busqueda
       let query = localStorage.getItem("apiSearch");
       if (e.key === "Escape") localStorage.removeItem("apiSearch");
       let item = d.querySelectorAll(".item");
       item.forEach((e) => {
         if (!query) {
           e.classList.remove("filter");
           return false;
         }
       });
     });
   }else
   if (hash === "#/" + user + "/unidades") {
    tabActive("unidades");
    localStorage.tabConveyance = false;
    localStorage.tabViajes = false;
    localStorage.tabUnit = true;


    await ajax({
      url: `${api.SUBITEMS}.json`,
      cbSuccess: (items) => {   
        newArray = items;
  //      console.log(newArray);   
        renderTableUnits(newArray);
      },
    });

    const updateData = setInterval(  () => {
      
      ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {
          
            //console.log(Object.values(items));
              listenItemsArray = Object.values(items);
              let firstArray = Object.values(newArray);
               // console.log(Object.entries(itemsArray).length);

               if(listenItemsArray.length === firstArray.length){

                
                  for (let i = 0; i < firstArray.length; i++) {
                    let e = firstArray[i];
                     let e2 = listenItemsArray[i];
              
                   if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                    || e.unidad != e2.unidad || e.bol != e2.bol 
                    || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                    || e.cliente != e2.cliente || e.cporte != e2.cporte
                    || e.tracking != e2.tracking || e.llegada != e2.llegada
                    || e.status != e2.status || e.llegadareal != e2.llegadareal
                    || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                    || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                    ) {
                    //  console.log("UPDATE")
                    renderTableUnits(items);
                     }
     
                   }
                 } 
                 else {
                 // console.log("UPDATE");
                 renderTableUnits(items);

                  
                 }


             
             //console.log(listenItemsArray);
           }       
        })

    }, 10000);
       
    updateData;
    
    d.getElementById('excelFileInput').addEventListener('change', e => {
   
      if(e.target.matches("#excelFileInput")){
      //  console.log(e.target); 
           handleFile(e);            
      }
       
   });

   d.addEventListener("click", async (e) => {    
    //console.log(e.target);
   //LEER CSV / XLS
   let date = new Date;
   if (e.target.matches(".importModal")) {
     clearInterval(updateData);
   }else
   if(e.target.matches(".importXlsx")){


     dbXlsx.forEach((item)=>{
       // console.log(item);
     let hora = item[3].slice(11, 17),
         arrF = item[3].slice(1,-6).split("/"),
          concatF ="";
          item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
      });

      
           // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
       dbXlsx.forEach(async (element) => {
          //  console.log(element[1]);

   if (element[1].match("24") || element[1].match("HS")) {
       //console.log(element[1]);
      
       let options = {
         method: "POST",
         headers: {
           "Content-type": "application/json; charset=utf-8",
         },
         body: JSON.stringify({
           unidad: "",
           caja: "",
           cporte: "",
           tracking: `${element[0]}`,
           bol: "",
           ruta: `${element[1]}`,
           operador: "",
           cliente: "FORD HERMOSILLO",
           proveedor: `${element[2]}`,
           citaprogramada: `${element[3]}`,
           llegadareal: "01/01/0001 00:00",
           salidareal: "01/01/0001 00:00",
           eta: "01/01/0001 00:00",
           llegadadestino: "01/01/0001 00:00",
           salidadestino: "01/01/0001 00:00",
           llegada: "EN TIEMPO",
           status: "PENDIENTE",
           comentarios: "SIN COMENTARIOS"
         }),
       };
       await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         },
       });
           

   } else 
   if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
     
       //console.log(element[1]);

       let options = {
         method: "POST",
         headers: {
           "Content-type": "application/json; charset=utf-8",
         },
         body: JSON.stringify({
           unidad: "",
           caja: "",
           cporte: "",
           tracking: `${element[0]}`,
           bol: "",
           ruta: `${element[1]}`,
           operador: "",
           cliente: "FORD CUAUTITLAN",
           proveedor: `${element[2]}`,
           citaprogramada: `${element[3]}`,
           llegadareal: "01/01/0001 00:00",
           salidareal: "01/01/0001 00:00",
           eta: "01/01/0001 00:00",
           llegadadestino: "01/01/0001 00:00",
           salidadestino: "01/01/0001 00:00",
           llegada: "EN TIEMPO",
           status: "PENDIENTE",
           comentarios: "SIN COMENTARIOS"
         }),
       };
       await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         }
       });
           
   }
     setTimeout(() => {
       location.reload();
     }, 3000);

        });
        
    }else
    //GENERAR REPORTE XLS 
    if (e.target.matches(".modal_xls")){
     if(localStorage.tabViajes === "true"){
       clearInterval(updateData);

    d.querySelector(".export-modal-body").innerHTML = `
      <section id="thtable" class="thtable">
      <table class="table table-hover table-sm" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr style="background-color:black; color:white;">
      <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
      <th scope="col">UNIDAD</th>
      <th scope="col">CAJA</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">C.PORTE</th>
      <th scope="col">TRACKING</th>
      <th scope="col">BOL / SHIPPER</th>
      <th scope="col">RUTA</th>
      <th scope="col">CLIENTE</th>
      <th scope="col">PROVEEDOR</th>
      <th scope="col">CITA PROGRAMADA</th>
      <th scope="col">LLEGADA REAL</th>
      <th scope="col">SALIDA REAL</th>
      <th scope="col">ETA</th>
      <th scope="col">LLEGADA A DESTINO</th>
      <th scope="col">SALIDA A DESTINO</th>
      <th scope="col">LLEGADA</th>
      <th scope="col">ESTATUS</th>
      <th scope="col">COMENTARIOS</th>  
      </tr>
      </thead>
      <tbody id="table_bodyX" class="body_table">
      </tbody>     
      </table>
      </section>
      `;

       //Helper de acceso a los items
         const $tr = d.querySelectorAll(".item");
         const lisTr = Array.from($tr);
     
         lisTr.forEach((e) => {
          if(e.classList[5] === "filter"){
           return
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
         });
 
         d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
     } else {
       location.reload();
     }
     
    
    }else
    if (e.target.matches(".cancelXls") || e.target.matches(".report")){
     location.reload();
   }else
    if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
     // console.log(e.target);

      let isConfirm = confirm("¿Eliminar Registro?");

      if (isConfirm) {
       await ajax({
          url: `${api.ITEMS}/${e.target.id}.json`,
          options: {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          cbSuccess: (res) => {
            //console.log(res);
           
          },
        });
        location.reload();
      }
    }else
    if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
     clearInterval(updateData);
     const tabConv = (item) => {

      d.getElementById("formulario").classList.add("edit");
      d.getElementById("formulario").classList.remove("register");
      d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      d.querySelector(".modal-body").innerHTML = `
      <div class="container-fluid font"> 
      <table class="table table-sm " >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th id="cajas" scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
      <th scope="col">VERIFICACION</th>
      <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>

    </tr>
  </thead>
  <tbody class="text-center text-wrap" >
  <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option> 
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
  </td>
  <td><input name="fecha" style="width: 90px;" type="text"  value="${item.fecha}"></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
      <option value="${item.ubicacion}">${item.ubicacion}</option> 
      <option value="BP NORTE">BP NORTE</option>  
      <option value="BP SUR">BP SUR</option>
      <option value="BP CLOSURES">BP CLOSURES</option>
      <option value="BP TRIM">BP TRIM</option>
      <option value="BP CLC">BP CLC</option>
      <option value="FRAMING">FRAMING</option>
      <option value="PATIO RAMOS">PATIO RAMOS</option>
      <option value="PATIO MX">PATIO MX</option>
      <option value="PPATIO HMO">PATIO HMO</option>
      <option value="PATIO PEDRO E">PATIO PEDRO E</option>
      <option value="PATIO SILAO">PATIO SILAO</option>
      <option value="EN TRANSITO">EN TRANSITO</option>
      </select>
  </td>
  <td>      
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
    <option value="${item.comentarios}">${item.comentarios}</option> 
    <option value="CARGADA MP">CARGADA MP</option>  
    <option value="PARCIAL">PARCIAL</option>
    <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
    <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
    <option value="VACIA">VACIA</option>
    <option value="DAÑADA">DAÑADA</option>
    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
    <option value="DISPONIBLE">DISPONIBLE</option>
    </select>
  </td>  
  </tbody>
  
</table>
</div>
      `;
    }

        const tabUnit = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="poliza" style="width: 100px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="inciso" style="width: 100px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option> 
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
      </td>
      <td><input name="fecha" style="width: 100px;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
          <option value="${item.ubicacion}">${item.ubicacion}</option> 
          <option value="BP NORTE">BP NORTE</option>  
          <option value="BP SUR">BP SUR</option>
          <option value="BP CLOSURES">BP CLOSURES</option>
          <option value="BP TRIM">BP TRIM</option>
          <option value="BP CLC">BP CLC</option>
          <option value="FRAMING">FRAMING</option>
          <option value="PATIO RAMOS">PATIO RAMOS</option>
          <option value="PATIO MX">PATIO MX</option>
          <option value="PATIO HMO">PATIO HMO</option>
          <option value="PATIO PEDRO E">PATIO PEDRO E</option>
          <option value="PATIO SILAO">PATIO SILAO</option>
          <option value="EN TRANSITO">EN TRANSITO</option>
          </select>
      </td>
      <td><input name="comentarios" style="width: 250px;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

     //  console.log();
     if(localStorage.tabViajes === "true"){
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     await ajax({
        url: `${api.ITEMS}/${e.target.id}.json`,
        method: "GET",
        cbSuccess: (item) => {
          // console.log(item);
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("/"),
             concatF ="";
             
             return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
          };

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font" style="padding: 0;"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
            <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>
            
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap">
          <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
          <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
          <option value="${item.operador}">${item.operador}</option> 
          <option value="ASIGNAR">ASIGNAR</option>
          <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
          <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
          <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
          <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
          <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
          <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
          <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
          <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
          <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
          <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
          <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
          <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
          <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
          <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
          <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
          <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
          <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
          <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
          <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
          <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
          <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
          <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
          <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
          <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
          <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
          <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
          <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
          <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
          <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
          <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
          <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
          <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
          <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
          <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
          <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
          <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
          <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
          <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
          <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
          <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
          <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
          <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
          <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
          <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
          <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
          <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
          <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
          <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
          <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
          <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
          <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
          <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
          <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
          <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
          <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
          <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
          <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
          <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
          <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
          </select>
          </td>
          <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
          <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
          <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
          <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" ${user === "Traffic" || user === "TrafficH" ? "disabled" : ""} required></td>
          <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
          <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
          <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
          <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
          <option value="${item.llegada}">${item.llegada}</option> 
          <option value="A TIEMPO">A TIEMPO</option>  
          <option value="TARDE">TARDE</option>
          <option value="DESFASADA">DESFASADA</option>
          <option value="CRITICA">CRITICA</option>
          </select>
          </td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
          <option value="${item.status}">${item.status}</option> 
          <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
          <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
          <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
          <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
          <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
          <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
          <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
          <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
          <option value="TRANSITO A GM">TRANSITO A GM</option>
          <option value="TRANSITO A BRP">TRANSITO A BRP</option>
          <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
          <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
          <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
          <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
          <option value="DETENIDO">DETENIDO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CARGANDO">CARGANDO</option>
          <option value="DESCARGANDO">DESCARGANDO</option>
          <option value="EN ESPERA">EN ESPERA</option>
          <option value="DRY RUN">DRY RUN</option>
          <option value="BROKEREADO">BROKEREADO</option>
          <option value="TONU">TONU</option>
          <option value="CANCELADO">CANCELADO</option>
          <option value="COMPLETO">COMPLETO</option>
          </td>
          <td>
          <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
        },
      });
     }
      if(localStorage.tabConveyance === "true"){
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       await ajax({
         url: `${api.SUBITEMS1}/${e.target.id}.json`,
         method: "GET",
         cbSuccess: (item) => {
           // console.log(item);
           tabConv(item);
         },
       });
      }
      if(localStorage.tabUnit === "true"){
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     
       await ajax({
         url: `${api.SUBITEMS}/${e.target.id}.json`,
         method: "GET",
         cbSuccess: (item) => {
           // console.log(item);
           tabUnit(item);
         },
       });

      }

    } else
    if (e.target.matches(".remolque")) {
      //  console.log(e.target);

      const tabConv = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
      d.getElementById("exampleModalLabel").classList.add("convoy");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="caja" style="width: 35px;" type="text"></td>
    <td><input name="tipo" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };      

      tabConv();
      
    }else
    if (e.target.matches(".unidad")) {
      const tabUnit = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
      d.getElementById("exampleModalLabel").classList.add("unit");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">CONTACTO DEL SEGURO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="unidad" style="width: 35px;" type="text"></td>
    <td><input name="operador" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };

      tabUnit();
    } else
    if (e.target.matches(".tablero")) {
     clearInterval(updateData);
     window.location.hash = "/"+ user+"/productivo";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTable(newArray);
       },
     });

     d.getElementById("tablero").style.color = "#ffffffe8";
     d.getElementById("tablero").style.backgroundColor = "#10438e";
     d.getElementById("tablero").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";


     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".equipov")) {
     clearInterval(updateData);
     window.location.hash = "/"+ user +"/equipov";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTableEV(newArray);
       },
     });

     d.getElementById("equipov").style.color = "#ffffffe8";
     d.getElementById("equipov").style.backgroundColor = "#10438e";
     d.getElementById("equipov").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".history")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/history";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;


     await ajax({
       url: `${api.ITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
         //console.log(itemsArray)   
         renderTableHistory(newArray);
       },
     });

     d.getElementById("history").style.color = "#ffffffe8";
     d.getElementById("history").style.backgroundColor = "#10438e";
     d.getElementById("history").style.borderColor = "#094fb5";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
   }else
   if (e.target.matches(".cajas")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/cajas";
     localStorage.tabConveyance = true;
     localStorage.tabViajes = false;
   localStorage.tabUnit = false;


     await ajax({
       url: `${api.SUBITEMS1}.json`,
       cbSuccess: (items) => {   
         newArray = items;
       //  console.log(newArray)   
        renderTableCV(newArray);
       },
     });

     d.getElementById("cajas").style.color = "#ffffffe8";
     d.getElementById("cajas").style.backgroundColor = "#10438e";
     d.getElementById("cajas").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";

     d.getElementById("unidades").style.color = "";
     d.getElementById("unidades").style.backgroundColor = "";
     d.getElementById("unidades").style.borderColor = "";
     
   }else
   if (e.target.matches(".unidades")) {
     clearInterval(updateData);
     window.location.hash = "/"+user+"/unidades";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = false;
     localStorage.tabUnit = true;


     await ajax({
       url: `${api.SUBITEMS}.json`,
       cbSuccess: (items) => {   
         newArray = items;
   //      console.log(newArray);   
         renderTableUnits(newArray);
       },
     });

     d.getElementById("unidades").style.color = "#ffffffe8";
     d.getElementById("unidades").style.backgroundColor = "#10438e";
     d.getElementById("unidades").style.borderColor = "#094fb5";

     d.getElementById("history").style.color = "";
     d.getElementById("history").style.backgroundColor = "";
     d.getElementById("history").style.borderColor = "";

     d.getElementById("equipov").style.color = "";
     d.getElementById("equipov").style.backgroundColor = "";
     d.getElementById("equipov").style.borderColor = "";

     d.getElementById("cajas").style.color = "";
     d.getElementById("cajas").style.backgroundColor = "";
     d.getElementById("cajas").style.borderColor = "";

     d.getElementById("tablero").style.color = "";
     d.getElementById("tablero").style.backgroundColor = "";
     d.getElementById("tablero").style.borderColor = "";
     
   }  else
   if (e.target.matches(".reg")) {
     clearInterval(updateData);
     //  console.log(e.target);
     //MODAL REGISTRO DE VIAJES
     d.querySelector(".hidden").style.display = "block";
     d.getElementById("formulario").classList.add("register");
     d.getElementById("formulario").classList.remove("edit");
     d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
     d.querySelector(".modal-body").innerHTML = `
         <div class="container-fluid font"> 
         <table class="table table-sm" >
     <thead class="table-dark text-center">
       <tr class="text-wrap">
       <th scope="col">UNIDAD</th>
       <th scope="col">CAJA</th>
       <th scope="col">OPERADOR</th>
       <th scope="col">C.PORTE</th>
       <th scope="col">TRACKING</th>
       <th scope="col">BOL / SHIPPER</th>
       <th scope="col">RUTA</th>
       <th scope="col">CLIENTE</th>
       <th scope="col">PROVEEDOR</th>
       <th scope="col">CITA PROGRAMADA</th>
       <th scope="col">LLEGADA REAL</th>
       <th scope="col">SALIDA REAL</th>
       <th scope="col">ETA A DESTINO</th>
       <th scope="col">LLEGADA A DESTINO</th>
       <th scope="col">SALIDA A DESTINO</th>
       <th scope="col">LLEGADA</th>
       <th scope="col">ESTATUS</th>
       <th scope="col">COMENTARIOS</th>
       
   
       </tr>
     </thead>
     <tbody class="text-center text-wrap" >
     <td><input name="unidad" style="width: 35px;" type="text"></input></td>
     <td><input name="caja" style="width: 60px;" type="text"></input></td>
     <td><input name="operador" style="width: 130px;" type="text"></input></td>
     <td><input name="cporte" style="width: 70px;" type="text"></input></td>
     <td><input name="tracking" style="width: 80px;" type="text"></input></td>
     <td><input name="bol" style="width: 75px;" type="text"></input></td>
     <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
     <td>
     <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="cliente" id="cliente">
       <option value="FORD CUAUTITLAN">FORD CUAUTITLAN</option>
       <option value="FORD HERMOSILLO">FORD HERMOSILLO</option>
       <option value="MULTILOG">MULTILOG</option>
       <option value="GM">GM</option>
       <option value="STELLANTIS">STELLANTIS</option>
       <option value="ACTIVE">ACTIVE</option>
       <option value="BRP">BRP</option>
       <option value="AMAZON">AMAZON</option>
     </td>
     <td><input id="proveedor" name="proveedor" type="text" style="width: 80px;"></input></td>
     <td><input id="citaprogramada" name="citaprogramada" type="datetime-local" ></td>
     <td><input id="llegadareal" name="llegadareal" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="salidareal" name="salidareal" style="width: 90px;" type="text" value="01/01/0001 00:00"disabled></td>
     <td><input id="eta" name="eta" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="llegadadestino" name="llegadadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td><input id="salidadestino" name="salidadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
     <td>
     <select class="form-select form-select-sm" name="llegada" id="arribo" style="width: 100px; height: 24px; font-size: 12px;">
      <option value="A TIEMPO" selected>A TIEMPO</option>
     <option value="TARDE" >TARDE</option>
     <option value="DESFASADA" >DESFASADA</option>
     <option value="CRITICA" >CRITICA</option>
     </select>
     </td>
     <td>
     <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="status" id="status">
       <option value="PENDIENTE">PENDIENTE</option>
       <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
       <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
       <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
       <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
       <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
       <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
       <option value="DETENIDO">DETENIDO</option>
       <option value="CARGANDO">CARGANDO</option>
       <option value="EN ESPERA">EN ESPERA</option>
       <option value="DRY RUN">DRY RUN</option>
       <option value="TONU">TONU</option>
       <option value="CANCELADO">CANCELADO</option>
       <option value="COMPLETO">COMPLETO</option>
     </td>
     <td>
     <input name="comentarios" style="width: 130px;" type="text"  value="SIN COMENTARIOS">
     </td>    
     </tbody>
     
   </table>
   </div>
         `;
   }else
    if(e.target.matches(".generar_xls")){
      //let $dataTable = d.getElementById("table_xls");
          generar_xls('table_xls', 'Reporte');
          location.reload();

    } else
    
    return;
  });

   d.addEventListener("submit", async (e) => {
     e.preventDefault();
     clearInterval(updateData);
  // console.log(e.target);
   
  if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
    //console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

   //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
      //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } else if (
        e.dataset.unit.includes(query) ||
          e.dataset.box.includes(query) ||
          e.dataset.operador.includes(query) ||
          e.dataset.track.includes(query) ||
          e.dataset.ruta.includes(query) ||
          e.dataset.cliente.includes(query) ||
          e.dataset.proveedor.includes(query) ||
          e.dataset.citaprogramada.includes(query) ||
          e.dataset.status.includes(query)
      ) {
        e.classList.remove("filter");
      } else {
        e.classList.add("filter");
      }
                    });
    }
    else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
     //   console.log(e.target);
   let query = localStorage.getItem("apiSearch").toUpperCase();

     //  console.log(query);

   let item = d.querySelectorAll(".item");
       item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
     if (!query) {
       e.classList.remove("filter");
       return false;
     } 
     else if (e.dataset.conv.includes(query) ||
     e.dataset.circuito.includes(query) ||
     e.dataset.ubicacion.includes(query)
     ) {
       e.classList.remove("filter");
     } 
     else {
       e.classList.add("filter");
     }
                   });
    } 
    else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
 // console.log(e.target);
  let query = localStorage.getItem("apiSearch").toUpperCase();

  //console.log(query);

  let item = d.querySelectorAll(".item");
      item.forEach((e) => {
  //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
    if (!query) {
      e.classList.remove("filter");
      return false;
    } 
    else if (e.dataset.unit.includes(query) ||
    e.dataset.circuito.includes(query) ||
    e.dataset.ubicacion.includes(query)
    ) {
      e.classList.remove("filter");
    } 
    else {
      e.classList.add("filter");
    }
                  });
    }  
     
    else if (e.target.matches(".register")) {
       //Create Register
      

       if (!e.target.id.value) {

        
        const dateConvert = (date) => {
          let hora = date.slice(11, 17),
          arrF = date.slice(0,10).split("-"),
           concatF ="";
           
           return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
        };

         let options = {
           method: "POST",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
           body: JSON.stringify({
             unidad: e.target.unidad.value.toUpperCase(),
             caja: e.target.caja.value.toUpperCase(),
             cporte: e.target.cporte.value.toUpperCase(),
             tracking: e.target.tracking.value.toUpperCase(),
             bol: e.target.bol.value.toUpperCase(),
             ruta: e.target.ruta.value.toUpperCase(),
             operador: e.target.operador.value.toUpperCase(),
             cliente: e.target.cliente.value.toUpperCase(),
             proveedor: e.target.proveedor.value.toUpperCase(),
             citaprogramada: dateConvert(e.target.citaprogramada.value),
             llegadareal: e.target.llegadareal.value,
             salidareal: e.target.salidareal.value,
             eta: e.target.eta.value,
             llegadadestino: e.target.llegadadestino.value,
             salidadestino: e.target.salidadestino.value,
             llegada: e.target.llegada.value.toUpperCase(),
             status: e.target.status.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
           }),
         };
       await ajax({
           url: `${api.ITEMS}.json`,
           options,
           cbSuccess: (res) => {
             json = res.json();
           },
         });
         location.reload();
       }
       // console.log(e.target);
    } 
     
    else if (e.target.matches(".edit")) {

      if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
        if (!e.target.id.value) {
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
            url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
            },
          });
          location.reload();
        }
      }    
      if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
        
        if (!e.target.id.value) {
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              contacto: e.target.contacto.value.toUpperCase(),
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
            url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
            },
          });
          location.reload();
        }
  
  
      } 
      else if(localStorage.tabViajes === "true") {
        if (!e.target.id.value) {
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("-"),
             concatF ="";
             
             return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
          };

          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              unidad: e.target.unidad.value.toUpperCase(),
              caja: e.target.caja.value.toUpperCase(),
              cporte: e.target.cporte.value.toUpperCase(),
              tracking: e.target.tracking.value.toUpperCase(),
              bol: e.target.bol.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              operador: e.target.operador.value.toUpperCase(),
              cliente: e.target.cliente.value.toUpperCase(),
              proveedor: e.target.proveedor.value.toUpperCase(),
             llegadaprogramada: e.target.llegadaprogramada.value,
             llegadareal: dateConvert(e.target.llegadareal.value),
             salidareal: dateConvert(e.target.salidareal.value),
             eta: dateConvert(e.target.eta.value),
             llegadadestino: dateConvert(e.target.llegadadestino.value),
             salidadestino: dateConvert(e.target.salidadestino.value),
             llegada: e.target.llegada.value.toUpperCase(),
             status: e.target.status.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
         await ajax({
             url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
            options,
            cbSuccess: (res) => {
           //   console.log(res);
            },
          });
          location.reload();
        }
      }
        }

    else if (e.target.matches(".update")) {
        //console.log(e.target);

      //UPDATE
       //console.log(e.target.textarea[0].value.toUpperCase());
       //console.log(e.target.textarea[1].value.toUpperCase());

       let keyUnit = d.getElementById("controlV").dataset.unit;
       let keyConv = d.getElementById("controlV").dataset.conveyance;

      // console.log(keyUnit);

       
       if (!e.target.id.value) {
       
        let options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            comentarios: e.target.textarea.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS}/${keyUnit}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

         options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
              circuito: e.target.circuito.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              ubicacion: e.target.ubicacion.value.toUpperCase(),
              comentarios: e.target.comentarios.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS1}/${keyConv}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

           location.reload();
      }
      

    }

        
   });

   d.addEventListener("keyup", (e) => {
     //  console.log(d.getElementById("ruta"));
     //limpiar busqueda
     let query = localStorage.getItem("apiSearch");
     if (e.key === "Escape") localStorage.removeItem("apiSearch");
     let item = d.querySelectorAll(".item");
     item.forEach((e) => {
       if (!query) {
         e.classList.remove("filter");
         return false;
       }
     });
   });
   }

     
   }else {
        return 
   }

 
}



/*
 if (hash === "#/CVehicular/cajas") { 
      localStorage.tabConveyance = true;
      localStorage.tabUnit = false;
      localStorage.tabViajes = false;
         
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            cbSuccess: (items) => {   
              newArray = items;
            //  console.log(newArray)   
             renderTableCV(newArray);
            },
          });
    
          const updateData = setInterval(  () => {
          
            ajax({
              url: `${api.ITEMS}.json`,
              cbSuccess: (items) => {
                
                  //console.log(Object.values(items));
                    listenItemsArray = Object.values(items);
                    let firstArray = Object.values(newArray);
                     // console.log(Object.entries(itemsArray).length);
      
                     if(listenItemsArray.length === firstArray.length){
      
                      
                        for (let i = 0; i < firstArray.length; i++) {
                          let e = firstArray[i];
                           let e2 = listenItemsArray[i];
                    
                         if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                          || e.unidad != e2.unidad || e.bol != e2.bol 
                          || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                          || e.cliente != e2.cliente || e.cporte != e2.cporte
                          || e.tracking != e2.tracking || e.llegada != e2.llegada
                          || e.status != e2.status || e.llegadareal != e2.llegadareal
                          || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                          || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                          ) {
                          //  console.log("UPDATE")
                          renderTableCV(items);
                           }
           
                         }
                       } 
                       else {
                       // console.log("UPDATE");
                       renderTableCV(items);
      
                        
                       }
      
      
                   
                   //console.log(listenItemsArray);
                 }       
              })
      
          }, 5000);
             
          updateData;
    
        
      d.getElementById("cajas").style.color = "#ffffffe8";
      d.getElementById("cajas").style.backgroundColor = "#10438e";
      d.getElementById("cajas").style.borderColor = "#094fb5";
    
      d.getElementById("equipov").style.color = "";
      d.getElementById("equipov").style.backgroundColor = "";
      d.getElementById("equipov").style.borderColor = "";
    
      d.getElementById("tablero").style.color = "";
      d.getElementById("tablero").style.backgroundColor = "";
      d.getElementById("tablero").style.borderColor = "";
    
      d.getElementById("unidades").style.color = "";
      d.getElementById("unidades").style.backgroundColor = "";
      d.getElementById("unidades").style.borderColor = "";
    
       
          
         
    
      
          d.addEventListener("click", async (e) => {      
            //console.log(e.target);
            //LEER CSV / XLS
            if (e.target.matches(".import_csv")){
             //console.log(e.target);    
            }
            
            //GENERAR REPORTE XLS
            let date = new Date;
            if (e.target.matches(".modal_xls")){
              
              if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "false"){
                d.getElementById("exportModalXls").innerHTML = `
                <section id="thtable" class="thtable">
               <table class="table table-hover table-sm" id="table_xls">
                <thead class="table-dark text-center align-middle">
                <tr style="background-color:black; color:white;">
                <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
                </tr>
              <tr style="background-color:black; color:white;">
                <th scope="col">UNIDAD</th>
                <th scope="col">CAJA</th>
                <th scope="col">OPERADOR</th>
                <th scope="col">C.PORTE</th>
                <th scope="col">TRACKING</th>
                <th scope="col">BOL / SHIPPER</th>
                <th scope="col">RUTA</th>
                <th scope="col">CLIENTE</th>
                <th scope="col">FECHA</th>
                <th scope="col">HORARIO</th>
                <th scope="col">LLEGADA</th>
                <th scope="col">ESTATUS</th>  
              </tr>
            </thead>
         
            <tbody id="table_body" class="body_table">
            </tbody>
            
          </table>
        </section>
                `;    
                await ajax({
                 url: `${api.ITEMS}.json`,
                 method: "GET",
                 cbSuccess: (items) => {
                   //console.log(items);
       
                   let itemsArray = Object.entries(items);
                
                  //console.log(itemsArray);
        
                  // Orden for date
                  let orderItems = itemsArray.sort((o1, o2) => {
                    if (o1[1].fecha < o2[1].fecha || o1[1].ventana < o2[1].ventana) {
                      return -1;
                    } else if (o1[1].fecha > o2[1].fecha || o1[1].ventana > o2[1].ventana) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
       
       
                   orderItems.forEach((item) => {
                     d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXls(item));          
                   });
       
                   //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                     const newOrder = Array.from($tr);
                     // Orden Run Complete
                    newOrder.sort((e1, e2) => {
                 if (
                   e1.dataset.run < e2.dataset.run ||
                   e1.dataset.run < e2.dataset.run
                 ) {
                   return -1;
                 } else if (
                   e1.dataset.run > e2.dataset.run ||
                   e1.dataset.run > e2.dataset.run
                 ) {
                   return 1;
                 } else {
                   return 0;
                 }
               });
               newOrder.forEach((e) => {
                 d.getElementById("table_body").insertAdjacentElement("beforeend", e);          
               });
               },
               });
              }
    
              if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
                d.getElementById("exportModalXls").innerHTML = `
    
                <section id="thtable" class="thtable">
               <table class="table table-hover table-sm" id="table_xls">
                <thead class="table-dark text-center align-middle">
                <tr style="background-color:black; color:white;">
                <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
                </tr>
              <tr style="background-color:black; color:white;">
              <th scope="col">CAJA</th>
              <th scope="col">TIPO</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
               <th scope="col">VERIFICACION</th>
               <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">CONTACTO DEL SEGURO</th>
              <th scope="col">CIRCUITO</th>
              <th scope="col">FECHA</th>
              <th scope="col">UBICACION</th> 
              <th scope="col">ESTATUS</th>  
              </tr>
            </thead>
         
            <tbody id="table_body" class="body_table">
            </tbody>
            
          </table>
        </section>
                `; 
                
                await ajax({
                  url: `${api.SUBITEMS1}.json`,
                  method: "GET",
                  cbSuccess: (items) => {
                    //console.log(items);
       
                    let itemsArray = Object.entries(items);
                 
                   //console.log(itemsArray);
         
                   // Ubication Order
                   let orderItems = itemsArray.sort((o1, o2) => {
                    if (o1[1].ubicacion < o2[1].ubicacion || o1[1].ubicacion < o2[1].ubicacion) {
                      return -1;
                    } else if (o1[1].ubicacion > o2[1].ubicacion || o1[1].ubicacion > o2[1].ubicacion) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
       
        
                    orderItems.forEach((item) => {
                      d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
                    });
        
                     //Helper de acceso a los items
                       const $tr = d.querySelectorAll(".item2");
                        const newOrder = Array.from($tr);
      
                    // console.log($tr);
                      // Orden Run Complete
                         newOrder.sort((e1, e2) => {
                         if (
                              e1.dataset.run < e2.dataset.run ||
                               e1.dataset.run < e2.dataset.run
                         ) {
                                 return -1;
                         } else if (
                              e1.dataset.run > e2.dataset.run ||
                              e1.dataset.run > e2.dataset.run
                               ) {
                            return 1;
                                 } else {
                               return 0;
                                   }
                                       });
      
      
              newOrder.forEach((e) => {
                d.getElementById("table_body").insertAdjacentElement("beforeend", e);          
               });     
                },
                });
              } 
              
              if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
                d.getElementById("exportModalXls").innerHTML = `
    
              <section id="thtable" class="thtable">
             <table class="table table-hover table-sm" id="table_xls">
              <thead class="table-dark text-center align-middle">
              <tr style="background-color:black; color:white;">
              <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
              </tr>
            <tr style="background-color:black; color:white;">
            <th scope="col">UNIDAD</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">MODELO</th>
            <th scope="col">PLACA</th>
            <th scope="col">AÑO</th>
             <th scope="col">VERIFICACION</th>
             <th scope="col">NO. POLIZA</th>
            <th scope="col">INCISO</th>
            <th scope="col">CONTACTO DEL SEGURO</th>
            <th scope="col">CIRCUITO</th>
            <th scope="col">FECHA</th>
            <th scope="col">UBICACION</th> 
            <th scope="col">ESTATUS</th>  
            </tr>
          </thead>
       
          <tbody id="table_body" class="body_table">
          </tbody>
          
        </table>
      </section>
              `; 
               
                await ajax({
                  url: `${api.SUBITEMS}.json`,
                  method: "GET",
                  cbSuccess: (items) => {
                    //console.log(items);
       
                    let itemsArray = Object.entries(items);
                 
                   //console.log(itemsArray);
         
                   // Ubication Order
                   let orderItems = itemsArray.sort((o1, o2) => {
                    if (o1[1].ubicacion < o2[1].ubicacion || o1[1].ubicacion < o2[1].ubicacion) {
                      return -1;
                    } else if (o1[1].ubicacion > o2[1].ubicacion || o1[1].ubicacion > o2[1].ubicacion) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
       
        
                    orderItems.forEach((item) => {
                      d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
                    });
        
                     //Helper de acceso a los items
                       const $tr = d.querySelectorAll(".item2");
                        const newOrder = Array.from($tr);
      
                    // console.log($tr);
                      // Orden Run Complete
                         newOrder.sort((e1, e2) => {
                         if (
                              e1.dataset.run < e2.dataset.run ||
                               e1.dataset.run < e2.dataset.run
                         ) {
                                 return -1;
                         } else if (
                              e1.dataset.run > e2.dataset.run ||
                              e1.dataset.run > e2.dataset.run
                               ) {
                            return 1;
                                 } else {
                               return 0;
                                   }
                                       });
      
      
              newOrder.forEach((e) => {
                d.getElementById("table_body").insertAdjacentElement("beforeend", e);          
               });     
                },
                });
              }
              
              
            }
            if (e.target.matches(".cancelXls") || e.target.matches(".report")){
              location.reload();
            }
            if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
             console.log(e.target);
      
              let isConfirm = confirm("¿Eliminar Registro?");
      
              if(localStorage.tabConveyance === "true") {
                if (isConfirm) {
                  await ajax({
                     url: `${api.SUBITEMS1}/${e.target.id}.json`,
                     options: {
                       method: "DELETE",
                       headers: {
                         "Content-type": "application/json; charset=utf-8",
                       },
                     },
                     cbSuccess: (res) => {
                       //console.log(res);
                      
                     },
                   });
                   location.reload();
                 }
              } else if (localStorage.tabUnit === "true") {
                if (isConfirm) {
                  await ajax({
                     url: `${api.SUBITEMS}/${e.target.id}.json`,
                     options: {
                       method: "DELETE",
                       headers: {
                         "Content-type": "application/json; charset=utf-8",
                       },
                     },
                     cbSuccess: (res) => {
                       //console.log(res);
                      
                     },
                   });
                   location.reload();
                 }
              } else {
                return;
              }
    
              
    
    
            }
            if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
             // console.log(e.target);
    
             const tabConv = (item) => {
    
              d.getElementById("formulario").classList.add("edit");
              d.getElementById("formulario").classList.remove("register");
              d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
              d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font"> 
              <table class="table table-sm " >
              <thead class="table-dark text-center">
              <tr class="text-wrap">
              <th id="cajas" scope="col">CAJA</th>
              <th scope="col">TIPO</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
              <th scope="col">VERIFICACION</th>
              <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">MARCHAMO</th>
              <th scope="col">CIRCUITO</th>
              <th scope="col">FECHA</th>
              <th scope="col">UBICACION</th> 
              <th scope="col">ESTATUS</th>
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap" >
          <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ></td>
          <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" ></td>
          <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ></td>
          <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ></td>
          <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ></td>
          <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
          <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ></td>
          <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ></td>
          <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
              <option value="${item.circuito}">${item.circuito}</option> 
              <option value="FORDC - HILEX">FORDC - HILEX</option>  
              <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
              <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
              <option value="FORDC - MUBEA">FORDC - MUBEA</option>
              <option value="FORDC - BROSE">FORDC - BROSE</option>
              <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
              <option value="FORDC - STANDAR">FORDC - STANDAR</option>
              <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
              <option value="FORDC - DHL">FORDC - DHL</option>
              <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
              <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
              <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
              <option value="FORDH - BROSE">FORDH - BROSE MX</option>
              <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
              <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
              <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
              <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
              <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
              <option value="AMAZON">AMAZON</option>
              <option value="BRP">BRP</option>
              <option value="GM">GM</option>
              <option value="ACTIVE ON D">ACTIVE ON D</option>
              <option value="FCA - NARMEX">FCA - NARMEX</option>
              <option value="FCA - TI GROUP">FCA - TI GROUP</option>
              <option value="FCA - WEBASTO">FCA - WEBASTO</option>
              <option value="FCA - TENNECO">FCA - TENNECO</option>
              </select>
          </td>
          <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
              <option value="${item.ubicacion}">${item.ubicacion}</option> 
              <option value="BP NORTE">BP NORTE</option>  
              <option value="BP SUR">BP SUR</option>
              <option value="BP CLOSURES">BP CLOSURES</option>
              <option value="BP TRIM">BP TRIM</option>
              <option value="BP CLC">BP CLC</option>
              <option value="FRAMING">FRAMING</option>
              <option value="PATIO RAMOS">PATIO RAMOS</option>
              <option value="PATIO MX">PATIO MX</option>
              <option value="PPATIO HMO">PATIO HMO</option>
              <option value="PATIO PEDRO E">PATIO PEDRO E</option>
              <option value="PATIO SILAO">PATIO SILAO</option>
              <option value="EN TRANSITO">EN TRANSITO</option>
              </select>
          </td>
          <td>      
            <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
            <option value="${item.comentarios}">${item.comentarios}</option> 
            <option value="CARGADA MP">CARGADA MP</option>  
            <option value="PARCIAL">PARCIAL</option>
            <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
            <option value="EV - FALTA SHIPPER>EV - FALTA SHIPPER</option>
            <option value="VACIA>VACIA</option>
            <option value="DAÑADA>DAÑADA</option>
            <option value="MANTENIMIENTO>MANTENIMIENTO</option>
            <option value="DISPONIBLE">DISPONIBLE</option>
            </select>
          </td>  
          </tbody>
          
        </table>
        </div>
              `;
            }
    
            const tabUnit = (item) => {
    
              d.getElementById("formulario").classList.add("edit");
              d.getElementById("formulario").classList.remove("register");
              d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
              d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid font"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">KILOMETRAJE</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
            </tr>
          </thead>
          <tbody class="text-center text-wrap" >
          <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ></td>
          <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ></td>
          <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ></td>
          <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ></td>
          <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ></td>
          <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ></td>
          <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ></td>
          <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ></td>
          <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
          <option value="${item.circuito}">${item.circuito}</option> 
          <option value="FORDC - HILEX">FORDC - HILEX</option>  
          <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
          <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
          <option value="FORDC - MUBEA">FORDC - MUBEA</option>
          <option value="FORDC - BROSE">FORDC - BROSE</option>
          <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
          <option value="FORDC - STANDAR">FORDC - STANDAR</option>
          <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
          <option value="FORDC - DHL">FORDC - DHL</option>
          <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
          <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
          <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
          <option value="FORDH - BROSE">FORDH - BROSE MX</option>
          <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
          <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
          <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
          <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
          <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
          <option value="AMAZON">AMAZON</option>
          <option value="BRP">BRP</option>
          <option value="GM">GM</option>
          <option value="ACTIVE ON D">ACTIVE ON D</option>
          <option value="FCA - NARMEX">FCA - NARMEX</option>
          <option value="FCA - TI GROUP">FCA - TI GROUP</option>
          <option value="FCA - WEBASTO">FCA - WEBASTO</option>
          <option value="FCA - TENNECO">FCA - TENNECO</option>
          </select>
          </td>
          <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
          <td>
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
              <option value="${item.ubicacion}">${item.ubicacion}</option> 
              <option value="BP NORTE">BP NORTE</option>  
              <option value="BP SUR">BP SUR</option>
              <option value="BP CLOSURES">BP CLOSURES</option>
              <option value="BP TRIM">BP TRIM</option>
              <option value="BP CLC">BP CLC</option>
              <option value="FRAMING">FRAMING</option>
              <option value="PATIO RAMOS">PATIO RAMOS</option>
              <option value="PATIO MX">PATIO MX</option>
              <option value="PATIO HMO">PATIO HMO</option>
              <option value="PATIO PEDRO E">PATIO PEDRO E</option>
              <option value="PATIO SILAO">PATIO SILAO</option>
              <option value="EN TRANSITO">EN TRANSITO</option>
              </select>
          </td>
          <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
          </tbody>
          
        </table>
        </div>
              `;
            }
    
    
              d.querySelector(".hidden").style.display = "block";
              d.getElementById("bt-save").dataset.value = `${e.target.id}`;
      
             
              if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
                await ajax({
                  url: `${api.SUBITEMS1}/${e.target.id}.json`,
                  method: "GET",
                  cbSuccess: (item) => {
                    // console.log(item);
                    tabConv(item);
                  },
                });
              } if(localStorage.tabUnit === "true" && localStorage.tabConveyance === "false"){
                
                await ajax({
                  url: `${api.SUBITEMS}/${e.target.id}.json`,
                  method: "GET",
                  cbSuccess: (item) => {
                    // console.log(item);
                    tabUnit(item);
                  },
                });
              } else {
                //console.log(localStorage.tabConveyance,localStorage.tabUnit);
              }
          
      
            }  
            if (e.target.matches(".remolque")) {
              //  console.log(e.target);
    
              const tabConv = ()=> {
                //MODAL
              d.querySelector(".hidden").style.display = "block";
              d.getElementById("formulario").classList.add("register");
              d.getElementById("formulario").classList.remove("edit");
              d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
              d.getElementById("exampleModalLabel").classList.add("convoy");
              d.getElementById("exampleModalLabel").classList.remove("convoy");
              d.querySelector(".modal-body").innerHTML = `
                  <div class="container-fluid"> 
                  <table class="table table-sm" >
              <thead class="table-dark text-center">
              <tr class="text-wrap">
              <th scope="col">CAJA</th>
              <th scope="col">TIPO</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
               <th scope="col">VERIFICACION</th>
               <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">MARCHAMO</th>
              <th scope="col">CIRCUITO</th>
              <th scope="col">FECHA</th>
              <th scope="col">UBICACION</th> 
              <th scope="col">ESTATUS</th>
          
              </tr>
            </thead>
            <tbody class="text-center text-wrap">
            <td><input name="caja" style="width: 35px;" type="text"></td>
            <td><input name="tipo" style="width: 60px;" type="text"></td>
            <td><input name="modelo" style="width: 130px;" type="text"></td>
            <td><input name="placa" style="width: 70px;" type="text"></td>
            <td><input name="año" style="width: 80px;" type="text"></td>
            <td><input name="verificacion" style="width: 75px;" type="text"></td>
            <td><input name="poliza" style="width: 75px;" type="text"></td>
            <td><input name="inciso" style="width: 95px;" type="text"></td>
            <td><input name="contacto" type="text" style="width: 80px;"></td>
            <td><input name="circuito" type="text"></td>
            <td><input name="fecha" type="date"></td>
            <td><input name="ubicacion" type="text"></td>
            <td><input name="comentarios" type="text"></td>  
            </tbody>
              
            </table>
            </div>
                  `;
              };      
    
              tabConv();
              
            }
            if (e.target.matches(".unidad")) {
              const tabUnit = ()=> {
                //MODAL
              d.querySelector(".hidden").style.display = "block";
              d.getElementById("formulario").classList.add("register");
              d.getElementById("formulario").classList.remove("edit");
              d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
              d.getElementById("exampleModalLabel").classList.add("unit");
              d.getElementById("exampleModalLabel").classList.remove("convoy");
              d.querySelector(".modal-body").innerHTML = `
                  <div class="container-fluid"> 
                  <table class="table table-sm" >
              <thead class="table-dark text-center">
              <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">OPERADOR</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
               <th scope="col">VERIFICACION</th>
               <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">CONTACTO DEL SEGURO</th>
              <th scope="col">CIRCUITO</th>
              <th scope="col">FECHA</th>
              <th scope="col">UBICACION</th> 
              <th scope="col">ESTATUS</th>
          
              </tr>
            </thead>
            <tbody class="text-center text-wrap">
            <td><input name="unidad" style="width: 35px;" type="text"></td>
            <td><input name="operador" style="width: 60px;" type="text"></td>
            <td><input name="modelo" style="width: 130px;" type="text"></td>
            <td><input name="placa" style="width: 70px;" type="text"></td>
            <td><input name="año" style="width: 80px;" type="text"></td>
            <td><input name="verificacion" style="width: 75px;" type="text"></td>
            <td><input name="poliza" style="width: 75px;" type="text"></td>
            <td><input name="inciso" style="width: 95px;" type="text"></td>
            <td><input name="contacto" type="text" style="width: 80px;"></td>
            <td><input name="circuito" type="text"></td>
            <td><input name="fecha" type="date"></td>
            <td><input name="ubicacion" type="text"></td>
            <td><input name="comentarios" type="text"></td>  
            </tbody>
              
            </table>
            </div>
                  `;
              };
    
              tabUnit();
            }   
            if (e.target.matches(".tablero")) {
              clearInterval(updateData);
              window.location.hash = "/"+ user +"/productivo";
              localStorage.tabConveyance = false;
              localStorage.tabViajes = true;
               localStorage.tabUnit = false;
      
      
              await ajax({
                url: `${api.ITEMS}.json`,
                cbSuccess: (items) => {   
                  newArray = items;
                  //console.log(itemsArray)   
                  renderTablePublic(newArray);
                },
              });
      
              d.getElementById("tablero").style.color = "#ffffffe8";
              d.getElementById("tablero").style.backgroundColor = "#10438e";
              d.getElementById("tablero").style.borderColor = "#094fb5";
      
              d.getElementById("history").style.color = "";
              d.getElementById("history").style.backgroundColor = "";
              d.getElementById("history").style.borderColor = "";
      
      
              d.getElementById("equipov").style.color = "";
              d.getElementById("equipov").style.backgroundColor = "";
              d.getElementById("equipov").style.borderColor = "";
      
              d.getElementById("cajas").style.color = "";
              d.getElementById("cajas").style.backgroundColor = "";
              d.getElementById("cajas").style.borderColor = "";
      
              d.getElementById("unidades").style.color = "";
              d.getElementById("unidades").style.backgroundColor = "";
              d.getElementById("unidades").style.borderColor = "";
            }
            if (e.target.matches(".equipov")) {
              clearInterval(updateData);
              window.location.hash = "/"+ user +"/equipov";
              localStorage.tabConveyance = false;
              localStorage.tabViajes = true;
               localStorage.tabUnit = false;
      
      
              await ajax({
                url: `${api.ITEMS}.json`,
                cbSuccess: (items) => {   
                  newArray = items;
                  //console.log(itemsArray)   
                  renderTableEV(newArray);
                },
              });
      
              d.getElementById("equipov").style.color = "#ffffffe8";
              d.getElementById("equipov").style.backgroundColor = "#10438e";
              d.getElementById("equipov").style.borderColor = "#094fb5";
      
              d.getElementById("history").style.color = "";
              d.getElementById("history").style.backgroundColor = "";
              d.getElementById("history").style.borderColor = "";
      
              d.getElementById("tablero").style.color = "";
              d.getElementById("tablero").style.backgroundColor = "";
              d.getElementById("tablero").style.borderColor = "";
      
              d.getElementById("cajas").style.color = "";
              d.getElementById("cajas").style.backgroundColor = "";
              d.getElementById("cajas").style.borderColor = "";
      
              d.getElementById("unidades").style.color = "";
              d.getElementById("unidades").style.backgroundColor = "";
              d.getElementById("unidades").style.borderColor = "";
            }
            if (e.target.matches(".history")) {
              clearInterval(updateData);
              window.location.hash = "/"+user+"/history";
              localStorage.tabConveyance = false;
              localStorage.tabViajes = true;
               localStorage.tabUnit = false;
      
      
              await ajax({
                url: `${api.ITEMS}.json`,
                cbSuccess: (items) => {   
                  newArray = items;
                  //console.log(itemsArray)   
                  renderTableHistory(newArray);
                },
              });
      
              d.getElementById("history").style.color = "#ffffffe8";
              d.getElementById("history").style.backgroundColor = "#10438e";
              d.getElementById("history").style.borderColor = "#094fb5";
      
              d.getElementById("equipov").style.color = "";
              d.getElementById("equipov").style.backgroundColor = "";
              d.getElementById("equipov").style.borderColor = "";
      
              d.getElementById("tablero").style.color = "";
              d.getElementById("tablero").style.backgroundColor = "";
              d.getElementById("tablero").style.borderColor = "";
      
              d.getElementById("cajas").style.color = "";
              d.getElementById("cajas").style.backgroundColor = "";
              d.getElementById("cajas").style.borderColor = "";
      
              d.getElementById("unidades").style.color = "";
              d.getElementById("unidades").style.backgroundColor = "";
              d.getElementById("unidades").style.borderColor = "";
            }
            if (e.target.matches(".cajas")) {
              clearInterval(updateData);
              window.location.hash = "/"+user+"/cajas";
              localStorage.tabConveyance = true;
              localStorage.tabViajes = false;
            localStorage.tabUnit = false;
      
      
              await ajax({
                url: `${api.SUBITEMS1}.json`,
                cbSuccess: (items) => {   
                  newArray = items;
                //  console.log(newArray)   
                 renderTableCV(newArray);
                },
              });
      
              d.getElementById("cajas").style.color = "#ffffffe8";
              d.getElementById("cajas").style.backgroundColor = "#10438e";
              d.getElementById("cajas").style.borderColor = "#094fb5";
      
              d.getElementById("history").style.color = "";
              d.getElementById("history").style.backgroundColor = "";
              d.getElementById("history").style.borderColor = "";
      
              d.getElementById("equipov").style.color = "";
              d.getElementById("equipov").style.backgroundColor = "";
              d.getElementById("equipov").style.borderColor = "";
      
              d.getElementById("tablero").style.color = "";
              d.getElementById("tablero").style.backgroundColor = "";
              d.getElementById("tablero").style.borderColor = "";
      
              d.getElementById("unidades").style.color = "";
              d.getElementById("unidades").style.backgroundColor = "";
              d.getElementById("unidades").style.borderColor = "";
              
            }
            if (e.target.matches(".unidades")) {
              clearInterval(updateData);
              window.location.hash = "/"+user+"/unidades";
              localStorage.tabConveyance = false;
              localStorage.tabViajes = false;
              localStorage.tabUnit = true;
      
      
              await ajax({
                url: `${api.SUBITEMS}.json`,
                cbSuccess: (items) => {   
                  newArray = items;
            //      console.log(newArray);   
                  renderTableUnits(newArray);
                },
              });
      
              d.getElementById("unidades").style.color = "#ffffffe8";
              d.getElementById("unidades").style.backgroundColor = "#10438e";
              d.getElementById("unidades").style.borderColor = "#094fb5";
      
              d.getElementById("history").style.color = "";
              d.getElementById("history").style.backgroundColor = "";
              d.getElementById("history").style.borderColor = "";
      
              d.getElementById("equipov").style.color = "";
              d.getElementById("equipov").style.backgroundColor = "";
              d.getElementById("equipov").style.borderColor = "";
      
              d.getElementById("cajas").style.color = "";
              d.getElementById("cajas").style.backgroundColor = "";
              d.getElementById("cajas").style.borderColor = "";
      
              d.getElementById("tablero").style.color = "";
              d.getElementById("tablero").style.backgroundColor = "";
              d.getElementById("tablero").style.borderColor = "";
              
            }
            if(e.target.matches(".generar_xls")){
              //let $dataTable = d.getElementById("table_xls");
                  generar_xls('table_xls', 'Reporte');
                  location.reload();
            }
            return;
          });
    
          d.addEventListener("submit", async (e) => {
            e.preventDefault();
         // console.log(e.target);
              if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
          //console.log(e.target);
          let query = localStorage.getItem("apiSearch").toUpperCase();
    
         //console.log(query);
    
          let item = d.querySelectorAll(".item");
              item.forEach((e) => {
            //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
            if (!query) {
              e.classList.remove("filter");
              return false;
            } else if (
              e.dataset.unit.includes(query) ||
                e.dataset.box.includes(query) ||
                e.dataset.operador.includes(query) ||
                e.dataset.track.includes(query) ||
                e.dataset.ruta.includes(query) ||
                e.dataset.cliente.includes(query) ||
                e.dataset.fechaf.includes(query) ||
                e.dataset.status.includes(query)
            ) {
              e.classList.remove("filter");
            } else {
              e.classList.add("filter");
            }
                          });
        }
    
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
      //   console.log(e.target);
         let query = localStorage.getItem("apiSearch").toUpperCase();
    
      //  console.log(query);
    
         let item = d.querySelectorAll(".item");
             item.forEach((e) => {
         //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
           if (!query) {
             e.classList.remove("filter");
             return false;
           } 
           else if (e.dataset.conv.includes(query) ||
           e.dataset.circuito.includes(query) ||
           e.dataset.ubicacion.includes(query)
           ) {
             e.classList.remove("filter");
           } 
           else {
             e.classList.add("filter");
           }
                         });
       } 
    
       else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
        console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();
    
        //console.log(query);
    
        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
        //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } 
          else if (e.dataset.unit.includes(query) ||
          e.dataset.circuito.includes(query) ||
          e.dataset.ubicacion.includes(query)
          ) {
            e.classList.remove("filter");
          } 
          else {
            e.classList.add("filter");
          }
                        });
      }
            
            else if (e.target.matches(".register")) {
    
              let regModal = d.getElementById("exampleModalLabel");
              //Create Register
              console.log(regModal);
              if(regModal.textContent.includes("Remolque")){
                if (!e.target.id.value) {
                  let options = {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                      caja: e.target.caja.value.toUpperCase(),
                      tipo: e.target.tipo.value.toUpperCase(),
                      modelo: e.target.modelo.value.toUpperCase(),
                      placa: e.target.placa.value.toUpperCase(),
                      año: e.target.año.value.toUpperCase(),
                      verificacion: e.target.verificacion.value.toUpperCase(),
                      poliza: e.target.poliza.value.toUpperCase(),
                      inciso: e.target.inciso.value.toUpperCase(),
                      contacto: e.target.contacto.value.toUpperCase(),
                      circuito: e.target.circuito.value.toUpperCase(),
                      fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                      ubicacion: e.target.ubicacion.value.toUpperCase(),
                      comentarios: e.target.comentarios.value.toUpperCase()
                      
                    }),
                  };
                await ajax({
                    url: `${api.SUBITEMS1}.json`,
                    options,
                    cbSuccess: (res) => {
                     // json = res.json();
                    },
                  });
                  location.reload();
                }
              } if(regModal.textContent.includes("Unidad")){
                if (!e.target.id.value) {
                  let options = {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                      unidad: e.target.unidad.value.toUpperCase(),
                      operador: e.target.operador.value.toUpperCase(),
                      modelo: e.target.modelo.value.toUpperCase(),
                      placa: e.target.placa.value.toUpperCase(),
                      año: e.target.año.value.toUpperCase(),
                      verificacion: e.target.verificacion.value.toUpperCase(),
                      poliza: e.target.poliza.value.toUpperCase(),
                      inciso: e.target.inciso.value.toUpperCase(),
                      contacto: e.target.contacto.value.toUpperCase(),
                      circuito: e.target.circuito.value.toUpperCase(),
                      fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                      ubicacion: e.target.ubicacion.value.toUpperCase(),
                      comentarios: e.target.comentarios.value.toUpperCase()
                      
                    }),
                  };
                await ajax({
                    url: `${api.SUBITEMS}.json`,
                    options,
                    cbSuccess: (res) => {
                     // json = res.json();
                    },
                  });
                  location.reload();
                }
              }
              
              // console.log(e.target);
            } 
            
            else if (e.target.matches(".edit")) {
              //UPDATE
            //  console.log(e.target.comentarios);
            
            if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
              if (!e.target.id.value) {
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                    caja: e.target.caja.value.toUpperCase(),
                    tipo: e.target.tipo.value.toUpperCase(),
                    modelo: e.target.modelo.value.toUpperCase(),
                    placa: e.target.placa.value.toUpperCase(),
                    año: e.target.año.value.toUpperCase(),
                    verificacion: e.target.verificacion.value.toUpperCase(),
                    poliza: e.target.poliza.value.toUpperCase(),
                    inciso: e.target.inciso.value.toUpperCase(),
                    contacto: e.target.contacto.value.toUpperCase(),
                    circuito: e.target.circuito.value.toUpperCase(),
                    fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                    ubicacion: e.target.ubicacion.value.toUpperCase(),
                    comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                  url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                  },
                });
                location.reload();
              }
            }
            if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
              if (!e.target.id.value) {
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                    unidad: e.target.unidad.value.toUpperCase(),
                    operador: e.target.operador.value.toUpperCase(),
                    modelo: e.target.modelo.value.toUpperCase(),
                    placa: e.target.placa.value.toUpperCase(),
                    año: e.target.año.value.toUpperCase(),
                    verificacion: e.target.verificacion.value.toUpperCase(),
                    poliza: e.target.poliza.value.toUpperCase(),
                    inciso: e.target.inciso.value.toUpperCase(),
                    contacto: e.target.contacto.value.toUpperCase(),
                    circuito: e.target.circuito.value.toUpperCase(),
                    fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                    ubicacion: e.target.ubicacion.value.toUpperCase(),
                    comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                  url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                  },
                });
                location.reload();
              }
            }
              
      
              // console.log(e.target);
            }
     
     
               
          });
         
          d.addEventListener("keyup", (e) => {
            //  console.log(d.getElementById("ruta"));
            //limpiar busqueda
            let query = localStorage.getItem("apiSearch");
            if (e.key === "Escape") localStorage.removeItem("apiSearch");
            let item = d.querySelectorAll(".item");
            item.forEach((e) => {
              if (!query) {
                e.classList.remove("filter");
                return false;
              }
            });
          });
    
    }
 

      if (hash === "#/" + user + "/productivo") {
        localStorage.tabConveyance = false;
            localStorage.tabViajes = true;
             localStorage.tabUnit = false;
    
            await ajax({
              url: `${api.ITEMS}.json`,
              cbSuccess: (items) => {   
                newArray = items;
                //console.log(itemsArray)   
                renderTablePublic(newArray);
              },
            });
    
            const updateData = setInterval(  () => {
          
              ajax({
                url: `${api.ITEMS}.json`,
                cbSuccess: (items) => {
                  
                    //console.log(Object.values(items));
                      listenItemsArray = Object.values(items);
                      let firstArray = Object.values(newArray);
                       // console.log(Object.entries(itemsArray).length);
        
                       if(listenItemsArray.length === firstArray.length){
        
                        
                          for (let i = 0; i < firstArray.length; i++) {
                            let e = firstArray[i];
                             let e2 = listenItemsArray[i];
                      
                           if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                            || e.unidad != e2.unidad || e.bol != e2.bol 
                            || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                            || e.cliente != e2.cliente || e.cporte != e2.cporte
                            || e.tracking != e2.tracking || e.llegada != e2.llegada
                            || e.status != e2.status || e.llegadareal != e2.llegadareal
                            || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                            || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                            ) {
                            //  console.log("UPDATE")
                            renderTablePublic(items);
                             }
             
                           }
                         } 
                         else {
                         // console.log("UPDATE");
                         renderTablePublic(items);
        
                          
                         }
        
        
                     
                     //console.log(listenItemsArray);
                   }       
                })
        
            }, 5000);
               
            updateData;
    
            
    
            d.getElementById("tablero").style.color = "#ffffffe8";
            d.getElementById("tablero").style.backgroundColor = "#10438e";
            d.getElementById("tablero").style.borderColor = "#094fb5";
    
            d.getElementById("history").style.color = "";
            d.getElementById("history").style.backgroundColor = "";
            d.getElementById("history").style.borderColor = "";
    
    
            d.getElementById("equipov").style.color = "";
            d.getElementById("equipov").style.backgroundColor = "";
            d.getElementById("equipov").style.borderColor = "";
    
            d.getElementById("cajas").style.color = "";
            d.getElementById("cajas").style.backgroundColor = "";
            d.getElementById("cajas").style.borderColor = "";
    
            d.getElementById("unidades").style.color = "";
            d.getElementById("unidades").style.backgroundColor = "";
            d.getElementById("unidades").style.borderColor = "";
    
            
          d.getElementById('excelFileInput').addEventListener('change', e => {
       
            if(e.target.matches("#excelFileInput")){
            //  console.log(e.target); 
                 handleFile(e);            
            }
             
         });
     
         d.addEventListener("click", async (e) => {    
          //console.log(e.target);
         //LEER CSV / XLS
         let date = new Date;
         if (e.target.matches(".importModal")) {
           clearInterval(updateData);
         }else
         if(e.target.matches(".importXlsx")){
    
    
           dbXlsx.forEach((item)=>{
             // console.log(item);
           let hora = item[3].slice(11, 17),
               arrF = item[3].slice(1,-6).split("/"),
                concatF ="";
                item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
            });
    
            
                 // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
             dbXlsx.forEach(async (element) => {
                //  console.log(element[1]);
    
         if (element[1].match("24") || element[1].match("HS")) {
             //console.log(element[1]);
            
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "FORD HERMOSILLO",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "A TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               },
             });
                 
    
         } else 
         if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
           
             //console.log(element[1]);
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "FORD CUAUTITLAN",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "A TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               }
             });
                 
         }  else 
         if (element[1].match("GMMEX")) {
           
             //console.log(element[1]);
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "GM",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "A TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               }
             });
                 
         } else 
         if (element[2].match("MEX3")) {
           
             //console.log(element[1]);
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "AMAZON",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "A TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               }
             });
                 
         }  else 
         if (element[1].match("BRP")) {
           
             //console.log(element[1]);
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "BRP",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "A TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               }
             });
                 
         } 
    
    
           setTimeout(() => {
             location.reload();
           }, 3000);
     
              });
              
          }else
          //GENERAR REPORTE XLS 
          if (e.target.matches(".modal_xls")){
           if(localStorage.tabViajes === "true"){
             clearInterval(updateData);
    
          d.querySelector(".export-modal-body").innerHTML = `
            <section id="thtable" class="thtable">
            <table class="table table-hover table-sm" id="table_xls">
            <thead class="table-dark text-center align-middle">
            <tr style="background-color:black; color:white;">
            <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
            </tr>
            <tr style="background-color:black; color:white;">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col">LLEGADA REAL</th>
            <th scope="col">SALIDA REAL</th>
            <th scope="col">ETA</th>
            <th scope="col">LLEGADA A DESTINO</th>
            <th scope="col">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>  
            </tr>
            </thead>
            <tbody id="table_bodyX" class="body_table">
            </tbody>     
            </table>
            </section>
            `;
    
             //Helper de acceso a los items
               const $tr = d.querySelectorAll(".item");
               const lisTr = Array.from($tr);
           
               lisTr.forEach((e) => {
                if(e.classList[5] === "filter"){
                 return
                }
                d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
               });
       
               d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
           } else {
             location.reload();
           }
           
          
          }else
          if (e.target.matches(".cancelXls") || e.target.matches(".report")){
           location.reload();
         }else
          if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
           // console.log(e.target);
    
            let isConfirm = confirm("¿Eliminar Registro?");
    
            if (isConfirm) {
             await ajax({
                url: `${api.ITEMS}/${e.target.id}.json`,
                options: {
                  method: "DELETE",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                },
                cbSuccess: (res) => {
                  //console.log(res);
                 
                },
              });
              location.reload();
            }
          }else
          if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
           clearInterval(updateData);
           const tabConv = (item) => {
    
            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid font"> 
            <table class="table table-sm " >
            <thead class="table-dark text-center">
            <tr class="text-wrap">
            <th id="cajas" scope="col">CAJA</th>
            <th scope="col">TIPO</th>
            <th scope="col">MODELO</th>
            <th scope="col">PLACA</th>
            <th scope="col">AÑO</th>
            <th scope="col">VERIFICACION</th>
            <th scope="col">NO. POLIZA</th>
            <th scope="col">INCISO</th>
            <th scope="col">MARCHAMO</th>
            <th scope="col">CIRCUITO</th>
            <th scope="col">FECHA</th>
            <th scope="col">UBICACION</th> 
            <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
        <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
        <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
        <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
        <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
        <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
        <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
        <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
        <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
        <td>
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
            <option value="${item.circuito}">${item.circuito}</option> 
            <option value="FORDC - HILEX">FORDC - HILEX</option>  
            <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
            <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
            <option value="FORDC - MUBEA">FORDC - MUBEA</option>
            <option value="FORDC - BROSE">FORDC - BROSE</option>
            <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
            <option value="FORDC - STANDAR">FORDC - STANDAR</option>
            <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
            <option value="FORDC - DHL">FORDC - DHL</option>
            <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
            <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
            <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
            <option value="FORDH - BROSE">FORDH - BROSE MX</option>
            <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
            <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
            <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
            <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
            <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
            <option value="AMAZON">AMAZON</option>
            <option value="BRP">BRP</option>
            <option value="GM">GM</option>
            <option value="ACTIVE ON D">ACTIVE ON D</option>
            <option value="FCA - NARMEX">FCA - NARMEX</option>
            <option value="FCA - TI GROUP">FCA - TI GROUP</option>
            <option value="FCA - WEBASTO">FCA - WEBASTO</option>
            <option value="FCA - TENNECO">FCA - TENNECO</option>
            </select>
        </td>
        <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
        <td>
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
            <option value="${item.ubicacion}">${item.ubicacion}</option> 
            <option value="BP NORTE">BP NORTE</option>  
            <option value="BP SUR">BP SUR</option>
            <option value="BP CLOSURES">BP CLOSURES</option>
            <option value="BP TRIM">BP TRIM</option>
            <option value="BP CLC">BP CLC</option>
            <option value="FRAMING">FRAMING</option>
            <option value="PATIO RAMOS">PATIO RAMOS</option>
            <option value="PATIO MX">PATIO MX</option>
            <option value="PPATIO HMO">PATIO HMO</option>
            <option value="PATIO PEDRO E">PATIO PEDRO E</option>
            <option value="PATIO SILAO">PATIO SILAO</option>
            <option value="EN TRANSITO">EN TRANSITO</option>
            </select>
        </td>
        <td>      
          <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
          <option value="${item.comentarios}">${item.comentarios}</option> 
          <option value="CARGADA MP">CARGADA MP</option>  
          <option value="PARCIAL">PARCIAL</option>
          <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
          <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
          <option value="VACIA">VACIA</option>
          <option value="DAÑADA">DAÑADA</option>
          <option value="MANTENIMIENTO">MANTENIMIENTO</option>
          <option value="DISPONIBLE">DISPONIBLE</option>
          </select>
        </td>  
        </tbody>
        
      </table>
      </div>
            `;
          }
    
          const tabUnit = (item) => {
    
            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid font"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">KILOMETRAJE</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
    
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
        <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
        <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
        <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
        <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
        <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
        <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
        <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
        <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
        <td>
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
        <option value="${item.circuito}">${item.circuito}</option> 
        <option value="FORDC - HILEX">FORDC - HILEX</option>  
        <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
        <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
        <option value="FORDC - MUBEA">FORDC - MUBEA</option>
        <option value="FORDC - BROSE">FORDC - BROSE</option>
        <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
        <option value="FORDC - STANDAR">FORDC - STANDAR</option>
        <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
        <option value="FORDC - DHL">FORDC - DHL</option>
        <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
        <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
        <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
        <option value="FORDH - BROSE">FORDH - BROSE MX</option>
        <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
        <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
        <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
        <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
        <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
        <option value="AMAZON">AMAZON</option>
        <option value="BRP">BRP</option>
        <option value="GM">GM</option>
        <option value="ACTIVE ON D">ACTIVE ON D</option>
        <option value="FCA - NARMEX">FCA - NARMEX</option>
        <option value="FCA - TI GROUP">FCA - TI GROUP</option>
        <option value="FCA - WEBASTO">FCA - WEBASTO</option>
        <option value="FCA - TENNECO">FCA - TENNECO</option>
        </select>
        </td>
        <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
        <td>
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
            <option value="${item.ubicacion}">${item.ubicacion}</option> 
            <option value="BP NORTE">BP NORTE</option>  
            <option value="BP SUR">BP SUR</option>
            <option value="BP CLOSURES">BP CLOSURES</option>
            <option value="BP TRIM">BP TRIM</option>
            <option value="BP CLC">BP CLC</option>
            <option value="FRAMING">FRAMING</option>
            <option value="PATIO RAMOS">PATIO RAMOS</option>
            <option value="PATIO MX">PATIO MX</option>
            <option value="PATIO HMO">PATIO HMO</option>
            <option value="PATIO PEDRO E">PATIO PEDRO E</option>
            <option value="PATIO SILAO">PATIO SILAO</option>
            <option value="EN TRANSITO">EN TRANSITO</option>
            </select>
        </td>
        <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
        </tbody>
        
      </table>
      </div>
            `;
          }
    
    
           //  console.log();
           if(localStorage.tabViajes === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                const dateConvert = (date) => {
                  let hora = date.slice(11, 17),
                  arrF = date.slice(0,10).split("/"),
                   concatF ="";
                   
                   return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
                };
    
                d.getElementById("formulario").classList.add("edit");
                d.getElementById("formulario").classList.remove("register");
                d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
                d.querySelector(".modal-body").innerHTML = `
                  <div class="container-fluid font" style="padding: 0;"> 
                  <table class="table table-sm" >
              <thead class="table-dark text-center">
                <tr class="text-wrap">
                <th scope="col">UNIDAD</th>
                <th scope="col">CAJA</th>
                <th scope="col">OPERADOR</th>
                <th scope="col">C.PORTE</th>
                <th scope="col">TRACKING</th>
                <th scope="col">BOL / SHIPPER</th>
                <th scope="col">RUTA</th>
                <th scope="col">CLIENTE</th>
                <th scope="col">PROVEEDOR</th>
                <th scope="col">CITA PROGRAMADA</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
                <th scope="col">LLEGADA</th>
                <th scope="col">ESTATUS</th>
                <th scope="col">COMENTARIOS</th>
                
            
                </tr>
              </thead>
              <tbody class="text-center text-wrap">
              <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
              <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
              <option value="${item.operador}">${item.operador}</option> 
              <option value="ASIGNAR">ASIGNAR</option>
              <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
              <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
              <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
              <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
              <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
              <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
              <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
              <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
              <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
              <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
              <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
              <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
              <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
              <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
              <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
              <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
              <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
              <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
              <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
              <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
              <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
              <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
              <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
              <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
              <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
              <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
              <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
              <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
              <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
              <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
              <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
              <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
              <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
              <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
              <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
              <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
              <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
              <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
              <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
              <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
              <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
              <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
              <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
              <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
              <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
              <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
              <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
              <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
              <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
              <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
              <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
              <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
              <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
              <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
              <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
              <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
              <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
              <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
              <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
              </select>
              </td>
              <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
              <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
              <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
              <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" disabled required></td>
              <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
              <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
              <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
              <option value="${item.llegada}">${item.llegada}</option> 
              <option value="A TIEMPO">A TIEMPO</option>  
              <option value="TARDE">TARDE</option>
              <option value="DESFASADA">DESFASADA</option>
              <option value="CRITICA">CRITICA</option>
              </select>
              </td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
              <option value="${item.status}">${item.status}</option> 
              <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
              <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
              <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
              <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
              <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
              <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
              <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
              <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
              <option value="TRANSITO A GM">TRANSITO A GM</option>
              <option value="TRANSITO A BRP">TRANSITO A BRP</option>
              <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
              <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
              <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
              <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
              <option value="DETENIDO">DETENIDO</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CARGANDO">CARGANDO</option>
              <option value="DESCARGANDO">DESCARGANDO</option>
              <option value="EN ESPERA">EN ESPERA</option>
              <option value="DRY RUN">DRY RUN</option>
              <option value="BROKEREADO">BROKEREADO</option>
              <option value="TONU">TONU</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="COMPLETO">COMPLETO</option>
              </td>
              <td>
              <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
              </td>    
              </tbody>
              
            </table>
            </div>
                  `;
              },
            });
           }
            if(localStorage.tabConveyance === "true"){
             d.querySelector(".hidden").style.display = "block";
             d.getElementById("bt-save").dataset.value = `${e.target.id}`;
             await ajax({
               url: `${api.SUBITEMS1}/${e.target.id}.json`,
               method: "GET",
               cbSuccess: (item) => {
                 // console.log(item);
                 tabConv(item);
               },
             });
            }
            if(localStorage.tabUnit === "true"){
             d.querySelector(".hidden").style.display = "block";
             d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           
             await ajax({
               url: `${api.SUBITEMS}/${e.target.id}.json`,
               method: "GET",
               cbSuccess: (item) => {
                 // console.log(item);
                 tabUnit(item);
               },
             });
    
            }
    
          }else
          if (e.target.matches(".control") || e.target.matches(".fa-car")) {
           // console.log(e.target);
    
         
           await ajax({
             url: `${api.SUBITEMS}.json`,
             method: "GET",
             cbSuccess: (unit) => {
            
              // console.log(e.target);
              let unitArray = Object.entries(unit);
              
    
              unitArray.forEach(unit => {
               if(e.target.id === unit[1].unidad){
    
                 d.getElementById("controlModal").style.height = "60vh";
               d.querySelector(".control-modal-body").innerHTML = `
             <div class="container-fluid"> 
             <table class="table table-sm" >
             <thead class="table-dark text-center">
               <tr class="text-wrap">
                 <th scope="col">UNIDAD</th>
                 <th scope="col">OPERADOR</th>
                 <th scope="col">MODELO</th>
                 <th scope="col">PLACA</th>
                 <th scope="col">AÑO</th>
                 <th scope="col">VERIFICACION</th>
                 <th scope="col">NO. POLIZA</th>
                 <th scope="col">INCISO</th>
                 <th scope="col">CONTACTO DEL SEGURO</th> 
               </tr>
             </thead>
             <tbody class="text-center" class="text-wrap">
             <tr>
             <td>${unit[1].unidad}</td>
             <td>${unit[1].operador}</td>
             <td>${unit[1].modelo}</td>
             <td>${unit[1].placa}</td>
             <td>${unit[1].año}</td>
             <td>${unit[1].verificacion}</td>
             <td>${unit[1].poliza}</td>
             <td>${unit[1].inciso}</td>
             <td>${unit[1].contacto}</td>     
             </tr>   
             </tbody>      
           </table>
    
           <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #b9e1ff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
           </div>
             `;
    
            d.getElementById("controlV").dataset.unit = unit[0];
    
            
    
               } 
              });
    
             },
           });
    
           await ajax({
             url: `${api.SUBITEMS1}.json`,
             method: "GET",
             cbSuccess: (conv) => {
             
              let convArray = Object.entries(conv);
              
              convArray.forEach(conv => {
             
               if(e.target.dataset.conveyance === conv[1].caja){
    
                 d.getElementById("controlModal").style.height = "45vh";
                 d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
                 <div class="container-fluid"> 
         
                    <table class="table table-sm" >
                    <thead class="table-dark text-center">
                      <tr class="text-wrap">
                      <th scope="col">CAJA</th>
                      <th scope="col">TIPO</th>
                      <th scope="col">MODELO</th>
                      <th scope="col">PLACA</th>
                      <th scope="col">AÑO</th>
                      <th scope="col">VERIFICACION</th>
                      <th scope="col">NO. POLIZA</th>
                      <th scope="col">INCISO</th>
                      <th scope="col">CONTACTO DEL SEGURO</th>
                      <th scope="col">CIRCUITO</th>
                      <th scope="col">FECHA</th>
                      <th scope="col">UBICACION</th> 
                      <th scope="col">ESTATUS</th>
                      </tr>
                    </thead>
                    <tbody class="text-center text-wrap" >
             <td>${conv[1].caja}</td>
             <td>${conv[1].tipo}</td>
             <td>${conv[1].modelo}</td>
             <td>${conv[1].placa}</td>
             <td>${conv[1].año}</td>
             <td>${conv[1].verificacion}</td>
             <td>${conv[1].poliza}</td>
             <td>${conv[1].inciso}</td>
             <td>${conv[1].contacto}</td>
             <td><input name="circuito" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
             <td><input name="ruta" style="background: #b9e1ff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
             <td><input name="ubicacion" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
             <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #b9e1ff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
             </tbody>      
                   </div>` 
           
               );
    
               d.getElementById("controlV").dataset.conveyance = conv[0];
                 
               }
             
             });
    
           
            
               
             }
    
           });
       
    
    
          }else
          if (e.target.matches(".tablero")) {
           clearInterval(updateData);
           window.location.hash = "/"+ user+"/productivo";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = true;
            localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.ITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
               //console.log(itemsArray)   
               renderTablePublic(newArray);
             },
           });
    
           d.getElementById("tablero").style.color = "#ffffffe8";
           d.getElementById("tablero").style.backgroundColor = "#10438e";
           d.getElementById("tablero").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
         }else
         if (e.target.matches(".equipov")) {
           clearInterval(updateData);
           window.location.hash = "/"+ user +"/equipov";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = true;
            localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.ITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
               //console.log(itemsArray)   
               renderTableEV(newArray);
             },
           });
    
           d.getElementById("equipov").style.color = "#ffffffe8";
           d.getElementById("equipov").style.backgroundColor = "#10438e";
           d.getElementById("equipov").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
         }else
         if (e.target.matches(".history")) {
           clearInterval(updateData);
           window.location.hash = "/"+user+"/history";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = true;
            localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.ITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
               //console.log(itemsArray)   
               renderTableHistory(newArray);
             },
           });
    
           d.getElementById("history").style.color = "#ffffffe8";
           d.getElementById("history").style.backgroundColor = "#10438e";
           d.getElementById("history").style.borderColor = "#094fb5";
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
         }else
         if (e.target.matches(".cajas")) {
           clearInterval(updateData);
           window.location.hash = "/"+user+"/cajas";
           localStorage.tabConveyance = true;
           localStorage.tabViajes = false;
         localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.SUBITEMS1}.json`,
             cbSuccess: (items) => {   
               newArray = items;
             //  console.log(newArray)   
              renderTableCV(newArray);
             },
           });
    
           d.getElementById("cajas").style.color = "#ffffffe8";
           d.getElementById("cajas").style.backgroundColor = "#10438e";
           d.getElementById("cajas").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
           
         }else
         if (e.target.matches(".unidades")) {
           clearInterval(updateData);
           window.location.hash = "/"+user+"/unidades";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = false;
           localStorage.tabUnit = true;
    
    
           await ajax({
             url: `${api.SUBITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
         //      console.log(newArray);   
               renderTableUnits(newArray);
             },
           });
    
           d.getElementById("unidades").style.color = "#ffffffe8";
           d.getElementById("unidades").style.backgroundColor = "#10438e";
           d.getElementById("unidades").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
           
         }  else
         if (e.target.matches(".remolque")) {
          //  console.log(e.target);

          const tabConv = ()=> {
            //MODAL
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("formulario").classList.add("register");
          d.getElementById("formulario").classList.remove("edit");
          d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
          d.getElementById("exampleModalLabel").classList.add("convoy");
          d.getElementById("exampleModalLabel").classList.remove("convoy");
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap">
        <td><input name="caja" style="width: 35px;" type="text"></td>
        <td><input name="tipo" style="width: 60px;" type="text"></td>
        <td><input name="modelo" style="width: 130px;" type="text"></td>
        <td><input name="placa" style="width: 70px;" type="text"></td>
        <td><input name="año" style="width: 80px;" type="text"></td>
        <td><input name="verificacion" style="width: 75px;" type="text"></td>
        <td><input name="poliza" style="width: 75px;" type="text"></td>
        <td><input name="inciso" style="width: 95px;" type="text"></td>
        <td><input name="contacto" type="text" style="width: 80px;"></td>
        <td><input name="circuito" type="text"></td>
        <td><input name="fecha" type="date"></td>
        <td><input name="ubicacion" type="text"></td>
        <td><input name="comentarios" type="text"></td>  
        </tbody>
          
        </table>
        </div>
              `;
          };      

          tabConv();
          
        } else
        if (e.target.matches(".unidad")) {
          const tabUnit = ()=> {
            //MODAL
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("formulario").classList.add("register");
          d.getElementById("formulario").classList.remove("edit");
          d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
          d.getElementById("exampleModalLabel").classList.add("unit");
          d.getElementById("exampleModalLabel").classList.remove("convoy");
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">UNIDAD</th>
          <th scope="col">OPERADOR</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">CONTACTO DEL SEGURO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap">
        <td><input name="unidad" style="width: 35px;" type="text"></td>
        <td><input name="operador" style="width: 60px;" type="text"></td>
        <td><input name="modelo" style="width: 130px;" type="text"></td>
        <td><input name="placa" style="width: 70px;" type="text"></td>
        <td><input name="año" style="width: 80px;" type="text"></td>
        <td><input name="verificacion" style="width: 75px;" type="text"></td>
        <td><input name="poliza" style="width: 75px;" type="text"></td>
        <td><input name="inciso" style="width: 95px;" type="text"></td>
        <td><input name="contacto" type="text" style="width: 80px;"></td>
        <td><input name="circuito" type="text"></td>
        <td><input name="fecha" type="date"></td>
        <td><input name="ubicacion" type="text"></td>
        <td><input name="comentarios" type="text"></td>  
        </tbody>
          
        </table>
        </div>
              `;
          };

          tabUnit();
        }   else
          if(e.target.matches(".generar_xls")){
            //let $dataTable = d.getElementById("table_xls");
                generar_xls('table_xls', 'Reporte');
                location.reload();
     
          }
          return;
        });
     
         d.addEventListener("submit", async (e) => {
           e.preventDefault();
           clearInterval(updateData);
        // console.log(e.target);
         
        if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
          //console.log(e.target);
          let query = localStorage.getItem("apiSearch").toUpperCase();
    
         //console.log(query);
    
          let item = d.querySelectorAll(".item");
              item.forEach((e) => {
            //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
            if (!query) {
              e.classList.remove("filter");
              return false;
            } else if (
              e.dataset.unit.includes(query) ||
                e.dataset.box.includes(query) ||
                e.dataset.operador.includes(query) ||
                e.dataset.track.includes(query) ||
                e.dataset.ruta.includes(query) ||
                e.dataset.cliente.includes(query) ||
                e.dataset.proveedor.includes(query) ||
                e.dataset.citaprogramada.includes(query) ||
                e.dataset.status.includes(query)
            ) {
              e.classList.remove("filter");
            } else {
              e.classList.add("filter");
            }
                          });
          }
          else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
           //   console.log(e.target);
         let query = localStorage.getItem("apiSearch").toUpperCase();
    
           //  console.log(query);
    
         let item = d.querySelectorAll(".item");
             item.forEach((e) => {
           //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
           if (!query) {
             e.classList.remove("filter");
             return false;
           } 
           else if (e.dataset.conv.includes(query) ||
           e.dataset.circuito.includes(query) ||
           e.dataset.ubicacion.includes(query)
           ) {
             e.classList.remove("filter");
           } 
           else {
             e.classList.add("filter");
           }
                         });
          } 
          else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
       // console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();
    
        //console.log(query);
    
        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
        //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } 
          else if (e.dataset.unit.includes(query) ||
          e.dataset.circuito.includes(query) ||
          e.dataset.ubicacion.includes(query)
          ) {
            e.classList.remove("filter");
          } 
          else {
            e.classList.add("filter");
          }
                        });
          }  
           
          else if (e.target.matches(".register")) {
             //Create Register
            
    
             if (!e.target.id.value) {
    
              
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("-"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
              };
    
              let fecha = dateConvert(e.target.citaprogramada.value);
    
               let options = {
                 method: "POST",
                 headers: {
                   "Content-type": "application/json; charset=utf-8",
                 },
                 body: JSON.stringify({
                   unidad: e.target.unidad.value.toUpperCase(),
                   caja: e.target.caja.value.toUpperCase(),
                   cporte: e.target.cporte.value.toUpperCase(),
                   tracking: e.target.tracking.value.toUpperCase(),
                   bol: e.target.bol.value.toUpperCase(),
                   ruta: e.target.ruta.value.toUpperCase(),
                   operador: e.target.operador.value.toUpperCase(),
                   cliente: e.target.cliente.value.toUpperCase(),
                   proveedor: e.target.proveedor.value.toUpperCase(),
                   citaprogramada: fecha,
                   llegadareal: e.target.llegadareal.value,
                   salidareal: e.target.salidareal.value,
                   eta: e.target.eta.value,
                   llegadadestino: e.target.llegadadestino.value,
                   salidadestino: e.target.salidadestino.value,
                   llegada: e.target.llegada.value.toUpperCase(),
                   status: e.target.status.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                 }),
               };
             await ajax({
                 url: `${api.ITEMS}.json`,
                 options,
                 cbSuccess: (res) => {
                   json = res.json();
                 },
               });
               location.reload();
             }
             // console.log(e.target);
          } 
           
          else if (e.target.matches(".edit")) {
    
            if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
              if (!e.target.id.value) {
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                   circuito: e.target.circuito.value.toUpperCase(),
                   fecha: e.target.fecha.value.toUpperCase(),
                   ubicacion: e.target.ubicacion.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                  url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                  },
                });
                location.reload();
              }
            }    
            if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
              
              if (!e.target.id.value) {
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                   circuito: e.target.circuito.value.toUpperCase(),
                   fecha: e.target.fecha.value.toUpperCase(),
                   ubicacion: e.target.ubicacion.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                  url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                  },
                });
                location.reload();
              }
        
        
            } 
            else if(localStorage.tabViajes === "true") {
              if (!e.target.id.value) {
                const dateConvert = (date) => {
                  let hora = date.slice(11, 17),
                  arrF = date.slice(0,10).split("-"),
                   concatF ="";
                   
                   return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
                };
    
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                    unidad: e.target.unidad.value.toUpperCase(),
                    caja: e.target.caja.value.toUpperCase(),
                    cporte: e.target.cporte.value.toUpperCase(),
                    tracking: e.target.tracking.value.toUpperCase(),
                    bol: e.target.bol.value.toUpperCase(),
                    ruta: e.target.ruta.value.toUpperCase(),
                    operador: e.target.operador.value.toUpperCase(),
                    cliente: e.target.cliente.value.toUpperCase(),
                    proveedor: e.target.proveedor.value.toUpperCase(),
                   llegadaprogramada: e.target.llegadaprogramada.value,
                   llegadareal: dateConvert(e.target.llegadareal.value),
                   salidareal: dateConvert(e.target.salidareal.value),
                   eta: dateConvert(e.target.eta.value),
                   llegadadestino: dateConvert(e.target.llegadadestino.value),
                   salidadestino: dateConvert(e.target.salidadestino.value),
                   llegada: e.target.llegada.value.toUpperCase(),
                   status: e.target.status.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                   url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                 //   console.log(res);
                  },
                });
                location.reload();
              }
            }
              }
    
          else if (e.target.matches(".update")) {
              //console.log(e.target);
    
            //UPDATE
             //console.log(e.target.textarea[0].value.toUpperCase());
             //console.log(e.target.textarea[1].value.toUpperCase());
    
             let keyUnit = d.getElementById("controlV").dataset.unit;
             let keyConv = d.getElementById("controlV").dataset.conveyance;
    
            // console.log(keyUnit);
    
             
             if (!e.target.id.value) {
             
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  comentarios: e.target.textarea.value.toUpperCase()
                }),
              };
    
                await ajax({
                   url: `${api.SUBITEMS}/${keyUnit}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                 },
              });
    
               options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    circuito: e.target.circuito.value.toUpperCase(),
                    ruta: e.target.ruta.value.toUpperCase(),
                    ubicacion: e.target.ubicacion.value.toUpperCase(),
                    comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
    
                await ajax({
                   url: `${api.SUBITEMS1}/${keyConv}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                 },
              });
    
                 location.reload();
            }
            
    
          }
    
              
         });
     
         d.addEventListener("keyup", (e) => {
           //  console.log(d.getElementById("ruta"));
           //limpiar busqueda
           let query = localStorage.getItem("apiSearch");
           if (e.key === "Escape") localStorage.removeItem("apiSearch");
           let item = d.querySelectorAll(".item");
           item.forEach((e) => {
             if (!query) {
               e.classList.remove("filter");
               return false;
             }
           });
         });
       }else
       if (hash === "#/" + user + "/equipov") {
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;
    
    
        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTableEV(newArray);
          },
        });
    
        const updateData = setInterval(  () => {
          
          ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {
              
                //console.log(Object.values(items));
                  listenItemsArray = Object.values(items);
                  let firstArray = Object.values(newArray);
                   // console.log(Object.entries(itemsArray).length);
    
                   if(listenItemsArray.length === firstArray.length){
    
                    
                      for (let i = 0; i < firstArray.length; i++) {
                        let e = firstArray[i];
                         let e2 = listenItemsArray[i];
                  
                       if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                        || e.unidad != e2.unidad || e.bol != e2.bol 
                        || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                        || e.cliente != e2.cliente || e.cporte != e2.cporte
                        || e.tracking != e2.tracking || e.llegada != e2.llegada
                        || e.status != e2.status || e.llegadareal != e2.llegadareal
                        || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                        || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                        ) {
                        //  console.log("UPDATE")
                        renderTableEV(items);
                         }
         
                       }
                     } 
                     else {
                     // console.log("UPDATE");
                     renderTableEV(items);
    
                      
                     }
    
    
                 
                 //console.log(listenItemsArray);
               }       
            })
    
        }, 5000);
           
        updateData;
    
        d.getElementById("equipov").style.color = "#ffffffe8";
        d.getElementById("equipov").style.backgroundColor = "#10438e";
        d.getElementById("equipov").style.borderColor = "#094fb5";
    
        d.getElementById("history").style.color = "";
        d.getElementById("history").style.backgroundColor = "";
        d.getElementById("history").style.borderColor = "";
    
        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
    
        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";
    
        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
    
        
        d.getElementById('excelFileInput').addEventListener('change', e => {
       
          if(e.target.matches("#excelFileInput")){
          //  console.log(e.target); 
               handleFile(e);            
          }
           
       });
    
       d.addEventListener("click", async (e) => {    
        //console.log(e.target);
       //LEER CSV / XLS
       let date = new Date;
       if (e.target.matches(".importModal")) {
         clearInterval(updateData);
       }else
       if(e.target.matches(".importXlsx")){
    
    
         dbXlsx.forEach((item)=>{
           // console.log(item);
         let hora = item[3].slice(11, 17),
             arrF = item[3].slice(1,-6).split("/"),
              concatF ="";
              item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
          });
    
          
               // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
           dbXlsx.forEach(async (element) => {
              //  console.log(element[1]);
    
       if (element[1].match("24") || element[1].match("HS")) {
           //console.log(element[1]);
          
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: "",
               caja: "",
               cporte: "",
               tracking: `${element[0]}`,
               bol: "",
               ruta: `${element[1]}`,
               operador: "",
               cliente: "FORD HERMOSILLO",
               proveedor: `${element[2]}`,
               citaprogramada: `${element[3]}`,
               llegadareal: "01/01/0001 00:00",
               salidareal: "01/01/0001 00:00",
               eta: "01/01/0001 00:00",
               llegadadestino: "01/01/0001 00:00",
               salidadestino: "01/01/0001 00:00",
               llegada: "EN TIEMPO",
               status: "PENDIENTE",
               comentarios: "SIN COMENTARIOS"
             }),
           };
           await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
           });
               
    
       } else 
       if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
         
           //console.log(element[1]);
    
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: "",
               caja: "",
               cporte: "",
               tracking: `${element[0]}`,
               bol: "",
               ruta: `${element[1]}`,
               operador: "",
               cliente: "FORD CUAUTITLAN",
               proveedor: `${element[2]}`,
               citaprogramada: `${element[3]}`,
               llegadareal: "01/01/0001 00:00",
               salidareal: "01/01/0001 00:00",
               eta: "01/01/0001 00:00",
               llegadadestino: "01/01/0001 00:00",
               salidadestino: "01/01/0001 00:00",
               llegada: "EN TIEMPO",
               status: "PENDIENTE",
               comentarios: "SIN COMENTARIOS"
             }),
           };
           await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             }
           });
               
       }
         setTimeout(() => {
           location.reload();
         }, 3000);
    
            });
            
        }else
        //GENERAR REPORTE XLS 
        if (e.target.matches(".modal_xls")){
         if(localStorage.tabViajes === "true"){
           clearInterval(updateData);
    
        d.querySelector(".export-modal-body").innerHTML = `
          <section id="thtable" class="thtable">
          <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">UNIDAD</th>
          <th scope="col">CAJA</th>
          <th scope="col">OPERADOR</th>
          <th scope="col">C.PORTE</th>
          <th scope="col">TRACKING</th>
          <th scope="col">BOL / SHIPPER</th>
          <th scope="col">RUTA</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">PROVEEDOR</th>
          <th scope="col">CITA PROGRAMADA</th>
          <th scope="col">LLEGADA REAL</th>
          <th scope="col">SALIDA REAL</th>
          <th scope="col">ETA</th>
          <th scope="col">LLEGADA A DESTINO</th>
          <th scope="col">SALIDA A DESTINO</th>
          <th scope="col">LLEGADA</th>
          <th scope="col">ESTATUS</th>
          <th scope="col">COMENTARIOS</th>  
          </tr>
          </thead>
          <tbody id="table_bodyX" class="body_table">
          </tbody>     
          </table>
          </section>
          `;
    
           //Helper de acceso a los items
             const $tr = d.querySelectorAll(".item");
             const lisTr = Array.from($tr);
         
             lisTr.forEach((e) => {
              if(e.classList[5] === "filter"){
               return
              }
              d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
             });
     
             d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
         } else {
           location.reload();
         }
         
        
        }else
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
         location.reload();
       }else
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
         // console.log(e.target);
    
          let isConfirm = confirm("¿Eliminar Registro?");
    
          if (isConfirm) {
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
              options: {
                method: "DELETE",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
              },
              cbSuccess: (res) => {
                //console.log(res);
               
              },
            });
            location.reload();
          }
        }else
        if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
         clearInterval(updateData);
         const tabConv = (item) => {
    
          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font"> 
          <table class="table table-sm " >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th id="cajas" scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
          <th scope="col">VERIFICACION</th>
          <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
      <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
          <option value="${item.circuito}">${item.circuito}</option> 
          <option value="FORDC - HILEX">FORDC - HILEX</option>  
          <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
          <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
          <option value="FORDC - MUBEA">FORDC - MUBEA</option>
          <option value="FORDC - BROSE">FORDC - BROSE</option>
          <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
          <option value="FORDC - STANDAR">FORDC - STANDAR</option>
          <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
          <option value="FORDC - DHL">FORDC - DHL</option>
          <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
          <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
          <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
          <option value="FORDH - BROSE">FORDH - BROSE MX</option>
          <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
          <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
          <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
          <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
          <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
          <option value="AMAZON">AMAZON</option>
          <option value="BRP">BRP</option>
          <option value="GM">GM</option>
          <option value="ACTIVE ON D">ACTIVE ON D</option>
          <option value="FCA - NARMEX">FCA - NARMEX</option>
          <option value="FCA - TI GROUP">FCA - TI GROUP</option>
          <option value="FCA - WEBASTO">FCA - WEBASTO</option>
          <option value="FCA - TENNECO">FCA - TENNECO</option>
          </select>
      </td>
      <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
          <option value="${item.ubicacion}">${item.ubicacion}</option> 
          <option value="BP NORTE">BP NORTE</option>  
          <option value="BP SUR">BP SUR</option>
          <option value="BP CLOSURES">BP CLOSURES</option>
          <option value="BP TRIM">BP TRIM</option>
          <option value="BP CLC">BP CLC</option>
          <option value="FRAMING">FRAMING</option>
          <option value="PATIO RAMOS">PATIO RAMOS</option>
          <option value="PATIO MX">PATIO MX</option>
          <option value="PPATIO HMO">PATIO HMO</option>
          <option value="PATIO PEDRO E">PATIO PEDRO E</option>
          <option value="PATIO SILAO">PATIO SILAO</option>
          <option value="EN TRANSITO">EN TRANSITO</option>
          </select>
      </td>
      <td>      
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
        <option value="${item.comentarios}">${item.comentarios}</option> 
        <option value="CARGADA MP">CARGADA MP</option>  
        <option value="PARCIAL">PARCIAL</option>
        <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
        <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
        <option value="VACIA">VACIA</option>
        <option value="DAÑADA">DAÑADA</option>
        <option value="MANTENIMIENTO">MANTENIMIENTO</option>
        <option value="DISPONIBLE">DISPONIBLE</option>
        </select>
      </td>  
      </tbody>
      
    </table>
    </div>
          `;
        }
    
        const tabUnit = (item) => {
    
          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option> 
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
      </td>
      <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
          <option value="${item.ubicacion}">${item.ubicacion}</option> 
          <option value="BP NORTE">BP NORTE</option>  
          <option value="BP SUR">BP SUR</option>
          <option value="BP CLOSURES">BP CLOSURES</option>
          <option value="BP TRIM">BP TRIM</option>
          <option value="BP CLC">BP CLC</option>
          <option value="FRAMING">FRAMING</option>
          <option value="PATIO RAMOS">PATIO RAMOS</option>
          <option value="PATIO MX">PATIO MX</option>
          <option value="PATIO HMO">PATIO HMO</option>
          <option value="PATIO PEDRO E">PATIO PEDRO E</option>
          <option value="PATIO SILAO">PATIO SILAO</option>
          <option value="EN TRANSITO">EN TRANSITO</option>
          </select>
      </td>
      <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }
    
    
         //  console.log();
         if(localStorage.tabViajes === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("/"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
              };
    
              d.getElementById("formulario").classList.add("edit");
              d.getElementById("formulario").classList.remove("register");
              d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
              d.querySelector(".modal-body").innerHTML = `
                  <div class="container-fluid font" style="padding: 0;"> 
                  <table class="table table-sm" >
              <thead class="table-dark text-center">
                <tr class="text-wrap">
                <th scope="col">UNIDAD</th>
                <th scope="col">CAJA</th>
                <th scope="col">OPERADOR</th>
                <th scope="col">C.PORTE</th>
                <th scope="col">TRACKING</th>
                <th scope="col">BOL / SHIPPER</th>
                <th scope="col">RUTA</th>
                <th scope="col">CLIENTE</th>
                <th scope="col">PROVEEDOR</th>
                <th scope="col">CITA PROGRAMADA</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
                <th scope="col">LLEGADA</th>
                <th scope="col">ESTATUS</th>
                <th scope="col">COMENTARIOS</th>
                
            
                </tr>
              </thead>
              <tbody class="text-center text-wrap">
              <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
              <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
              <option value="${item.operador}">${item.operador}</option> 
              <option value="ASIGNAR">ASIGNAR</option>
              <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
              <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
              <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
              <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
              <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
              <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
              <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
              <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
              <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
              <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
              <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
              <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
              <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
              <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
              <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
              <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
              <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
              <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
              <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
              <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
              <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
              <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
              <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
              <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
              <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
              <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
              <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
              <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
              <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
              <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
              <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
              <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
              <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
              <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
              <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
              <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
              <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
              <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
              <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
              <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
              <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
              <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
              <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
              <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
              <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
              <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
              <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
              <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
              <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
              <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
              <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
              <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
              <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
              <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
              <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
              <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
              <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
              <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
              <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
              </select>
              </td>
              <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
              <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
              <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
              <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" disabled required></td>
              <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
              <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
              <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
              <option value="${item.llegada}">${item.llegada}</option> 
              <option value="A TIEMPO">A TIEMPO</option>  
              <option value="TARDE">TARDE</option>
              <option value="DESFASADA">DESFASADA</option>
              <option value="CRITICA">CRITICA</option>
              </select>
              </td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
              <option value="${item.status}">${item.status}</option> 
              <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
              <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
              <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
              <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
              <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
              <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
              <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
              <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
              <option value="TRANSITO A GM">TRANSITO A GM</option>
              <option value="TRANSITO A BRP">TRANSITO A BRP</option>
              <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
              <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
              <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
              <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
              <option value="DETENIDO">DETENIDO</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CARGANDO">CARGANDO</option>
              <option value="DESCARGANDO">DESCARGANDO</option>
              <option value="EN ESPERA">EN ESPERA</option>
              <option value="DRY RUN">DRY RUN</option>
              <option value="BROKEREADO">BROKEREADO</option>
              <option value="TONU">TONU</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="COMPLETO">COMPLETO</option>
              </td>
              <td>
              <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
              </td>    
              </tbody>
              
            </table>
            </div>
                  `;
            },
          });
         }
          if(localStorage.tabConveyance === "true"){
           d.querySelector(".hidden").style.display = "block";
           d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           await ajax({
             url: `${api.SUBITEMS1}/${e.target.id}.json`,
             method: "GET",
             cbSuccess: (item) => {
               // console.log(item);
               tabConv(item);
             },
           });
          }
          if(localStorage.tabUnit === "true"){
           d.querySelector(".hidden").style.display = "block";
           d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         
           await ajax({
             url: `${api.SUBITEMS}/${e.target.id}.json`,
             method: "GET",
             cbSuccess: (item) => {
               // console.log(item);
               tabUnit(item);
             },
           });
    
          }
    
        }else
        if (e.target.matches(".control") || e.target.matches(".fa-car")) {
         // console.log(e.target);
    
       
         await ajax({
           url: `${api.SUBITEMS}.json`,
           method: "GET",
           cbSuccess: (unit) => {
          
            // console.log(e.target);
            let unitArray = Object.entries(unit);
            
    
            unitArray.forEach(unit => {
             if(e.target.id === unit[1].unidad){
    
               d.getElementById("controlModal").style.height = "60vh";
             d.querySelector(".control-modal-body").innerHTML = `
           <div class="container-fluid"> 
           <table class="table table-sm" >
           <thead class="table-dark text-center">
             <tr class="text-wrap">
               <th scope="col">UNIDAD</th>
               <th scope="col">OPERADOR</th>
               <th scope="col">MODELO</th>
               <th scope="col">PLACA</th>
               <th scope="col">AÑO</th>
               <th scope="col">VERIFICACION</th>
               <th scope="col">NO. POLIZA</th>
               <th scope="col">INCISO</th>
               <th scope="col">CONTACTO DEL SEGURO</th> 
             </tr>
           </thead>
           <tbody class="text-center" class="text-wrap">
           <tr>
           <td>${unit[1].unidad}</td>
           <td>${unit[1].operador}</td>
           <td>${unit[1].modelo}</td>
           <td>${unit[1].placa}</td>
           <td>${unit[1].año}</td>
           <td>${unit[1].verificacion}</td>
           <td>${unit[1].poliza}</td>
           <td>${unit[1].inciso}</td>
           <td>${unit[1].contacto}</td>     
           </tr>   
           </tbody>      
         </table>
    
         <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #b9e1ff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
         </div>
           `;
    
          d.getElementById("controlV").dataset.unit = unit[0];
    
          
    
             } 
            });
    
           },
         });
    
         await ajax({
           url: `${api.SUBITEMS1}.json`,
           method: "GET",
           cbSuccess: (conv) => {
           
            let convArray = Object.entries(conv);
            
            convArray.forEach(conv => {
           
             if(e.target.dataset.conveyance === conv[1].caja){
    
               d.getElementById("controlModal").style.height = "45vh";
               d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
               <div class="container-fluid"> 
       
                  <table class="table table-sm" >
                  <thead class="table-dark text-center">
                    <tr class="text-wrap">
                    <th scope="col">CAJA</th>
                    <th scope="col">TIPO</th>
                    <th scope="col">MODELO</th>
                    <th scope="col">PLACA</th>
                    <th scope="col">AÑO</th>
                    <th scope="col">VERIFICACION</th>
                    <th scope="col">NO. POLIZA</th>
                    <th scope="col">INCISO</th>
                    <th scope="col">CONTACTO DEL SEGURO</th>
                    <th scope="col">CIRCUITO</th>
                    <th scope="col">FECHA</th>
                    <th scope="col">UBICACION</th> 
                    <th scope="col">ESTATUS</th>
                    </tr>
                  </thead>
                  <tbody class="text-center text-wrap" >
           <td>${conv[1].caja}</td>
           <td>${conv[1].tipo}</td>
           <td>${conv[1].modelo}</td>
           <td>${conv[1].placa}</td>
           <td>${conv[1].año}</td>
           <td>${conv[1].verificacion}</td>
           <td>${conv[1].poliza}</td>
           <td>${conv[1].inciso}</td>
           <td>${conv[1].contacto}</td>
           <td><input name="circuito" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
           <td><input name="ruta" style="background: #b9e1ff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
           <td><input name="ubicacion" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
           <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #b9e1ff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
           </tbody>      
                 </div>` 
         
             );
    
             d.getElementById("controlV").dataset.conveyance = conv[0];
               
             }
           
           });
    
         
          
             
           }
    
         });
     
    
    
        }else
        if (e.target.matches(".tablero")) {
         clearInterval(updateData);
         window.location.hash = "/"+ user+"/productivo";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTablePublic(newArray);
           },
         });
    
         d.getElementById("tablero").style.color = "#ffffffe8";
         d.getElementById("tablero").style.backgroundColor = "#10438e";
         d.getElementById("tablero").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".equipov")) {
         clearInterval(updateData);
         window.location.hash = "/"+ user +"/equipov";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTableEV(newArray);
           },
         });
    
         d.getElementById("equipov").style.color = "#ffffffe8";
         d.getElementById("equipov").style.backgroundColor = "#10438e";
         d.getElementById("equipov").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".history")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/history";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTableHistory(newArray);
           },
         });
    
         d.getElementById("history").style.color = "#ffffffe8";
         d.getElementById("history").style.backgroundColor = "#10438e";
         d.getElementById("history").style.borderColor = "#094fb5";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".cajas")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/cajas";
         localStorage.tabConveyance = true;
         localStorage.tabViajes = false;
       localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.SUBITEMS1}.json`,
           cbSuccess: (items) => {   
             newArray = items;
           //  console.log(newArray)   
            renderTableCV(newArray);
           },
         });
    
         d.getElementById("cajas").style.color = "#ffffffe8";
         d.getElementById("cajas").style.backgroundColor = "#10438e";
         d.getElementById("cajas").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
         
       }else
       if (e.target.matches(".unidades")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/unidades";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = false;
         localStorage.tabUnit = true;
    
    
         await ajax({
           url: `${api.SUBITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
       //      console.log(newArray);   
             renderTableUnits(newArray);
           },
         });
    
         d.getElementById("unidades").style.color = "#ffffffe8";
         d.getElementById("unidades").style.backgroundColor = "#10438e";
         d.getElementById("unidades").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
         
       }  else
       if (e.target.matches(".remolque")) {
        //  console.log(e.target);

        const tabConv = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
        d.getElementById("exampleModalLabel").classList.add("convoy");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="caja" style="width: 35px;" type="text"></td>
      <td><input name="tipo" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };      

        tabConv();
        
      }
      if (e.target.matches(".unidad")) {
        const tabUnit = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
        d.getElementById("exampleModalLabel").classList.add("unit");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="unidad" style="width: 35px;" type="text"></td>
      <td><input name="operador" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };

        tabUnit();
      }   else
        if(e.target.matches(".generar_xls")){
          //let $dataTable = d.getElementById("table_xls");
              generar_xls('table_xls', 'Reporte');
              location.reload();
    
        }
        return;
      });
    
       d.addEventListener("submit", async (e) => {
         e.preventDefault();
         clearInterval(updateData);
      // console.log(e.target);
       
      if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
        //console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();
    
       //console.log(query);
    
        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
          //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } else if (
            e.dataset.unit.includes(query) ||
              e.dataset.box.includes(query) ||
              e.dataset.operador.includes(query) ||
              e.dataset.track.includes(query) ||
              e.dataset.ruta.includes(query) ||
              e.dataset.cliente.includes(query) ||
              e.dataset.proveedor.includes(query) ||
              e.dataset.citaprogramada.includes(query) ||
              e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
         //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
    
         //  console.log(query);
    
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
         //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
     // console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
    
      //console.log(query);
    
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
          e.classList.add("filter");
        }
                      });
        }  
         
        else if (e.target.matches(".register")) {
           //Create Register
          
    
           if (!e.target.id.value) {
    
            
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("-"),
               concatF ="";
               
               return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
            };
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: e.target.unidad.value.toUpperCase(),
                 caja: e.target.caja.value.toUpperCase(),
                 cporte: e.target.cporte.value.toUpperCase(),
                 tracking: e.target.tracking.value.toUpperCase(),
                 bol: e.target.bol.value.toUpperCase(),
                 ruta: e.target.ruta.value.toUpperCase(),
                 operador: e.target.operador.value.toUpperCase(),
                 cliente: e.target.cliente.value.toUpperCase(),
                 proveedor: e.target.proveedor.value.toUpperCase(),
                 citaprogramada: dateConvert(e.target.citaprogramada.value),
                 llegadareal: e.target.llegadareal.value,
                 salidareal: e.target.salidareal.value,
                 eta: e.target.eta.value,
                 llegadadestino: e.target.llegadadestino.value,
                 salidadestino: e.target.salidadestino.value,
                 llegada: e.target.llegada.value.toUpperCase(),
                 status: e.target.status.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
           await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               },
             });
             location.reload();
           }
           // console.log(e.target);
        } 
         
        else if (e.target.matches(".edit")) {
    
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
          }    
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
            
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
      
      
          } 
          else if(localStorage.tabViajes === "true") {
            if (!e.target.id.value) {
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("-"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
              };
    
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  unidad: e.target.unidad.value.toUpperCase(),
                  caja: e.target.caja.value.toUpperCase(),
                  cporte: e.target.cporte.value.toUpperCase(),
                  tracking: e.target.tracking.value.toUpperCase(),
                  bol: e.target.bol.value.toUpperCase(),
                  ruta: e.target.ruta.value.toUpperCase(),
                  operador: e.target.operador.value.toUpperCase(),
                  cliente: e.target.cliente.value.toUpperCase(),
                  proveedor: e.target.proveedor.value.toUpperCase(),
                 llegadaprogramada: e.target.llegadaprogramada.value,
                 llegadareal: dateConvert(e.target.llegadareal.value),
                 salidareal: dateConvert(e.target.salidareal.value),
                 eta: dateConvert(e.target.eta.value),
                 llegadadestino: dateConvert(e.target.llegadadestino.value),
                 salidadestino: dateConvert(e.target.salidadestino.value),
                 llegada: e.target.llegada.value.toUpperCase(),
                 status: e.target.status.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                 url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
               //   console.log(res);
                },
              });
              location.reload();
            }
          }
            }
    
        else if (e.target.matches(".update")) {
            //console.log(e.target);
    
          //UPDATE
           //console.log(e.target.textarea[0].value.toUpperCase());
           //console.log(e.target.textarea[1].value.toUpperCase());
    
           let keyUnit = d.getElementById("controlV").dataset.unit;
           let keyConv = d.getElementById("controlV").dataset.conveyance;
    
          // console.log(keyUnit);
    
           
           if (!e.target.id.value) {
           
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                comentarios: e.target.textarea.value.toUpperCase()
              }),
            };
    
              await ajax({
                 url: `${api.SUBITEMS}/${keyUnit}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
               },
            });
    
             options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                  circuito: e.target.circuito.value.toUpperCase(),
                  ruta: e.target.ruta.value.toUpperCase(),
                  ubicacion: e.target.ubicacion.value.toUpperCase(),
                  comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
    
              await ajax({
                 url: `${api.SUBITEMS1}/${keyConv}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
               },
            });
    
               location.reload();
          }
          
    
        }
    
            
       });
    
       d.addEventListener("keyup", (e) => {
         //  console.log(d.getElementById("ruta"));
         //limpiar busqueda
         let query = localStorage.getItem("apiSearch");
         if (e.key === "Escape") localStorage.removeItem("apiSearch");
         let item = d.querySelectorAll(".item");
         item.forEach((e) => {
           if (!query) {
             e.classList.remove("filter");
             return false;
           }
         });
       });
       } else
       if (hash === "#/" + user + "/history") {
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;
    
    
        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTableHistory(newArray);
          },
        });
    
        const updateData = setInterval(  () => {
          
          ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {
              
                //console.log(Object.values(items));
                  listenItemsArray = Object.values(items);
                  let firstArray = Object.values(newArray);
                   // console.log(Object.entries(itemsArray).length);
    
                   if(listenItemsArray.length === firstArray.length){
    
                    
                      for (let i = 0; i < firstArray.length; i++) {
                        let e = firstArray[i];
                         let e2 = listenItemsArray[i];
                  
                       if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                        || e.unidad != e2.unidad || e.bol != e2.bol 
                        || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                        || e.cliente != e2.cliente || e.cporte != e2.cporte
                        || e.tracking != e2.tracking || e.llegada != e2.llegada
                        || e.status != e2.status || e.llegadareal != e2.llegadareal
                        || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                        || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                        ) {
                        //  console.log("UPDATE")
                        renderTableHistory(items);
                         }
         
                       }
                     } 
                     else {
                     // console.log("UPDATE");
                     renderTableHistory(items);
    
                      
                     }
    
    
                 
                 //console.log(listenItemsArray);
               }       
            })
    
        }, 5000);
           
        updateData;
    
        d.getElementById("history").style.color = "#ffffffe8";
        d.getElementById("history").style.backgroundColor = "#10438e";
        d.getElementById("history").style.borderColor = "#094fb5";
    
        d.getElementById("equipov").style.color = "";
        d.getElementById("equipov").style.backgroundColor = "";
        d.getElementById("equipov").style.borderColor = "";
    
        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
    
        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";
    
        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
    
        
        d.getElementById('excelFileInput').addEventListener('change', e => {
       
          if(e.target.matches("#excelFileInput")){
          //  console.log(e.target); 
               handleFile(e);            
          }
           
       });
    
       d.addEventListener("click", async (e) => {    
        //console.log(e.target);
       //LEER CSV / XLS
       let date = new Date;
       if (e.target.matches(".importModal")) {
         clearInterval(updateData);
       }else
       if(e.target.matches(".importXlsx")){
    
    
         dbXlsx.forEach((item)=>{
           // console.log(item);
         let hora = item[3].slice(11, 17),
             arrF = item[3].slice(1,-6).split("/"),
              concatF ="";
              item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
          });
    
          
               // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
           dbXlsx.forEach(async (element) => {
              //  console.log(element[1]);
    
       if (element[1].match("24") || element[1].match("HS")) {
           //console.log(element[1]);
          
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: "",
               caja: "",
               cporte: "",
               tracking: `${element[0]}`,
               bol: "",
               ruta: `${element[1]}`,
               operador: "",
               cliente: "FORD HERMOSILLO",
               proveedor: `${element[2]}`,
               citaprogramada: `${element[3]}`,
               llegadareal: "01/01/0001 00:00",
               salidareal: "01/01/0001 00:00",
               eta: "01/01/0001 00:00",
               llegadadestino: "01/01/0001 00:00",
               salidadestino: "01/01/0001 00:00",
               llegada: "EN TIEMPO",
               status: "PENDIENTE",
               comentarios: "SIN COMENTARIOS"
             }),
           };
           await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
           });
               
    
       } else 
       if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
         
           //console.log(element[1]);
    
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: "",
               caja: "",
               cporte: "",
               tracking: `${element[0]}`,
               bol: "",
               ruta: `${element[1]}`,
               operador: "",
               cliente: "FORD CUAUTITLAN",
               proveedor: `${element[2]}`,
               citaprogramada: `${element[3]}`,
               llegadareal: "01/01/0001 00:00",
               salidareal: "01/01/0001 00:00",
               eta: "01/01/0001 00:00",
               llegadadestino: "01/01/0001 00:00",
               salidadestino: "01/01/0001 00:00",
               llegada: "EN TIEMPO",
               status: "PENDIENTE",
               comentarios: "SIN COMENTARIOS"
             }),
           };
           await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             }
           });
               
       }
         setTimeout(() => {
           location.reload();
         }, 3000);
    
            });
            
        }else
        //GENERAR REPORTE XLS 
        if (e.target.matches(".modal_xls")){
         if(localStorage.tabViajes === "true"){
           clearInterval(updateData);
    
        d.querySelector(".export-modal-body").innerHTML = `
          <section id="thtable" class="thtable">
          <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">UNIDAD</th>
          <th scope="col">CAJA</th>
          <th scope="col">OPERADOR</th>
          <th scope="col">C.PORTE</th>
          <th scope="col">TRACKING</th>
          <th scope="col">BOL / SHIPPER</th>
          <th scope="col">RUTA</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">PROVEEDOR</th>
          <th scope="col">CITA PROGRAMADA</th>
          <th scope="col">LLEGADA REAL</th>
          <th scope="col">SALIDA REAL</th>
          <th scope="col">ETA</th>
          <th scope="col">LLEGADA A DESTINO</th>
          <th scope="col">SALIDA A DESTINO</th>
          <th scope="col">LLEGADA</th>
          <th scope="col">ESTATUS</th>
          <th scope="col">COMENTARIOS</th>  
          </tr>
          </thead>
          <tbody id="table_bodyX" class="body_table">
          </tbody>     
          </table>
          </section>
          `;
    
           //Helper de acceso a los items
             const $tr = d.querySelectorAll(".item");
             const lisTr = Array.from($tr);
         
             lisTr.forEach((e) => {
              if(e.classList[5] === "filter"){
               return
              }
              d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
             });
     
             d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
         } else {
           location.reload();
         }
         
        
        }else
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
         location.reload();
       }else
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
         // console.log(e.target);
    
          let isConfirm = confirm("¿Eliminar Registro?");
    
          if (isConfirm) {
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
              options: {
                method: "DELETE",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
              },
              cbSuccess: (res) => {
                //console.log(res);
               
              },
            });
            location.reload();
          }
        }else
        if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
         clearInterval(updateData);
         const tabConv = (item) => {
    
          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font"> 
          <table class="table table-sm " >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th id="cajas" scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
          <th scope="col">VERIFICACION</th>
          <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
      <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
          <option value="${item.circuito}">${item.circuito}</option> 
          <option value="FORDC - HILEX">FORDC - HILEX</option>  
          <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
          <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
          <option value="FORDC - MUBEA">FORDC - MUBEA</option>
          <option value="FORDC - BROSE">FORDC - BROSE</option>
          <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
          <option value="FORDC - STANDAR">FORDC - STANDAR</option>
          <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
          <option value="FORDC - DHL">FORDC - DHL</option>
          <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
          <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
          <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
          <option value="FORDH - BROSE">FORDH - BROSE MX</option>
          <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
          <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
          <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
          <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
          <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
          <option value="AMAZON">AMAZON</option>
          <option value="BRP">BRP</option>
          <option value="GM">GM</option>
          <option value="ACTIVE ON D">ACTIVE ON D</option>
          <option value="FCA - NARMEX">FCA - NARMEX</option>
          <option value="FCA - TI GROUP">FCA - TI GROUP</option>
          <option value="FCA - WEBASTO">FCA - WEBASTO</option>
          <option value="FCA - TENNECO">FCA - TENNECO</option>
          </select>
      </td>
      <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
          <option value="${item.ubicacion}">${item.ubicacion}</option> 
          <option value="BP NORTE">BP NORTE</option>  
          <option value="BP SUR">BP SUR</option>
          <option value="BP CLOSURES">BP CLOSURES</option>
          <option value="BP TRIM">BP TRIM</option>
          <option value="BP CLC">BP CLC</option>
          <option value="FRAMING">FRAMING</option>
          <option value="PATIO RAMOS">PATIO RAMOS</option>
          <option value="PATIO MX">PATIO MX</option>
          <option value="PPATIO HMO">PATIO HMO</option>
          <option value="PATIO PEDRO E">PATIO PEDRO E</option>
          <option value="PATIO SILAO">PATIO SILAO</option>
          <option value="EN TRANSITO">EN TRANSITO</option>
          </select>
      </td>
      <td>      
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
        <option value="${item.comentarios}">${item.comentarios}</option> 
        <option value="CARGADA MP">CARGADA MP</option>  
        <option value="PARCIAL">PARCIAL</option>
        <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
        <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
        <option value="VACIA">VACIA</option>
        <option value="DAÑADA">DAÑADA</option>
        <option value="MANTENIMIENTO">MANTENIMIENTO</option>
        <option value="DISPONIBLE">DISPONIBLE</option>
        </select>
      </td>  
      </tbody>
      
    </table>
    </div>
          `;
        }
    
        const tabUnit = (item) => {
    
          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option> 
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
      </td>
      <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
          <option value="${item.ubicacion}">${item.ubicacion}</option> 
          <option value="BP NORTE">BP NORTE</option>  
          <option value="BP SUR">BP SUR</option>
          <option value="BP CLOSURES">BP CLOSURES</option>
          <option value="BP TRIM">BP TRIM</option>
          <option value="BP CLC">BP CLC</option>
          <option value="FRAMING">FRAMING</option>
          <option value="PATIO RAMOS">PATIO RAMOS</option>
          <option value="PATIO MX">PATIO MX</option>
          <option value="PATIO HMO">PATIO HMO</option>
          <option value="PATIO PEDRO E">PATIO PEDRO E</option>
          <option value="PATIO SILAO">PATIO SILAO</option>
          <option value="EN TRANSITO">EN TRANSITO</option>
          </select>
      </td>
      <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }
    
    
         //  console.log();
         if(localStorage.tabViajes === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("/"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
              };
    
              d.getElementById("formulario").classList.add("edit");
              d.getElementById("formulario").classList.remove("register");
              d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
              d.querySelector(".modal-body").innerHTML = `
                  <div class="container-fluid font" style="padding: 0;"> 
                  <table class="table table-sm" >
              <thead class="table-dark text-center">
                <tr class="text-wrap">
                <th scope="col">UNIDAD</th>
                <th scope="col">CAJA</th>
                <th scope="col">OPERADOR</th>
                <th scope="col">C.PORTE</th>
                <th scope="col">TRACKING</th>
                <th scope="col">BOL / SHIPPER</th>
                <th scope="col">RUTA</th>
                <th scope="col">CLIENTE</th>
                <th scope="col">PROVEEDOR</th>
                <th scope="col">CITA PROGRAMADA</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
                <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
                <th scope="col">LLEGADA</th>
                <th scope="col">ESTATUS</th>
                <th scope="col">COMENTARIOS</th>
                
            
                </tr>
              </thead>
              <tbody class="text-center text-wrap">
              <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
              <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
              <option value="${item.operador}">${item.operador}</option> 
              <option value="ASIGNAR">ASIGNAR</option>
              <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
              <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
              <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
              <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
              <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
              <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
              <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
              <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
              <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
              <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
              <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
              <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
              <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
              <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
              <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
              <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
              <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
              <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
              <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
              <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
              <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
              <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
              <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
              <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
              <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
              <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
              <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
              <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
              <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
              <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
              <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
              <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
              <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
              <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
              <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
              <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
              <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
              <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
              <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
              <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
              <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
              <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
              <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
              <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
              <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
              <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
              <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
              <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
              <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
              <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
              <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
              <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
              <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
              <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
              <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
              <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
              <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
              <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
              <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
              </select>
              </td>
              <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
              <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
              <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
              <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" disabled required></td>
              <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
              <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
              <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour"  value="${item.citaprogramada}" disabled></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
              <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
              <option value="${item.llegada}">${item.llegada}</option> 
              <option value="A TIEMPO">A TIEMPO</option>  
              <option value="TARDE">TARDE</option>
              <option value="DESFASADA">DESFASADA</option>
              <option value="CRITICA">CRITICA</option>
              </select>
              </td>
              <td>
              <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
              <option value="${item.status}">${item.status}</option> 
              <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
              <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
              <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
              <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
              <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
              <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
              <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
              <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
              <option value="TRANSITO A GM">TRANSITO A GM</option>
              <option value="TRANSITO A BRP">TRANSITO A BRP</option>
              <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
              <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
              <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
              <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
              <option value="DETENIDO">DETENIDO</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="CARGANDO">CARGANDO</option>
              <option value="DESCARGANDO">DESCARGANDO</option>
              <option value="EN ESPERA">EN ESPERA</option>
              <option value="DRY RUN">DRY RUN</option>
              <option value="BROKEREADO">BROKEREADO</option>
              <option value="TONU">TONU</option>
              <option value="CANCELADO">CANCELADO</option>
              <option value="COMPLETO">COMPLETO</option>
              </td>
              <td>
              <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
              </td>    
              </tbody>
              
            </table>
            </div>
                  `;
            },
          });
         }
          if(localStorage.tabConveyance === "true"){
           d.querySelector(".hidden").style.display = "block";
           d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           await ajax({
             url: `${api.SUBITEMS1}/${e.target.id}.json`,
             method: "GET",
             cbSuccess: (item) => {
               // console.log(item);
               tabConv(item);
             },
           });
          }
          if(localStorage.tabUnit === "true"){
           d.querySelector(".hidden").style.display = "block";
           d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         
           await ajax({
             url: `${api.SUBITEMS}/${e.target.id}.json`,
             method: "GET",
             cbSuccess: (item) => {
               // console.log(item);
               tabUnit(item);
             },
           });
    
          }
    
        }else
        if (e.target.matches(".control") || e.target.matches(".fa-car")) {
         // console.log(e.target);
    
       
         await ajax({
           url: `${api.SUBITEMS}.json`,
           method: "GET",
           cbSuccess: (unit) => {
          
            // console.log(e.target);
            let unitArray = Object.entries(unit);
            
    
            unitArray.forEach(unit => {
             if(e.target.id === unit[1].unidad){
    
               d.getElementById("controlModal").style.height = "60vh";
             d.querySelector(".control-modal-body").innerHTML = `
           <div class="container-fluid"> 
           <table class="table table-sm" >
           <thead class="table-dark text-center">
             <tr class="text-wrap">
               <th scope="col">UNIDAD</th>
               <th scope="col">OPERADOR</th>
               <th scope="col">MODELO</th>
               <th scope="col">PLACA</th>
               <th scope="col">AÑO</th>
               <th scope="col">VERIFICACION</th>
               <th scope="col">NO. POLIZA</th>
               <th scope="col">INCISO</th>
               <th scope="col">CONTACTO DEL SEGURO</th> 
             </tr>
           </thead>
           <tbody class="text-center" class="text-wrap">
           <tr>
           <td>${unit[1].unidad}</td>
           <td>${unit[1].operador}</td>
           <td>${unit[1].modelo}</td>
           <td>${unit[1].placa}</td>
           <td>${unit[1].año}</td>
           <td>${unit[1].verificacion}</td>
           <td>${unit[1].poliza}</td>
           <td>${unit[1].inciso}</td>
           <td>${unit[1].contacto}</td>     
           </tr>   
           </tbody>      
         </table>
    
         <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #b9e1ff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
         </div>
           `;
    
          d.getElementById("controlV").dataset.unit = unit[0];
    
          
    
             } 
            });
    
           },
         });
    
         await ajax({
           url: `${api.SUBITEMS1}.json`,
           method: "GET",
           cbSuccess: (conv) => {
           
            let convArray = Object.entries(conv);
            
            convArray.forEach(conv => {
           
             if(e.target.dataset.conveyance === conv[1].caja){
    
               d.getElementById("controlModal").style.height = "45vh";
               d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
               <div class="container-fluid"> 
       
                  <table class="table table-sm" >
                  <thead class="table-dark text-center">
                    <tr class="text-wrap">
                    <th scope="col">CAJA</th>
                    <th scope="col">TIPO</th>
                    <th scope="col">MODELO</th>
                    <th scope="col">PLACA</th>
                    <th scope="col">AÑO</th>
                    <th scope="col">VERIFICACION</th>
                    <th scope="col">NO. POLIZA</th>
                    <th scope="col">INCISO</th>
                    <th scope="col">CONTACTO DEL SEGURO</th>
                    <th scope="col">CIRCUITO</th>
                    <th scope="col">FECHA</th>
                    <th scope="col">UBICACION</th> 
                    <th scope="col">ESTATUS</th>
                    </tr>
                  </thead>
                  <tbody class="text-center text-wrap" >
           <td>${conv[1].caja}</td>
           <td>${conv[1].tipo}</td>
           <td>${conv[1].modelo}</td>
           <td>${conv[1].placa}</td>
           <td>${conv[1].año}</td>
           <td>${conv[1].verificacion}</td>
           <td>${conv[1].poliza}</td>
           <td>${conv[1].inciso}</td>
           <td>${conv[1].contacto}</td>
           <td><input name="circuito" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
           <td><input name="ruta" style="background: #b9e1ff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
           <td><input name="ubicacion" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
           <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #b9e1ff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
           </tbody>      
                 </div>` 
         
             );
    
             d.getElementById("controlV").dataset.conveyance = conv[0];
               
             }
           
           });
    
         
          
             
           }
    
         });
     
    
    
        }else
        if (e.target.matches(".tablero")) {
         clearInterval(updateData);
         window.location.hash = "/"+ user+"/productivo";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTablePublic(newArray);
           },
         });
    
         d.getElementById("tablero").style.color = "#ffffffe8";
         d.getElementById("tablero").style.backgroundColor = "#10438e";
         d.getElementById("tablero").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".equipov")) {
         clearInterval(updateData);
         window.location.hash = "/"+ user +"/equipov";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTableEV(newArray);
           },
         });
    
         d.getElementById("equipov").style.color = "#ffffffe8";
         d.getElementById("equipov").style.backgroundColor = "#10438e";
         d.getElementById("equipov").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".history")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/history";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTableHistory(newArray);
           },
         });
    
         d.getElementById("history").style.color = "#ffffffe8";
         d.getElementById("history").style.backgroundColor = "#10438e";
         d.getElementById("history").style.borderColor = "#094fb5";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".cajas")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/cajas";
         localStorage.tabConveyance = true;
         localStorage.tabViajes = false;
       localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.SUBITEMS1}.json`,
           cbSuccess: (items) => {   
             newArray = items;
           //  console.log(newArray)   
            renderTableCV(newArray);
           },
         });
    
         d.getElementById("cajas").style.color = "#ffffffe8";
         d.getElementById("cajas").style.backgroundColor = "#10438e";
         d.getElementById("cajas").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
         
       }else
       if (e.target.matches(".unidades")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/unidades";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = false;
         localStorage.tabUnit = true;
    
    
         await ajax({
           url: `${api.SUBITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
       //      console.log(newArray);   
             renderTableUnits(newArray);
           },
         });
    
         d.getElementById("unidades").style.color = "#ffffffe8";
         d.getElementById("unidades").style.backgroundColor = "#10438e";
         d.getElementById("unidades").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
         
       }  else
       if (e.target.matches(".remolque")) {
        //  console.log(e.target);

        const tabConv = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
        d.getElementById("exampleModalLabel").classList.add("convoy");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="caja" style="width: 35px;" type="text"></td>
      <td><input name="tipo" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };      

        tabConv();
        
      }
      if (e.target.matches(".unidad")) {
        const tabUnit = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
        d.getElementById("exampleModalLabel").classList.add("unit");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="unidad" style="width: 35px;" type="text"></td>
      <td><input name="operador" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };

        tabUnit();
      }   else
        if(e.target.matches(".generar_xls")){
          //let $dataTable = d.getElementById("table_xls");
              generar_xls('table_xls', 'Reporte');
              location.reload();
    
        }
        return;
      });
    
       d.addEventListener("submit", async (e) => {
         e.preventDefault();
         clearInterval(updateData);
      // console.log(e.target);
       
      if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
        //console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();
    
       //console.log(query);
    
        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
          //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } else if (
            e.dataset.unit.includes(query) ||
              e.dataset.box.includes(query) ||
              e.dataset.operador.includes(query) ||
              e.dataset.track.includes(query) ||
              e.dataset.ruta.includes(query) ||
              e.dataset.cliente.includes(query) ||
              e.dataset.proveedor.includes(query) ||
              e.dataset.citaprogramada.includes(query) ||
              e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
         //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
    
         //  console.log(query);
    
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
         //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
     // console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
    
      //console.log(query);
    
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
          e.classList.add("filter");
        }
                      });
        }  
         
        else if (e.target.matches(".register")) {
           //Create Register
          
    
           if (!e.target.id.value) {
    
            
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("-"),
               concatF ="";
               
               return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
            };
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: e.target.unidad.value.toUpperCase(),
                 caja: e.target.caja.value.toUpperCase(),
                 cporte: e.target.cporte.value.toUpperCase(),
                 tracking: e.target.tracking.value.toUpperCase(),
                 bol: e.target.bol.value.toUpperCase(),
                 ruta: e.target.ruta.value.toUpperCase(),
                 operador: e.target.operador.value.toUpperCase(),
                 cliente: e.target.cliente.value.toUpperCase(),
                 proveedor: e.target.proveedor.value.toUpperCase(),
                 citaprogramada: dateConvert(e.target.citaprogramada.value),
                 llegadareal: e.target.llegadareal.value,
                 salidareal: e.target.salidareal.value,
                 eta: e.target.eta.value,
                 llegadadestino: e.target.llegadadestino.value,
                 salidadestino: e.target.salidadestino.value,
                 llegada: e.target.llegada.value.toUpperCase(),
                 status: e.target.status.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
           await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               },
             });
             location.reload();
           }
           // console.log(e.target);
        } 
         
        else if (e.target.matches(".edit")) {
    
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
          }    
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
            
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
      
      
          } 
          else if(localStorage.tabViajes === "true") {
            if (!e.target.id.value) {
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("-"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
              };
    
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  unidad: e.target.unidad.value.toUpperCase(),
                  caja: e.target.caja.value.toUpperCase(),
                  cporte: e.target.cporte.value.toUpperCase(),
                  tracking: e.target.tracking.value.toUpperCase(),
                  bol: e.target.bol.value.toUpperCase(),
                  ruta: e.target.ruta.value.toUpperCase(),
                  operador: e.target.operador.value.toUpperCase(),
                  cliente: e.target.cliente.value.toUpperCase(),
                  proveedor: e.target.proveedor.value.toUpperCase(),
                 llegadaprogramada: e.target.llegadaprogramada.value,
                 llegadareal: dateConvert(e.target.llegadareal.value),
                 salidareal: dateConvert(e.target.salidareal.value),
                 eta: dateConvert(e.target.eta.value),
                 llegadadestino: dateConvert(e.target.llegadadestino.value),
                 salidadestino: dateConvert(e.target.salidadestino.value),
                 llegada: e.target.llegada.value.toUpperCase(),
                 status: e.target.status.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                 url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
               //   console.log(res);
                },
              });
              location.reload();
            }
          }
            }
    
        else if (e.target.matches(".update")) {
            //console.log(e.target);
    
          //UPDATE
           //console.log(e.target.textarea[0].value.toUpperCase());
           //console.log(e.target.textarea[1].value.toUpperCase());
    
           let keyUnit = d.getElementById("controlV").dataset.unit;
           let keyConv = d.getElementById("controlV").dataset.conveyance;
    
          // console.log(keyUnit);
    
           
           if (!e.target.id.value) {
           
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                comentarios: e.target.textarea.value.toUpperCase()
              }),
            };
    
              await ajax({
                 url: `${api.SUBITEMS}/${keyUnit}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
               },
            });
    
             options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                  circuito: e.target.circuito.value.toUpperCase(),
                  ruta: e.target.ruta.value.toUpperCase(),
                  ubicacion: e.target.ubicacion.value.toUpperCase(),
                  comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
    
              await ajax({
                 url: `${api.SUBITEMS1}/${keyConv}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
               },
            });
    
               location.reload();
          }
          
    
        }
    
            
       });
    
       d.addEventListener("keyup", (e) => {
         //  console.log(d.getElementById("ruta"));
         //limpiar busqueda
         let query = localStorage.getItem("apiSearch");
         if (e.key === "Escape") localStorage.removeItem("apiSearch");
         let item = d.querySelectorAll(".item");
         item.forEach((e) => {
           if (!query) {
             e.classList.remove("filter");
             return false;
           }
         });
       });
       }else
       if (hash === "#/" + user + "/cajas") { 
        localStorage.tabConveyance = true;
            localStorage.tabViajes = false;
          localStorage.tabUnit = false;
    
    
            await ajax({
              url: `${api.SUBITEMS1}.json`,
              cbSuccess: (items) => {   
                newArray = items;
              //  console.log(newArray)   
               renderTableCV(newArray);
              },
            });
    
            const updateData = setInterval(  () => {
          
              ajax({
                url: `${api.ITEMS}.json`,
                cbSuccess: (items) => {
                  
                    //console.log(Object.values(items));
                      listenItemsArray = Object.values(items);
                      let firstArray = Object.values(newArray);
                       // console.log(Object.entries(itemsArray).length);
        
                       if(listenItemsArray.length === firstArray.length){
        
                        
                          for (let i = 0; i < firstArray.length; i++) {
                            let e = firstArray[i];
                             let e2 = listenItemsArray[i];
                      
                           if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                            || e.unidad != e2.unidad || e.bol != e2.bol 
                            || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                            || e.cliente != e2.cliente || e.cporte != e2.cporte
                            || e.tracking != e2.tracking || e.llegada != e2.llegada
                            || e.status != e2.status || e.llegadareal != e2.llegadareal
                            || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                            || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                            ) {
                            //  console.log("UPDATE")
                            renderTableCV(items);
                             }
             
                           }
                         } 
                         else {
                         // console.log("UPDATE");
                         renderTableCV(items);
        
                          
                         }
        
        
                     
                     //console.log(listenItemsArray);
                   }       
                })
        
            }, 5000);
               
            updateData;
    
            d.getElementById("cajas").style.color = "#ffffffe8";
            d.getElementById("cajas").style.backgroundColor = "#10438e";
            d.getElementById("cajas").style.borderColor = "#094fb5";
    
            d.getElementById("history").style.color = "";
            d.getElementById("history").style.backgroundColor = "";
            d.getElementById("history").style.borderColor = "";
    
            d.getElementById("equipov").style.color = "";
            d.getElementById("equipov").style.backgroundColor = "";
            d.getElementById("equipov").style.borderColor = "";
    
            d.getElementById("tablero").style.color = "";
            d.getElementById("tablero").style.backgroundColor = "";
            d.getElementById("tablero").style.borderColor = "";
    
            d.getElementById("unidades").style.color = "";
            d.getElementById("unidades").style.backgroundColor = "";
            d.getElementById("unidades").style.borderColor = "";
    
            
          d.getElementById('excelFileInput').addEventListener('change', e => {
       
            if(e.target.matches("#excelFileInput")){
            //  console.log(e.target); 
                 handleFile(e);            
            }
             
         });
     
         d.addEventListener("click", async (e) => {    
          //console.log(e.target);
         //LEER CSV / XLS
         let date = new Date;
         if (e.target.matches(".importModal")) {
           clearInterval(updateData);
         }else
         if(e.target.matches(".importXlsx")){
    
    
           dbXlsx.forEach((item)=>{
             // console.log(item);
           let hora = item[3].slice(11, 17),
               arrF = item[3].slice(1,-6).split("/"),
                concatF ="";
                item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
            });
    
            
                 // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
             dbXlsx.forEach(async (element) => {
                //  console.log(element[1]);
    
         if (element[1].match("24") || element[1].match("HS")) {
             //console.log(element[1]);
            
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "FORD HERMOSILLO",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "EN TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               },
             });
                 
    
         } else 
         if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
           
             //console.log(element[1]);
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: "",
                 caja: "",
                 cporte: "",
                 tracking: `${element[0]}`,
                 bol: "",
                 ruta: `${element[1]}`,
                 operador: "",
                 cliente: "FORD CUAUTITLAN",
                 proveedor: `${element[2]}`,
                 citaprogramada: `${element[3]}`,
                 llegadareal: "01/01/0001 00:00",
                 salidareal: "01/01/0001 00:00",
                 eta: "01/01/0001 00:00",
                 llegadadestino: "01/01/0001 00:00",
                 salidadestino: "01/01/0001 00:00",
                 llegada: "EN TIEMPO",
                 status: "PENDIENTE",
                 comentarios: "SIN COMENTARIOS"
               }),
             };
             await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               }
             });
                 
         }
           setTimeout(() => {
             location.reload();
           }, 3000);
     
              });
              
          }else
          //GENERAR REPORTE XLS 
          if (e.target.matches(".modal_xls")){
           if(localStorage.tabViajes === "true"){
             clearInterval(updateData);
    
          d.querySelector(".export-modal-body").innerHTML = `
            <section id="thtable" class="thtable">
            <table class="table table-hover table-sm" id="table_xls">
            <thead class="table-dark text-center align-middle">
            <tr style="background-color:black; color:white;">
            <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
            </tr>
            <tr style="background-color:black; color:white;">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL / SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">PROVEEDOR</th>
            <th scope="col">CITA PROGRAMADA</th>
            <th scope="col">LLEGADA REAL</th>
            <th scope="col">SALIDA REAL</th>
            <th scope="col">ETA</th>
            <th scope="col">LLEGADA A DESTINO</th>
            <th scope="col">SALIDA A DESTINO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">COMENTARIOS</th>  
            </tr>
            </thead>
            <tbody id="table_bodyX" class="body_table">
            </tbody>     
            </table>
            </section>
            `;
    
             //Helper de acceso a los items
               const $tr = d.querySelectorAll(".item");
               const lisTr = Array.from($tr);
           
               lisTr.forEach((e) => {
                if(e.classList[5] === "filter"){
                 return
                }
                d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
               });
       
               d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
           } else {
             location.reload();
           }
           
          
          }else
          if (e.target.matches(".cancelXls") || e.target.matches(".report")){
           location.reload();
         }else
          if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
           // console.log(e.target);
    
            let isConfirm = confirm("¿Eliminar Registro?");
    
            if (isConfirm) {
             await ajax({
                url: `${api.ITEMS}/${e.target.id}.json`,
                options: {
                  method: "DELETE",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                },
                cbSuccess: (res) => {
                  //console.log(res);
                 
                },
              });
              location.reload();
            }
          }else
          if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
            // console.log(e.target);
   
            const tabConv = (item) => {
   
             d.getElementById("formulario").classList.add("edit");
             d.getElementById("formulario").classList.remove("register");
             d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
             d.querySelector(".modal-body").innerHTML = `
             <div class="container-fluid font"> 
             <table class="table table-sm " >
             <thead class="table-dark text-center">
             <tr class="text-wrap">
             <th id="cajas" scope="col">CAJA</th>
             <th scope="col">TIPO</th>
             <th scope="col">MODELO</th>
             <th scope="col">PLACA</th>
             <th scope="col">AÑO</th>
             <th scope="col">VERIFICACION</th>
             <th scope="col">NO. POLIZA</th>
             <th scope="col">INCISO</th>
             <th scope="col">MARCHAMO</th>
             <th scope="col">CIRCUITO</th>
             <th scope="col">FECHA</th>
             <th scope="col">UBICACION</th> 
             <th scope="col">ESTATUS</th>
       
           </tr>
         </thead>
         <tbody class="text-center text-wrap" >
         <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ></td>
         <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" ></td>
         <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ></td>
         <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ></td>
         <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ></td>
         <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
         <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ></td>
         <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ></td>
         <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ></td>
         <td>
         <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
             <option value="${item.circuito}">${item.circuito}</option> 
             <option value="FORDC - HILEX">FORDC - HILEX</option>  
             <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
             <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
             <option value="FORDC - MUBEA">FORDC - MUBEA</option>
             <option value="FORDC - BROSE">FORDC - BROSE</option>
             <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
             <option value="FORDC - STANDAR">FORDC - STANDAR</option>
             <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
             <option value="FORDC - DHL">FORDC - DHL</option>
             <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
             <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
             <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
             <option value="FORDH - BROSE">FORDH - BROSE MX</option>
             <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
             <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
             <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
             <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
             <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
             <option value="AMAZON">AMAZON</option>
             <option value="BRP">BRP</option>
             <option value="GM">GM</option>
             <option value="ACTIVE ON D">ACTIVE ON D</option>
             <option value="FCA - NARMEX">FCA - NARMEX</option>
             <option value="FCA - TI GROUP">FCA - TI GROUP</option>
             <option value="FCA - WEBASTO">FCA - WEBASTO</option>
             <option value="FCA - TENNECO">FCA - TENNECO</option>
             </select>
         </td>
         <td><input name="fecha" style="width: 90px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
         <td>
         <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
             <option value="${item.ubicacion}">${item.ubicacion}</option> 
             <option value="BP NORTE">BP NORTE</option>  
             <option value="BP SUR">BP SUR</option>
             <option value="BP CLOSURES">BP CLOSURES</option>
             <option value="BP TRIM">BP TRIM</option>
             <option value="BP CLC">BP CLC</option>
             <option value="FRAMING">FRAMING</option>
             <option value="PATIO RAMOS">PATIO RAMOS</option>
             <option value="PATIO MX">PATIO MX</option>
             <option value="PPATIO HMO">PATIO HMO</option>
             <option value="PATIO PEDRO E">PATIO PEDRO E</option>
             <option value="PATIO SILAO">PATIO SILAO</option>
             <option value="EN TRANSITO">EN TRANSITO</option>
             </select>
         </td>
         <td>      
           <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
           <option value="${item.comentarios}">${item.comentarios}</option> 
           <option value="CARGADA MP">CARGADA MP</option>  
           <option value="PARCIAL">PARCIAL</option>
           <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
           <option value="EV - FALTA SHIPPER>EV - FALTA SHIPPER</option>
           <option value="VACIA>VACIA</option>
           <option value="DAÑADA>DAÑADA</option>
           <option value="MANTENIMIENTO>MANTENIMIENTO</option>
           <option value="DISPONIBLE">DISPONIBLE</option>
           </select>
         </td>  
         </tbody>
         
       </table>
       </div>
             `;
           }
   
           const tabUnit = (item) => {
   
             d.getElementById("formulario").classList.add("edit");
             d.getElementById("formulario").classList.remove("register");
             d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
             d.querySelector(".modal-body").innerHTML = `
             <div class="container-fluid font"> 
             <table class="table table-sm" >
         <thead class="table-dark text-center">
           <tr class="text-wrap">
           <th scope="col">UNIDAD</th>
       <th scope="col">OPERADOR</th>
       <th scope="col">MODELO</th>
       <th scope="col">PLACA</th>
       <th scope="col">AÑO</th>
        <th scope="col">VERIFICACION</th>
        <th scope="col">NO. POLIZA</th>
       <th scope="col">INCISO</th>
       <th scope="col">KILOMETRAJE</th>
       <th scope="col">CIRCUITO</th>
       <th scope="col">FECHA</th>
       <th scope="col">UBICACION</th> 
       <th scope="col">ESTATUS</th>
   
           </tr>
         </thead>
         <tbody class="text-center text-wrap" >
         <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ></td>
         <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ></td>
         <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ></td>
         <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ></td>
         <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ></td>
         <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ></td>
         <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ></td>
         <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ></td>
         <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ></td>
         <td>
         <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
         <option value="${item.circuito}">${item.circuito}</option> 
         <option value="FORDC - HILEX">FORDC - HILEX</option>  
         <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
         <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
         <option value="FORDC - MUBEA">FORDC - MUBEA</option>
         <option value="FORDC - BROSE">FORDC - BROSE</option>
         <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
         <option value="FORDC - STANDAR">FORDC - STANDAR</option>
         <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
         <option value="FORDC - DHL">FORDC - DHL</option>
         <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
         <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
         <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
         <option value="FORDH - BROSE">FORDH - BROSE MX</option>
         <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
         <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
         <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
         <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
         <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
         <option value="AMAZON">AMAZON</option>
         <option value="BRP">BRP</option>
         <option value="GM">GM</option>
         <option value="ACTIVE ON D">ACTIVE ON D</option>
         <option value="FCA - NARMEX">FCA - NARMEX</option>
         <option value="FCA - TI GROUP">FCA - TI GROUP</option>
         <option value="FCA - WEBASTO">FCA - WEBASTO</option>
         <option value="FCA - TENNECO">FCA - TENNECO</option>
         </select>
         </td>
         <td><input name="fecha" style="width: 100px; background-color: #b9e1ff;" type="text"  value="${item.fecha}"></td>
         <td>
         <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
             <option value="${item.ubicacion}">${item.ubicacion}</option> 
             <option value="BP NORTE">BP NORTE</option>  
             <option value="BP SUR">BP SUR</option>
             <option value="BP CLOSURES">BP CLOSURES</option>
             <option value="BP TRIM">BP TRIM</option>
             <option value="BP CLC">BP CLC</option>
             <option value="FRAMING">FRAMING</option>
             <option value="PATIO RAMOS">PATIO RAMOS</option>
             <option value="PATIO MX">PATIO MX</option>
             <option value="PATIO HMO">PATIO HMO</option>
             <option value="PATIO PEDRO E">PATIO PEDRO E</option>
             <option value="PATIO SILAO">PATIO SILAO</option>
             <option value="EN TRANSITO">EN TRANSITO</option>
             </select>
         </td>
         <td><input name="comentarios" style="width: 250px; background-color: #b9e1ff;" type="text""  value="${item.comentarios}"></td>  
         </tbody>
         
       </table>
       </div>
             `;
           }
   
   
             d.querySelector(".hidden").style.display = "block";
             d.getElementById("bt-save").dataset.value = `${e.target.id}`;
     
            
             if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
               await ajax({
                 url: `${api.SUBITEMS1}/${e.target.id}.json`,
                 method: "GET",
                 cbSuccess: (item) => {
                   // console.log(item);
                   tabConv(item);
                 },
               });
             } if(localStorage.tabUnit === "true" && localStorage.tabConveyance === "false"){
               
               await ajax({
                 url: `${api.SUBITEMS}/${e.target.id}.json`,
                 method: "GET",
                 cbSuccess: (item) => {
                   // console.log(item);
                   tabUnit(item);
                 },
               });
             } else {
               //console.log(localStorage.tabConveyance,localStorage.tabUnit);
             }
         
     
           } else
          if (e.target.matches(".control") || e.target.matches(".fa-car")) {
           // console.log(e.target);
    
         
           await ajax({
             url: `${api.SUBITEMS}.json`,
             method: "GET",
             cbSuccess: (unit) => {
            
              // console.log(e.target);
              let unitArray = Object.entries(unit);
              
    
              unitArray.forEach(unit => {
               if(e.target.id === unit[1].unidad){
    
                 d.getElementById("controlModal").style.height = "60vh";
               d.querySelector(".control-modal-body").innerHTML = `
             <div class="container-fluid"> 
             <table class="table table-sm" >
             <thead class="table-dark text-center">
               <tr class="text-wrap">
                 <th scope="col">UNIDAD</th>
                 <th scope="col">OPERADOR</th>
                 <th scope="col">MODELO</th>
                 <th scope="col">PLACA</th>
                 <th scope="col">AÑO</th>
                 <th scope="col">VERIFICACION</th>
                 <th scope="col">NO. POLIZA</th>
                 <th scope="col">INCISO</th>
                 <th scope="col">CONTACTO DEL SEGURO</th> 
               </tr>
             </thead>
             <tbody class="text-center" class="text-wrap">
             <tr>
             <td>${unit[1].unidad}</td>
             <td>${unit[1].operador}</td>
             <td>${unit[1].modelo}</td>
             <td>${unit[1].placa}</td>
             <td>${unit[1].año}</td>
             <td>${unit[1].verificacion}</td>
             <td>${unit[1].poliza}</td>
             <td>${unit[1].inciso}</td>
             <td>${unit[1].contacto}</td>     
             </tr>   
             </tbody>      
           </table>
    
           <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #b9e1ff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
           </div>
             `;
    
            d.getElementById("controlV").dataset.unit = unit[0];
    
            
    
               } 
              });
    
             },
           });
    
           await ajax({
             url: `${api.SUBITEMS1}.json`,
             method: "GET",
             cbSuccess: (conv) => {
             
              let convArray = Object.entries(conv);
              
              convArray.forEach(conv => {
             
               if(e.target.dataset.conveyance === conv[1].caja){
    
                 d.getElementById("controlModal").style.height = "45vh";
                 d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
                 <div class="container-fluid"> 
         
                    <table class="table table-sm" >
                    <thead class="table-dark text-center">
                      <tr class="text-wrap">
                      <th scope="col">CAJA</th>
                      <th scope="col">TIPO</th>
                      <th scope="col">MODELO</th>
                      <th scope="col">PLACA</th>
                      <th scope="col">AÑO</th>
                      <th scope="col">VERIFICACION</th>
                      <th scope="col">NO. POLIZA</th>
                      <th scope="col">INCISO</th>
                      <th scope="col">CONTACTO DEL SEGURO</th>
                      <th scope="col">CIRCUITO</th>
                      <th scope="col">FECHA</th>
                      <th scope="col">UBICACION</th> 
                      <th scope="col">ESTATUS</th>
                      </tr>
                    </thead>
                    <tbody class="text-center text-wrap" >
             <td>${conv[1].caja}</td>
             <td>${conv[1].tipo}</td>
             <td>${conv[1].modelo}</td>
             <td>${conv[1].placa}</td>
             <td>${conv[1].año}</td>
             <td>${conv[1].verificacion}</td>
             <td>${conv[1].poliza}</td>
             <td>${conv[1].inciso}</td>
             <td>${conv[1].contacto}</td>
             <td><input name="circuito" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
             <td><input name="ruta" style="background: #b9e1ff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
             <td><input name="ubicacion" style="background: #b9e1ff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
             <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #b9e1ff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
             </tbody>      
                   </div>` 
           
               );
    
               d.getElementById("controlV").dataset.conveyance = conv[0];
                 
               }
             
             });
    
           
            
               
             }
    
           });
       
    
    
          }else
          if (e.target.matches(".tablero")) {
           clearInterval(updateData);
           window.location.hash = "/"+ user+"/productivo";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = true;
            localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.ITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
               //console.log(itemsArray)   
               renderTablePublic(newArray);
             },
           });
    
           d.getElementById("tablero").style.color = "#ffffffe8";
           d.getElementById("tablero").style.backgroundColor = "#10438e";
           d.getElementById("tablero").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
         }else
         if (e.target.matches(".equipov")) {
           clearInterval(updateData);
           window.location.hash = "/"+ user +"/equipov";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = true;
            localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.ITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
               //console.log(itemsArray)   
               renderTableEV(newArray);
             },
           });
    
           d.getElementById("equipov").style.color = "#ffffffe8";
           d.getElementById("equipov").style.backgroundColor = "#10438e";
           d.getElementById("equipov").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
         }else
         if (e.target.matches(".history")) {
           clearInterval(updateData);
           window.location.hash = "/"+user+"/history";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = true;
            localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.ITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
               //console.log(itemsArray)   
               renderTableHistory(newArray);
             },
           });
    
           d.getElementById("history").style.color = "#ffffffe8";
           d.getElementById("history").style.backgroundColor = "#10438e";
           d.getElementById("history").style.borderColor = "#094fb5";
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
         }else
         if (e.target.matches(".cajas")) {
           clearInterval(updateData);
           window.location.hash = "/"+user+"/cajas";
           localStorage.tabConveyance = true;
           localStorage.tabViajes = false;
         localStorage.tabUnit = false;
    
    
           await ajax({
             url: `${api.SUBITEMS1}.json`,
             cbSuccess: (items) => {   
               newArray = items;
             //  console.log(newArray)   
              renderTableCV(newArray);
             },
           });
    
           d.getElementById("cajas").style.color = "#ffffffe8";
           d.getElementById("cajas").style.backgroundColor = "#10438e";
           d.getElementById("cajas").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
    
           d.getElementById("unidades").style.color = "";
           d.getElementById("unidades").style.backgroundColor = "";
           d.getElementById("unidades").style.borderColor = "";
           
         }else
         if (e.target.matches(".unidades")) {
           clearInterval(updateData);
           window.location.hash = "/"+user+"/unidades";
           localStorage.tabConveyance = false;
           localStorage.tabViajes = false;
           localStorage.tabUnit = true;
    
    
           await ajax({
             url: `${api.SUBITEMS}.json`,
             cbSuccess: (items) => {   
               newArray = items;
         //      console.log(newArray);   
               renderTableUnits(newArray);
             },
           });
    
           d.getElementById("unidades").style.color = "#ffffffe8";
           d.getElementById("unidades").style.backgroundColor = "#10438e";
           d.getElementById("unidades").style.borderColor = "#094fb5";
    
           d.getElementById("history").style.color = "";
           d.getElementById("history").style.backgroundColor = "";
           d.getElementById("history").style.borderColor = "";
    
           d.getElementById("equipov").style.color = "";
           d.getElementById("equipov").style.backgroundColor = "";
           d.getElementById("equipov").style.borderColor = "";
    
           d.getElementById("cajas").style.color = "";
           d.getElementById("cajas").style.backgroundColor = "";
           d.getElementById("cajas").style.borderColor = "";
    
           d.getElementById("tablero").style.color = "";
           d.getElementById("tablero").style.backgroundColor = "";
           d.getElementById("tablero").style.borderColor = "";
           
         }  else
         if (e.target.matches(".remolque")) {
          //  console.log(e.target);

          const tabConv = ()=> {
            //MODAL
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("formulario").classList.add("register");
          d.getElementById("formulario").classList.remove("edit");
          d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
          d.getElementById("exampleModalLabel").classList.add("convoy");
          d.getElementById("exampleModalLabel").classList.remove("convoy");
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap">
        <td><input name="caja" style="width: 35px;" type="text"></td>
        <td><input name="tipo" style="width: 60px;" type="text"></td>
        <td><input name="modelo" style="width: 130px;" type="text"></td>
        <td><input name="placa" style="width: 70px;" type="text"></td>
        <td><input name="año" style="width: 80px;" type="text"></td>
        <td><input name="verificacion" style="width: 75px;" type="text"></td>
        <td><input name="poliza" style="width: 75px;" type="text"></td>
        <td><input name="inciso" style="width: 95px;" type="text"></td>
        <td><input name="contacto" type="text" style="width: 80px;"></td>
        <td><input name="circuito" type="text"></td>
        <td><input name="fecha" type="date"></td>
        <td><input name="ubicacion" type="text"></td>
        <td><input name="comentarios" type="text"></td>  
        </tbody>
          
        </table>
        </div>
              `;
          };      

          tabConv();
          
        }
        if (e.target.matches(".unidad")) {
          const tabUnit = ()=> {
            //MODAL
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("formulario").classList.add("register");
          d.getElementById("formulario").classList.remove("edit");
          d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
          d.getElementById("exampleModalLabel").classList.add("unit");
          d.getElementById("exampleModalLabel").classList.remove("convoy");
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">UNIDAD</th>
          <th scope="col">OPERADOR</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">CONTACTO DEL SEGURO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap">
        <td><input name="unidad" style="width: 35px;" type="text"></td>
        <td><input name="operador" style="width: 60px;" type="text"></td>
        <td><input name="modelo" style="width: 130px;" type="text"></td>
        <td><input name="placa" style="width: 70px;" type="text"></td>
        <td><input name="año" style="width: 80px;" type="text"></td>
        <td><input name="verificacion" style="width: 75px;" type="text"></td>
        <td><input name="poliza" style="width: 75px;" type="text"></td>
        <td><input name="inciso" style="width: 95px;" type="text"></td>
        <td><input name="contacto" type="text" style="width: 80px;"></td>
        <td><input name="circuito" type="text"></td>
        <td><input name="fecha" type="date"></td>
        <td><input name="ubicacion" type="text"></td>
        <td><input name="comentarios" type="text"></td>  
        </tbody>
          
        </table>
        </div>
              `;
          };

          tabUnit();
        }   else
          if(e.target.matches(".generar_xls")){
            //let $dataTable = d.getElementById("table_xls");
                generar_xls('table_xls', 'Reporte');
                location.reload();
     
          }
          return;
        });
     
         d.addEventListener("submit", async (e) => {
           e.preventDefault();
           clearInterval(updateData);
        // console.log(e.target);
         
        if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
          //console.log(e.target);
          let query = localStorage.getItem("apiSearch").toUpperCase();
    
         //console.log(query);
    
          let item = d.querySelectorAll(".item");
              item.forEach((e) => {
            //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
            if (!query) {
              e.classList.remove("filter");
              return false;
            } else if (
              e.dataset.unit.includes(query) ||
                e.dataset.box.includes(query) ||
                e.dataset.operador.includes(query) ||
                e.dataset.track.includes(query) ||
                e.dataset.ruta.includes(query) ||
                e.dataset.cliente.includes(query) ||
                e.dataset.proveedor.includes(query) ||
                e.dataset.citaprogramada.includes(query) ||
                e.dataset.status.includes(query)
            ) {
              e.classList.remove("filter");
            } else {
              e.classList.add("filter");
            }
                          });
          }
          else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
           //   console.log(e.target);
         let query = localStorage.getItem("apiSearch").toUpperCase();
    
           //  console.log(query);
    
         let item = d.querySelectorAll(".item");
             item.forEach((e) => {
           //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
           if (!query) {
             e.classList.remove("filter");
             return false;
           } 
           else if (e.dataset.conv.includes(query) ||
           e.dataset.circuito.includes(query) ||
           e.dataset.ubicacion.includes(query)
           ) {
             e.classList.remove("filter");
           } 
           else {
             e.classList.add("filter");
           }
                         });
          } 
          else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
       // console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();
    
        //console.log(query);
    
        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
        //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } 
          else if (e.dataset.unit.includes(query) ||
          e.dataset.circuito.includes(query) ||
          e.dataset.ubicacion.includes(query)
          ) {
            e.classList.remove("filter");
          } 
          else {
            e.classList.add("filter");
          }
                        });
          }  
           
          else if (e.target.matches(".register")) {
             //Create Register
            
    
             if (!e.target.id.value) {
    
              
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("-"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
              };
    
               let options = {
                 method: "POST",
                 headers: {
                   "Content-type": "application/json; charset=utf-8",
                 },
                 body: JSON.stringify({
                   unidad: e.target.unidad.value.toUpperCase(),
                   caja: e.target.caja.value.toUpperCase(),
                   cporte: e.target.cporte.value.toUpperCase(),
                   tracking: e.target.tracking.value.toUpperCase(),
                   bol: e.target.bol.value.toUpperCase(),
                   ruta: e.target.ruta.value.toUpperCase(),
                   operador: e.target.operador.value.toUpperCase(),
                   cliente: e.target.cliente.value.toUpperCase(),
                   proveedor: e.target.proveedor.value.toUpperCase(),
                   citaprogramada: dateConvert(e.target.citaprogramada.value),
                   llegadareal: e.target.llegadareal.value,
                   salidareal: e.target.salidareal.value,
                   eta: e.target.eta.value,
                   llegadadestino: e.target.llegadadestino.value,
                   salidadestino: e.target.salidadestino.value,
                   llegada: e.target.llegada.value.toUpperCase(),
                   status: e.target.status.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                 }),
               };
             await ajax({
                 url: `${api.ITEMS}.json`,
                 options,
                 cbSuccess: (res) => {
                   json = res.json();
                 },
               });
               location.reload();
             }
             // console.log(e.target);
          } 
           
          else if (e.target.matches(".edit")) {
    
            if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
              if (!e.target.id.value) {
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                   circuito: e.target.circuito.value.toUpperCase(),
                   fecha: e.target.fecha.value.toUpperCase(),
                   ubicacion: e.target.ubicacion.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                  url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                  },
                });
                location.reload();
              }
            }    
            if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
              
              if (!e.target.id.value) {
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                   circuito: e.target.circuito.value.toUpperCase(),
                   fecha: e.target.fecha.value.toUpperCase(),
                   ubicacion: e.target.ubicacion.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                  url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                  },
                });
                location.reload();
              }
        
        
            } 
            else if(localStorage.tabViajes === "true") {
              if (!e.target.id.value) {
                const dateConvert = (date) => {
                  let hora = date.slice(11, 17),
                  arrF = date.slice(0,10).split("-"),
                   concatF ="";
                   
                   return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
                };
    
                let options = {
                  method: "PATCH",
                  headers: {
                    "Content-type": "application/json; charset=utf-8",
                  },
                  body: JSON.stringify({
                    unidad: e.target.unidad.value.toUpperCase(),
                    caja: e.target.caja.value.toUpperCase(),
                    cporte: e.target.cporte.value.toUpperCase(),
                    tracking: e.target.tracking.value.toUpperCase(),
                    bol: e.target.bol.value.toUpperCase(),
                    ruta: e.target.ruta.value.toUpperCase(),
                    operador: e.target.operador.value.toUpperCase(),
                    cliente: e.target.cliente.value.toUpperCase(),
                    proveedor: e.target.proveedor.value.toUpperCase(),
                   llegadaprogramada: e.target.llegadaprogramada.value,
                   llegadareal: dateConvert(e.target.llegadareal.value),
                   salidareal: dateConvert(e.target.salidareal.value),
                   eta: dateConvert(e.target.eta.value),
                   llegadadestino: dateConvert(e.target.llegadadestino.value),
                   salidadestino: dateConvert(e.target.salidadestino.value),
                   llegada: e.target.llegada.value.toUpperCase(),
                   status: e.target.status.value.toUpperCase(),
                   comentarios: e.target.comentarios.value.toUpperCase()
                  }),
                };
               await ajax({
                   url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                  options,
                  cbSuccess: (res) => {
                 //   console.log(res);
                  },
                });
                location.reload();
              }
            }
              }
    
          else if (e.target.matches(".update")) {
              //console.log(e.target);
    
            //UPDATE
             //console.log(e.target.textarea[0].value.toUpperCase());
             //console.log(e.target.textarea[1].value.toUpperCase());
    
             let keyUnit = d.getElementById("controlV").dataset.unit;
             let keyConv = d.getElementById("controlV").dataset.conveyance;
    
            // console.log(keyUnit);
    
             
             if (!e.target.id.value) {
             
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  comentarios: e.target.textarea.value.toUpperCase()
                }),
              };
    
                await ajax({
                   url: `${api.SUBITEMS}/${keyUnit}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                 },
              });
    
               options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    circuito: e.target.circuito.value.toUpperCase(),
                    ruta: e.target.ruta.value.toUpperCase(),
                    ubicacion: e.target.ubicacion.value.toUpperCase(),
                    comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
    
                await ajax({
                   url: `${api.SUBITEMS1}/${keyConv}.json`,
                  options,
                  cbSuccess: (res) => {
                   // console.log(res);
                 },
              });
    
                 location.reload();
            }
            
    
          }
    
              
         });
     
         d.addEventListener("keyup", (e) => {
           //  console.log(d.getElementById("ruta"));
           //limpiar busqueda
           let query = localStorage.getItem("apiSearch");
           if (e.key === "Escape") localStorage.removeItem("apiSearch");
           let item = d.querySelectorAll(".item");
           item.forEach((e) => {
             if (!query) {
               e.classList.remove("filter");
               return false;
             }
           });
         });
       }else
       if (hash === "#/" + user + "/unidades") {
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;
    
    
        await ajax({
          url: `${api.SUBITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
      //      console.log(newArray);   
            renderTableUnits(newArray);
          },
        });
    
        const updateData = setInterval(  () => {
          
          ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {
              
                //console.log(Object.values(items));
                  listenItemsArray = Object.values(items);
                  let firstArray = Object.values(newArray);
                   // console.log(Object.entries(itemsArray).length);
    
                   if(listenItemsArray.length === firstArray.length){
    
                    
                      for (let i = 0; i < firstArray.length; i++) {
                        let e = firstArray[i];
                         let e2 = listenItemsArray[i];
                  
                       if( e.comentarios != e2.comentarios || e.caja != e2.caja 
                        || e.unidad != e2.unidad || e.bol != e2.bol 
                        || e.proveedor != e2.proveedor || e.citaprogramada != e2.citaprogramada 
                        || e.cliente != e2.cliente || e.cporte != e2.cporte
                        || e.tracking != e2.tracking || e.llegada != e2.llegada
                        || e.status != e2.status || e.llegadareal != e2.llegadareal
                        || e.salidareal != e2.salidareal || e.eta != e2.eta || e.llegadadestino != e2.llegadadestino
                        || e.salidadestino != e2.salidadestino || e.operador != e2.operador
                        ) {
                        //  console.log("UPDATE")
                        renderTableUnits(items);
                         }
         
                       }
                     } 
                     else {
                     // console.log("UPDATE");
                     renderTableUnits(items);
    
                      
                     }
    
    
                 
                 //console.log(listenItemsArray);
               }       
            })
    
        }, 5000);
           
        updateData;
    
        d.getElementById("unidades").style.color = "#ffffffe8";
        d.getElementById("unidades").style.backgroundColor = "#10438e";
        d.getElementById("unidades").style.borderColor = "#094fb5";
    
        d.getElementById("history").style.color = "";
        d.getElementById("history").style.backgroundColor = "";
        d.getElementById("history").style.borderColor = "";
    
        d.getElementById("equipov").style.color = "";
        d.getElementById("equipov").style.backgroundColor = "";
        d.getElementById("equipov").style.borderColor = "";
    
        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";
    
        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
    
        
        d.getElementById('excelFileInput').addEventListener('change', e => {
       
          if(e.target.matches("#excelFileInput")){
          //  console.log(e.target); 
               handleFile(e);            
          }
           
       });
    
       d.addEventListener("click", async (e) => {    
        //console.log(e.target);
       //LEER CSV / XLS
       let date = new Date;
       if (e.target.matches(".importModal")) {
         clearInterval(updateData);
       }else
       if(e.target.matches(".importXlsx")){
    
    
         dbXlsx.forEach((item)=>{
           // console.log(item);
         let hora = item[3].slice(11, 17),
             arrF = item[3].slice(1,-6).split("/"),
              concatF ="";
              item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
          });
    
          
               // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
           dbXlsx.forEach(async (element) => {
              //  console.log(element[1]);
    
       if (element[1].match("24") || element[1].match("HS")) {
           //console.log(element[1]);
          
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: "",
               caja: "",
               cporte: "",
               tracking: `${element[0]}`,
               bol: "",
               ruta: `${element[1]}`,
               operador: "",
               cliente: "FORD HERMOSILLO",
               proveedor: `${element[2]}`,
               citaprogramada: `${element[3]}`,
               llegadareal: "01/01/0001 00:00",
               salidareal: "01/01/0001 00:00",
               eta: "01/01/0001 00:00",
               llegadadestino: "01/01/0001 00:00",
               salidadestino: "01/01/0001 00:00",
               llegada: "EN TIEMPO",
               status: "PENDIENTE",
               comentarios: "SIN COMENTARIOS"
             }),
           };
           await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
           });
               
    
       } else 
       if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
         
           //console.log(element[1]);
    
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: "",
               caja: "",
               cporte: "",
               tracking: `${element[0]}`,
               bol: "",
               ruta: `${element[1]}`,
               operador: "",
               cliente: "FORD CUAUTITLAN",
               proveedor: `${element[2]}`,
               citaprogramada: `${element[3]}`,
               llegadareal: "01/01/0001 00:00",
               salidareal: "01/01/0001 00:00",
               eta: "01/01/0001 00:00",
               llegadadestino: "01/01/0001 00:00",
               salidadestino: "01/01/0001 00:00",
               llegada: "EN TIEMPO",
               status: "PENDIENTE",
               comentarios: "SIN COMENTARIOS"
             }),
           };
           await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             }
           });
               
       }
         setTimeout(() => {
           location.reload();
         }, 3000);
    
            });
            
        }else
        //GENERAR REPORTE XLS 
        if (e.target.matches(".modal_xls")){
         if(localStorage.tabViajes === "true"){
           clearInterval(updateData);
    
        d.querySelector(".export-modal-body").innerHTML = `
          <section id="thtable" class="thtable">
          <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">UNIDAD</th>
          <th scope="col">CAJA</th>
          <th scope="col">OPERADOR</th>
          <th scope="col">C.PORTE</th>
          <th scope="col">TRACKING</th>
          <th scope="col">BOL / SHIPPER</th>
          <th scope="col">RUTA</th>
          <th scope="col">CLIENTE</th>
          <th scope="col">PROVEEDOR</th>
          <th scope="col">CITA PROGRAMADA</th>
          <th scope="col">LLEGADA REAL</th>
          <th scope="col">SALIDA REAL</th>
          <th scope="col">ETA</th>
          <th scope="col">LLEGADA A DESTINO</th>
          <th scope="col">SALIDA A DESTINO</th>
          <th scope="col">LLEGADA</th>
          <th scope="col">ESTATUS</th>
          <th scope="col">COMENTARIOS</th>  
          </tr>
          </thead>
          <tbody id="table_bodyX" class="body_table">
          </tbody>     
          </table>
          </section>
          `;
    
           //Helper de acceso a los items
             const $tr = d.querySelectorAll(".item");
             const lisTr = Array.from($tr);
         
             lisTr.forEach((e) => {
              if(e.classList[5] === "filter"){
               return
              }
              d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
             });
     
             d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
         } else {
           location.reload();
         }
         
        
        }else
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
         location.reload();
       }else
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
         // console.log(e.target);
    
          let isConfirm = confirm("¿Eliminar Registro?");
    
          if (isConfirm) {
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
              options: {
                method: "DELETE",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
              },
              cbSuccess: (res) => {
                //console.log(res);
               
              },
            });
            location.reload();
          }
        }else
        if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
          // console.log(e.target);
 
          const tabConv = (item) => {
 
           d.getElementById("formulario").classList.add("edit");
           d.getElementById("formulario").classList.remove("register");
           d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
           d.querySelector(".modal-body").innerHTML = `
           <div class="container-fluid font"> 
           <table class="table table-sm " >
           <thead class="table-dark text-center">
           <tr class="text-wrap">
           <th id="cajas" scope="col">CAJA</th>
           <th scope="col">TIPO</th>
           <th scope="col">MODELO</th>
           <th scope="col">PLACA</th>
           <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
           <th scope="col">INCISO</th>
           <th scope="col">MARCHAMO</th>
           <th scope="col">CIRCUITO</th>
           <th scope="col">FECHA</th>
           <th scope="col">UBICACION</th> 
           <th scope="col">ESTATUS</th>
     
         </tr>
       </thead>
       <tbody class="text-center text-wrap" >
       <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ></td>
       <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" ></td>
       <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ></td>
       <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ></td>
       <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ></td>
       <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
       <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ></td>
       <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ></td>
       <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ></td>
       <td>
       <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
           <option value="${item.circuito}">${item.circuito}</option> 
           <option value="FORDC - HILEX">FORDC - HILEX</option>  
           <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
           <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
           <option value="FORDC - MUBEA">FORDC - MUBEA</option>
           <option value="FORDC - BROSE">FORDC - BROSE</option>
           <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
           <option value="FORDC - STANDAR">FORDC - STANDAR</option>
           <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
           <option value="FORDC - DHL">FORDC - DHL</option>
           <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
           <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
           <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
           <option value="FORDH - BROSE">FORDH - BROSE MX</option>
           <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
           <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
           <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
           <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
           <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
           <option value="AMAZON">AMAZON</option>
           <option value="BRP">BRP</option>
           <option value="GM">GM</option>
           <option value="ACTIVE ON D">ACTIVE ON D</option>
           <option value="FCA - NARMEX">FCA - NARMEX</option>
           <option value="FCA - TI GROUP">FCA - TI GROUP</option>
           <option value="FCA - WEBASTO">FCA - WEBASTO</option>
           <option value="FCA - TENNECO">FCA - TENNECO</option>
           </select>
       </td>
       <td><input name="fecha" style="width: 90px;" type="text"  value="${item.fecha}"></td>
       <td>
       <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
           <option value="${item.ubicacion}">${item.ubicacion}</option> 
           <option value="BP NORTE">BP NORTE</option>  
           <option value="BP SUR">BP SUR</option>
           <option value="BP CLOSURES">BP CLOSURES</option>
           <option value="BP TRIM">BP TRIM</option>
           <option value="BP CLC">BP CLC</option>
           <option value="FRAMING">FRAMING</option>
           <option value="PATIO RAMOS">PATIO RAMOS</option>
           <option value="PATIO MX">PATIO MX</option>
           <option value="PPATIO HMO">PATIO HMO</option>
           <option value="PATIO PEDRO E">PATIO PEDRO E</option>
           <option value="PATIO SILAO">PATIO SILAO</option>
           <option value="EN TRANSITO">EN TRANSITO</option>
           </select>
       </td>
       <td>      
         <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
         <option value="${item.comentarios}">${item.comentarios}</option> 
         <option value="CARGADA MP">CARGADA MP</option>  
         <option value="PARCIAL">PARCIAL</option>
         <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
         <option value="EV - FALTA SHIPPER>EV - FALTA SHIPPER</option>
         <option value="VACIA>VACIA</option>
         <option value="DAÑADA>DAÑADA</option>
         <option value="MANTENIMIENTO>MANTENIMIENTO</option>
         <option value="DISPONIBLE">DISPONIBLE</option>
         </select>
       </td>  
       </tbody>
       
     </table>
     </div>
           `;
         }
 
         const tabUnit = (item) => {
 
           d.getElementById("formulario").classList.add("edit");
           d.getElementById("formulario").classList.remove("register");
           d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
           d.querySelector(".modal-body").innerHTML = `
           <div class="container-fluid font"> 
           <table class="table table-sm" >
       <thead class="table-dark text-center">
         <tr class="text-wrap">
         <th scope="col">UNIDAD</th>
     <th scope="col">OPERADOR</th>
     <th scope="col">MODELO</th>
     <th scope="col">PLACA</th>
     <th scope="col">AÑO</th>
      <th scope="col">VERIFICACION</th>
      <th scope="col">NO. POLIZA</th>
     <th scope="col">INCISO</th>
     <th scope="col">KILOMETRAJE</th>
     <th scope="col">CIRCUITO</th>
     <th scope="col">FECHA</th>
     <th scope="col">UBICACION</th> 
     <th scope="col">ESTATUS</th>
 
         </tr>
       </thead>
       <tbody class="text-center text-wrap" >
       <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ></td>
       <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ></td>
       <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ></td>
       <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ></td>
       <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ></td>
       <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ></td>
       <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" ></td>
       <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" ></td>
       <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ></td>
       <td>
       <select class="form-select form-select-sm" style="height: 24px; width: 150px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
       <option value="${item.circuito}">${item.circuito}</option> 
       <option value="FORDC - HILEX">FORDC - HILEX</option>  
       <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
       <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
       <option value="FORDC - MUBEA">FORDC - MUBEA</option>
       <option value="FORDC - BROSE">FORDC - BROSE</option>
       <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
       <option value="FORDC - STANDAR">FORDC - STANDAR</option>
       <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
       <option value="FORDC - DHL">FORDC - DHL</option>
       <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
       <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
       <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
       <option value="FORDH - BROSE">FORDH - BROSE MX</option>
       <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
       <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
       <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
       <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
       <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
       <option value="AMAZON">AMAZON</option>
       <option value="BRP">BRP</option>
       <option value="GM">GM</option>
       <option value="ACTIVE ON D">ACTIVE ON D</option>
       <option value="FCA - NARMEX">FCA - NARMEX</option>
       <option value="FCA - TI GROUP">FCA - TI GROUP</option>
       <option value="FCA - WEBASTO">FCA - WEBASTO</option>
       <option value="FCA - TENNECO">FCA - TENNECO</option>
       </select>
       </td>
       <td><input name="fecha" style="width: 100px;" type="text"  value="${item.fecha}"></td>
       <td>
       <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
           <option value="${item.ubicacion}">${item.ubicacion}</option> 
           <option value="BP NORTE">BP NORTE</option>  
           <option value="BP SUR">BP SUR</option>
           <option value="BP CLOSURES">BP CLOSURES</option>
           <option value="BP TRIM">BP TRIM</option>
           <option value="BP CLC">BP CLC</option>
           <option value="FRAMING">FRAMING</option>
           <option value="PATIO RAMOS">PATIO RAMOS</option>
           <option value="PATIO MX">PATIO MX</option>
           <option value="PATIO HMO">PATIO HMO</option>
           <option value="PATIO PEDRO E">PATIO PEDRO E</option>
           <option value="PATIO SILAO">PATIO SILAO</option>
           <option value="EN TRANSITO">EN TRANSITO</option>
           </select>
       </td>
       <td><input name="comentarios" style="width: 250px;" type="text""  value="${item.comentarios}"></td>  
       </tbody>
       
     </table>
     </div>
           `;
         }
 
 
           d.querySelector(".hidden").style.display = "block";
           d.getElementById("bt-save").dataset.value = `${e.target.id}`;
   
          
           if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
             await ajax({
               url: `${api.SUBITEMS1}/${e.target.id}.json`,
               method: "GET",
               cbSuccess: (item) => {
                 // console.log(item);
                 tabConv(item);
               },
             });
           } if(localStorage.tabUnit === "true" && localStorage.tabConveyance === "false"){
             
             await ajax({
               url: `${api.SUBITEMS}/${e.target.id}.json`,
               method: "GET",
               cbSuccess: (item) => {
                 // console.log(item);
                 tabUnit(item);
               },
             });
           } else {
             //console.log(localStorage.tabConveyance,localStorage.tabUnit);
           }
       
   
         } else
        if (e.target.matches(".tablero")) {
         clearInterval(updateData);
         window.location.hash = "/"+ user+"/productivo";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTablePublic(newArray);
           },
         });
    
         d.getElementById("tablero").style.color = "#ffffffe8";
         d.getElementById("tablero").style.backgroundColor = "#10438e";
         d.getElementById("tablero").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".equipov")) {
         clearInterval(updateData);
         window.location.hash = "/"+ user +"/equipov";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTableEV(newArray);
           },
         });
    
         d.getElementById("equipov").style.color = "#ffffffe8";
         d.getElementById("equipov").style.backgroundColor = "#10438e";
         d.getElementById("equipov").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".history")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/history";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = true;
          localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.ITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
             //console.log(itemsArray)   
             renderTableHistory(newArray);
           },
         });
    
         d.getElementById("history").style.color = "#ffffffe8";
         d.getElementById("history").style.backgroundColor = "#10438e";
         d.getElementById("history").style.borderColor = "#094fb5";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
       }else
       if (e.target.matches(".cajas")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/cajas";
         localStorage.tabConveyance = true;
         localStorage.tabViajes = false;
       localStorage.tabUnit = false;
    
    
         await ajax({
           url: `${api.SUBITEMS1}.json`,
           cbSuccess: (items) => {   
             newArray = items;
           //  console.log(newArray)   
            renderTableCV(newArray);
           },
         });
    
         d.getElementById("cajas").style.color = "#ffffffe8";
         d.getElementById("cajas").style.backgroundColor = "#10438e";
         d.getElementById("cajas").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
    
         d.getElementById("unidades").style.color = "";
         d.getElementById("unidades").style.backgroundColor = "";
         d.getElementById("unidades").style.borderColor = "";
         
       }else
       if (e.target.matches(".unidades")) {
         clearInterval(updateData);
         window.location.hash = "/"+user+"/unidades";
         localStorage.tabConveyance = false;
         localStorage.tabViajes = false;
         localStorage.tabUnit = true;
    
    
         await ajax({
           url: `${api.SUBITEMS}.json`,
           cbSuccess: (items) => {   
             newArray = items;
       //      console.log(newArray);   
             renderTableUnits(newArray);
           },
         });
    
         d.getElementById("unidades").style.color = "#ffffffe8";
         d.getElementById("unidades").style.backgroundColor = "#10438e";
         d.getElementById("unidades").style.borderColor = "#094fb5";
    
         d.getElementById("history").style.color = "";
         d.getElementById("history").style.backgroundColor = "";
         d.getElementById("history").style.borderColor = "";
    
         d.getElementById("equipov").style.color = "";
         d.getElementById("equipov").style.backgroundColor = "";
         d.getElementById("equipov").style.borderColor = "";
    
         d.getElementById("cajas").style.color = "";
         d.getElementById("cajas").style.backgroundColor = "";
         d.getElementById("cajas").style.borderColor = "";
    
         d.getElementById("tablero").style.color = "";
         d.getElementById("tablero").style.backgroundColor = "";
         d.getElementById("tablero").style.borderColor = "";
         
       }  else
       if (e.target.matches(".remolque")) {
        //  console.log(e.target);

        const tabConv = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
        d.getElementById("exampleModalLabel").classList.add("convoy");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="caja" style="width: 35px;" type="text"></td>
      <td><input name="tipo" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };      

        tabConv();
        
      }
      if (e.target.matches(".unidad")) {
        const tabUnit = ()=> {
          //MODAL
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
        d.getElementById("exampleModalLabel").classList.add("unit");
        d.getElementById("exampleModalLabel").classList.remove("convoy");
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap">
      <td><input name="unidad" style="width: 35px;" type="text"></td>
      <td><input name="operador" style="width: 60px;" type="text"></td>
      <td><input name="modelo" style="width: 130px;" type="text"></td>
      <td><input name="placa" style="width: 70px;" type="text"></td>
      <td><input name="año" style="width: 80px;" type="text"></td>
      <td><input name="verificacion" style="width: 75px;" type="text"></td>
      <td><input name="poliza" style="width: 75px;" type="text"></td>
      <td><input name="inciso" style="width: 95px;" type="text"></td>
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
        };

        tabUnit();
      }   else
        if(e.target.matches(".generar_xls")){
          //let $dataTable = d.getElementById("table_xls");
              generar_xls('table_xls', 'Reporte');
              location.reload();
    
        }
        return;
      });
    
       d.addEventListener("submit", async (e) => {
         e.preventDefault();
         clearInterval(updateData);
      // console.log(e.target);
       
      if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
        //console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();
    
       //console.log(query);
    
        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
          //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } else if (
            e.dataset.unit.includes(query) ||
              e.dataset.box.includes(query) ||
              e.dataset.operador.includes(query) ||
              e.dataset.track.includes(query) ||
              e.dataset.ruta.includes(query) ||
              e.dataset.cliente.includes(query) ||
              e.dataset.proveedor.includes(query) ||
              e.dataset.citaprogramada.includes(query) ||
              e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
         //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
    
         //  console.log(query);
    
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
         //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
     // console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
    
      //console.log(query);
    
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
          e.classList.add("filter");
        }
                      });
        }  
         
        else if (e.target.matches(".register")) {
           //Create Register
          
    
           if (!e.target.id.value) {
    
            
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("-"),
               concatF ="";
               
               return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
            };
    
             let options = {
               method: "POST",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                 unidad: e.target.unidad.value.toUpperCase(),
                 caja: e.target.caja.value.toUpperCase(),
                 cporte: e.target.cporte.value.toUpperCase(),
                 tracking: e.target.tracking.value.toUpperCase(),
                 bol: e.target.bol.value.toUpperCase(),
                 ruta: e.target.ruta.value.toUpperCase(),
                 operador: e.target.operador.value.toUpperCase(),
                 cliente: e.target.cliente.value.toUpperCase(),
                 proveedor: e.target.proveedor.value.toUpperCase(),
                 citaprogramada: dateConvert(e.target.citaprogramada.value),
                 llegadareal: e.target.llegadareal.value,
                 salidareal: e.target.salidareal.value,
                 eta: e.target.eta.value,
                 llegadadestino: e.target.llegadadestino.value,
                 salidadestino: e.target.salidadestino.value,
                 llegada: e.target.llegada.value.toUpperCase(),
                 status: e.target.status.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
           await ajax({
               url: `${api.ITEMS}.json`,
               options,
               cbSuccess: (res) => {
                 json = res.json();
               },
             });
             location.reload();
           }
           // console.log(e.target);
        } 
         
        else if (e.target.matches(".edit")) {
    
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
          }    
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
            
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
      
      
          } 
          else if(localStorage.tabViajes === "true") {
            if (!e.target.id.value) {
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                arrF = date.slice(0,10).split("-"),
                 concatF ="";
                 
                 return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
              };
    
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  unidad: e.target.unidad.value.toUpperCase(),
                  caja: e.target.caja.value.toUpperCase(),
                  cporte: e.target.cporte.value.toUpperCase(),
                  tracking: e.target.tracking.value.toUpperCase(),
                  bol: e.target.bol.value.toUpperCase(),
                  ruta: e.target.ruta.value.toUpperCase(),
                  operador: e.target.operador.value.toUpperCase(),
                  cliente: e.target.cliente.value.toUpperCase(),
                  proveedor: e.target.proveedor.value.toUpperCase(),
                 llegadaprogramada: e.target.llegadaprogramada.value,
                 llegadareal: dateConvert(e.target.llegadareal.value),
                 salidareal: dateConvert(e.target.salidareal.value),
                 eta: dateConvert(e.target.eta.value),
                 llegadadestino: dateConvert(e.target.llegadadestino.value),
                 salidadestino: dateConvert(e.target.salidadestino.value),
                 llegada: e.target.llegada.value.toUpperCase(),
                 status: e.target.status.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                 url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
               //   console.log(res);
                },
              });
              location.reload();
            }
          }
            }
    
        else if (e.target.matches(".update")) {
            //console.log(e.target);
    
          //UPDATE
           //console.log(e.target.textarea[0].value.toUpperCase());
           //console.log(e.target.textarea[1].value.toUpperCase());
    
           let keyUnit = d.getElementById("controlV").dataset.unit;
           let keyConv = d.getElementById("controlV").dataset.conveyance;
    
          // console.log(keyUnit);
    
           
           if (!e.target.id.value) {
           
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                comentarios: e.target.textarea.value.toUpperCase()
              }),
            };
    
              await ajax({
                 url: `${api.SUBITEMS}/${keyUnit}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
               },
            });
    
             options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                  circuito: e.target.circuito.value.toUpperCase(),
                  ruta: e.target.ruta.value.toUpperCase(),
                  ubicacion: e.target.ubicacion.value.toUpperCase(),
                  comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
    
              await ajax({
                 url: `${api.SUBITEMS1}/${keyConv}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
               },
            });
    
               location.reload();
          }
          
    
        }
    
            
       });
    
       d.addEventListener("keyup", (e) => {
         //  console.log(d.getElementById("ruta"));
         //limpiar busqueda
         let query = localStorage.getItem("apiSearch");
         if (e.key === "Escape") localStorage.removeItem("apiSearch");
         let item = d.querySelectorAll(".item");
         item.forEach((e) => {
           if (!query) {
             e.classList.remove("filter");
             return false;
           }
         });
       });
       }
    */