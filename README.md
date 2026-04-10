# 🤖  Calendar-Bot

> **Automatiza tu calendario y recíbelo en Telegram.**  
> Recibe tus eventos automáticamente, sin instalar apps ni pagar suscripciones.
Simple, rápido y siempre a mano.

---

## ¿De qué va esto?

Olvídate de abrir el calendario cada mañana para ver qué tienes. Este bot lo hace por ti — revisa tus eventos, detecta lo que importa y te lo manda directamente a Telegram cuando toca.

Dos cosas concretas que resuelve:

**🎂 Nunca más olvidar un cumpleaños**  
El bot escanea tu calendario cada mañana. Si alguien cumple años ese día, te avisa con el nombre de la persona y un mensaje de felicitación ya redactado, listo para copiar y enviar. Cero esfuerzo mental.

**📅 La semana, de un vistazo, cada lunes**  
Antes de que empiece la semana, recibes un resumen con todos tus eventos ordenados y clasificados por tipo — viajes, exámenes, reuniones, citas médicas, gym… Para arrancar el lunes con todo claro.

---

## Por qué mola

- **Coste total: 0 €** — ni tarjeta, ni servidor, ni suscripción
- **Sin instalaciones** — todo corre en la nube dentro de tu cuenta de Google
- **Funciona solo** — una vez configurado no hay que tocarlo nunca más
- **Privado** — los datos no salen de tu ecosistema Google
- **Configurable** — puedes añadir más palabras clave y tipos de eventos fácilmente

---

## Stack

| Capa | Tecnología |
|---|---|
| Lógica y ejecución | Google Apps Script |
| Fuente de datos | Google Calendar API |
| Notificaciones | Telegram Bot API |
| Scheduler (cron) | Triggers de Apps Script |
| Hosting | Google (gratuito, incluido en tu cuenta) |

---

## Cómo funciona

```
Cada día a las 8:00
    → Lee todos los eventos de tu Google Calendar
    → Busca eventos con la palabra "cumple"
    → Si encuentra alguno → envía notificación + mensaje sugerido a Telegram

Cada lunes a las 8:00
    → Lee los eventos de los próximos 7 días
    → Los clasifica por tipo y les asigna emoji
    → Envía el resumen completo a Telegram
```

---

## Requisitos

Antes de empezar necesitas tener:

- Una cuenta de **Gmail / Google**
- La app de **Telegram** instalada en el móvil
- Acceso a [script.google.com](https://script.google.com) desde el navegador

Nada más. Sin Node.js, sin Python, sin terminal.

---

## Configuración — paso a paso

### 1. Crear el bot de Telegram

Abre Telegram, busca **@BotFather** y sigue sus instrucciones para crear un bot nuevo. Al terminar te dará un **token** — guárdalo.

Para obtener tu **Chat ID** personal, busca **@userinfobot** en Telegram y pulsa Start. Te lo da al momento.

---

### 2. Crear el proyecto en Apps Script

Ve a [script.google.com](https://script.google.com), crea un nuevo proyecto y ponle el nombre que quieras. Borra el contenido por defecto del editor y pega el código del archivo `code.gs`.

---

### 3. Rellenar la configuración

Al inicio del código hay tres variables que debes rellenar con tus datos:

- `TELEGRAM_TOKEN` → el token que te dio BotFather
- `TELEGRAM_CHAT_ID` → tu ID numérico de Telegram
- `BIRTHDAY_KEYWORD` → la palabra que el bot buscará en tus eventos (por defecto: `"cumple"`)

---

### 4. Ajustar la zona horaria

En el panel de Apps Script ve a **Configuración del proyecto ⚙️** y cambia la zona horaria a `Europe/Madrid`. Así los triggers se ejecutan en tu hora local.

---

### 5. Autorizar permisos

La primera vez que ejecutes cualquier función, Google pedirá que autorices el acceso a tu calendario. Es un proceso estándar de seguridad de Google — solo ocurre una vez.

Ejecuta la función `test()` para verificar que la conexión con Telegram funciona correctamente antes de continuar.

---

### 6. Activar los triggers

En el panel lateral de Apps Script, abre la sección **Triggers (reloj ⏰)** y crea dos:

| Función | Cuándo se ejecuta |
|---|---|
| `checkBirthdays` | Todos los días · entre 8:00 y 9:00 |
| `weeklySummary` | Cada lunes · entre 8:00 y 9:00 |

Listo. A partir de aquí el bot trabaja solo.

---

## Cómo nombrar los eventos de cumpleaños

El bot detecta cualquier evento que contenga la palabra **"cumple"**, sin importar mayúsculas ni posición:

```
✅ cumple Vanessa
✅ Vanessa cumple
✅ Cumple de Juan
✅ cumpleaños Pedro
```

---

## Sincronización con iPhone

El calendario nativo del iPhone no sincroniza con Google Calendar por defecto. Para que el bot lea también tus eventos del iPhone:

1. Ve a **Ajustes → Calendario → Cuentas → Añadir cuenta → Google**
2. Inicia sesión con la misma cuenta de Gmail que usas en Apps Script
3. Activa la sincronización de Calendarios
4. Ve a **Ajustes → Calendario → Calendario por omisión** y selecciona el de Gmail

Desde ese momento, los eventos que crees en el iPhone aparecerán automáticamente en Google Calendar y el bot los leerá sin problemas.

---

## Ejemplo de mensajes en Telegram

**Notificación de cumpleaños:**
```
🎂 ¡Hoy cumple Vanessa!

Mensaje sugerido:
¡Feliz cumpleaños, Vanessa! 🎉 Espero que pases un día increíble
rodeado de las personas que quieres.
```

**Resumen semanal:**
```
📅 Tu semana de un vistazo

✈️ Lun 14/04 — Vuelo Madrid-Lisboa
📝 Mié 16/04 — Examen certificación
💼 Jue 17/04 10:00 — Reunión con cliente
🏥 Vie 18/04 09:30 — Cita médica

4 evento(s) esta semana
```

---

## Solución de problemas

**No llega ningún mensaje**  
Ejecuta `test()` manualmente desde el editor. Si no llega nada, revisa el token y el chat_id.

**Error 400 "message text is empty"**  
Comprueba que la función `sendTelegram` tenga la validación de texto vacío al inicio.

**No detecta cumpleaños**  
Asegúrate de que el evento en Google Calendar contiene exactamente la palabra "cumple". Usa la función `debugCalendar()` para ver qué eventos está leyendo el script.

**Los triggers se ejecutan a deshora**  
Verifica que la zona horaria del proyecto esté en `Europe/Madrid`.

---

## Seguridad

- El código y las credenciales viven dentro de tu cuenta privada de Google Apps Script
- Nadie más tiene acceso a tu script salvo tú
- Si el token de Telegram se compromete, revócalo desde @BotFather con `/revoke` y genera uno nuevo
- No compartas ni subas el archivo con credenciales a repositorios públicos

---

## Posibles mejoras futuras

- Soporte para múltiples calendarios seleccionados por nombre
- Resumen diario opcional además del semanal
- Integración con Google Tasks
- Personalización de mensajes de cumpleaños por persona
- Notificaciones de recordatorio con X horas de antelación

---

*Hecho con Google Apps Script · Telegram Bot API · y ganas de no olvidar más cumpleaños.*
