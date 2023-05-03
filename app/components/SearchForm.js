export function SearchForm () {
    const d= document,
     $form = d.createElement("form"),
    $input = d.createElement("input");

    $form.classList.add("search-form");
    $input.name = "search";
    $input.type = "search";
    $input.placeholder = "Buscar...";
    $input.autocomplete = "off";
   
    
    //console.log("ejecucion form");

    $form.appendChild($input);

    if(location.hash.includes("#/search")){
        $input.value = localStorage.getItem("apiSearch");
       
    }

    d.addEventListener("search", e => {
        if(!e.target.matches("input[type='search']")) return false;
        if(!e.target.value)localStorage.removeItem("apiSearch");
    });

    d.addEventListener("submit", e => {
        
        if(!e.target.matches(".search-form")) return false;
        e.preventDefault();
        localStorage.setItem("apiSearch", e.target.search.value);
       //console.log(location.hash);
       
    });


    return $form;
}