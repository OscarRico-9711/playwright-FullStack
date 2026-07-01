# 🚀 Playwright Cheat Sheet

> Referencia rápida para escribir, depurar y estructurar tests con Playwright + TypeScript.
> Usa el índice para saltar directo a lo que necesitas.

<a id="indice"></a>
## 📚 Índice

**Fundamentos**
[Imports](#imports) · [Comandos CLI](#cli) · [Configuración](#config) · [Estructura de un test y Hooks](#test-hooks)

**Interacción con la página**
[Navegación](#navegacion) · [Locators](#locators) · [Acciones](#acciones) · [Inputs](#inputs) · [Checkbox / Radio](#checkbox-radio) · [Select](#select) · [Drag & Drop](#drag-drop) · [Scroll](#scroll) · [Keyboard](#keyboard) · [Mouse](#mouse) · [Frames](#frames) · [Diálogos](#dialogos)

**Esperas y validaciones**
[Esperas](#esperas) · [Assertions](#assertions)

**Archivos y visual**
[Upload / Download](#upload-download) · [Screenshots](#screenshots) · [Visual testing](#visual-testing)

**Red y API**
[Network](#network) · [API testing](#api-testing)

**Arquitectura y sesión**
[Auth / storageState](#auth) · [Page Object Model](#pom) · [Fixtures](#fixtures)

**Extras**
[Accesibilidad (axe)](#accesibilidad) · [Mock de fecha/hora](#clock) · [Debugging](#debugging) · [CI (GitHub Actions)](#ci)

**Cierre**
[Anti-patterns](#anti-patterns) · [Fuentes oficiales](#fuentes)

---

<a id="imports"></a>
## 📦 Imports básicos

```ts
import { test, expect, type Page, type Locator } from '@playwright/test';
```

---

<a id="cli"></a>
## 🧰 Comandos útiles (CLI)

| Comando | Uso |
| --- | --- |
| `npx playwright test` | Ejecutar todas las pruebas. |
| `npx playwright test --ui` | Ejecutar pruebas en modo UI. |
| `npx playwright test --headed` | Ejecutar pruebas con navegador visible. |
| `npx playwright test --debug` | Ejecutar en modo debug con Playwright Inspector. |
| `npx playwright test tests/example.spec.ts` | Ejecutar una prueba o archivo específico. |
| `npx playwright test tests/example.spec.ts:25` | Ejecutar desde una línea específica. |
| `npx playwright test --project=chromium` | Ejecutar pruebas en un navegador/proyecto específico. |
| `npx playwright test --grep '@smoke'` | Ejecutar pruebas que coincidan con un tag o texto. |
| `npx playwright test --grep-invert '@flaky'` | Excluir pruebas que coincidan con un tag o texto. |
| `npx playwright test --repeat-each=5` | Repetir cada test N veces; útil para cazar flakiness. |
| `npx playwright test --workers=1` | Ejecutar con un solo worker; útil para depurar o estabilizar CI. |
| `npx playwright test --retries=2` | Reintentar tests fallidos. |
| `npx playwright test --shard=1/4` | Ejecutar una partición de la suite; útil para CI paralelo. |
| `npx playwright test --update-snapshots` | Actualizar snapshots de visual testing. |
| `npx playwright show-report` | Abrir el último reporte HTML. |
| `npx playwright show-trace trace.zip` | Abrir una traza específica. |
| `npx playwright codegen` | Generar código con Playwright Codegen. |
| `npx playwright codegen https://example.com` | Generar código apuntando a una URL específica. |
| `npx playwright install` | Instalar navegadores requeridos por Playwright. |
| `npx playwright install --with-deps` | Instalar navegadores y dependencias del sistema; útil en Linux/CI. |
| `npx playwright --help` | Ver ayuda general de comandos. |

---

<a id="config"></a>
## ⚙️ Configuración (`playwright.config.ts`)

| Configuración | Ejemplo | Uso |
| --- | --- | --- |
| **testDir** | `testDir: './tests'` | Carpeta donde viven los tests. |
| **timeout** | `timeout: 60_000` | Tiempo máximo por test. |
| **expect.timeout** | `expect: { timeout: 10_000 }` | Tiempo máximo para assertions tipo `expect(locator)`. |
| **fullyParallel** | `fullyParallel: true` | Ejecutar archivos/tests en paralelo. |
| **forbidOnly** | `forbidOnly: !!process.env.CI` | Fallar en CI si queda un `test.only`. |
| **retries** | `retries: process.env.CI ? 2 : 0` | Reintentos automáticos, normalmente solo en CI. |
| **workers** | `workers: process.env.CI ? 2 : undefined` | Número de procesos paralelos; usar `1` solo para debugging o suites con datos compartidos/inestables. |
| **reporter** | `reporter: [['html'], ['list']]` | Reportes de ejecución. |
| **outputDir** | `outputDir: 'test-results'` | Carpeta para screenshots, videos, traces y otros artefactos. |
| **globalSetup** | `globalSetup: require.resolve('./global-setup')` | Script que corre **una vez** antes de toda la suite (sin `page`). |
| **globalTeardown** | `globalTeardown: require.resolve('./global-teardown')` | Script que corre **una vez** al terminar toda la suite. |
| **baseURL** | `baseURL: process.env.BASE_URL` | Permite usar `page.goto('/')` sin repetir dominio. |
| **trace** | `trace: 'on-first-retry'` | Guardar trace para depurar fallos. |
| **screenshot** | `screenshot: 'only-on-failure'` | Screenshot automático cuando falla un test. |
| **video** | `video: 'retain-on-failure'` | Video automático conservado solo si falla. |
| **storageState** | `storageState: 'playwright/.auth/user.json'` | Reutilizar sesión autenticada. |
| **viewport** | `viewport: { width: 1440, height: 900 }` | Tamaño del navegador. |
| **locale** | `locale: 'es-CO'` | Idioma/región del navegador. |
| **timezoneId** | `timezoneId: 'America/Bogota'` | Zona horaria simulada. |
| **projects** | `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]` | Ejecutar en varios browsers/dispositivos. |
| **webServer** | `webServer: { command: 'npm run dev', url: 'http://localhost:3000' }` | Levantar la app antes de correr tests. |
| **extraHTTPHeaders** | `extraHTTPHeaders: { Authorization: 'Bearer token' }` | Headers comunes para API testing. |
| **proxy** | `proxy: { server: 'http://proxy:8080' }` | Ejecutar tests detrás de proxy. |
| **toHaveScreenshot** | `expect: { toHaveScreenshot: { maxDiffPixels: 100 } }` | Tolerancia global para visual testing. |

> **`globalSetup` vs setup project:** `globalSetup` corre una vez, no tiene `page` ni fixtures — úsalo para sembrar BD, arrancar servicios o generar tokens. El **setup project** (con `dependencies`) corre como un test normal, sí tiene navegador, y es el patrón correcto para hacer login y guardar `storageState`. Ver [Auth](#auth).

### Ejemplo base recomendado

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  outputDir: 'test-results',

  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },

  use: {
    baseURL: process.env.BASE_URL ?? 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Ejemplo con configuración para API

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.API_URL ?? 'https://api.example.com',
    extraHTTPHeaders: process.env.API_TOKEN
      ? {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        }
      : {
          Accept: 'application/json',
        },
  },
});
```

### Ejemplo con sesión autenticada

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

> Nota: no subir `playwright/.auth/*.json` al repositorio si contiene cookies, tokens o sesiones reales.

---

<a id="test-hooks"></a>
## 📝 Estructura de un test y Hooks

### Test

| Método | Código | Uso |
| --- | --- | --- |
| **test()** | `test('Login', async ({ page }) => {});` | Crear test. |
| **test.only()** | `test.only('Login', async () => {});` | Ejecutar solo un test. Evitar subirlo. |
| **test.skip()** | `test.skip('Login', async () => {});` | Omitir test. |
| **test.fixme()** | `test.fixme('Bug conocido', async () => {});` | Marcar test pendiente por bug. |
| **test.describe()** | `test.describe('Login', () => {});` | Agrupar tests. |
| **test.describe.serial()** | `test.describe.serial('flujo', () => {});` | Corren en orden; si uno falla, se saltan los siguientes. |
| **test.describe.parallel()** | `test.describe.parallel('grupo', () => {});` | Fuerza paralelo dentro del archivo aunque `fullyParallel` sea false. |
| **test.step()** | `await test.step('Login', async () => {});` | Agrupar pasos del test (mejora el reporte). |
| **test.slow()** | `test.slow();` | Triplica timeout del test. |
| **test.use()** | `test.use({ viewport: { width: 390, height: 844 } });` | Config específica por archivo/test. |

### Hooks

| Método | Código | Uso |
| --- | --- | --- |
| **beforeAll()** | `test.beforeAll(async () => {});` | Antes de todos los tests del archivo. |
| **beforeEach()** | `test.beforeEach(async ({ page }) => {});` | Antes de cada test. |
| **afterEach()** | `test.afterEach(async ({ page }) => {});` | Después de cada test. |
| **afterAll()** | `test.afterAll(async () => {});` | Después de todos los tests del archivo. |

### Tags para suites grandes

```ts
test('crear lead @smoke @critical', async ({ page }) => {
  await page.goto('/leads');
  // ...
});
```

```bash
npx playwright test --grep '@smoke'
npx playwright test --grep-invert '@flaky'
```

---

<a id="navegacion"></a>
## 🌐 Navegación

| Método | Código | Uso |
| --- | --- | --- |
| **goto()** | `await page.goto('https://playwright.dev/');` | Abre una URL. |
| **goto() con baseURL** | `await page.goto('/login');` | Abre una ruta relativa usando `baseURL`. |
| **reload()** | `await page.reload();` | Recarga la página actual. |
| **goBack()** | `await page.goBack();` | Vuelve a la página anterior. |
| **goForward()** | `await page.goForward();` | Avanza a la página siguiente. |
| **url()** | `const url = page.url();` | Obtiene la URL actual. |
| **title()** | `const title = await page.title();` | Obtiene el título de la página. |

### Cambio de pantalla / pestañas / popups

| Caso | Código | Uso |
| --- | --- | --- |
| **Misma pestaña** | `await expect(page).toHaveURL(/dashboard/);` | Validar navegación dentro de la misma página. |
| **Nueva pestaña/popup** | `const popupPromise = page.waitForEvent('popup');` | Crear la promesa antes del click. |
| **Context page** | `const pagePromise = context.waitForEvent('page');` | Esperar una nueva página desde el contexto. |
| **bringToFront()** | `await page2.bringToFront();` | Traer una pestaña al frente. |
| **close()** | `await page2.close();` | Cerrar una pestaña/página. |

#### Popup correcto

```ts
const popupPromise = page.waitForEvent('popup');
await page.getByRole('link', { name: 'Abrir detalle' }).click();

const popup = await popupPromise;
await popup.waitForLoadState();
await expect(popup).toHaveURL(/detalle/);
```

#### Nueva página desde `browserContext`

```ts
const pagePromise = context.waitForEvent('page');
await page.getByText('Abrir nueva pestaña').click();

const page2 = await pagePromise;
await page2.bringToFront();
await expect(page2).toHaveTitle(/Detalle/);
```

---

<a id="locators"></a>
## 🎯 Locators

### Tabla rápida

| Método | Código | Uso |
| --- | --- | --- |
| **locator()** | `page.locator('#username')` | Localizador CSS. |
| **getByRole()** | `page.getByRole('button', { name: 'Login' })` | Localiza por rol accesible. |
| **getByText()** | `page.getByText('Welcome')` | Localiza por texto. |
| **getByLabel()** | `page.getByLabel('Password')` | Localiza por label. |
| **getByPlaceholder()** | `page.getByPlaceholder('Email')` | Localiza por placeholder. |
| **getByTestId()** | `page.getByTestId('save-btn')` | Localiza por test id. |
| **getByAltText()** | `page.getByAltText('Logo')` | Localiza por alt. |
| **getByTitle()** | `page.getByTitle('Settings')` | Localiza por title. |
| **first()** | `page.locator('.item').first()` | Primer elemento. |
| **last()** | `page.locator('.item').last()` | Último elemento. |
| **nth()** | `page.locator('.item').nth(2)` | Elemento por índice. |
| **all()** | `const lista = await page.locator('#output > div > p').all();` | Obtener un array de locators; no auto-espera a que aparezcan todos. |
| **textContent()** | `const texto = await page.locator('h1').textContent();` | Obtener texto manualmente; para validar texto suele ser mejor `expect(locator).toHaveText()`. |
| **filter()** | `page.getByRole('row').filter({ hasText: 'Admin' })` | Filtra una lista ya ubicada; devuelve el `row` que contiene `Admin`. La accion se hace sobre la fila, no sobre el texto. |
| **has** | `page.locator('article', { has: page.getByText('Miami') })` o `page.getByRole('treeitem').filter({ has: page.getByTitle('Home') })` | Filtra padres por un elemento interno; devuelve el padre filtrado. La accion se hace sobre el padre. |
| **hasText** | `page.locator('.card', { hasText: 'Active' })` | Filtra padres por texto interno; devuelve la `.card` completa que contiene `Active`. Es equivalente a `.filter({ hasText: 'Active' })`. |
| **or()** | `botonA.or(botonB)` | Coincide con el primero de los dos que aparezca; útil para UIs variables. |
| **and()** | `page.getByRole('button').and(page.getByTitle('Guardar'))` | Debe cumplir ambos locators a la vez. |
| **CSS combinado** | `page.locator('[id="userName"][placeholder="Full Name"]')` | Busca un mismo elemento que cumpla varios atributos; devuelve ese elemento. |
| **locator encadenado** | `page.getByRole('treeitem').getByText('Home')` | Busca un hijo dentro del contenedor; devuelve el texto `Home`. La accion se hace sobre el hijo. |

### `or()` y `and()`

```ts
// or(): coincide con el primero que aparezca (útil cuando el texto del boton varia)
const confirmar = page
  .getByRole('button', { name: 'Aceptar' })
  .or(page.getByRole('button', { name: 'OK' }));
await confirmar.click();

// and(): debe cumplir ambas condiciones a la vez
const guardar = page.getByRole('button').and(page.getByTitle('Guardar'));
await expect(guardar).toBeVisible();
```

### Tomar un elemento especifico por su número con `first()` y `nth()`

Este patron sirve cuando un locator devuelve varios elementos iguales y se quiere actuar sobre una posicion concreta de la lista. `first()` toma el primer elemento y `nth(2)` toma el tercero, porque el indice empieza en `0`.

Usarlo esta bien cuando la posicion es parte del comportamiento que se quiere probar. Si se usa solo para evitar un error de multiples elementos, normalmente es mejor crear un locator mas especifico.

```ts
const products = page.getByTestId('product-card');

// Primer producto de la lista.
await expect(products.first()).toBeVisible();
await products.first().getByRole('button', { name: 'Ver detalle' }).click();

// Tercer producto de la lista.
await expect(products.nth(2)).toContainText('Disponible');
await products.nth(2).getByRole('button', { name: 'Agregar' }).click();
```

| Parte | Uso |
| --- | --- |
| `page.getByTestId('product-card')` | Encuentra todas las cards de productos. |
| `.first()` | Selecciona la primera card encontrada. |
| `.nth(2)` | Selecciona la tercera card encontrada. |
| `.getByRole('button', ...)` | Busca el boton dentro de la card seleccionada. |

### Buscar un hijo dentro de un padre

Este patron sirve cuando primero se encuentra un contenedor o elemento padre, y luego se busca un elemento hijo dentro de ese resultado. La accion final se hace sobre el hijo encontrado.

```ts
await page
  .getByRole('treeitem')
  .getByText('Home')
  .click();
```

| Parte | Uso |
| --- | --- |
| `page.getByRole('treeitem')` | Encuentra los elementos padre del arbol. |
| `.getByText('Home')` | Busca el texto `Home` dentro de esos padres. |
| `.click()` | Hace click sobre el hijo encontrado: el texto `Home`. |

La idea clave es: cuando encadenas otro locator, bajas a buscar dentro del elemento anterior. En este caso el locator apunta al hijo que tiene el texto `Home`, no al `treeitem` completo.

Mismo patron con CSS:

```ts
await page
  .locator('#userEmail-wrapper input[autocomplete="off"]')
  .fill('test@mail.com');
```

Tambien se puede escribir separando el contenedor y el elemento interno:

```ts
await page
  .locator('#userEmail-wrapper')
  .locator('input[autocomplete="off"]')
  .fill('test@mail.com');
```

| Parte | Uso |
| --- | --- |
| `#userEmail-wrapper` | Encuentra el contenedor por id. |
| `input[autocomplete="off"]` | Busca dentro de ese contenedor un `input` con ese atributo. |
| Espacio entre selectores | Busca descendientes en cualquier nivel, no solo hijos directos. |
| `.locator(...).locator(...)` | Hace lo mismo, pero separando el locator padre y el locator hijo. |

### Contar hijos o descendientes con `>`

Este patron sirve cuando se quiere validar cuantos elementos devuelve un selector. El simbolo `>` en CSS significa "hijo directo".

```ts
await expect(page.locator('#output > div > p')).toHaveCount(4);
```

| Parte | Uso |
| --- | --- |
| `#output` | Elemento padre inicial. |
| `> div` | Busca solo los `div` que son hijos directos de `#output`. |
| `> p` | Busca solo los `p` que son hijos directos de esos `div`. |
| `toHaveCount(4)` | Valida que ese locator devuelva exactamente 4 elementos. |

### Filtrar padres por hijos internos

Este patron sirve cuando un locator puede devolver varios elementos padre y se quiere reducir la lista usando una condicion interna, como texto o un locator hijo. La accion final se hace sobre el padre filtrado.

```ts
const homeTreeItem = page
  .getByRole('treeitem')
  .filter({ has: page.getByTitle('Home') });

await homeTreeItem.locator('.rc-tree-switcher').click();
await homeTreeItem.getByRole('checkbox', { name: 'Select Home' }).click();
```

| Parte | Uso |
| --- | --- |
| `page.getByRole('treeitem')` | Encuentra todos los padres del arbol. |
| `.filter({ has: page.getByTitle('Home') })` | Deja solo el padre que contiene un hijo con `title="Home"`. |
| `homeTreeItem` | Apunta al padre filtrado: el `treeitem` completo. |
| `homeTreeItem.locator('.rc-tree-switcher')` | Busca el switcher dentro del padre `Home`. |
| `homeTreeItem.getByRole('checkbox', { name: 'Select Home' })` | Busca el checkbox dentro del padre `Home`. |

Ejemplo combinando texto interno y un elemento hijo:

```ts
await page
  .getByTestId('card')
  .filter({
    hasText: 'John Doe',
    has: page.getByRole('button', { name: 'Edit' }),
  })
  .click();
```

| Parte | Uso |
| --- | --- |
| `page.getByTestId('card')` | Encuentra todas las cards. |
| `hasText: 'John Doe'` | Deja solo las cards que contienen el texto `John Doe`. |
| `has: page.getByRole('button', { name: 'Edit' })` | Deja solo las cards que tambien contienen un boton `Edit`. |
| `.click()` | Hace click sobre la card que cumple ambas condiciones. |

### Strict mode en locators

Playwright usa strict mode para acciones como `click()`, `fill()` o `check()`. Eso significa que el locator debe apuntar a un solo elemento. Si encuentra varios, el test falla para evitar hacer click en el elemento equivocado.

```ts
// Falla si hay mas de un boton con texto "Save".
await page.getByRole('button', { name: 'Save' }).click();
```

Mejor hacerlo mas especifico usando un contenedor:

```ts
const profileForm = page.getByTestId('profile-form');

await profileForm
  .getByRole('button', { name: 'Save' })
  .click();
```

Usar `first()` o `nth()` solo cuando la posicion realmente importa:

```ts
await page.getByRole('button', { name: 'Save' }).first().click();
```

### Recomendación de prioridad

| Mejor opción | Cuándo usar |
| --- | --- |
| `getByRole()` | Botones, links, headings, tablas, inputs con rol accesible. |
| `getByLabel()` | Inputs de formularios. |
| `getByText()` | Textos visibles únicos. |
| `getByTestId()` | Componentes sin texto estable o UI muy dinámica. |
| `locator()` | Casos específicos con CSS/XPath cuando lo anterior no alcanza. |

---

<a id="acciones"></a>
## 👆 Acciones

| Método | Código | Uso |
| --- | --- | --- |
| **click()** | `await page.getByRole('button', { name: 'Login' }).click();` | Click. |
| **dblclick()** | `await page.getByText('Edit').dblclick();` | Doble click. |
| **hover()** | `await page.getByText('Products').hover();` | Pasar el mouse. |
| **focus()** | `await page.locator('#email').focus();` | Dar foco. |
| **blur()** | `await page.locator('#email').blur();` | Quitar foco. |
| **tap()** | `await page.getByRole('button').tap();` | Tap en móviles (requiere `hasTouch`). |
| **dispatchEvent()** | `await locator.dispatchEvent('click');` | Disparar evento DOM; usar solo si no sirve acción real. |

---

<a id="inputs"></a>
## ✍️ Inputs

| Método | Código | Uso |
| --- | --- | --- |
| **fill()** | `await page.getByPlaceholder('Email').fill('test@mail.com');` | Escribir texto reemplazando el valor. |
| **clear()** | `await page.getByLabel('Email').clear();` | Limpiar input. |
| **press()** | `await page.getByPlaceholder('Search').press('Enter');` | Presionar una tecla. |
| **pressSequentially()** | `await page.locator('#search').pressSequentially('Playwright');` | Simula escritura humana. |
| **inputValue()** | `const value = await page.locator('#email').inputValue();` | Obtener valor del input. |
| **evaluate() con HTMLInputElement** | `const isValid = await page.locator('#email').evaluate((el: HTMLInputElement) => el.checkValidity());` | Validar propiedades/metodos nativos de un input, por ejemplo formato requerido por `pattern` o `required`. |
| **selectText()** | `await page.locator('#email').selectText();` | Seleccionar texto dentro del input. |

---

<a id="checkbox-radio"></a>
## ☑️ Checkbox / Radio

| Método | Código | Uso |
| --- | --- | --- |
| **check()** | `await page.getByRole('checkbox').check();` | Marcar checkbox. |
| **uncheck()** | `await page.getByRole('checkbox').uncheck();` | Desmarcar checkbox. |
| **setChecked()** | `await page.getByRole('checkbox').setChecked(true);` | Forzar estado. |
| **toBeChecked()** | `await expect(page.getByRole('checkbox')).toBeChecked();` | Validar estado marcado. |

---

<a id="select"></a>
## 📋 Select

| Método | Código | Uso |
| --- | --- | --- |
| **selectOption() por value** | `await page.getByRole('combobox').selectOption('admin');` | Seleccionar por value. |
| **selectOption() por label** | `await page.getByRole('combobox').selectOption({ label: 'Admin' });` | Seleccionar por texto visible. |
| **selectOption() múltiple** | `await locator.selectOption(['red', 'blue']);` | Selección múltiple. |

---

<a id="drag-drop"></a>
## 🎭 Drag & Drop

| Método | Código | Uso |
| --- | --- | --- |
| **dragTo()** | `await page.locator('#item').dragTo(page.locator('#target'));` | Arrastrar elemento. |

---

<a id="scroll"></a>
## 📜 Scroll

| Método | Código | Uso |
| --- | --- | --- |
| **scrollIntoViewIfNeeded()** | `await page.locator('#footer').scrollIntoViewIfNeeded();` | Hacer scroll al elemento. |
| **mouse.wheel()** | `await page.mouse.wheel(0, 500);` | Scroll con mouse. |
| **evaluate()** | `await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));` | Scroll vía JS. |

---

<a id="keyboard"></a>
## ⌨️ Keyboard

| Método | Código | Uso |
| --- | --- | --- |
| **keyboard.press()** | `await page.keyboard.press('Control+A');` | Atajo de teclado. |
| **keyboard.type()** | `await page.keyboard.type('Hello');` | Escribir texto. |
| **keyboard.down()** | `await page.keyboard.down('Shift');` | Mantener tecla. |
| **keyboard.up()** | `await page.keyboard.up('Shift');` | Soltar tecla. |

---

<a id="mouse"></a>
## 🖱️ Mouse

| Método | Código | Uso |
| --- | --- | --- |
| **mouse.click()** | `await page.mouse.click(200, 300);` | Click por coordenadas. |
| **mouse.move()** | `await page.mouse.move(500, 300);` | Mover mouse. |
| **mouse.down()** | `await page.mouse.down();` | Presionar botón. |
| **mouse.up()** | `await page.mouse.up();` | Soltar botón. |

---

<a id="frames"></a>
## 🌍 Frames

| Método | Código | Uso |
| --- | --- | --- |
| **frameLocator()** | `page.frameLocator('#frame')` | Acceder a iframe. |
| **locator dentro de frame** | `page.frameLocator('#frame').getByRole('button', { name: 'Pay' })` | Buscar elemento dentro del iframe. |

### Ejemplo frame

```ts
const frame = page.frameLocator('#payment-frame');
await frame.getByLabel('Card number').fill('4242424242424242');
await frame.getByRole('button', { name: 'Pay' }).click();
```

---

<a id="dialogos"></a>
## 🚨 Diálogos

| Tipo / método | Código | Uso |
| --- | --- | --- |
| **alert** | `page.on('dialog', dialog => dialog.accept());` | Aceptar alerta. |
| **confirm accept** | `await dialog.accept();` | Aceptar confirmación. |
| **confirm dismiss** | `await dialog.dismiss();` | Cancelar confirmación. |
| **prompt** | `await dialog.accept('Texto');` | Enviar valor al prompt. |
| **message()** | `dialog.message()` | Leer mensaje del diálogo. |
| **type()** | `dialog.type()` | Obtener tipo: `alert`, `confirm`, `prompt`, `beforeunload`. |
| **beforeunload** | `await page.close({ runBeforeUnload: true });` | Disparar confirmación al cerrar. |

### Aceptar un diálogo

```ts
page.on('dialog', async dialog => {
  expect(dialog.message()).toContain('¿Está seguro?');
  await dialog.accept();
});

await page.getByRole('button', { name: 'Eliminar' }).click();
```

### Cancelar un diálogo

```ts
page.on('dialog', async dialog => {
  await dialog.dismiss();
});

await page.getByRole('button', { name: 'Eliminar' }).click();
```

### Prompt con texto

```ts
page.on('dialog', async dialog => {
  expect(dialog.type()).toBe('prompt');
  await dialog.accept('Oscar');
});

await page.getByRole('button', { name: 'Cambiar nombre' }).click();
```

> Importante: si registras `page.on('dialog')`, debes aceptar o descartar el diálogo. Si solo haces `console.log(dialog.message())`, la acción puede quedarse bloqueada.

---

<a id="esperas"></a>
## ⏳ Esperas

| Método | Código | Uso |
| --- | --- | --- |
| **waitForURL()** | `await page.waitForURL('**/dashboard');` | Esperar URL. |
| **toHaveURL()** | `await expect(page).toHaveURL(/dashboard/);` | Mejor para validar navegación. |
| **waitForLoadState()** | `await page.waitForLoadState('domcontentloaded');` | Esperar carga básica del DOM. |
| **waitForResponse()** | `await page.waitForResponse(r => r.url().includes('/users') && r.status() === 200);` | Esperar respuesta API. |
| **waitForRequest()** | `await page.waitForRequest('**/login');` | Esperar request. |
| **waitForEvent()** | `await page.waitForEvent('popup');` | Esperar evento. |
| **waitForFunction()** | `await page.waitForFunction(() => document.title === 'Home');` | Esperar condición JS. |
| **waitForTimeout()** | `await page.waitForTimeout(1000);` | Espera fija; evitar salvo debugging. |

### Patrón recomendado para eventos

```ts
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/users') && response.status() === 200
);

await page.getByRole('button', { name: 'Buscar' }).click();
const response = await responsePromise;
```

> Recomendación: preferir `expect(locator).toBeVisible()`, `expect(page).toHaveURL()` o esperar una respuesta específica antes que `waitForTimeout()`.

---

<a id="assertions"></a>
## ✅ Assertions

> **Clave para entender flakiness:** las assertions **web-first** (reciben un `Locator`/`Page`/`APIResponse`) **reintentan automáticamente** hasta el `expect.timeout`. Las **genéricas** (reciben un valor ya resuelto) **evalúan una sola vez**, sin reintento — por eso, si comparas un valor que aún no llegó, fallan al instante.

### Auto-retry (web-first) — reintentan hasta el timeout

| Método | Código | Uso |
| --- | --- | --- |
| **toBeVisible()** | `await expect(locator).toBeVisible();` | Visible. |
| **toBeHidden()** | `await expect(locator).toBeHidden();` | Oculto. |
| **toBeAttached()** | `await expect(locator).toBeAttached();` | Existe en el DOM, aunque no necesariamente sea visible. |
| **toBeInViewport()** | `await expect(locator).toBeInViewport();` | Esta dentro del area visible; util despues de hacer scroll. |
| **toBeEnabled()** | `await expect(locator).toBeEnabled();` | Habilitado. |
| **toBeDisabled()** | `await expect(locator).toBeDisabled();` | Deshabilitado. |
| **toBeEditable()** | `await expect(locator).toBeEditable();` | El campo permite escritura. |
| **toBeFocused()** | `await expect(locator).toBeFocused();` | El elemento tiene el foco actual. |
| **toBeChecked()** | `await expect(locator).toBeChecked();` | Marcado. |
| **toBeRequired()** | `await expect(locator).toBeRequired();` | Campo requerido. |
| **toBeInvalid()** | `await expect(locator).toBeInvalid();` | Campo invalido segun validacion HTML. |
| **toBeEmpty()** | `await expect(locator).toBeEmpty();` | El elemento no tiene texto ni hijos. |
| **toHaveText()** | `await expect(locator).toHaveText('Success');` | Texto exacto. |
| **toContainText()** | `await expect(locator).toContainText('Success');` | Contiene texto. |
| **toContainText() ignorando mayúsculas** | `await expect(locator).toContainText(/success/i);` | Contiene texto ignorando mayúsculas/minúsculas. |
| **toHaveValue()** | `await expect(locator).toHaveValue('Oscar');` | Valor del input. |
| **toHaveValues()** | `await expect(locator).toHaveValues(['A', 'B']);` | Varios valores seleccionados (select múltiple). |
| **toHaveAttribute()** | `await expect(locator).toHaveAttribute('atributo', 'valor');` | Atributo y su valor. |
| **toHaveId()** | `await expect(locator).toHaveId('user-name');` | Valida el id exacto. |
| **toHaveJSProperty()** | `await expect(locator).toHaveJSProperty('checked', true);` | Valida una propiedad JavaScript, no solo un atributo HTML. |
| **toHaveClass()** | `await expect(locator).toHaveClass(/active/);` | Valida TODAS las clases (usa regex para una parcial). |
| **toContainClass()** | `await expect(locator).toContainClass('field-error');` | Valida que tenga una clase específica aunque tenga otras. |
| **toHaveCSS()** | `await expect(locator).toHaveCSS('color', 'rgb(255, 0, 0)');` | Valida el CSS calculado por el navegador. |
| **toHaveCount()** | `await expect(locator).toHaveCount(5);` | Cuántos elementos devuelve el locator. |
| **toHaveRole()** | `await expect(locator).toHaveRole('button');` | Valida el rol accesible (ARIA). |
| **toHaveAccessibleName()** | `await expect(locator).toHaveAccessibleName('Enviar');` | Valida el nombre accesible del elemento. |
| **toHaveURL()** | `await expect(page).toHaveURL(/dashboard/);` | URL de la página. |
| **toHaveTitle()** | `await expect(page).toHaveTitle('Dashboard');` | Título de la página. |
| **toBeOK()** | `await expect(response).toBeOK();` | Respuesta API con status 2xx. |

### Genéricas de expect — NO reintentan (evalúan una vez)

| Método | Código | Uso |
| --- | --- | --- |
| **toBe()** | `expect(status).toBe(200);` | Igualdad exacta (primitivos o misma referencia). |
| **toEqual()** | `expect(user).toEqual({ name: 'Oscar' });` | Igualdad profunda de objetos/arrays. |
| **toContain()** | `expect(text).toContain('Success');` | Un string o array contiene un valor. |
| **toHaveProperty()** | `expect(user).toHaveProperty('email');` | Un objeto tiene una propiedad (y opcionalmente su valor). |
| **toMatch()** | `expect(email).toMatch(/@test\.com$/);` | Un string coincide con texto o regex. |
| **toMatchObject()** | `expect(json).toMatchObject({ success: true });` | Objeto parcial. |
| **toBeTruthy()** | `expect(isLoggedIn).toBeTruthy();` | La condición es verdadera. |
| **toBeFalsy()** | `expect(hasError).toBeFalsy();` | La condición es falsa. |
| **toBeGreaterThan()** | `expect(users.length).toBeGreaterThan(0);` | Comparación numérica. |

### `expect.poll` y `expect.soft`

```ts
// expect.poll: reintenta una función custom hasta que cumpla o expire el timeout.
// Útil cuando no hay un assertion web-first directo.
await expect.poll(async () => {
  const res = await request.get('/api/status');
  return res.status();
}, { timeout: 10_000 }).toBe(200);

// expect.soft: NO detiene el test al fallar; reporta todos los fallos al final.
// Ideal para validar varios campos de un formulario en una sola corrida.
await expect.soft(page.getByTestId('nombre')).toHaveText('Oscar');
await expect.soft(page.getByTestId('rol')).toHaveText('Admin');
// el test continúa aunque el primero falle
```

### Ejemplo de validacion de formulario

```ts
const fullName = page.getByLabel('Full Name');

await expect(fullName).toBeRequired();

await fullName.fill('');
await expect(fullName).toBeInvalid();
```

---

<a id="upload-download"></a>
## 📂 Upload / Download

| Método | Código | Uso |
| --- | --- | --- |
| **setInputFiles()** | `await page.locator('input[type=file]').setInputFiles('cv.pdf');` | Subir archivo. |
| **waitForEvent('download')** | `const downloadPromise = page.waitForEvent('download');` | Crear espera antes del click. |
| **saveAs()** | `await download.saveAs('report.pdf');` | Guardar descarga. |
| **suggestedFilename()** | `download.suggestedFilename()` | Obtener nombre sugerido del archivo. |

### Download correcto

```ts
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Descargar' }).click();

const download = await downloadPromise;
await download.saveAs(`downloads/${download.suggestedFilename()}`);
```

---

<a id="screenshots"></a>
## 📸 Screenshots

| Método | Código | Uso |
| --- | --- | --- |
| **page.screenshot()** | `await page.screenshot({ path: 'page.png' });` | Capturar página. |
| **fullPage** | `await page.screenshot({ path: 'full.png', fullPage: true });` | Capturar página completa. |
| **locator.screenshot()** | `await page.locator('#logo').screenshot({ path: 'logo.png' });` | Capturar elemento. |

---

<a id="visual-testing"></a>
## 🖼️ Visual testing

| Método / comando | Código | Uso |
| --- | --- | --- |
| **toHaveScreenshot() página** | `await expect(page).toHaveScreenshot('home.png');` | Comparar screenshot de toda la página. |
| **toHaveScreenshot() elemento** | `await expect(locator).toHaveScreenshot('card.png');` | Comparar screenshot de un componente. |
| **maxDiffPixels** | `await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });` | Permitir diferencia máxima en pixeles. |
| **mask** | `await expect(page).toHaveScreenshot({ mask: [page.getByTestId('clock')] });` | Ocultar zonas dinámicas. |
| **stylePath** | `await expect(page).toHaveScreenshot({ stylePath: './screenshot.css' });` | Aplicar CSS para estabilizar screenshots. |
| **update snapshots** | `npx playwright test --update-snapshots` | Actualizar baselines cuando el cambio visual es esperado. |
| **ignore snapshots** | `npx playwright test --ignore-snapshots` | Ignorar comparaciones visuales temporalmente. |

### Ejemplo visual testing de componente

```ts
test('property card visual', async ({ page }) => {
  await page.goto('/properties');

  const card = page.getByTestId('property-card').first();
  await expect(card).toBeVisible();
  await expect(card).toHaveScreenshot('property-card.png');
});
```

> Recomendación: generar y comparar snapshots en el mismo sistema operativo/browser que usa CI para evitar diferencias por fuentes, rendering o hardware.

---

<a id="network"></a>
## 🌐 Network

| Método | Código | Uso |
| --- | --- | --- |
| **route()** | `await page.route('**/users', route => route.abort());` | Interceptar petición. |
| **fulfill()** | `await route.fulfill({ json: { success: true } });` | Mockear respuesta. |
| **continue()** | `await route.continue();` | Continuar request. |
| **abort()** | `await route.abort();` | Cancelar request. |
| **waitForResponse()** | `await page.waitForResponse('**/api/users');` | Esperar respuesta. |
| **request() event** | `page.on('request', request => console.log(request.url()));` | Escuchar requests. |
| **response() event** | `page.on('response', response => console.log(response.status()));` | Escuchar responses. |

### Mock de API

```ts
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    json: [
      { id: 1, name: 'Oscar', role: 'Admin' },
    ],
  });
});

await page.goto('/users');
await expect(page.getByText('Oscar')).toBeVisible();
```

### Continuar modificando headers

```ts
await page.route('**/api/**', async route => {
  const headers = {
    ...route.request().headers(),
    'x-test-run': 'true',
  };

  await route.continue({ headers });
});
```

---

<a id="api-testing"></a>
## 🔌 API testing

| Método / fixture | Código | Uso |
| --- | --- | --- |
| **request.get()** | `const response = await request.get('/users');` | GET a un endpoint. |
| **request.post()** | `const response = await request.post('/users', { data });` | POST con body JSON. |
| **request.put()** | `await request.put('/users/1', { data });` | Actualizar recurso. |
| **request.patch()** | `await request.patch('/users/1', { data });` | Actualizar parcialmente. |
| **request.delete()** | `await request.delete('/users/1');` | Eliminar recurso. |
| **response.ok()** | `expect(response.ok()).toBeTruthy();` | Validar status 2xx/3xx. |
| **expect(response).toBeOK()** | `await expect(response).toBeOK();` | Assertion directa de respuesta OK. |
| **response.json()** | `const body = await response.json();` | Leer body JSON. |
| **response.status()** | `expect(response.status()).toBe(201);` | Validar status code. |
| **request.newContext()** | `const api = await request.newContext({ baseURL });` | Crear contexto API manual. |

### Test API simple

```ts
import { test, expect } from '@playwright/test';

test('GET users', async ({ request }) => {
  const response = await request.get('/api/users');

  await expect(response).toBeOK();

  const users = await response.json();
  expect(users.length).toBeGreaterThan(0);
});
```

### Crear data por API y validar en UI

```ts
import { test, expect } from '@playwright/test';

test('crear usuario por API y verlo en UI', async ({ request, page }) => {
  const createResponse = await request.post('/api/users', {
    data: {
      name: 'Oscar',
      role: 'Admin',
    },
  });

  await expect(createResponse).toBeOK();

  await page.goto('/users');
  await expect(page.getByText('Oscar')).toBeVisible();
});
```

### Contexto API manual

```ts
import { test, expect, request } from '@playwright/test';

test('GET users con contexto API manual', async () => {
  const api = await request.newContext({
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: process.env.API_TOKEN
      ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
      : {},
  });

  try {
    const response = await api.get('/users');
    await expect(response).toBeOK();
  } finally {
    await api.dispose();
  }
});
```

---

<a id="auth"></a>
## 🔐 Auth / storageState

| Concepto | Código | Uso |
| --- | --- | --- |
| **storageState()** | `await page.context().storageState({ path: 'playwright/.auth/user.json' });` | Guardar sesión. |
| **usar sesión** | `use: { storageState: 'playwright/.auth/user.json' }` | Reutilizar login. |
| **setup project** | `dependencies: ['setup']` | Ejecutar login antes de los tests. |

### `auth.setup.ts`

```ts
import { test as setup, expect } from '@playwright/test';

setup('login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.USER_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

---

<a id="pom"></a>
## 🧱 Page Object Model

```ts
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async expectLoaded() {
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

Uso:

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login válido', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.expectLoaded();
  await loginPage.login('user@mail.com', 'Password123');

  await expect(page).toHaveURL(/dashboard/);
});
```

---

<a id="fixtures"></a>
## 🧰 Fixtures custom

```ts
// fixtures/base.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
```

Uso:

```ts
import { test, expect } from '../fixtures/base';

test('login válido', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login('user@mail.com', 'Password123');

  await expect(page).toHaveURL(/dashboard/);
});
```

---

<a id="accesibilidad"></a>
## ♿ Accesibilidad (axe-core)

Instalar: `npm i -D @axe-core/playwright`

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home sin violaciones de accesibilidad', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### Acotar el análisis

```ts
const results = await new AxeBuilder({ page })
  .include('#main')                 // solo esta zona
  .exclude('#widget-externo')       // ignorar zonas de terceros
  .withTags(['wcag2a', 'wcag2aa'])  // solo reglas WCAG A y AA
  .analyze();

expect(results.violations).toEqual([]);
```

> Tip: para reportes más claros, imprime `results.violations.map(v => v.id)` cuando falle.

---

<a id="clock"></a>
## 🕐 Mock de fecha/hora (page.clock)

Sirve para testear features dependientes del tiempo (contadores, expiraciones, saludos "buenos días", timers) sin esperar en tiempo real.

```ts
// 1. Instalar el reloj con una hora inicial ANTES de navegar.
await page.clock.install({ time: new Date('2024-02-01T10:00:00') });
await page.goto('/');

// 2. Avanzar el tiempo (dispara timers/intervals).
await page.clock.fastForward('02:00');   // 2 minutos
await page.clock.fastForward(30_000);    // 30 segundos

// 3. Fijar una hora concreta sin avanzar timers.
await page.clock.setFixedTime(new Date('2024-12-25T00:00:00'));

// 4. Pausar en un momento y correr manualmente.
await page.clock.pauseAt(new Date('2024-02-01T10:05:00'));
await page.clock.runFor(1_000);          // corre 1 segundo de timers
```

| Método | Uso |
| --- | --- |
| `install({ time })` | Arranca el reloj simulado; llamar antes de `goto()`. |
| `setFixedTime(date)` | Congela `Date.now()` en un valor, sin correr timers. |
| `fastForward(ms \| '05:00')` | Salta el tiempo hacia adelante y ejecuta los timers de ese rango. |
| `pauseAt(date)` | Pausa el reloj en un instante exacto. |
| `runFor(ms)` | Avanza manualmente una cantidad de tiempo. |

---

<a id="debugging"></a>
## 🐞 Debugging

| Herramienta | Cómo | Uso |
| --- | --- | --- |
| **page.pause()** | `await page.pause();` | Pausa el test y abre el Inspector (en modo headed). |
| **--debug** | `npx playwright test --debug` | Corre paso a paso con el Inspector. |
| **PWDEBUG** | `PWDEBUG=1 npx playwright test` | Igual que `--debug` vía variable de entorno. |
| **--ui** | `npx playwright test --ui` | Modo UI: time-travel, watch, logs por test. |
| **Trace viewer** | `npx playwright show-trace trace.zip` | Abrir una traza (con `trace: 'on-first-retry'` en config). |
| **--headed** | `npx playwright test --headed` | Ver el navegador mientras corre. |

```ts
test('debug puntual', async ({ page }) => {
  await page.goto('/');
  await page.pause();               // se detiene aquí y abre el Inspector
  await page.getByRole('button', { name: 'Login' }).click();
});
```

---

<a id="ci"></a>
## 🤖 CI (GitHub Actions)

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

> En CI conviene: `retries: 2`, `workers: 2`, `forbidOnly: true` y `trace: 'on-first-retry'` (ya incluidos en el [ejemplo base](#config)).

---

<a id="anti-patterns"></a>
## 🧨 Anti-patterns

| Evitar | Mejor usar |
| --- | --- |
| `waitForTimeout()` para sincronizar | `expect(locator).toBeVisible()` o `waitForResponse()` específico. |
| Selectores CSS muy frágiles | `getByRole`, `getByLabel`, `getByTestId`. |
| Login por UI en cada test | `storageState`. |
| Repetir selectores en todos los specs | Page Object Model o fixtures. |
| Esperar popup/download después del click | Crear la promesa antes del click. |
| Tests dependientes entre sí | Datos por API, fixtures o setup independiente. |
| Hardcodear URLs/credenciales | `baseURL` y variables de entorno. |
| Hacer mock global sin limpiar contexto | Contextos aislados o rutas por test. |
| Visual testing con datos dinámicos visibles | `mask`, `stylePath` o data estable. |
| Comparar valores con `toBe`/`toEqual` esperando reintento | Usar assertions web-first o `expect.poll()`. |

---

<a id="fuentes"></a>
## 📚 Fuentes oficiales

| Tema | Link |
| --- | --- |
| Configuration | https://playwright.dev/docs/test-configuration |
| Command line | https://playwright.dev/docs/test-cli |
| Locators | https://playwright.dev/docs/locators |
| Assertions | https://playwright.dev/docs/test-assertions |
| API testing | https://playwright.dev/docs/api-testing |
| Dialogs | https://playwright.dev/docs/dialogs |
| Clock (mock time) | https://playwright.dev/docs/clock |
| Accessibility testing | https://playwright.dev/docs/accessibility-testing |
| Visual comparisons | https://playwright.dev/docs/test-snapshots |
| Authentication | https://playwright.dev/docs/auth |
| Fixtures | https://playwright.dev/docs/test-fixtures |
| Page Object Model | https://playwright.dev/docs/pom |
| Debugging | https://playwright.dev/docs/debug |
| CI | https://playwright.dev/docs/ci-intro |
