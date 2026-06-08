/**
 * 泰流行369 行程表 — 从本地 data.json 加载数据
 */
const DATA_URL = `data.json?v=${Date.now()}`;

const EVENT_FIELDS = ["date", "time", "star", "event", "location", "type", "notes", "image"];
const MERCH_FIELDS = ["name", "star", "category", "price", "status", "image", "notes"];
const GROUP_FIELDS = ["name", "image"];
const MERCH_SEARCH_FIELDS = ["name", "star", "category", "price", "status", "notes"];
const MERCH_CATEGORY_ALL = "全部";
const MERCH_CATEGORY_OTHER = "其它";
const MERCH_CATEGORIES = [
  MERCH_CATEGORY_ALL,
  "娃娃",
  "小卡",
  "衣服",
  "徽章",
  "代言",
  MERCH_CATEGORY_OTHER,
];
const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const scheduleEl = document.getElementById("schedule");
const statusEl = document.getElementById("schedule-status");
const merchandiseEl = document.getElementById("merchandise");
const groupsEl = document.getElementById("groups");
const moduleTabs = [...document.querySelectorAll(".module-tab")];
const todayEventCountEl = document.getElementById("today-event-count");
const merchCountEl = document.getElementById("merch-count");
const moduleScheduleCountEl = document.getElementById("module-schedule-count");
const moduleMerchCountEl = document.getElementById("module-merch-count");
const moduleGroupsCountEl = document.getElementById("module-groups-count");

/** 将 data.json 解析为统一的事件列表 */
function normalizeEvents(data) {
  let list = [];
  if (Array.isArray(data)) {
    list = data;
  } else if (data && Array.isArray(data.events)) {
    list = data.events;
  }

  const events = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;

    const record = {};
    EVENT_FIELDS.forEach((key) => {
      const value = item[key];
      record[key] = value == null ? "" : String(value).trim();
    });

    if (!record.date && !record.star && !record.event) continue;
    events.push(record);
  }

  return events;
}

function normalizeMerchandise(data) {
  const list = data && Array.isArray(data.merchandise) ? data.merchandise : [];
  const merchandise = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;

    const record = {};
    MERCH_FIELDS.forEach((key) => {
      const value = item[key];
      record[key] = value == null ? "" : String(value).trim();
    });

    if (!record.name && !record.star && !record.category) continue;
    merchandise.push(record);
  }

  return merchandise;
}

function normalizeGroups(data) {
  const list = data && Array.isArray(data.groups) ? data.groups : [];
  const groups = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;

    const record = {};
    GROUP_FIELDS.forEach((key) => {
      const value = item[key];
      record[key] = value == null ? "" : String(value).trim();
    });

    if (!record.name && !record.image) continue;
    groups.push(record);
  }

  return groups;
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

function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isTodayOrFutureEvent(event) {
  if (!event.date) return true;
  return event.date >= getTodayDateKey();
}

