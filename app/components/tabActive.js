export function tabActive (tab) {
    let d = document;

    if(tab === "tablero") {

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
    } else 
    if(tab === "equipov"){
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

    } else 
    if(tab === "history"){
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
    } else
    if(tab === "cajas"){
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
    } else
    if(tab === "unidades"){
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


}