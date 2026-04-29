const fs = require('fs');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const apiUrl = process.env.API_URL || 'http://localhost:8000/api';

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

const devEnvConfigFile = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}'
};
`;

// Sobrescribir los archivos de environment de Angular
fs.writeFileSync('./src/environments/environment.ts', envConfigFile);
fs.writeFileSync('./src/environments/environment.development.ts', devEnvConfigFile);

console.log(`[Angular] Entornos generados exitosamente con API_URL: ${apiUrl}`);
