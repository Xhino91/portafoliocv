import { loadImage } from "./loadImg.js";



export async function generatePDF(obj, url, date) {
    //console.log(obj, url);
    const image = await loadImage(url);
    

    const pdf = new jsPDF('p', 'pt', 'a4');

    pdf.addImage(image, 'PNG', 5, 0, 585, 842);

    const children = dropArea.children;
    for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child instanceof HTMLImageElement) {
        const imgDataDropArea = child.src;
        pdf.addImage(imgDataDropArea, 'JPEG', 170, 485, 250, 230);
    }
    }

    pdf.setFontSize(9);
    pdf.setTextColor("#ffffff");
    pdf.setFontType("bold");
    pdf.text(date, 505, 52);
    
    pdf.setTextColor("#4d4e53");
    pdf.setFontSize(10);
    pdf.text(obj.$coordinador, 450, 780);
    pdf.text(obj.$ruta, 168, 123);
    pdf.text(obj.$load, 168, 141);
    pdf.text(obj.$citaprogramada, 168, 159);
    pdf.text(obj.$scac, 168, 177);
    pdf.text(obj.$rem, 168, 195);
    pdf.text(obj.$ubicacion, 168, 213);
    pdf.text(obj.$razon, 168, 230);
    pdf.text(obj.$coordenadas, 168, 264);
    pdf.text(obj.$recoleccion, 168, 284);
    pdf.text(obj.$descarga, 168, 302);
    pdf.text(obj.$etadestino, 168, 320);
    pdf.text(obj.$planrecuperacion, 168, 338);
    pdf.text(obj.$distanciakm, 168, 375);
    pdf.text(obj.$proveedor, 168, 393);
    pdf.text(obj.$cliente, 168, 412);
    pdf.text(obj.$descargadock, 168, 428);

   
    pdf.save("example.pdf");

}