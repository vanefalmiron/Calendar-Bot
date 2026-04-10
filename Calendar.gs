// ── CONFIGURACIÓN ──────────────────────────────────────────
var TELEGRAM_TOKEN   = "TELEGRAM_TOKEN";
var TELEGRAM_CHAT_ID = TELEGRAM_CHAT_ID;  // número sin comillas
var BIRTHDAY_KEYWORD = "cumple";

// ── ENVIAR MENSAJE A TELEGRAM ───────────────────────────────
function sendTelegram(text) {
  if (!text || text.trim() === "") return;
  var url = "https://api.telegram.org/bot" + "TELEGRAM_TOKEN" + "/sendMessage";
  var payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "Markdown"
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  UrlFetchApp.fetch(url, options);
}

// ── MÓDULO CUMPLEAÑOS ───────────────────────────────────────
function checkBirthdays() {
  var today = new Date();
  var start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  var end   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  var calendars = CalendarApp.getAllCalendars();
  var found = false;

  calendars.forEach(function(cal) {
    cal.getEvents(start, end).forEach(function(event) {
      var title = event.getTitle();
      if (title.toLowerCase().indexOf(BIRTHDAY_KEYWORD) !== -1) {
        found = true;
        var name = title.toLowerCase()
          .replace(BIRTHDAY_KEYWORD, "")
          .trim();
        name = name.charAt(0).toUpperCase() + name.slice(1);

        var mensajes = [
          "¡Feliz cumpleaños, " + name + "! 🎉 Espero que pases un día increíble rodeado de las personas que quieres.",
          "¡Hoy es tu día, " + name + "! 🥳 Que este año nuevo esté lleno de cosas buenas para ti. ¡Felicidades!",
          "¡Muchas felicidades, " + name + "! 🎂 Que este año te traiga todo lo que mereces.",
          "¡Feliz cumple, " + name + "! Espero que lo estés celebrando como se merece. Un abrazo enorme. 🎈"
        ];
        var mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
        sendTelegram("🎂 *¡Hoy cumple " + name + "!*\n\nMensaje sugerido:\n_" + mensaje + "_");
      }
    });
  });

  if (!found) {
    sendTelegram("📅 *Sin cumpleaños hoy*\nNadie cumple años hoy. ¡Disfruta el día! 😊");
  }
}

// ── MÓDULO RESUMEN SEMANAL ──────────────────────────────────
function weeklySummary() {
  var now = new Date();
  var end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  var emojiMap = {
    "viaje": "✈️", "vuelo": "✈️", "tren": "🚆",
    "examen": "📝", "entrega": "📝",
    "reunión": "💼", "meeting": "💼", "zoom": "💻",
    "médico": "🏥", "cita": "📋",
    "gym": "💪", "entreno": "💪",
    "cumple": "🎂"
  };

  function getEmoji(title) {
    var t = title.toLowerCase();
    for (var key in emojiMap) {
      if (t.indexOf(key) !== -1) return emojiMap[key];
    }
    return "📌";
  }

  function formatDate(date) {
    var days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
    var d   = days[date.getDay()];
    var day = String(date.getDate()).padStart(2, "0");
    var mon = String(date.getMonth() + 1).padStart(2, "0");
    var h   = String(date.getHours()).padStart(2, "0");
    var m   = String(date.getMinutes()).padStart(2, "0");
    return (date.getHours() === 0 && date.getMinutes() === 0)
      ? d + " " + day + "/" + mon
      : d + " " + day + "/" + mon + " " + h + ":" + m;
  }

  var calendars = CalendarApp.getAllCalendars();
  var lines = ["📅 *Tu semana de un vistazo*\n"];
  var count = 0;

  calendars.forEach(function(cal) {
    cal.getEvents(now, end).forEach(function(event) {
      var title = event.getTitle();
      if (!title) return;
      lines.push(getEmoji(title) + " *" + formatDate(event.getStartTime()) + "* — " + title);
      count++;
    });
  });

  if (count === 0) {
    sendTelegram("📅 *Resumen semanal*\n\nSin eventos esta semana. ¡A descansar! 🎉");
    return;
  }

  lines.push("\n_" + count + " evento(s) esta semana_");
  sendTelegram(lines.join("\n"));
}


