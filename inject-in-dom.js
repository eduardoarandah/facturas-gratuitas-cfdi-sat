/* Emisor/Receptor */
function llenaEmisorReceptor(data) {
  $("#Emisor_RegimenFiscal").val(data.regimen_fiscal).trigger("change");
  $("#Emisor_TipoComprobante").val(data.tipo_comprobante).trigger("change");
  $("#Receptor_RfcCargado").val("Otro ").trigger("change");
  $("#Receptor_Rfc").val(data.rfc).trigger("change").trigger("blur");
  $("#Receptor_Nombre").val(data.nombre).trigger("change");

  if (data.es_persona_moral)
    $("#Receptor_UsoCFDIMoral").val(data.usocfdi).trigger("change");
  else $("#Receptor_UsoCFDIFisica").val(data.usocfdi).trigger("change");

  /* agregar */
  $("#Receptor_ResidenciaFiscalLookUp").val(data.pais).trigger("change");
  $("#Receptor_NumRegIdTrib")
    .val(data.clave_identidad_fiscal)
    .trigger("change");
}

/* Comprobante */
function llenaComprobante(data) {
  $("#LugarExpedicion")
    .val(data.codigo_postal_expedicion)
    .trigger("change")
    .trigger("blur");
  $("#MonedaLookUp").val(data.moneda).trigger("change");
  $("#FormaPagoLookUp").val(data.forma_de_pago).trigger("change");
  $("#MetodoPagoLookUp").val(data.metodo_de_pago).trigger("change");
  $("#Folio").val(data.folio).trigger("change").trigger("blur");
}

/* Concepto */
function llenaConcepto(data) {
  /* llenar clave de producto */
  $("#ClaveProdServ").trigger("click");
  $("#ClaveProdServ").val(data.clave_producto);
  $("#ClaveProdServ").trigger("blur", this);
  llenarDatosConcepto($("#ClaveProdServ"));

  /* llenar descripcion y valor unitario */
  $("#Descripcion").val(data.producto).trigger("change").trigger("blur");
  $("#ValorUnitario").val(data.monto).trigger("change").trigger("blur");
}

/* Traslados */
function llenaTraslado(data) {
  /* Click en traslado (2do radio) */
  var radios = $("#tabImpuestos input[name='tipoImpuesto']");
  $(radios[1]).trigger("click");

  /* Poner monto base */
  $("#Traslados_Base").val(data.monto);

  /* Impuesto (dropdown) */
  $("#Traslados_Impuesto").val(data.traslados_impuesto);
  $("#Traslados_Impuesto").trigger("change");

  /* Tasa o cuota (dropdown) */
  $("#Traslados_TipoFactor").val(data.traslados_tipofactor);
  $("#Traslados_TipoFactor").trigger("change");

  /* Valor de la tasa o cuota */
  $("#Traslados_TasaOCuota").val(data.traslados_tasaocuota);
  validarTasaOCuotTraslado();

  /* Click en "Agregar" */
  $("#btnAgregaConImpuestoTraslado").click();
}

/* Retencion */
function llenaRetencion(data) {
  /* Click en retencion (primer radio) */
  var radios = $("#tabImpuestos input[name='tipoImpuesto']");
  $(radios[0]).trigger("click");

  /* Poner monto base */
  $("#Retenciones_Base").val(data.monto);

  /* Impuesto dropdown */
  $("#Retenciones_Impuesto").val(data.retencion_impuesto);
  $("#Retenciones_Impuesto").trigger("change");

  /* Tasa o cuota dropdown */
  $("#Retenciones_TipoFactor").val(data.retencion_tipofactor);
  $("#Retenciones_TipoFactor").trigger("change");

  /* Tasa o cuota dropdown? */
  $("#Retenciones_TasaOCuota").val(data.retencion_tasaocuota);
  validarTasaOCuotaRetencion();

  /* Click en "Agregar" */
  $("#btnAgregaConImpuestoRetenido").click();
}

/* Ejecutar */
function llenarFactura(data) {
  /* Emisor / receptor */
  llenaEmisorReceptor(data);

  /* Botón siguiente */
  clickTab($("ul#tabsComprobante.nav-tabs li.active").next()[0].id);
  autoguardado(this);

  /* Info del comprobante */
  llenaComprobante(data);

  /* concepto 1 */
  //boton nuevo concepto
  $("#btnMuestraConcepto").trigger("click");

  llenaConcepto(data);

  /* si es extranjero */
  if (!data.es_extranjero) {
    /* Click en Adicionales > impuestos */
    $("#AdicionalImpuestos").trigger("click");
    /* Llenar traslados */
    setTimeout(() => llenaTraslado(data), 500);
    /* Llenar retenciones */
    if (data.es_persona_moral) setTimeout(() => llenaRetencion(data), 1000);
  }

  /* Esperamos para dar click en agregar concepto */
  setTimeout(() => $("#tabConceptos #btnAceptarModal").trigger("click"), 1500);
}
// comunicacion con el popup
document.addEventListener("llenarFacturaClicked", function (event) {
  // console.log("llenarFacturaClicked fired en script.js", event.detail);
  llenarFactura(event.detail);
});
