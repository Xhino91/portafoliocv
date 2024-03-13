export default function dropAreaLabel() {

    let dropArea = document.getElementById('dropArea');

    // Agregar controladores de eventos para el área de arrastrar y soltar
    dropArea.addEventListener('dragenter', function (e) {
        e.preventDefault();
        dropArea.classList.add('hover');
    });

    dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    dropArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        dropArea.classList.remove('hover');
    });

    dropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        dropArea.classList.remove('hover');

        var files = e.dataTransfer.files;
        if (files.length > 0) {
            // Iterar a través de cada archivo
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file.type.match('image.*')) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        var img = new Image();
                        img.src = reader.result;
                        dropArea.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Uno de los archivos seleccionados no es una imagen.');
                }
            }
        }
    });

}
