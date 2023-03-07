// obtener tab actual
// https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const llenarFactura = async () => {
  // obtener la URL base
  const urlBase = document.getElementById("url-base").value;
  // obtener el ID
  const facturaId = document.getElementById("factura").value;

  // sustituir el {id} por el ID de la factura
  const url = urlBase.replace("{id}", facturaId);

  //https://app.sinetiks.com/admin/cobro/2880/sat
  // obtener datos para llenar la factura
  const data = await fetch(url).then((res) => res.json());

  // obtener tab actual
  const currentTab = await getCurrentTab();

  // inyectar función y data
  // https://developer.chrome.com/docs/extensions/reference/scripting/
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: (data) => {
      // trigger a custom event on the current tab and pass data
      document.dispatchEvent(
        new CustomEvent("llenarFacturaClicked", { detail: data })
      );
    },
    args: [data],
  });
};

// llenar datos guardados al cargar
document.addEventListener("DOMContentLoaded", async () => {
  // url base
  document.getElementById("url-base").value =
    localStorage.getItem("facturas-gratis-url-base") || "";
  document.getElementById("factura").value =
    localStorage.getItem("facturas-gratis-factura") || "";
});

// auto guardar url base
document
  .getElementById("url-base")
  .addEventListener("change", () =>
    localStorage.setItem(
      "facturas-gratis-url-base",
      document.getElementById("url-base").value
    )
  );

// auto guardar factura
document
  .getElementById("factura")
  .addEventListener("change", () =>
    localStorage.setItem(
      "facturas-gratis-factura",
      document.getElementById("factura").value
    )
  );

// al hacer click en el boton llenar factura, llama a la función llenar factura
document.getElementById("llenar-factura").onclick = llenarFactura;

// configurar sistema form
const toggleConfigurarSistemaForm = () => {
  document
    .getElementById("configurar-sistema__form")
    .classList.toggle("d-none");
  document
    .getElementById("configurar-sistema__abrir")
    .classList.toggle("d-none");
};
document.getElementById("configurar-sistema__abrir").onclick =
  toggleConfigurarSistemaForm;
document.getElementById("configurar-sistema__cerrar").onclick =
  toggleConfigurarSistemaForm;
