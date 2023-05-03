export async function ajax(props){
    let { url, cbSuccess, options } = props;

    await fetch(url, options)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json => cbSuccess(json))
    .catch(error => {
        /*let message = error.statusText || "Sin conexión a la base de datos";
        alert("Sin conexion");
        document.getElementById("thtable").insertAdjacentHTML("beforeend",`
        <div class="error">
        <p>${message}</p>
        </div>`);
        document.querySelector(".loader").style.display = "none";*/

        console.log(error);
    });
}