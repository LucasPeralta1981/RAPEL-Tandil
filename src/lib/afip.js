// lib/afip.js
import { PDFDocument, rgb } from 'pdf-lib';

/**
 * Configuración de AFIP (en producción, usa variables de entorno)
 * ⚠️ ESTO ES UNA SIMULACIÓN - No se conecta realmente a AFIP
 */
const AFIP_CONFIG = {
  wsUrl: 'https://wsaflive.afip.gob.ar/wsfe/service', // URL de prueba
  service: 'wsfe',
  cuit: process.env.AFIP_CUIT || '20123456789',
  token: process.env.AFIP_TOKEN,
  cert: process.env.AFIP_CERT
};

/**
 * Genera un número de comprobante único
 */
function generateCbteNro() {
  return `FE-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

/**
 * Calcula impuestos según tipo de IVA
 * @param {number} subtotal - Monto sin IVA
 * @param {string} ivaType - 'responsable', 'monotributo', 'exento'
 */
function calculateTaxes(subtotal, ivaType = 'responsable') {
  const taxes = {
    subtotal: subtotal,
    iva: 0,
    iibb: 0,
    total: subtotal
  };

  switch (ivaType) {
    case 'responsable':
      taxes.iva = subtotal * 0.21; // 21% IVA
      taxes.iibb = subtotal * 0.02; // 2% Ingresos Brutos (ejemplo)
      break;
    case 'monotributo':
      taxes.iva = 0; // Monotributo no factura con IVA
      taxes.total = subtotal;
      break;
    case 'exento':
      taxes.iva = 0;
      taxes.iibb = 0;
      break;
  }

  taxes.total = taxes.subtotal + taxes.iva + taxes.iibb;
  return taxes;
}

/**
 * Genera una factura PDF simple (SIMULACIÓN)
 * En producción, usarías una librería como pdfkit o pdfmake
 */
async function generateInvoicePDF(invoiceData) {
  try {
    // Crear un PDF simple (en producción, usarías una librería más robusta)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Dibujar encabezado
    page.drawText('FACTURA A', {
      x: 50,
      y: height - 50,
      size: 24,
      color: rgb(0, 0, 0)
    });

    // Datos de la empresa
    page.drawText('TU EMPRESA S.A.', {
      x: 50,
      y: height - 90,
      size: 12
    });
    page.drawText(`CUIT: ${AFIP_CONFIG.cuit}`, {
      x: 50,
      y: height - 110,
      size: 10
    });

    // Datos del cliente
    page.drawText(`Cliente: ${invoiceData.customerName}`, {
      x: 50,
      y: height - 150,
      size: 12
    });
    page.drawText(`CUIT: ${invoiceData.customerTaxId}`, {
      x: 50,
      y: height - 170,
      size: 10
    });

    // Información de la factura
    page.drawText(`Comprobante: ${invoiceData.cbteNro}`, {
      x: 400,
      y: height - 90,
      size: 12
    });
    page.drawText(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, {
      x: 400,
      y: height - 110,
      size: 10
    });

    // Items
    let yPosition = height - 220;
    page.drawText('Descripción | Cantidad | Precio | Total', {
      x: 50,
      y: yPosition,
      size: 10
    });
    yPosition -= 20;

    invoiceData.items.forEach(item => {
      page.drawText(`${item.name} | ${item.quantity} | $${item.price} | $${item.subtotal}`, {
        x: 50,
        y: yPosition,
        size: 10
      });
      yPosition -= 15;
    });

    // Totales
    yPosition -= 20;
    page.drawText(`Subtotal: $${invoiceData.taxes.subtotal.toFixed(2)}`, {
      x: 400,
      y: yPosition,
      size: 12
    });
    yPosition -= 15;
    page.drawText(`IVA (21%): $${invoiceData.taxes.iva.toFixed(2)}`, {
      x: 400,
      y: yPosition,
      size: 12
    });
    yPosition -= 15;
    page.drawText(`Total: $${invoiceData.taxes.total.toFixed(2)}`, {
      x: 400,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 1)
    });

    // Guardar PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw new Error('Error al generar factura PDF');
  }
}

/**
 * Simula la autorización de comprobante en AFIP
 * En producción, esto haría una llamada SOAP real
 */
async function authorizeComprobante(invoiceData) {
  // Simulación de respuesta de AFIP
  return {
    success: true,
    cbteNro: generateCbteNro(),
    cae: `12345678-${Math.floor(Math.random() * 900000) + 100000}`,
    caeVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T'),
    mensaje: 'Comprobante autorizado exitosamente'
  };
}

/**
 * Genera una factura completa
 */
export async function createInvoice(invoiceData) {
  try {
    // Calcular impuestos
    const taxes = calculateTaxes(invoiceData.subtotal, invoiceData.taxType);
    
    // Autorizar comprobante (simulado)
    const auth = await authorizeComprobante({ ...invoiceData, taxes });
    
    // Generar PDF
    const pdfBytes = await generateInvoicePDF({
      ...invoiceData,
      taxes,
      cbteNro: auth.cbeNro
    });

    return {
      success: true,
      invoice: {
        cbteNro: auth.cbteNro,
        cae: auth.cae,
        caeVencimiento: auth.caeVencimiento,
        taxes,
        pdf: pdfBytes
      },
      message: auth.mensaje
    };
  } catch (error) {
    console.error('Error creando factura:', error);
    return {
      success: false,
      error: error.message
    };
  }
}