// Genera Documento_Pruebas_AA3_EV02.docx a partir de datos.mjs.
// Si existe pantallazos/<ID>.png (por ejemplo CP-01.png) lo inserta; si no, deja un recuadro vacío.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { portada, entorno, historias, casosDeUso, funcionales, validaciones } from './datos.mjs';

const require = createRequire(import.meta.url);
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  AlignmentType, HeadingLevel, ImageRun, PageBreak, LevelFormat, Footer, PageNumber, HeightRule, VerticalAlign
} = require('docx');

const carpeta = path.dirname(fileURLToPath(import.meta.url));
const FUENTE = 'Arial';
const ANCHO = 9360; // ancho útil de la página Carta con márgenes de 1 pulgada (en DXA)
const AZUL = '1F4368';
const GRIS = 'F2F2F2';
const borde = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const bordes = { top: borde, bottom: borde, left: borde, right: borde };

let figura = 0;
let instanciaLista = 0;

const texto = (t, op = {}) => new TextRun({ text: t, font: FUENTE, size: 22, ...op });
const parrafo = (t, op = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, ...op.parrafo, children: [texto(t, op.run)] });

function celda(hijos, ancho, op = {}) {
  return new TableCell({
    borders: bordes, width: { size: ancho, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP,
    shading: op.sombra ? { fill: op.sombra, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: hijos
  });
}
const cTexto = (t, ancho, op = {}) =>
  celda([new Paragraph({ children: [texto(t, { size: 20, bold: op.negrita, color: op.color })] })], ancho, op);

function tabla(anchos, filas) {
  return new Table({ width: { size: ANCHO, type: WidthType.DXA }, columnWidths: anchos, rows: filas });
}
const encabezadoTabla = (titulos, anchos) =>
  new TableRow({ tableHeader: true, children: titulos.map((t, i) => cTexto(t, anchos[i], { negrita: true, sombra: 'DCE6F1' })) });

const titulo1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: t, font: FUENTE })] });
const titulo2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: t, font: FUENTE })] });
const titulo3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: [new TextRun({ text: t, font: FUENTE })] });
const viñeta = (t) => new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, spacing: { after: 60 }, children: [texto(t)] });

// Lee el ancho y el alto de un PNG desde su cabecera.
function dimensionesPng(buffer) {
  return { ancho: buffer.readUInt32BE(16), alto: buffer.readUInt32BE(20) };
}

// Pantallazo de una prueba: imagen real si existe el archivo, recuadro vacío si no.
function pantallazo(id, descripcion) {
  figura += 1;
  const ruta = path.join(carpeta, 'pantallazos', `${id}.png`);
  const leyenda = new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 80, after: 240 },
    children: [texto(`Figura ${figura}. ${id}: ${descripcion}`, { italics: true, size: 18, color: '595959' })]
  });
  if (fs.existsSync(ruta)) {
    const datos = fs.readFileSync(ruta);
    const { ancho, alto } = dimensionesPng(datos);
    const escala = Math.min(600 / ancho, 560 / alto, 1);
    return [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, keepNext: true, children: [
        new ImageRun({ type: 'png', data: datos, transformation: { width: Math.round(ancho * escala), height: Math.round(alto * escala) },
          altText: { title: id, description: descripcion, name: id } })] }),
      leyenda
    ];
  }
  const vacio = { style: BorderStyle.DASHED, size: 6, color: '7F7F7F' };
  const recuadro = new Table({
    width: { size: ANCHO, type: WidthType.DXA }, columnWidths: [ANCHO],
    rows: [new TableRow({ height: { value: 2400, rule: HeightRule.ATLEAST }, children: [new TableCell({
      borders: { top: vacio, bottom: vacio, left: vacio, right: vacio }, width: { size: ANCHO, type: WidthType.DXA },
      shading: { fill: GRIS, type: ShadingType.CLEAR, color: 'auto' }, verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        texto(`Pantallazo ${id}`, { bold: true, color: '7F7F7F' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          texto(`Guardar la captura como pantallazos/${id}.png y volver a generar el documento`, { size: 18, color: '7F7F7F' })] })]
    })] })]
  });
  return [recuadro, leyenda];
}

