import { loadImage } from "./loadImg.js";

export async function generatePDF(obj, url, date) {
  const MAX_CHARACTERS_PER_LINE = 60;
  const MAX_LINES = 5;
  const razon = obj.$razon;
  const planRecuperacion = obj.$planrecuperacion;
  let razonLines = [];
  let planRecuperacionLines = [];
  //console.log(obj, url);
  const image = await loadImage(url);

  const pdf = new jsPDF("p", "pt", "a4");

  pdf.addImage(image, "PNG", 5, 0, 585, 842);
  const dropArea = document.getElementById("dropArea");
  const children = dropArea.children;
  const imgHeight = 200;
  const pageHeight = 842;
  const marginBottom = 140;
  const marginBetweenImages = 30;

  let imgX = 50;
  let imgY = pageHeight - imgHeight - marginBottom;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child instanceof HTMLImageElement) {
      const imgDataDropArea = child.src;
      const imgWidth = 230;

      if (i > 0) {
        imgX += imgWidth + marginBetweenImages;
        imgY = pageHeight - imgHeight - marginBottom;
      }

      pdf.addImage(imgDataDropArea, "JPEG", imgX, imgY, imgWidth, imgHeight);

      // Actualizar la posición Y para la siguiente imagen
      imgY -= imgHeight + marginBetweenImages;
    }
  }

  pdf.setFontSize(9);
  pdf.setTextColor("#ffffff");
  pdf.setFontType("bold");
  pdf.text(date, 505, 52);

  pdf.setTextColor("#4d4e53");
  pdf.setFontSize(10);
  pdf.text(obj.$coordinador, 435, 780);
  pdf.text(obj.$ruta, 168, 123);
  pdf.text(obj.$load, 168, 141);
  pdf.text(obj.$citaprogramada, 168, 159);
  pdf.text(obj.$scac, 168, 177);
  pdf.text(obj.$rem, 168, 195);
  pdf.text(obj.$ubicacion, 168, 213);
  for (let i = 0; i < MAX_LINES; i++) {
    const startIndex = i * MAX_CHARACTERS_PER_LINE;
    const endIndex = (i + 1) * MAX_CHARACTERS_PER_LINE;
    const line = razon.substring(startIndex, endIndex);
    razonLines.push(line);
  }


  let startYRazon = 230;
  razonLines.forEach((line, index) => {
    pdf.text(line, 168, startYRazon);
    startYRazon += 12;
  });
  pdf.text(obj.$coordenadas, 168, 267);
  pdf.text(obj.$recoleccion, 168, 284);
  pdf.text(obj.$descarga, 168, 302);
  pdf.text(obj.$etadestino, 168, 320);
  for (let i = 0; i < MAX_LINES; i++) {
    const startIndex = i * MAX_CHARACTERS_PER_LINE;
    const endIndex = (i + 1) * MAX_CHARACTERS_PER_LINE;
    const line = planRecuperacion.substring(startIndex, endIndex);
    planRecuperacionLines.push(line);
  }


  let startY = 338;
  planRecuperacionLines.forEach((line, index) => {
    pdf.text(line, 168, startY);
    startY += 12;
  });
  pdf.text(obj.$distanciakm, 168, 375);
  pdf.text(obj.$proveedor, 168, 393);
  pdf.text(obj.$cliente, 168, 412);
  pdf.text(obj.$descargadock, 168, 428);

  pdf.save(`Alarma(${obj.$load}).pdf`);
}