function updateHeroStats(events, merchandise, groups = []) {
  const today = getTodayDateKey();
  const todayEventCount = events.filter((event) => event.date === today).length;

  if (todayEventCountEl) {
    todayEventCountEl.textContent = String(todayEventCount);
  }

  if (merchCountEl) {
    merchCountEl.textContent = String(merchandise.length);
  }

  if (moduleScheduleCountEl) {
    moduleScheduleCountEl.textContent = String(events.filter(isTodayOrFutureEvent).length);
  }

  if (moduleMerchCountEl) {
    moduleMerchCountEl.textContent = String(merchandise.length);
  }

  if (moduleGroupsCountEl) {
    moduleGroupsCountEl.textContent = String(groups.length);
  }
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

function createMerchStatusBadge(status) {
  const value = status.trim() || "咨询";
  const span = document.createElement("span");
  span.className = "merch-card__status";
  span.dataset.status = value;
  span.textContent = value;
  return span;
}

/** Returns image src: https URL, Google Drive link, or site-relative path. */
function resolveImageUrl(raw) {
  const value = (raw || "").trim();
  if (!value) return null;

  const driveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  if (/^https?:\/\//i.test(value)) {
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

  // Block other protocols (javascript:, data:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  if (value.includes("..")) return null;

  // Local / site-relative path (e.g. images/202606/03/foo.jpeg)
  return value.replace(/^\.\//, "");
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

  if (meta.childNodes.length > 0) {
    body.appendChild(meta);
  }

  const star = event.star?.trim();
  if (star) {
    const artist = document.createElement("h3");
    artist.className = "event-card__artist";
    artist.textContent = `艺人：${star}`;
    body.appendChild(artist);
  }

  const location = event.location?.trim();
  if (location) {
    const loc = document.createElement("p");
    loc.className = "event-card__location";
    const locationPrefix = isOnlineType(event.type || "") ? "频道：" : "地址：";
    loc.textContent = `${locationPrefix}${location}`;
    body.appendChild(loc);
  }

  const eventName = event.event?.trim();
  if (eventName) {
    const title = document.createElement("p");
    title.className = "event-card__title";
    title.textContent = `活动：${eventName}`;
    body.appendChild(title);
  }

  const notesText = event.notes?.trim();
  if (notesText) {
    const notes = document.createElement("p");
    notes.className = "event-card__notes";
    notes.textContent = `注：${notesText}`;
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

function createMerchCard(item, index) {
  const imageUrl = resolveImageUrl(item.image);
  const article = document.createElement("article");
  article.className = `merch-card${index % 2 === 1 ? " merch-card--alt" : ""}${
    imageUrl ? " merch-card--has-image" : ""
  }`;

  if (imageUrl) {
    const media = document.createElement("div");
    media.className = "merch-card__media";

    const img = document.createElement("img");
    img.className = "merch-card__image";
    img.src = imageUrl;
    img.alt = item.name ? `${item.name} 商品图` : `${item.star || "明星周边"} 商品图`;
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
      media.remove();
      article.classList.remove("merch-card--has-image");
    });

    media.appendChild(img);
    article.appendChild(media);
  }

  const body = document.createElement("div");
  body.className = "merch-card__body";

  const meta = document.createElement("div");
  meta.className = "merch-card__meta";

  if (item.category) {
    const category = document.createElement("span");
    category.className = "merch-card__category";
    category.textContent = item.category;
    meta.appendChild(category);
  }

  meta.appendChild(createMerchStatusBadge(item.status));
  body.appendChild(meta);

  const title = document.createElement("h3");
  title.className = "merch-card__title";
  title.textContent = item.name || "明星周边";
  body.appendChild(title);

  if (item.star) {
    const star = document.createElement("p");
    star.className = "merch-card__star";
    star.textContent = `艺人：${item.star}`;
    body.appendChild(star);
  }

  const footer = document.createElement("div");
  footer.className = "merch-card__footer";

  const price = document.createElement("p");
  price.className = "merch-card__price";
  price.textContent = item.price || "咨询";
  footer.appendChild(price);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "merch-card__contact js-copy-wechat";
  button.textContent = "微信咨询";
  button.setAttribute("aria-label", `复制微信号咨询${item.name || "明星周边"}`);
  footer.appendChild(button);
  body.appendChild(footer);

  if (item.notes) {
    const notes = document.createElement("p");
    notes.className = "merch-card__notes";
    notes.textContent = item.notes;
    body.appendChild(notes);
  }

  article.appendChild(body);
  return article;
}

function createGroupCard(group, index) {
  const imageUrl = resolveImageUrl(group.image);
  const article = document.createElement("article");
  article.className = `group-card${index % 2 === 1 ? " group-card--alt" : ""}${
    imageUrl ? " group-card--has-image" : ""
  }`;

  const media = document.createElement("div");
  media.className = "group-card__media";

  if (imageUrl) {
    const img = document.createElement("img");
    img.className = "group-card__image";
    img.src = imageUrl;
    img.alt = group.name ? `${group.name} 群图片` : "追星群组图片";
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
      media.classList.add("group-card__media--empty");
      media.replaceChildren("暂无群图");
      article.classList.remove("group-card--has-image");
    });

    media.appendChild(img);
  } else {
    media.classList.add("group-card__media--empty");
    media.textContent = "暂无群图";
  }

  const body = document.createElement("div");
  body.className = "group-card__body";

  const label = document.createElement("p");
  label.className = "group-card__label";
  label.textContent = "微信群";
  body.appendChild(label);

  const title = document.createElement("h3");
  title.className = "group-card__title";
  title.textContent = group.name || "追星群组";
  body.appendChild(title);

  article.appendChild(media);
  article.appendChild(body);
  return article;
}

function getMerchCategory(item) {
  const category = item.category?.trim();
  if (!category) return MERCH_CATEGORY_OTHER;
  return MERCH_CATEGORIES.includes(category) ? category : MERCH_CATEGORY_OTHER;
}

function matchesMerchSearch(item, keyword) {
  const q = keyword.trim().toLowerCase();
  if (!q) return true;

  return MERCH_SEARCH_FIELDS.some((field) => item[field]?.toLowerCase().includes(q));
}

function getFilteredMerchandise(items, category, keyword) {
  return items.filter((item) => {
    const inCategory = category === MERCH_CATEGORY_ALL || getMerchCategory(item) === category;
    return inCategory && matchesMerchSearch(item, keyword);
  });
}

function renderMerchGrid(listEl, countEl, emptyEl, items, activeCategory, keyword) {
  const filtered = getFilteredMerchandise(items, activeCategory, keyword);
  listEl.replaceChildren();

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.appendChild(createMerchCard(item, index));
    listEl.appendChild(li);
  });

  countEl.textContent = `${activeCategory} · ${filtered.length} 个周边`;
  emptyEl.hidden = filtered.length > 0;
  listEl.hidden = filtered.length === 0;
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
    empty.textContent = "暂无行程数据，请在 data.json 中添加活动。";
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