// Bloque de una prueba: tabla con sus datos y debajo el pantallazo.
function bloquePrueba(p, huTexto) {
  const instancia = instanciaLista++;
  const A = [2200, 7160];
  const pasos = (p.pasos || [p.datos]).map((paso) =>
    new Paragraph({ numbering: { reference: 'pasos', level: 0, instance: instancia }, spacing: { after: 40 },
      children: [texto(paso, { size: 20 })] }));
  const filas = [];
  if (huTexto) filas.push(new TableRow({ children: [cTexto('Requisito', A[0], { negrita: true, sombra: GRIS }), cTexto(huTexto, A[1])] }));
  if (p.pasos) filas.push(new TableRow({ children: [cTexto('Pasos', A[0], { negrita: true, sombra: GRIS }), celda(pasos, A[1])] }));
  filas.push(
    new TableRow({ children: [cTexto('Datos de entrada', A[0], { negrita: true, sombra: GRIS }), cTexto(p.datos, A[1])] }),
    new TableRow({ children: [cTexto('Resultado esperado', A[0], { negrita: true, sombra: GRIS }), cTexto(p.esperado, A[1])] }),
    new TableRow({ children: [cTexto('Resultado obtenido', A[0], { negrita: true, sombra: GRIS }), cTexto(' ', A[1])] }),
    new TableRow({ children: [cTexto('Estado', A[0], { negrita: true, sombra: GRIS }), cTexto('☐ Aprobada     ☐ No aprobada', A[1])] })
  );
  return [titulo3(`${p.id} · ${p.titulo}`), tabla(A, filas), ...pantallazo(p.id, p.titulo)];
}

// ---------------------------------------------------------------------------
// Contenido
// ---------------------------------------------------------------------------
const centrado = (t, op = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: op.despues ?? 120 },
  children: [new TextRun({ text: t, font: FUENTE, size: op.tamano ?? 24, bold: op.negrita, color: op.color })] });

const hoja = [
  centrado('', { despues: 600 }),
  centrado(portada.entidad, { tamano: 28, negrita: true, color: AZUL }),
  centrado(portada.programa, { tamano: 26, despues: 900 }),
  centrado(portada.sistema, { tamano: 56, negrita: true, color: AZUL, despues: 200 }),
  centrado(portada.titulo, { tamano: 32, despues: 200 }),
  centrado(portada.evidencia, { tamano: 26, despues: 1200 }),
  centrado('Aprendiz', { tamano: 22, color: '595959', despues: 20 }),
  centrado(portada.aprendiz, { tamano: 26, negrita: true, despues: 200 }),
  centrado('Ficha de formación', { tamano: 22, color: '595959', despues: 20 }),
  centrado(portada.ficha, { tamano: 26, negrita: true, despues: 200 }),
  centrado('Instructor', { tamano: 22, color: '595959', despues: 20 }),
  centrado(portada.instructor, { tamano: 26, negrita: true, despues: 900 }),
  centrado(portada.fecha, { tamano: 24 })
];

