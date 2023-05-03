export function Titulo () {
    const $menu = document.createElement("div");
    $menu.classList.add("menu");
    $menu.innerHTML = `
      <h1 class="logo">INTLOGIS</h1>
      <h3 class="logo">On Time</h3>
    `;
    return $menu;
}