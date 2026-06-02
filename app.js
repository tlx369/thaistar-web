/**
 * Thai Star Schedule — loads rows from published Google Sheet (CSV).
 */
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2Esk6BpiuVRHrY0KHAUs95xvKCk25DVRCqOJketwJjixqIawkba0FyLvVdtw05CH8T9okh-j3A2kw/pub?output=csv";

const COLUMNS = ["date", "time", "star", "event", "location", "type", "notes"];
const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const scheduleEl = document.getElementById("schedule");
const statusEl = document.getElementById("schedule-status");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || (c === "\r" && text[i + 1] === "\n")) {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      if (c === "\r") i++;
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
}

function rowsToEvents(tableRows) {
  if (tableRows.length < 2) return [];

  const header = tableRows[0].map((h) => h.trim().toLowerCase());
  const events = [];

  for (let r = 1; r < tableRows.length; r++) {
    const cells = tableRows[r];
    const record = {};
    COLUMNS.forEach((key) => {
      const idx = header.indexOf(key);
      record[key] = idx >= 0 ? (cells[idx] ?? "").trim() : "";
    });

    if (!record.date && !record.star && !record.event) continue;
    events.push(record);
  }

  return events;
}

function timeSortKey(timeStr) {
  if (!timeStr) return 99999;
  const isPm = /下午|PM/i.test(timeStr);
  const isAm = /上午|AM/i.test(timeStr);
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 50000;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (isPm && h < 12) h += 12;
  if (isAm && h === 12) h = 0;
  if (!isAm && !isPm && /PM/i.test(timeStr) && h < 12) h += 12;
  return h * 60 + m;
}

function groupByDate(events) {
  const map = new Map();
  for (const ev of events) {
    const key = ev.date || "unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ev);
  }

  for (const list of map.values()) {
    list.sort((a, b) => timeSortKey(a.time) - timeSortKey(b.time));
  }

  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function formatDateHeading(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return { label: isoDate, weekday: "", iso: isoDate };
  }
  return {
    label: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`,
    weekday: WEEKDAYS[d.getDay()],
    iso: isoDate,
  };
}

function isOnlineType(type) {
  const t = type.trim();
  if (!t) return false;
  if (/线下|offline|现场/i.test(t)) return false;
  return /线上|online|直播/i.test(t);
}

function createBadge(type) {
  const online = isOnlineType(type);
  const span = document.createElement("span");
  span.className = online ? "badge badge--online" : "badge badge--offline";
  span.textContent = type.trim() || (online ? "线上" : "线下");
  return span;
}

function createEventCard(event, index) {
  const online = isOnlineType(event.type);
  const alt = index % 2 === 1;

  const article = document.createElement("article");
  article.className = `event-card${alt ? " event-card--alt" : ""}`;

  const accent = document.createElement("div");
  accent.className = `event-card__accent${alt ? " event-card__accent--pink" : ""}`;
  accent.setAttribute("aria-hidden", "true");

  const body = document.createElement("div");
  body.className = "event-card__body";

  const meta = document.createElement("div");
  meta.className = "event-card__meta";

  if (event.time) {
    const time = document.createElement("time");
    time.className = "event-card__time";
    time.dateTime = event.date ? `${event.date}T${event.time}` : "";
    time.textContent = event.time;
    meta.appendChild(time);
  }

  if (event.type) {
    meta.appendChild(createBadge(event.type));
  }

  const artist = document.createElement("h3");
  artist.className = "event-card__artist";
  artist.textContent = event.star || "—";

  const title = document.createElement("p");
  title.className = "event-card__title";
  title.textContent = event.event || "—";

  body.appendChild(meta);
  body.appendChild(artist);
  body.appendChild(title);

  if (event.location) {
    const loc = document.createElement("p");
    loc.className = "event-card__location";
    loc.textContent = event.location;
    body.appendChild(loc);
  }

  if (event.notes) {
    const notes = document.createElement("p");
    notes.className = "event-card__notes";
    notes.textContent = event.notes;
    body.appendChild(notes);
  }

  article.appendChild(accent);
  article.appendChild(body);
  return article;
}

function renderSchedule(grouped) {
  scheduleEl.replaceChildren();

  if (grouped.length === 0) {
    const empty = document.createElement("p");
    empty.className = "schedule-empty";
    empty.textContent = "暂无行程数据，请在 Google 表格中添加活动。";
    scheduleEl.appendChild(empty);
    return;
  }

  for (const [dateKey, events] of grouped) {
    const { label, weekday, iso } = formatDateHeading(dateKey);

    const section = document.createElement("section");
    section.className = "day-group";
    section.dataset.date = iso;

    const heading = document.createElement("h2");
    heading.className = "day-group__heading";

    const timeEl = document.createElement("time");
    timeEl.dateTime = iso;
    timeEl.textContent = label;
    heading.appendChild(timeEl);

    if (weekday) {
      const wd = document.createElement("span");
      wd.className = "day-group__weekday";
      wd.textContent = weekday;
      heading.appendChild(wd);
    }

    const list = document.createElement("ul");
    list.className = "card-list";

    events.forEach((ev, i) => {
      const li = document.createElement("li");
      li.appendChild(createEventCard(ev, i));
      list.appendChild(li);
    });

    section.appendChild(heading);
    section.appendChild(list);
    scheduleEl.appendChild(section);
  }
}

function showError(message) {
  scheduleEl.replaceChildren();
  const box = document.createElement("div");
  box.className = "schedule-error";
  box.setAttribute("role", "alert");

  const p = document.createElement("p");
  p.textContent = message;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "schedule-error__retry";
  btn.textContent = "重试";
  btn.addEventListener("click", loadSchedule);

  box.appendChild(p);
  box.appendChild(btn);
  scheduleEl.appendChild(box);
}

async function loadSchedule() {
  if (statusEl) {
    scheduleEl.replaceChildren(statusEl);
    statusEl.hidden = false;
  } else {
    scheduleEl.replaceChildren();
    const status = document.createElement("p");
    status.className = "schedule-status";
    status.id = "schedule-status";
    status.innerHTML =
      '<span class="schedule-status__spinner" aria-hidden="true"></span>正在从 Google 表格加载行程…';
    scheduleEl.appendChild(status);
  }

  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();
    const tableRows = parseCSV(text);
    const events = rowsToEvents(tableRows);
    const grouped = groupByDate(events);

    if (statusEl) statusEl.remove();
    renderSchedule(grouped);
  } catch (err) {
    console.error("Failed to load schedule:", err);
    showError(
      "无法加载行程数据。请确认表格已发布到网络，并通过本地服务器或网站域名访问本页（直接打开 file:// 可能无法跨域请求）。"
    );
  }
}

loadSchedule();