hoja.push(
  titulo1('1. Introducción'),
  parrafo('InfoManager System es una aplicación web para administrar usuarios, documentos y reportes desde un panel centralizado. Este documento reúne las pruebas realizadas al módulo de Documentos, que permite subir archivos, clasificarlos por categoría y controlar su fecha de vencimiento para saber cuáles están vigentes, por vencer o vencidos.'),
  parrafo('El módulo se construyó en la evidencia GA7-220501096-AA3-EV01 con Spring Boot e Hibernate en el servidor y React (JSX) en la interfaz, sobre la base de datos MySQL del proyecto. Aquí se verifica que cumple las historias de usuario y los casos de uso definidos, y que valida correctamente los datos que recibe: textos, longitudes, caracteres especiales, números, fechas y archivos.'),
  parrafo('Cada requisito se describe con su historia de usuario y, debajo, el pantallazo de la aplicación que evidencia su funcionamiento. Las pruebas de validación se documentan con los datos de entrada, el resultado esperado y el resultado obtenido.'),

  titulo1('2. Objetivo'),
  titulo2('2.1 Objetivo general'),
  parrafo('Verificar el funcionamiento del módulo de Documentos de InfoManager System frente a las historias de usuario y los casos de uso definidos, documentando las pruebas funcionales y de validación con sus evidencias.'),
  titulo2('2.2 Objetivos específicos'),
  viñeta('Comprobar con pantallazos que cada historia de usuario del módulo se cumple en la aplicación.'),
  viñeta('Probar las validaciones de textos, longitudes, caracteres especiales, números, fechas y archivos.'),
  viñeta('Verificar el cálculo de la vigencia de los documentos (vigente, por vencer y vencido).'),
  viñeta('Confirmar que los datos se guardan y se consultan correctamente en MySQL mediante Hibernate.'),
  viñeta('Dejar constancia de los resultados para detectar y corregir defectos antes de la entrega final.'),

  titulo1('3. Alcance y entorno de pruebas'),
  parrafo('Las pruebas cubren las ocho historias de usuario del módulo de Documentos, desde la pantalla de documentos y el panel administrativo hasta la base de datos. No incluyen el inicio de sesión ni el control de acceso por roles, que se desarrollarán en un módulo posterior; por ello, en esta versión la lista "Subido por" se elige manualmente.'),
  tabla([2800, 6560], entorno.map(([a, b]) => new TableRow({ children: [cTexto(a, 2800, { negrita: true, sombra: GRIS }), cTexto(b, 6560)] }))),

  titulo1('4. Historias de usuario y casos de uso'),
  titulo2('4.1 Historias de usuario'),
  parrafo('Las historias de usuario siguientes describen lo que el módulo debe hacer. Cada una tiene criterios de aceptación contra los que se comparan las pruebas.'),
  tabla([900, 3100, 4560, 800], [
    encabezadoTabla(['ID', 'Historia', 'Criterios de aceptación', 'Prioridad'], [900, 3100, 4560, 800]),
    ...historias.map((h) => new TableRow({ children: [
      cTexto(h.id, 900, { negrita: true }), cTexto(h.historia, 3100),
      celda(h.criterios.map((c) => new Paragraph({ numbering: { reference: 'vinetas', level: 0 }, spacing: { after: 40 }, children: [texto(c, { size: 20 })] })), 4560),
      cTexto(h.prioridad, 800)] }))
  ]),
  titulo2('4.2 Casos de uso'),
  parrafo('El módulo tiene dos actores: el Administrador, que gestiona los documentos y consulta el resumen del panel, y el Usuario, que sube, consulta y descarga documentos.'),
  tabla([900, 1900, 1700, 4160, 700], [
    encabezadoTabla(['ID', 'Caso de uso', 'Actor', 'Descripción', 'Historia'], [900, 1900, 1700, 4160, 700]),
    ...casosDeUso.map((c) => new TableRow({ children: [
      cTexto(c[0], 900, { negrita: true }), cTexto(c[1], 1900), cTexto(c[2], 1700), cTexto(c[3], 4160), cTexto(c[4], 700)] }))
  ]),

  titulo1('5. Pruebas funcionales')
);
hoja.push(parrafo('Para cada historia de usuario se presenta su descripción y, debajo, los casos de prueba con el pantallazo de la aplicación que evidencia el resultado.'));

for (const h of historias) {
  const pruebas = funcionales.filter((p) => p.hu === h.id);
  if (pruebas.length === 0) continue;
  hoja.push(titulo2(`${h.id} · ${h.titulo}`));
  hoja.push(new Paragraph({ spacing: { after: 80 }, children: [texto('Historia: ', { bold: true }), texto(h.historia, { italics: true })] }));
  hoja.push(new Paragraph({ spacing: { after: 60 }, children: [texto('Criterios de aceptación:', { bold: true })] }));
  h.criterios.forEach((c) => hoja.push(viñeta(c)));
  pruebas.forEach((p) => hoja.push(...bloquePrueba(p, `${h.id} · ${h.titulo}`)));
}

