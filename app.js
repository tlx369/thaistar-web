/**
 * Thai Star Schedule — loads rows from published Google Sheet (CSV).
 */
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2Esk6BpiuVRHrY0KHAUs95xvKCk25DVRCqOJketwJjixqIawkba0FyLvVdtw05CH8T9okh-j3A2kw/pub?output=csv";

const COLUMNS = ["date", "time", "star", "event", "location", "type", "notes", "image"];
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

/** Group by date; tabs ordered oldest → newest (ascending). */
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

function formatDateMeta(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return { tabLabel: isoDate, weekday: "", iso: isoDate };
  }
  return {
    tabLabel: `${d.getMonth() + 1}月${d.getDate()}日`,
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

/** Returns a safe image URL, or null if missing / invalid. */
function resolveImageUrl(raw) {
  const value = (raw || "").trim();
  if (!value) return null;

  const driveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

function createEventCard(event, index) {
  const alt = index % 2 === 1;
  const imageUrl = resolveImageUrl(event.image);

  const article = document.createElement("article");
  article.className = `event-card${alt ? " event-card--alt" : ""}${
    imageUrl ? " event-card--has-image" : ""
  }`;

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

  if (imageUrl) {
    const media = document.createElement("div");
    media.className = "event-card__media";

    const img = document.createElement("img");
    img.className = "event-card__poster";
    img.src = imageUrl;
    img.alt = event.event
      ? `${event.star || "活动"} · ${event.event} 海报`
      : `${event.star || "活动"} 海报`;
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
      media.remove();
      article.classList.remove("event-card--has-image");
    });

    media.appendChild(img);
    article.appendChild(media);
  }

  article.appendChild(body);
  return article;
}

function createDayPanel(dateKey, events, isActive) {
  const { iso } = formatDateMeta(dateKey);
  const panelId = `panel-${iso}`;
  const tabId = `tab-${iso}`;

  const panel = document.createElement("section");
  panel.className = "day-panel";
  panel.id = panelId;
  panel.role = "tabpanel";
  panel.setAttribute("aria-labelledby", tabId);
  panel.dataset.date = iso;

  if (!isActive) {
    panel.hidden = true;
  } else {
    panel.classList.add("day-panel--active");
  }

  const list = document.createElement("ul");
  list.className = "card-list";

  if (events.length === 0) {
    const empty = document.createElement("p");
    empty.className = "day-panel__empty";
    empty.textContent = "这一天暂无行程安排。";
    panel.appendChild(empty);
  } else {
    events.forEach((ev, i) => {
      const li = document.createElement("li");
      li.appendChild(createEventCard(ev, i));
      list.appendChild(li);
    });
    panel.appendChild(list);
  }

  return panel;
}

function createDateTab(dateKey, isActive) {
  const { tabLabel, weekday, iso } = formatDateMeta(dateKey);
  const tabId = `tab-${iso}`;
  const panelId = `panel-${iso}`;

  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = `date-tab${isActive ? " date-tab--active" : ""}`;
  tab.id = tabId;
  tab.role = "tab";
  tab.setAttribute("aria-selected", isActive ? "true" : "false");
  tab.setAttribute("aria-controls", panelId);
  tab.tabIndex = isActive ? 0 : -1;
  tab.dataset.date = iso;

  const label = document.createElement("span");
  label.className = "date-tab__label";
  label.textContent = tabLabel;
  tab.appendChild(label);

  if (weekday) {
    const wd = document.createElement("span");
    wd.className = "date-tab__weekday";
    wd.textContent = weekday;
    tab.appendChild(wd);
  }

  return tab;
}

function scrollTabIntoView(tab, scrollContainer) {
  if (!tab || !scrollContainer) return;
  const tabRect = tab.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
    tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

const PANEL_TRANSITION_MS = 280;

function activateDateTab(iso, tabList) {
  const { tabs, panels, scrollEl } = tabList;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.date === iso;
    tab.classList.toggle("date-tab--active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.date === iso;

    if (isActive) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("day-panel--active"));
      return;
    }

    if (panel.classList.contains("day-panel--active")) {
      panel.classList.remove("day-panel--active");
      window.setTimeout(() => {
        if (!panel.classList.contains("day-panel--active")) {
          panel.hidden = true;
        }
      }, PANEL_TRANSITION_MS);
    } else {
      panel.hidden = true;
      panel.classList.remove("day-panel--active");
    }
  });

  const activeTab = tabs.find((t) => t.dataset.date === iso);
  scrollTabIntoView(activeTab, scrollEl);
}

function wireTabKeyboard(tabs, tabList) {
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
      let nextIndex = index;
      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        e.preventDefault();
      } else if (e.key === "Home") {
        nextIndex = 0;
        e.preventDefault();
      } else if (e.key === "End") {
        nextIndex = tabs.length - 1;
        e.preventDefault();
      } else {
        return;
      }
      tabs[nextIndex].focus();
      activateDateTab(tabs[nextIndex].dataset.date, tabList);
    });
  });
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

  const shell = document.createElement("div");
  shell.className = "schedule-shell";

  const tabsNav = document.createElement("nav");
  tabsNav.className = "date-tabs";
  tabsNav.setAttribute("role", "tablist");
  tabsNav.setAttribute("aria-label", "选择日期");

  const scrollEl = document.createElement("div");
  scrollEl.className = "date-tabs__scroll";

  const panelsWrap = document.createElement("div");
  panelsWrap.className = "schedule-panels";

  const tabs = [];
  const panels = [];

  grouped.forEach(([dateKey, events], index) => {
    const isActive = index === 0;
    const tab = createDateTab(dateKey, isActive);
    const panel = createDayPanel(dateKey, events, isActive);

    tabs.push(tab);
    panels.push(panel);
    scrollEl.appendChild(tab);
    panelsWrap.appendChild(panel);
  });

  const tabList = { tabs, panels, scrollEl };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("date-tab--active")) return;
      activateDateTab(tab.dataset.date, tabList);
    });
  });

  wireTabKeyboard(tabs, tabList);

  tabsNav.appendChild(scrollEl);
  shell.appendChild(tabsNav);
  shell.appendChild(panelsWrap);
  scheduleEl.appendChild(shell);
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
