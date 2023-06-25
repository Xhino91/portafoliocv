import { Loader } from "./components/Loader.js";
import { Header } from "./components/Header.js";
import { Main } from "./components/Main.js";
import { Router } from "./components/Router.js";
import { Login } from "./components/login.js";
import api from "./helpers/wp_api.js";
import { ajax } from "./helpers/ajax.js";

const d = document;

export function App() {
  const $login = d.getElementById("login");
  const $root = d.getElementById("root");
  $root.innerHTML = null;
  $login.innerHTML = null;

  if (!sessionStorage.login) {
    //console.log("sesion activa");
    localStorage.clear();
    Login();

    const $form = d.querySelector("#form");

    $form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = d.querySelector("#typeEmailX-2").value,
        password = d.querySelector("#typePasswordX-2").value;

      const data = {
        username: username,
        password: password,
      };

      //console.log(data);
      if (e.target.id === "form") {
        await ajax({
          url: api.USERS,
          cbSuccess: (res) => {
            //console.log(data);
            //Admin         
            if (res[0].user === `${data.username}` && res[0].pass === `${data.password}`) {
              //console.log("Acceso Completo");
              window.location.hash = "/Tracking";
              sessionStorage.login = true;
              localStorage.username = data.username;
              $login.style = "display: none;";
              location.reload(true);
              $root.appendChild(Header());
              $root.appendChild(Main());
              document.getElementById("thtable").appendChild(Loader());

              Router();
            } else
            if (res[1].user === `${data.username}` && res[1].pass === `${data.password}`) {
              //console.log("Acceso Completo");
              window.location.hash = "/Inhouse";
              sessionStorage.login = true;
              localStorage.username = data.username;
              $login.style = "display: none;";
              location.reload(true);

              $root.appendChild(Header());
              $root.appendChild(Main());
              document.getElementById("thtable").appendChild(Loader());

              Router();
            } else
            if (res[2].user === `${data.username}` && res[2].pass === `${data.password}`) {
              //console.log("Acceso Completo");
              window.location.hash = "/Traffic";
              sessionStorage.login = true;
              localStorage.username = data.username;
              $login.style = "display: none;";
              location.reload(true);

              $root.appendChild(Header());
              $root.appendChild(Main());
              document.getElementById("thtable").appendChild(Loader());

              Router();
            } else
            if (res[3].user === `${data.username}` && res[3].pass === `${data.password}`) {
              //console.log("Acceso Completo");
              window.location.hash = "/Public";
              sessionStorage.login = true;
              localStorage.username = data.username;
              $login.style = "display: none;";
              location.reload(true);

              $root.appendChild(Header());
              $root.appendChild(Main());
              document.getElementById("thtable").appendChild(Loader());

              Router();
            }
            if (res[4].user === `${data.username}` && res[4].pass === `${data.password}`) {
              //console.log("Acceso Completo");
              window.location.hash = "/CVehicular";
              sessionStorage.login = true;
              localStorage.username = data.username;
              $login.style = "display: none;";
              location.reload(true);

              $root.appendChild(Header());
              $root.appendChild(Main());
              document.getElementById("thtable").appendChild(Loader());

              Router();
            }
             else {
              // console.log("Acceso Denegado");
              alert("Usuario y/o Contraseña Incorrecto");
            }
          },
        });
      }
    });
  } 
  else {
    $root.appendChild(Header());
    $root.appendChild(Main());
    document.getElementById("thtable").appendChild(Loader());
  
    Router();
  }

 
}
