# 🤖 Bot Calendario → Telegram

Automatización personal conectada a Google Calendar que envía notificaciones a Telegram con dos funcionalidades: recordatorio de cumpleaños con mensaje sugerido y resumen semanal de actividades.

**Stack:** Google Apps Script · Google Calendar API · Telegram Bot API  
**Coste:** 0 € / mes  
**Sin servidor, sin tarjeta, sin instalaciones**

---

## ¿Qué hace?

### 🎂 Recordatorio de cumpleaños
Cada mañana el bot revisa tu Google Calendar buscando eventos que contengan la palabra **"cumple"** (ej: "cumple Vanessa" o "Vanessa cumple"). Si encuentra alguno, envía una notificación a Telegram con el nombre de la persona y un mensaje de felicitación listo para copiar y pegar.

### 📅 Resumen semanal
Cada lunes envía un resumen con todos los eventos de los próximos 7 días, clasificados automáticamente con emojis según el tipo de evento (viaje, examen, reunión, médico, gym…).

---

## Requisitos previos

- Cuenta de Google (Gmail)
- App de Telegram instalada
- Acceso a [script.google.com](https://script.google.com)

---

## Paso 1 — Crear el bot de Telegram

1. Abre Telegram y busca **@BotFather**
2. Envía el comando `/newbot`
3. Sigue las instrucciones: elige nombre y username para el bot
4. BotFather te dará un **token** con este formato:
   ```
   123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Guarda ese token, lo necesitarás más adelante

### Obtener tu Chat ID

1. Busca **@userinfobot** en Telegram y pulsa Start
2. Te responderá automáticamente con tu `id` numérico
3. Guarda ese número

---

## Paso 2 — Crear el proyecto en Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **Nuevo proyecto**
3. Renómbralo (ej: "Bot Calendario Telegram")
4. Borra el contenido por defecto del editor

---

## Paso 3 — Pegar el código de Calendar.gs

---

## Paso 4 — Configurar la zona horaria

1. Haz clic en el icono del **engranaje ⚙️** (Configuración del proyecto) en el menú izquierdo
2. En **Zona horaria** selecciona `Europe/Madrid` (o la que corresponda)
3. Guarda

---

## Paso 5 — Autorizar el acceso al calendario

1. En el desplegable del editor selecciona la función `test`
2. Pulsa **Ejecutar**
3. Google te pedirá que autorices permisos — acéptalos
4. Comprueba que te llega el mensaje "🤖 Prueba de conexión exitosa" en Telegram

Este paso solo ocurre una vez.

---

## Paso 6 — Configurar los triggers (cron)

1. Haz clic en el icono del **reloj** (Triggers) en el menú izquierdo
2. Pulsa **Añadir trigger** y crea los dos siguientes:

| Función | Tipo de evento | Frecuencia | Hora |
|---|---|---|---|
| `checkBirthdays` | Temporizador | Cada día | Entre 8:00 y 9:00 |
| `weeklySummary` | Temporizador | Cada semana · Lunes | Entre 8:00 y 9:00 |

---

## Cómo nombrar los eventos de cumpleaños

El bot detecta cualquier evento que contenga la palabra **"cumple"** (sin distinguir mayúsculas):

```
✅ cumple Vanessa
✅ Vanessa cumple
✅ Cumple de Juan
✅ cumpleaños Pedro   ← también detecta "cumpleaños"
```

---

## Sincronizar el iPhone con Google Calendar

Por defecto el calendario nativo del iPhone no sincroniza con Google. Para que el bot lea tus eventos:

1. En el iPhone ve a **Ajustes → Calendario → Cuentas → Añadir cuenta → Google**
2. Inicia sesión con la misma cuenta de Gmail del script
3. Activa la sincronización de Calendarios
4. Ve a **Ajustes → Calendario → Calendario por omisión** y selecciona el de Gmail

A partir de ahí los eventos nuevos del iPhone se sincronizan automáticamente con Google Calendar.

---

## Estructura del código

```
Apps Script (script.google.com)
│
├── sendTelegram(text)       — función base de envío
├── checkBirthdays()         — detecta "cumple" en eventos del día
├── weeklySummary()          — resumen de eventos de los próximos 7 días
└── test()                   — prueba de conexión
```

---

## Solución de problemas

**No llega ningún mensaje**
Ejecuta la función `test()` manualmente desde el editor. Si no llega nada, revisa que el token y el chat_id sean correctos.

**Error 400 "message text is empty"**
Asegúrate de que la función `sendTelegram` tenga el guard `if (!text || text.trim() === "") return;` al inicio.

**No detecta cumpleaños**
Comprueba que el evento en Google Calendar contiene exactamente la palabra "cumple". Ejecuta esta función de diagnóstico:

```javascript
function debugCalendar() {
  var today = new Date();
  var start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  var end   = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 23, 59, 59);
  var calendars = CalendarApp.getAllCalendars();
  Logger.log("Calendarios: " + calendars.length);
  calendars.forEach(function(cal) {
    Logger.log("→ " + cal.getName());
    cal.getEvents(start, end).forEach(function(e) {
      Logger.log("   " + e.getTitle());
    });
  });
}
```

**Los triggers se ejecutan a deshora**
Verifica que la zona horaria del proyecto esté configurada en `Europe/Madrid` (Configuración ⚙️ del proyecto).

---

## Seguridad

- El token de Telegram y el chat_id están directamente en el código dentro de Apps Script, que es privado a tu cuenta de Google
- No subas este archivo a ningún repositorio público sin eliminar las credenciales
- Si el token se compromete, revócalo desde @BotFather con el comando `/revoke`
