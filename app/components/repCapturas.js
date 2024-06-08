import {
    getDatabase,
    ref,
    get,
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

export async function repHistorial(){
    const db = getDatabase(), refItems = ref(db, "registros"), d= document;
    let datatab = [], html = "";


    let ws_data = [
      ["FECHA / HORA", "USUARIO", "TRACKING", "UNIDAD", "CAJA", "OPERADOR", "C. PORTE", "SHIPPER / BOL", "CLIENTE", "RUTA",
        "CITA PROGRAMADA", "LLEGADA REAL", "SALIDA REAL", "ETA", "LLEGADA REAL", "SALIDA REAL", "ESTATUS LLEGADA", "ESTATUS", "COMENTARIOS"]
        ];
    
    await get(refItems)
    .then((snapshot) => {
        if (snapshot.exists()) {
        datatab = snapshot.val(); 
        
        for (const key in datatab) {
            if (Object.hasOwnProperty.call(datatab, key)) {
              const item = datatab[key];

             ws_data.push([item.date, item.user, item.body.tracking, item.body.unidad, item.body.caja, item.body.operador,
                item.body.cporte, item.body.bol, item.body.cliente, item.body.ruta, item.body.citaprogramada,
                item.body.llegadareal, item.body.salidareal, item.body.eta, item.body.llegadadestino, item.body.salidadestino,
                item.body.llegada, item.body.status, item.body.comentarios
              ]);                
            }
          }

          let ws = XLSX.utils.aoa_to_sheet(ws_data);
      
          // Crear un libro de trabajo
          let wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Datos");
      
          // Generar y descargar el archivo Excel
          XLSX.writeFile(wb, 'datos.xlsx');

          
    
       } else {
         console.log("No se encontraron datos.");
       }
      })
    .catch((error) => {
        console.error("Error al obtener los datos:", error);
         });
    
               
    
    }