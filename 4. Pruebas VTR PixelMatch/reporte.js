import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const dirV4 = 'cypress/screenshots/Ghost4.5';
const dirV5 = 'cypress/screenshots/Ghost5.96.0';
const dirDiff = 'cypress/screenshots/diffs';
const reportDir = 'report';

// Verificar que la carpeta de diffs y report existe, si no, crearla
if (!fs.existsSync(dirDiff)){
  fs.mkdirSync(dirDiff, { recursive: true });
}
if (!fs.existsSync(reportDir)){
  fs.mkdirSync(reportDir, { recursive: true });
}

// Función para verificar si una ruta es un archivo
function isFile(path) {
  return fs.lstatSync(path).isFile();
}

// Función para recorrer directorios recursivamente y obtener todos los archivos
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Obtener todos los archivos en el directorio V4
const filesV4 = getAllFiles(dirV4);

const results = [];

filesV4.forEach(fileV4Path => {
  // Obtener la ruta relativa del archivo desde dirV4
  const relativePath = path.relative(dirV4, fileV4Path);

  // Reemplazar '4.5' por '5.96.0' en la ruta relativa
  const adjustedRelativePath = relativePath.replace('4.5', '5.96.0');

  const imgV5Path = path.join(dirV5, adjustedRelativePath);

  if (fs.existsSync(imgV5Path) && isFile(imgV5Path)) {
    const imgV4 = PNG.sync.read(fs.readFileSync(fileV4Path));
    const imgV5 = PNG.sync.read(fs.readFileSync(imgV5Path));

    const { width, height } = imgV4;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      imgV4.data, imgV5.data, diff.data, width, height,
      { threshold: 0.1 }
    );

    // Crear el directorio correspondiente en dirDiff si no existe
    const diffFilePath = path.join(dirDiff, adjustedRelativePath);
    const diffDir = path.dirname(diffFilePath);
    if (!fs.existsSync(diffDir)){
      fs.mkdirSync(diffDir, { recursive: true });
    }

    fs.writeFileSync(diffFilePath, PNG.sync.write(diff));

    results.push({
      name: adjustedRelativePath,
      before: `../${path.relative(reportDir, fileV4Path).replace(/\\/g, '/')}`,
      after: `../${path.relative(reportDir, imgV5Path).replace(/\\/g, '/')}`,
      diff: `../${path.relative(reportDir, diffFilePath).replace(/\\/g, '/')}`,
      numDiffPixels
    });

    console.log(`Comparado ${adjustedRelativePath}: ${numDiffPixels} píxeles diferentes`);
  } else {
    console.log(`El archivo ${relativePath} no existe o no es un archivo en la versión 5.96.0`);
  }
});

// Función para generar el HTML del reporte
function browser(result) {
  const functionalityName = result.name.split('\\')[0]; // Extraer el nombre de la funcionalidad
  const escenaryName = result.name.split('\\')[2]; // Extraer el nombre de la funcionalidad
  return `<div class="browser" id="test0" style="text-align: center;">
    <h2>${functionalityName} - ${escenaryName}</h2>
    <div class="imgline" style="display: flex; justify-content: center;">
      <div class="imgcontainer" style="margin: 0 10px;">
        <span class="imgname">Ghost 4.5</span>
        <img class="img2" src="${result.before}" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer" style="margin: 0 10px;">
        <span class="imgname">Ghost 5.96.0</span>
        <img class="img2" src="${result.after}" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline" style="display: flex; justify-content: center;">
      <div class="imgcontainer" style="margin: 0 10px;">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="${result.diff}" id="diffImage" label="Diff">
      </div>
    </div>
  </div>`;
}

function createReport(results) {
  return `
    <html>
        <head>
            <title> VRT Report </title>
            <link href="reporte.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Report for Visual Regression Testing</h1>
            <div id="visualizer">
                ${results.map(result => browser(result)).join('')}
            </div>
        </body>
    </html>`;
}

// Generar el reporte HTML
const reportHtml = createReport(results);
fs.writeFileSync(path.join(reportDir, 'report.html'), reportHtml);

// Copiar el archivo CSS al directorio del reporte
fs.copyFileSync('reporte.css', path.join(reportDir, 'reporte.css'));