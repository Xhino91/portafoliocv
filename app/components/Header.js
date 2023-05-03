import { SearchForm } from "./SearchForm.js";
import { Titulo } from "./Titulo.js";

export function Header (){
    const $header = document.createElement("header");
    $header.classList.add("header");
    $header.appendChild(Titulo());
    $header.appendChild(SearchForm());
    return $header;
}