hoja.push(titulo1('6. Pruebas de validación'));
hoja.push(parrafo('Estas pruebas comprueban que la aplicación rechaza o acepta correctamente los datos según su tipo: textos, longitudes, caracteres especiales, números, fechas y archivos. Algunas se hacen desde el formulario y otras directamente sobre la API, para confirmar que el servidor también valida y no depende solo de la interfaz.'));
for (const g of validaciones) {
  hoja.push(titulo2(g.grupo));
  g.pruebas.forEach((p) => hoja.push(...bloquePrueba(p, null)));
}

const total = funcionales.length + validaciones.reduce((s, g) => s + g.pruebas.length, 0);
hoja.push(
  titulo1('7. Resumen de resultados'),
  parrafo(`Se definieron ${total} casos de prueba: ${funcionales.length} funcionales y ${total - funcionales.length} de validación. Complete la tabla al terminar la ejecución.`),
  tabla([4560, 1600, 1600, 1600], [
    encabezadoTabla(['Tipo de prueba', 'Total', 'Aprobadas', 'No aprobadas'], [4560, 1600, 1600, 1600]),
    new TableRow({ children: [cTexto('Funcionales', 4560), cTexto(String(funcionales.length), 1600), cTexto(' ', 1600), cTexto(' ', 1600)] }),
    ...validaciones.map((g) => new TableRow({ children: [cTexto(`Validación: ${g.grupo}`, 4560), cTexto(String(g.pruebas.length), 1600), cTexto(' ', 1600), cTexto(' ', 1600)] })),
    new TableRow({ children: [cTexto('Total', 4560, { negrita: true, sombra: GRIS }), cTexto(String(total), 1600, { negrita: true, sombra: GRIS }), cTexto(' ', 1600, { sombra: GRIS }), cTexto(' ', 1600, { sombra: GRIS })] })
  ]),

  titulo1('8. Conclusiones'),
  new Paragraph({ spacing: { after: 120, line: 300 }, children: [
    texto('[Completar después de ejecutar las pruebas: indicar cuántas pruebas se aprobaron, qué defectos se encontraron y cómo se corrigieron, y si el módulo cumple las historias de usuario.]',
      { shading: { type: ShadingType.CLEAR, fill: 'FFF2A8', color: 'auto' } })] }),

  titulo1('9. Repositorio'),
  parrafo('El código del módulo, los scripts de la base de datos y este documento están versionados con Git en GitHub:'),
  parrafo(portada.repositorio, { run: { color: '0563C1' } })
);

const documento = new Document({
  creator: portada.aprendiz, title: `${portada.titulo} - ${portada.evidencia}`,
  styles: {
    default: { document: { run: { font: FUENTE, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: FUENTE, color: AZUL }, paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: FUENTE, color: AZUL }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: FUENTE, color: '1F2937' }, paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: { config: [
    { reference: 'vinetas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: 'pasos', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 360 } } } }] }
  ] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }, titlePage: true },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: 'InfoManager System, GA7-220501096-AA3-EV02. Página ', font: FUENTE, size: 18, color: '7F7F7F' }),
      new TextRun({ children: [PageNumber.CURRENT], font: FUENTE, size: 18, color: '7F7F7F' })] })] }),
      first: new Footer({ children: [new Paragraph({ children: [] })] }) },
    children: hoja
  }]
});

const salida = path.join(carpeta, 'Documento_Pruebas_AA3_EV02.docx');
fs.writeFileSync(salida, await Packer.toBuffer(documento));
const conImagen = [...funcionales, ...validaciones.flatMap((g) => g.pruebas)].filter((p) => fs.existsSync(path.join(carpeta, 'pantallazos', `${p.id}.png`))).length;
console.log(`Documento generado: ${salida}`);
console.log(`Pantallazos insertados: ${conImagen} de ${total}`);
