export function crearTabla(data) {
    console.log(data);


    const todasFilas = data.split(/\r?\n|\r/);
    let tabla = '<table>';
    for (let fila = 0; fila < todasFilas.length; fila++) {
      if (fila === 0) {
        tabla += '<thead>';
        tabla += '<tr>';
      } else {
        tabla += '<tr>';
      }

      
      const celdasFila = todasFilas[fila].split(',');
      for (let rowCell = 0; rowCell < celdasFila.length; rowCell++) {
        if (fila === 0) {
          tabla += '<th>';
          tabla += celdasFila[rowCell];
          tabla += '</th>';
        } else {
          tabla += '<td>';
          if (rowCell === 3) {
            tabla += '<img src="'+celdasFila[rowCell]+'">';
          } else {
            tabla += celdasFila[rowCell];
          }
          tabla += '</td>';
        }
      }
      if (fila === 0) {
        tabla += '</tr>';
        tabla += '</thead>';
        tabla += '<tbody>';
      } else {
        tabla += '</tr>';
      }
    } 
    tabla += '</tbody>';
    tabla += '</table>';
    
    console.log(tabla);
   // document.querySelector('#thtable').innerHTML = tabla;
  }
