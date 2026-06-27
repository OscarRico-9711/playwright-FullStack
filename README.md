# playwright-FullStack

Proyecto base para construir una automatizacion robusta con Playwright y TypeScript.

La idea es que este README vaya creciendo junto con el proyecto: configuracion inicial, comandos utiles, reportes, capturas de pantalla, trazas, buenas practicas, CI/CD, GitHub Actions y cualquier integracion que se agregue con el tiempo.

## Proposito

Crear un framework de pruebas end-to-end con Playwright que sea mantenible, escalable y facil de ejecutar tanto en local como en pipelines de integracion continua.

## Requisitos

Antes de crear el proyecto, se deben instalar y validar las siguientes herramientas.

### Node.js y npm

Node.js es necesario para ejecutar Playwright y administrar las dependencias del proyecto. npm viene instalado junto con Node.js.

| Comando / enlace | Uso |
| --- | --- |
| `https://nodejs.org/` | Descargar Node.js version `LTS` para Windows. |
| `node --version` | Validar instalacion de Node.js. |
| `node -v` | Validar instalacion de Node.js con comando corto. |
| `npm --version` | Validar instalacion de npm. |
| `npm -v` | Validar instalacion de npm con comando corto. |

Si los comandos de version muestran una respuesta, Node.js y npm quedaron instalados correctamente.

### Extension de Playwright para VS Code

La extension permite ejecutar, depurar y visualizar pruebas desde el panel de Testing de VS Code.

```text
Playwright Test for VSCode
```

| Comando | Uso |
| --- | --- |
| `code --install-extension ms-playwright.playwright` | Instalar la extension desde consola, si `code` esta disponible. |
| `code --list-extensions` | Verificar extensiones instaladas. |
| `ms-playwright.playwright` | Identificador que debe aparecer en la lista de extensiones. |

## Crear el proyecto Playwright desde consola

Desde la carpeta donde se quiere crear o inicializar el proyecto:

| Comando | Uso |
| --- | --- |
| `npm init playwright@latest` | Crear o inicializar la configuracion de Playwright. |
| `npx playwright install` | Instalar navegadores requeridos por Playwright. |
| `npx playwright --version` | Verificar la version instalada de Playwright dentro del proyecto. |
| `npx playwright test` | Verificar que Playwright puede ejecutar pruebas. |

## Crear proyecto desde VS Code - comando `Ctrl + Shift + P`

Tambien se puede iniciar el flujo desde Visual Studio Code:

1. Abrir la paleta de comandos con `Ctrl + Shift + P`.
2. Buscar y seleccionar `Install Playwright`.
3. Elegir TypeScript y las opciones necesarias para el proyecto.

## Crear repositorio Git y subir a GitHub

Este flujo se usa para versionar el proyecto localmente y luego subirlo a un repositorio remoto en GitHub.

| Comando | Uso |
| --- | --- |
| `git init` | Inicializa Git dentro del proyecto. |
| `git status` | Revisa el estado actual de los archivos. |
| `git add .` | Agrega todos los archivos al area de staging. |
| `git commit -m "Initial playwright-FullStack setup"` | Crea el primer commit del proyecto. |
| `git branch -M main` | Renombra la rama principal a `main`. |
| `git remote add origin https://github.com/TU_USUARIO/playwright-FullStack.git` | Conecta el repo local con el repo remoto. |
| `git remote -v` | Verifica que el remoto quedo configurado. |
| `git push -u origin main` | Sube la rama `main` al repositorio remoto por primera vez. |

Antes de `git remote add origin`, crear el repositorio en GitHub con el nombre `playwright-FullStack`. No marcar `Add a README file`, `.gitignore` ni licencia si ya existen localmente; asi se evita que GitHub cree un commit inicial diferente y aparezcan conflictos en el primer `push`.

Despues del primer `push`, el flujo normal para subir cambios es:

| Comando | Uso |
| --- | --- |
| `git status` | Revisar cambios locales. |
| `git add .` | Preparar cambios. |
| `git commit -m "Descripcion del cambio"` | Crear commit. |
| `git push` | Subir cambios al remoto. |

## Documentacion de Playwright
Los comandos, metodos, locators, assertions, hooks, fixtures, configuraciones y ejemplos avanzados de Playwright se documentan en:
[playwright-Helper-Documentation.md](./playwright-Helper-Documentation.md)

El README queda como guia principal del proyecto: proposito, requisitos, instalacion inicial y estructura general. La documentacion tecnica de uso diario de Playwright vive en el helper para evitar duplicar informacion.

## Archivos principales del proyecto

| Archivo / carpeta | Uso |
| --- | --- |
| `README.md` | Guia principal del proyecto. |
| `playwright-Helper-Documentation.md` | Helper especializado con comandos, metodos y ejemplos de Playwright. |
| `playwright.config.ts` | Configuracion principal de Playwright. |
| `tsconfig.json` | Configuracion de TypeScript. |
| `tests/` | Carpeta donde viven las pruebas. |
| `.github/workflows/playwright.yml` | Workflow inicial para ejecutar Playwright en GitHub Actions. |
| `package.json` | Dependencias y scripts del proyecto. |