function renderMerchandise(items) {
  if (!merchandiseEl) return;
  merchandiseEl.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "merch-empty";
    empty.textContent = "暂无明星周边，请稍后再来看看。";
    merchandiseEl.appendChild(empty);
    return;
  }

  const shell = document.createElement("div");
  shell.className = "merch-shell";

  const header = document.createElement("div");
  header.className = "merch-section-header";

  const title = document.createElement("h2");
  title.className = "merch-section-header__title";
  title.textContent = "明星周边";
  header.appendChild(title);

  const intro = document.createElement("p");
  intro.className = "merch-section-header__intro";
  intro.textContent = "按大类查看周边，也可以在当前大类内搜索明星名或商品名。";
  header.appendChild(intro);
  shell.appendChild(header);

  const controls = document.createElement("div");
  controls.className = "merch-controls";

  const categoryTabs = document.createElement("div");
  categoryTabs.className = "merch-category-tabs";
  categoryTabs.setAttribute("role", "tablist");
  categoryTabs.setAttribute("aria-label", "选择周边大类");

  const searchWrap = document.createElement("label");
  searchWrap.className = "merch-search";

  const searchText = document.createElement("span");
  searchText.className = "merch-search__label";
  searchText.textContent = "搜索";
  searchWrap.appendChild(searchText);

  const searchInput = document.createElement("input");
  searchInput.className = "merch-search__input";
  searchInput.type = "search";
  searchInput.placeholder = "明星名 / 产品名 / 关键字";
  searchInput.autocomplete = "off";
  searchWrap.appendChild(searchInput);

  controls.appendChild(categoryTabs);
  controls.appendChild(searchWrap);
  shell.appendChild(controls);

  const resultMeta = document.createElement("p");
  resultMeta.className = "merch-result-meta";
  shell.appendChild(resultMeta);

  const list = document.createElement("ul");
  list.className = "merch-grid";
  shell.appendChild(list);

  const noResults = document.createElement("p");
  noResults.className = "merch-results-empty";
  noResults.textContent = "当前大类下没有匹配的周边。";
  noResults.hidden = true;
  shell.appendChild(noResults);

  let activeCategory = MERCH_CATEGORY_ALL;

  const updateResults = () => {
    renderMerchGrid(list, resultMeta, noResults, items, activeCategory, searchInput.value);
  };

  MERCH_CATEGORIES.forEach((category) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `merch-category-tab${
      category === activeCategory ? " merch-category-tab--active" : ""
    }`;
    tab.textContent = category;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", category === activeCategory ? "true" : "false");

    tab.addEventListener("click", () => {
      activeCategory = category;
      [...categoryTabs.children].forEach((btn) => {
        const isActive = btn.textContent === activeCategory;
        btn.classList.toggle("merch-category-tab--active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      updateResults();
    });

    categoryTabs.appendChild(tab);
  });

  searchInput.addEventListener("input", updateResults);
  updateResults();

  merchandiseEl.appendChild(shell);
}

function renderGroups(groups) {
  if (!groupsEl) return;
  groupsEl.replaceChildren();

  if (groups.length === 0) {
    const empty = document.createElement("p");
    empty.className = "groups-empty";
    empty.textContent = "暂无追星群组，请稍后再来看看。";
    groupsEl.appendChild(empty);
    return;
  }

  const shell = document.createElement("div");
  shell.className = "groups-shell";

  const header = document.createElement("div");
  header.className = "groups-section-header";

  const title = document.createElement("h2");
  title.className = "groups-section-header__title";
  title.textContent = "追星群组";
  header.appendChild(title);

  const intro = document.createElement("p");
  intro.className = "groups-section-header__intro";
  intro.textContent = "添加感兴趣的微信群，和同担一起看行程、约线下、收情报。";
  header.appendChild(intro);
  shell.appendChild(header);

  const list = document.createElement("ul");
  list.className = "groups-grid";

  groups.forEach((group, index) => {
    const li = document.createElement("li");
    li.appendChild(createGroupCard(group, index));
    list.appendChild(li);
  });

  shell.appendChild(list);
  groupsEl.appendChild(shell);
}

function activateModule(targetId) {
  const panels = [scheduleEl, merchandiseEl, groupsEl].filter(Boolean);

  panels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.classList.toggle("content-panel--active", isActive);
    panel.hidden = !isActive;
  });

  moduleTabs.forEach((tab) => {
    const isActive = tab.dataset.moduleTarget === targetId;
    tab.classList.toggle("module-tab--active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function wireModuleTabs() {
  moduleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateModule(tab.dataset.moduleTarget);
    });
  });
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
  updateHeroStats([], [], []);

  if (statusEl) {
    scheduleEl.replaceChildren(statusEl);
    statusEl.hidden = false;
  } else {
    scheduleEl.replaceChildren();
    const status = document.createElement("p");
    status.className = "schedule-status";
    status.id = "schedule-status";
    status.innerHTML =
      '<span class="schedule-status__spinner" aria-hidden="true"></span>正在加载行程数据…';
    scheduleEl.appendChild(status);
  }

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const events = normalizeEvents(data);
    const merchandise = normalizeMerchandise(data);
    const groups = normalizeGroups(data);
    const grouped = groupByDate(events.filter(isTodayOrFutureEvent));

    if (statusEl) statusEl.remove();
    updateHeroStats(events, merchandise, groups);
    renderSchedule(grouped);
    renderMerchandise(merchandise);
    renderGroups(groups);
  } catch (err) {
    console.error("Failed to load schedule:", err);
    showError(
      "无法加载行程数据。请确认 data.json 与网页在同一目录，并通过本地服务器或网站访问（直接打开 file:// 可能无法读取 JSON）。"
    );
  }
}

wireModuleTabs();
loadSchedule();
