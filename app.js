/**
 * 泰流行369 行程表 — 从本地 data.json 加载数据
 */
const DATA_URL = "data.json?v=20260625-9";
const UMAMI_WEBSITE_ID = "52e1dec3-5e58-4681-96fe-53e09c223d75";
const THUMBNAIL_ROOT = "images/thumbs/";

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
const EVENT_BUYING_ITEMS = [
  {
    id: "vida-love-lesson-perthsanta",
    title: "VIDA Love Lesson with PerthSanta",
    dateRange: "6月14日 到 7月15日",
    artist: "PerthSanta",
    summary:
      "购买 VIDA 指定保健品满 499 泰铢即可获得抽选机会，50 位幸运粉丝可参加 PerthSanta 近距离特别课堂。",
    images: [
      "images/hddm/6.14-7.15/1.jpeg",
      "images/hddm/6.14-7.15/2.jpeg",
      "images/hddm/6.14-7.15/3.jpeg",
      "images/hddm/6.14-7.15/4.jpeg",
    ],
    detailTitle: "VIDA Love Lesson 活动规则",
    detailSections: [
      {
        heading: "活动介绍",
        body: [
          "VIDA 邀请大家参加 VIDA Love Lesson with PerthSanta。符合条件的参与者将有机会成为 50 位 Lucky Students 之一，参加与 PerthSanta 近距离互动的特别课堂，享受限定的专属时刻。",
          "活动名额有限，最终中奖名单以官方公布为准。",
        ],
      },
      {
        heading: "参与方式",
        body: [
          "在指定参与门店购买 VIDA 保健品，单张收据消费满 499 泰铢即可获得 1 次抽选机会。每张收据可获得的抽选次数不设上限。",
          "收据中必须至少包含 1 件 VIDA Magnesium Bisglycinate Plus 或 VIDA Apple Cider Vinegar。",
          "完成购买后，需要在活动指定登记渠道提交资料。",
        ],
      },
      {
        heading: "活动时间",
        body: [
          "购买并累计抽选机会时间：2026年6月14日 至 2026年7月15日。",
          "登记截止时间：2026年7月16日 23:59。",
          "中奖名单公布：2026年7月31日。",
          "活动日期：2026年8月15日。",
        ],
      },
      {
        heading: "前两日特别条件",
        body: [
          "仅限活动开始前 2 天，即 2026年6月14日 至 2026年6月15日，购买 VIDA 保健品满 499 泰铢，并且收据中包含 VIDA Magnesium Bisglycinate Plus 或 VIDA Apple Cider Vinegar 的顾客，可获得 2 倍抽选机会。",
          "也就是说，在特别期间内符合条件的购买记录，将获得双倍抽选机会。",
        ],
      },
      {
        heading: "50 位幸运中奖者福利",
        body: [
          "1. 参加限定课堂 LOVE LESSON，与 PerthSanta 近距离互动：50 位。",
          "2. 获得由 PerthSanta 送出的 VIDA Love Lesson Bag：50 位。",
          "3. 获得 PerthSanta 双人合照拍立得含签名，形式为 PerthSanta 2:1：随机 20 位。",
          "4. 与 PerthSanta 进行团体合照，形式为 PerthSanta 2:5：随机 30 位。",
          "5. 参加舞台上的 PerthSanta 限定互动游戏：随机 10 位。",
          "6. 获得 PerthSanta 颁发的 Top Student Award：随机 5 位。",
          "7. 写下并分享给 PerthSanta 的个人感想：50 位。",
          "8. 获得限定 Student ID PHOTOBOOTH：50 位。",
          "9. 活动课前享用甜点与饮品，为 LOVE LESSON 补充能量：50 位。",
        ],
      },
      {
        heading: "登记与收据规则",
        body: [
          "登记时间为 2026年6月14日 至 2026年7月16日 23:59。",
          "登记姓名必须与收据或订单资料上的完整姓名完全一致。",
          "符合资格的订单状态必须为已完成。",
          "之后被取消或退款的订单，将视为无效。",
        ],
      },
      {
        heading: "中奖公布与领奖规则",
        body: [
          "中奖名单将于 2026年7月31日 18:00 通过 VIDA 官方渠道公布。",
          "幸运中奖者必须在 2026年8月4日 12:00 前提交证明并确认参加。未在期限内确认者，将视为放弃资格，名额会顺延给名单中的下一位中奖者。",
          "每人限获得 1 份奖项，且必须本人到场参加。奖项不可转让，也不可兑换现金。",
          "活动将于 2026年8月15日举行。",
        ],
      },
      {
        heading: "法律与注意事项",
        body: [
          "价值 1,000 泰铢或以上的奖项，中奖者需自行承担 5% 预扣税。本次奖项价值为每位中奖者 5,000 泰铢。",
          "未满 20 岁的中奖者，必须取得父母或法定监护人的书面同意。",
          "主办方保留无需事先通知即可修改活动条款与条件的权利。如有争议，以主办方最终决定为准。",
          "许可证编号：2/2569，由 Samut Prakan Province 的 Phra Samut Chedi District Office 发出。",
        ],
      },
    ],
  },
  {
    id: "eucerin-once-upon-a-glow-lingling",
    title: "Eucerin presents Once Upon a Glow X LingLing",
    dateRange: "6月12日 到 7月9日",
    artist: "LingLing",
    summary:
      "购买指定 Eucerin Spotless Brightening 产品并登记收据，有机会成为 80 位幸运粉丝之一，参加 LingLing 限定近距离活动。",
    images: [
      "images/hddm/6.12-7.09/1.jpeg",
      "images/hddm/6.12-7.09/2.jpeg",
      "images/hddm/6.12-7.09/3.jpeg",
      "images/hddm/6.12-7.09/4.jpeg",
    ],
    detailTitle: "Eucerin Once Upon a Glow 活动规则",
    detailSections: [
      {
        heading: "活动介绍",
        body: [
          "Eucerin 邀请大家参加 Eucerin presents Once Upon a Glow X LingLing。符合条件的参与者将有机会成为 80 位幸运中奖者之一，近距离见到 LingLing，享受限定且难忘的专属体验。",
          "本次活动主题为 Enchanted Garden，是由粉丝投票选出的最受欢迎主题。活动现场还将有 LingLing 亲自准备的特别惊喜礼物，仅限本次活动提供。",
        ],
      },
      {
        heading: "购买方式",
        body: [
          "在 EVEANDBOY 全国门店，或通过 EVEANDBOY 官方线上渠道，购买参与活动的 Eucerin Spotless Brightening 指定产品。",
          "购买时间为 2026年6月12日 00:01 至 2026年7月9日 23:59，须符合活动条款与条件。",
        ],
      },
      {
        heading: "名额设置",
        body: [
          "本次活动共有 80 位中奖名额。",
          "其中包含 20 位 Special Fans 与 60 位 Lucky Fans。",
          "Special Fans 将根据有效抽选机会数量排序计算；Lucky Fans 将从符合全部活动条款的登记参与者中随机抽选。",
        ],
      },
      {
        heading: "专属福利",
        body: [
          "Top 1 与 Top 2 Special Fans 可获得 LingLing 的限定 Special Gift。",
          "中奖者将有机会参加 Private Talk 环节，并获得 LingLing 的特别明信片。",
          "中奖者可与 LingLing 创造特别回忆，参加 Eucerin presents Once Upon a Glow X LingLing 的限定活动，并享有更多现场专属福利。",
        ],
      },
      {
        heading: "登记方式与时间",
        body: [
          "完成购买后，需要通过活动指定登记渠道提交收据。",
          "登记时间为 2026年6月12日 至 2026年7月9日 23:59 前。",
          "登记资料与收据需符合主办方指定条件。",
        ],
      },
      {
        heading: "中奖公布",
        body: [
          "中奖名单将于 2026年7月21日 12:00 通过 Eucerin Thailand 官方社交媒体渠道公布。",
          "最终中奖资格、领奖方式与现场权益，以主办方公布及确认结果为准。",
        ],
      },
      {
        heading: "活动条款",
        body: [
          "活动条款与条件以主办方规定为准。",
          "许可证编号：91/2569。",
        ],
      },
    ],
  },
  {
    id: "dao-coffee-perth-santa-devils-kiss-concert",
    title: "Dao Coffee แจกบัตร Perth Santa Devil’s Kiss concert",
    dateRange: "6月12日 到 7月4日",
    artist: "PerthSanta",
    summary:
      "购买 Dao Coffee 指定咖啡满 95 泰铢并提交收据，有机会成为 20 位幸运粉丝，获得演唱会门票或合照权益。",
    images: [
      "images/hddm/6.12-7.04/1.jpeg",
      "images/hddm/6.12-7.04/2.jpeg",
      "images/hddm/6.12-7.04/3.jpeg",
      "images/hddm/6.12-7.04/4.jpeg",
    ],
    detailTitle: "Dao Coffee x PerthSanta 活动规则",
    detailSections: [
      {
        heading: "活动介绍",
        body: [
          "Dao Coffee 举办 Perth Santa Devil’s Kiss concert 赠票活动。参与者有机会成为 20 位 Lucky Fans，获得 Perth Santa Devil’s Kiss concert 相关奖项，并在活动中享有与艺人合照的特别权益。",
          "活动日期为 2026年7月19日。",
        ],
      },
      {
        heading: "参与方式",
        body: [
          "在 7-Eleven 任一门店、All Online 或 7-Delivery 购买任意口味、任意规格的 Dao Coffee，单张收据满 95 泰铢即可获得 1 次抽选机会。",
          "每张收据可获得 1 次机会；提交越多符合条件的收据，获得抽选机会越多。",
          "完成购买后，需要通过活动指定登记渠道提交资料。",
          "请保留收据作为领奖证明。收据需包含完整资料，包括收据编号、购买日期、Dao Coffee 商品信息，以及订单成功金额。",
        ],
      },
      {
        heading: "活动时间",
        body: [
          "参与时间：2026年6月12日 00:01 至 2026年7月4日 23:59。",
          "抽奖日期：2026年7月7日。",
          "中奖公布：2026年7月8日。",
          "演唱会及权益使用日期：2026年7月19日。",
        ],
      },
      {
        heading: "奖项设置",
        body: [
          "一等奖：Perth Santa Devil’s Kiss concert 2026年7月19日演唱会门票，并包含与艺人合照权益，形式为 2:1。共 10 份，每份价值 5,500 泰铢。",
          "二等奖：2026年7月19日与艺人合照权益，形式为 2:1，并附 Dao Coffee 礼盒套装。共 10 份，每份价值 965 泰铢。",
          "获得二等奖的中奖者，需自行持有任一日期的 Perth Santa Devil’s Kiss concert 入场门票，方可使用该权益。",
        ],
      },
      {
        heading: "领奖与现场规则",
        body: [
          "中奖者需按主办方指定方式确认资格，并在规定期限内完成确认。",
          "演唱会门票领取地点为 Paragon Hall 5 楼，领取时间为 2026年7月19日 10:30 至 13:00。",
          "合照权益需在演唱会结束后，于 Paragon Hall 5 楼按现场安排登记使用。",
          "具体领奖、确认与现场安排以主办方最终公布为准。",
        ],
      },
      {
        heading: "注意事项",
        body: [
          "活动条款与条件以主办方规定为准。",
          "许可证编号：111/2569。",
        ],
      },
    ],
  },
  {
    id: "cerave-ha-water-gel-the-plump-and-cool-lab",
    title: "CeraVe HA Water Gel The Plump and Cool Lab",
    dateRange: "6月3日 到 7月5日",
    artist: "Tee Wave",
    summary:
      "购买 CeraVe HA Water Gel 搭配指定保湿产品满 999 泰铢并登记收据，有机会参与近距离见面、拍立得合照、游戏与 Hi-Bye 权益。",
    images: [
      "images/hddm/6.03-7.05/1.jpeg",
      "images/hddm/6.03-7.05/2.jpeg",
    ],
    detailTitle: "CeraVe HA Water Gel 活动规则",
    detailSections: [
      {
        heading: "活动介绍",
        body: [
          "CeraVeThailand 邀请大家参与 CeraVe HA Water Gel The Plump and Cool Lab 活动。符合条件的参与者将有机会和 Tee、Wave 近距离互动，留下限定回忆。",
          "活动福利包含近距离团体见面、2:1 拍立得合照与现场签名、上台互动游戏，以及活动结束前的 Hi-Bye 环节。",
        ],
      },
      {
        heading: "参与方式",
        body: [
          "购买至少 1 件 CeraVe HA Water Gel，并搭配参与活动的指定保湿产品，单张收据净消费满 999 泰铢或以上。",
          "参与活动的购买渠道为 BEAUTRIUM 各门店，以及 BEAUTRIUM 官方线上渠道。",
          "完成购买后，需要清楚拍摄收据照片，并通过活动指定登记渠道提交资料，即可获得 1 次 Lucky Draw 登记机会。",
        ],
      },
      {
        heading: "参与商品",
        body: [
          "指定组合需包含 CeraVe HA Water Gel 至少 1 件。",
          "可搭配参与活动的保湿产品，例如 CeraVe Facial Moisturising Lotion PM、CeraVe Facial Moisturising Lotion SPF50 AM、CeraVe Oil Control Moisturising Gel-Cream 等，具体以主办方活动商品清单为准。",
        ],
      },
      {
        heading: "活动时间",
        body: [
          "购买与登记时间：2026年6月3日 至 2026年7月5日。",
          "中奖名单公布：2026年7月10日 16:00。",
          "最终中奖资格、领奖与活动安排，以主办方公布及确认结果为准。",
        ],
      },
      {
        heading: "活动福利",
        body: [
          "Exclusive Group Meeting：近距离参与限定团体见面活动。",
          "2:1 拍立得合照：与 Tee、Wave 进行 2:1 拍立得合照，并获得现场签名。",
          "舞台游戏互动：有机会登台与两位艺人一起参与互动游戏。",
          "Hi-Bye 权益：活动结束前可近距离与艺人道别互动。",
        ],
      },
      {
        heading: "注意事项",
        body: [
          "登记资料与收据需清晰、完整，并符合主办方指定条件。",
          "活动条款与条件以 CeraVeThailand 及主办方规定为准。",
          "许可证编号：1242/2569。",
        ],
      },
    ],
  },
  {
    id: "smooto-live-marathon-lykn",
    title: "7.7 Smooto Live Marathon x LYKN",
    dateRange: "6月16日 到 6月30日",
    artist: "LYKN",
    summary:
      "购买 Smooto 指定唇部产品满 500 泰铢即可获得抽选机会，有机会成为 30 位 Lucky Fans 参与直播活动并获得合照权益。",
    images: [
      "images/hddm/6.16-6.30/1.jpeg",
      "images/hddm/6.16-6.30/2.jpeg",
      "images/hddm/6.16-6.30/3.jpeg",
    ],
    detailTitle: "Smooto Live Marathon x LYKN 活动规则",
    detailSections: [
      {
        heading: "活动介绍",
        body: [
          "Smooto 举办 7.7 Smooto Live Marathon x LYKN 活动。符合条件的参与者将有机会成为 30 位 Lucky Fans 之一，参与 2026年7月7日的直播活动。",
          "活动时间为 2026年7月7日 18:00 至 19:30，将通过 TikTok Live 进行。",
        ],
      },
      {
        heading: "活动时间",
        body: [
          "购买资格期间：2026年6月16日 至 2026年6月30日。",
          "收据登记期间：2026年6月16日 至 2026年7月1日 12:00（泰国时间）。",
          "入选名单公布：2026年7月3日 14:00。",
        ],
      },
      {
        heading: "参与商品",
        body: [
          "参与者需在活动期间购买 Smooto Insta Glam Flash Tint（袋装或盒装）或 Smooto Pumping Jelly Lip（袋装、盒装或棒状装）。",
          "收据或订单确认中，必须至少包含 1 盒 Smooto Insta Glam Flash Tint LYKN Edition，才符合本活动参与资格。",
          "只有符合资格的 Smooto 唇部产品购买金额会被计算为活动抽选机会。",
        ],
      },
      {
        heading: "抽选机会计算",
        body: [
          "每购买参与活动商品满 500 泰铢，可获得 1 次参与活动抽选机会。",
          "500 泰铢 = 1 次机会。",
          "1,000 泰铢 = 2 次机会。",
          "1,500 泰铢 = 3 次机会。",
          "2,000 泰铢 = 4 次机会。",
        ],
      },
      {
        heading: "登记规则",
        body: [
          "参与者必须通过指定登记表提交完整且准确的资料，并附上有效购买证明。",
          "购买证明必须清楚显示购买日期、收据编号或订单编号、商品明细，以及购买金额。",
          "每张收据或每个订单编号只能登记 1 次，不可重复使用。",
          "提交登记表不代表一定能参加活动。入选名单将于 2026年7月3日公布，并通过登记时提供的资料联系入选者。",
        ],
      },
      {
        heading: "活动福利",
        body: [
          "入选者可获得活动席位。",
          "入选者可获得 5:5 数位合照权益，共 1 张。",
        ],
      },
      {
        heading: "注意事项",
        body: [
          "主办方保留根据实际购买金额，核对所有提交资料、购买证明与有效抽选机会数量的权利。",
          "用于参与本活动的商品不可退款、不可换货，也不可在任何情况下退回。",
          "主办方可视情况调整活动条款与条件；所有事项以主办方最终决定为准。",
        ],
      },
    ],
  },
];

const scheduleEl = document.getElementById("schedule");
const statusEl = document.getElementById("schedule-status");
const merchandiseEl = document.getElementById("merchandise");
const groupsEl = document.getElementById("groups");
const eventBuyingEl = document.getElementById("event-buying");
const moduleTabs = [...document.querySelectorAll(".module-tab")];
const todayEventCountEl = document.getElementById("today-event-count");
const merchCountEl = document.getElementById("merch-count");
const moduleScheduleCountEl = document.getElementById("module-schedule-count");
const moduleMerchCountEl = document.getElementById("module-merch-count");
const moduleGroupsCountEl = document.getElementById("module-groups-count");
const moduleEventBuyingCountEl = document.getElementById("module-event-buying-count");
const deferredModules = {
  merchandise: [],
  groups: [],
  merchandiseRendered: false,
  groupsRendered: false,
};

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
    if (Array.isArray(item.images)) {
      record.images = item.images.map((image) => String(image || "").trim()).filter(Boolean);
    }

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

  if (moduleEventBuyingCountEl) {
    moduleEventBuyingCountEl.textContent = String(EVENT_BUYING_ITEMS.length);
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
  const match = String(isoDate || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { tabLabel: isoDate, weekday: "", iso: isoDate };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) {
    return { tabLabel: isoDate, weekday: "", iso: isoDate };
  }
  return {
    tabLabel: `${month}月${day}日`,
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

function getThumbnailUrl(imageUrl) {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (!/^images\//i.test(imageUrl) || imageUrl.startsWith(THUMBNAIL_ROOT)) return imageUrl;
  if (!/\.(jpe?g|png|webp)$/i.test(imageUrl)) return imageUrl;
  return `${THUMBNAIL_ROOT}${imageUrl.slice("images/".length)}`;
}

function resolveImageSources(raw) {
  const original = resolveImageUrl(raw);
  if (!original) return { original: null, display: null };
  return {
    original,
    display: getThumbnailUrl(original),
  };
}

function resolveImageGallery(item) {
  const rawImages = Array.isArray(item?.images) && item.images.length > 0 ? item.images : [item?.image];
  const seen = new Set();
  return rawImages
    .map(resolveImageSources)
    .filter((source) => {
      if (!source.original || seen.has(source.original)) return false;
      seen.add(source.original);
      return true;
    });
}

function wireImageFallback(img, displayUrl, originalUrl, onFinalError) {
  img.addEventListener("error", () => {
    if (displayUrl && originalUrl && displayUrl !== originalUrl && img.dataset.fallbackTried !== "true") {
      img.dataset.fallbackTried = "true";
      img.src = originalUrl;
      return;
    }

    if (typeof onFinalError === "function") {
      onFinalError();
    }
  });
}

function createEventCard(event, index) {
  const alt = index % 2 === 1;
  const gallerySources = resolveImageGallery(event);
  const imageUrl = gallerySources[0]?.original;

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

    const preview = document.createElement("button");
    preview.type = "button";
    preview.className = `event-card__image-button event-card__image-button--count-${Math.min(
      gallerySources.length,
      4
    )}`;
    preview.dataset.scheduleImageSrc = imageUrl;
    preview.dataset.scheduleImageList = JSON.stringify(gallerySources.map((source) => source.original));
    preview.dataset.scheduleImageTitle = event.event
      ? `${event.star || "活动"} · ${event.event} 海报`
      : `${event.star || "活动"} 海报`;
    preview.setAttribute("aria-label", `查看${preview.dataset.scheduleImageTitle}`);

    const visibleSources = gallerySources.slice(0, 4);
    visibleSources.forEach((imageSources, imageIndex) => {
      const tile = document.createElement("span");
      tile.className = "event-card__poster-tile";

      const img = document.createElement("img");
      img.className = "event-card__poster";
      img.src = imageSources.display;
      img.alt = preview.dataset.scheduleImageTitle;
      img.loading = "lazy";
      img.decoding = "async";

      wireImageFallback(img, imageSources.display, imageSources.original, () => {
        tile.remove();
        if (!preview.querySelector(".event-card__poster-tile")) {
          media.remove();
          article.classList.remove("event-card--has-image");
        }
      });

      tile.appendChild(img);
      if (imageIndex === 3 && gallerySources.length > 4) {
        const more = document.createElement("span");
        more.className = "event-card__poster-more";
        more.textContent = `+${gallerySources.length - 4}`;
        tile.appendChild(more);
      }
      preview.appendChild(tile);
    });

    media.appendChild(preview);
    article.appendChild(media);
  }

  article.appendChild(body);
  return article;
}

function createMerchCard(item, index) {
  const imageSources = resolveImageSources(item.image);
  const imageUrl = imageSources.original;
  const article = document.createElement("article");
  article.className = `merch-card${index % 2 === 1 ? " merch-card--alt" : ""}${
    imageUrl ? " merch-card--has-image" : ""
  }`;

  if (imageUrl) {
    const media = document.createElement("button");
    media.type = "button";
    media.className = "merch-card__media";
    media.dataset.merchImageSrc = imageUrl;
    media.dataset.merchImageTitle = item.name ? `${item.name} 商品图` : "明星周边商品图";
    media.setAttribute("aria-label", `查看${media.dataset.merchImageTitle}`);

    const img = document.createElement("img");
    img.className = "merch-card__image";
    img.src = imageSources.display;
    img.alt = media.dataset.merchImageTitle;
    img.loading = "lazy";
    img.decoding = "async";

    wireImageFallback(img, imageSources.display, imageUrl, () => {
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
  const imageSources = resolveImageSources(group.image);
  const imageUrl = imageSources.original;
  const article = document.createElement("article");
  article.className = `group-card${index % 2 === 1 ? " group-card--alt" : ""}${
    imageUrl ? " group-card--has-image" : ""
  }`;

  const media = document.createElement(imageUrl ? "button" : "div");
  media.className = "group-card__media";

  if (imageUrl) {
    media.type = "button";
    media.dataset.groupImageSrc = imageUrl;
    media.dataset.groupImageTitle = group.name ? `${group.name} 群图片` : "追星群组图片";
    media.setAttribute("aria-label", `查看${media.dataset.groupImageTitle}`);

    const img = document.createElement("img");
    img.className = "group-card__image";
    img.src = imageSources.display;
    img.alt = media.dataset.groupImageTitle;
    img.loading = "lazy";
    img.decoding = "async";

    wireImageFallback(img, imageSources.display, imageUrl, () => {
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

function renderDayPanelEvents(panel, events) {
  if (!panel || panel.dataset.rendered === "true") return;
  panel.replaceChildren();

  if (events.length === 0) {
    const empty = document.createElement("p");
    empty.className = "day-panel__empty";
    empty.textContent = "这一天暂无行程安排。";
    panel.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    list.className = "card-list";
    events.forEach((ev, i) => {
      const li = document.createElement("li");
      li.appendChild(createEventCard(ev, i));
      list.appendChild(li);
    });
    panel.appendChild(list);
  }

  panel.dataset.rendered = "true";
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
  panel.dataset.rendered = "false";

  if (!isActive) {
    panel.hidden = true;
  } else {
    panel.classList.add("day-panel--active");
    renderDayPanelEvents(panel, events);
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
  const { tabs, panels, scrollEl, eventsByDate } = tabList;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.date === iso;
    tab.classList.toggle("date-tab--active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.date === iso;

    if (isActive) {
      renderDayPanelEvents(panel, eventsByDate.get(panel.dataset.date) || []);
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
  const eventsByDate = new Map();

  grouped.forEach(([dateKey, events], index) => {
    const isActive = index === 0;
    const { iso } = formatDateMeta(dateKey);
    const tab = createDateTab(dateKey, isActive);
    const panel = createDayPanel(dateKey, events, isActive);

    eventsByDate.set(iso, events);
    tabs.push(tab);
    panels.push(panel);
    scrollEl.appendChild(tab);
    panelsWrap.appendChild(panel);
  });

  const tabList = { tabs, panels, scrollEl, eventsByDate };

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

function getEventBuyingItemById(id) {
  return EVENT_BUYING_ITEMS.find((item) => item.id === id) || EVENT_BUYING_ITEMS[0] || null;
}

function createEventBuyingImage(src, title, index) {
  const imageSources = resolveImageSources(src);
  const imageUrl = imageSources.original;
  if (!imageUrl) return null;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "event-buying-image";
  button.dataset.imageSrc = imageUrl;
  button.dataset.imageTitle = `${title} 图片 ${index + 1}`;
  button.setAttribute("aria-label", `查看${title}图片 ${index + 1}`);

  const img = document.createElement("img");
  img.src = imageSources.display;
  img.alt = `${title} 图片 ${index + 1}`;
  img.loading = "eager";
  img.className = "event-buying-image__img";
  wireImageFallback(img, imageSources.display, imageUrl);
  button.appendChild(img);

  return button;
}

function createEventBuyingGallery(item) {
  const gallery = document.createElement("div");
  gallery.className = "event-buying-gallery";

  const viewport = document.createElement("div");
  viewport.className = "event-buying-gallery__viewport";

  const track = document.createElement("div");
  track.className = "event-buying-gallery__track";

  const images = (item.images || [])
    .map((src, index) => createEventBuyingImage(src, item.title, index))
    .filter(Boolean);

  images.forEach((image) => {
    const slide = document.createElement("div");
    slide.className = "event-buying-gallery__slide";
    slide.appendChild(image);
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  gallery.appendChild(viewport);

  if (images.length > 1) {
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "event-buying-gallery__nav event-buying-gallery__nav--prev";
    prev.dataset.eventBuyingGalleryPrev = "true";
    prev.setAttribute("aria-label", "上一张活动图片");
    prev.textContent = "‹";
    gallery.appendChild(prev);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "event-buying-gallery__nav event-buying-gallery__nav--next";
    next.dataset.eventBuyingGalleryNext = "true";
    next.setAttribute("aria-label", "下一张活动图片");
    next.textContent = "›";
    gallery.appendChild(next);

    const dots = document.createElement("div");
    dots.className = "event-buying-gallery__dots";
    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `event-buying-gallery__dot${
        index === 0 ? " event-buying-gallery__dot--active" : ""
      }`;
      dot.dataset.eventBuyingGalleryDot = String(index);
      dot.setAttribute("aria-label", `查看第 ${index + 1} 张活动图片`);
      dots.appendChild(dot);
    });
    gallery.appendChild(dots);
  }

  return gallery;
}

function getEventBuyingStartSortKey(item) {
  const match = String(item.dateRange || "").match(/(\d{1,2})月(\d{1,2})日/);
  if (!match) return 9999;

  const month = Number(match[1]);
  const day = Number(match[2]);
  if (!month || !day) return 9999;

  return month * 100 + day;
}

function renderEventBuyingList() {
  if (!eventBuyingEl) return;
  eventBuyingEl.replaceChildren();

  const header = document.createElement("div");
  header.className = "event-buying-header";

  const eyebrow = document.createElement("p");
  eyebrow.className = "event-buying-header__eyebrow";
  eyebrow.textContent = "Ticket & Event Service";
  header.appendChild(eyebrow);

  const title = document.createElement("h2");
  title.className = "event-buying-header__title";
  title.textContent = "活动代买";
  header.appendChild(title);

  const intro = document.createElement("p");
  intro.className = "event-buying-header__intro";
  intro.textContent = "可查看正在整理的活动代买信息，进入详情后可看多张活动图、完整说明和规则。";
  header.appendChild(intro);
  eventBuyingEl.appendChild(header);

  const list = document.createElement("ul");
  list.className = "event-buying-list";

  const sortedItems = [...EVENT_BUYING_ITEMS].sort(
    (a, b) => getEventBuyingStartSortKey(a) - getEventBuyingStartSortKey(b)
  );

  sortedItems.forEach((item) => {
    const li = document.createElement("li");
    const article = document.createElement("article");
    article.className = "event-buying-list-card";
    article.dataset.eventBuyingDetail = item.id;
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", `进入${item.title}详情页`);

    const imageSources = resolveImageSources(item.images && item.images[0]);
    const imageUrl = imageSources.original;
    const media = document.createElement("div");
    media.className = imageUrl
      ? "event-buying-list-card__media"
      : "event-buying-list-card__media event-buying-list-card__media--empty";

    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageSources.display;
      img.alt = `${item.title} 活动图片`;
      img.loading = "lazy";
      img.className = "event-buying-list-card__image";
      wireImageFallback(img, imageSources.display, imageUrl);
      media.appendChild(img);
    } else {
      media.textContent = "活动图片";
    }

    const body = document.createElement("div");
    body.className = "event-buying-list-card__body";

    const date = document.createElement("p");
    date.className = "event-buying-list-card__date";
    date.textContent = item.dateRange;
    body.appendChild(date);

    const artist = document.createElement("p");
    artist.className = "event-buying-list-card__artist";
    artist.textContent = `艺人：${item.artist}`;
    body.appendChild(artist);

    const summary = document.createElement("p");
    summary.className = "event-buying-list-card__summary";
    summary.textContent = item.summary;
    body.appendChild(summary);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-buying-list-card__button";
    button.textContent = "进入详情页";
    body.appendChild(button);

    article.appendChild(media);
    article.appendChild(body);
    li.appendChild(article);
    list.appendChild(li);
  });

  eventBuyingEl.appendChild(list);
}

function renderEventBuyingDetail(item) {
  if (!eventBuyingEl || !item) return;
  eventBuyingEl.replaceChildren();

  const detail = document.createElement("article");
  detail.className = "event-buying-detail";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "event-buying-detail__back";
  backButton.dataset.eventBuyingBack = "true";
  backButton.textContent = "返回活动列表";
  detail.appendChild(backButton);

  const header = document.createElement("header");
  header.className = "event-buying-detail__header";

  const date = document.createElement("p");
  date.className = "event-buying-detail__date";
  date.textContent = item.dateRange;
  header.appendChild(date);

  const title = document.createElement("h2");
  title.className = "event-buying-detail__title";
  title.textContent = item.title;
  header.appendChild(title);

  const artist = document.createElement("p");
  artist.className = "event-buying-detail__artist";
  artist.textContent = `艺人：${item.artist}`;
  header.appendChild(artist);

  const summary = document.createElement("p");
  summary.className = "event-buying-detail__summary";
  summary.textContent = item.summary;
  header.appendChild(summary);
  detail.appendChild(header);

  detail.appendChild(createEventBuyingGallery(item));

  const content = document.createElement("div");
  content.className = "event-buying-detail__content";

  (item.detailSections || []).forEach((section) => {
    const block = document.createElement("section");
    block.className = "event-buying-rule-block";

    const heading = document.createElement("h3");
    heading.textContent = section.heading;
    block.appendChild(heading);

    (section.body || []).forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      block.appendChild(p);
    });

    content.appendChild(block);
  });

  const contact = document.createElement("button");
  contact.type = "button";
  contact.className = "event-buying-detail__contact js-copy-wechat";
  contact.textContent = "复制微信号咨询";
  content.appendChild(contact);

  detail.appendChild(content);
  eventBuyingEl.appendChild(detail);
}

function openEventBuyingLightbox(src, title, gallerySources, startIndex = 0) {
  const images = (Array.isArray(gallerySources) && gallerySources.length > 0 ? gallerySources : [src]).filter(
    Boolean
  );
  if (images.length === 0) return;
  let activeIndex = Math.max(0, Math.min(startIndex, images.length - 1));

  const overlay = document.createElement("div");
  overlay.className = "event-buying-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", title || "活动图片预览");

  const close = document.createElement("button");
  close.type = "button";
  close.className = "event-buying-lightbox__close";
  close.setAttribute("aria-label", "关闭");

  const stage = document.createElement("div");
  stage.className = "event-buying-lightbox__stage";
  stage.appendChild(close);

  const img = document.createElement("img");
  img.alt = title || "活动图片预览";
  img.className = "event-buying-lightbox__image";
  stage.appendChild(img);
  overlay.appendChild(stage);

  const counter = document.createElement("div");
  counter.className = "event-buying-lightbox__counter";
  overlay.appendChild(counter);

  const actions = document.createElement("div");
  actions.className = "event-buying-lightbox__actions";

  let prev;
  let next;
  if (images.length > 1) {
    prev = document.createElement("button");
    prev.type = "button";
    prev.className = "event-buying-lightbox__nav event-buying-lightbox__nav--prev";
    prev.setAttribute("aria-label", "上一张");
    prev.textContent = "‹";
    overlay.appendChild(prev);

    next = document.createElement("button");
    next.type = "button";
    next.className = "event-buying-lightbox__nav event-buying-lightbox__nav--next";
    next.setAttribute("aria-label", "下一张");
    next.textContent = "›";
    overlay.appendChild(next);
  }

  const openOriginal = document.createElement("a");
  openOriginal.target = "_blank";
  openOriginal.rel = "noopener";
  openOriginal.download = "";
  openOriginal.className = "event-buying-lightbox__link";
  openOriginal.textContent = "保存图片";
  actions.appendChild(openOriginal);
  overlay.appendChild(actions);

  const renderImage = () => {
    const currentSrc = images[activeIndex];
    img.src = currentSrc;
    openOriginal.href = currentSrc;
    counter.textContent = images.length > 1 ? `${activeIndex + 1} / ${images.length}` : "";
  };

  const showImage = (direction) => {
    activeIndex = (activeIndex + direction + images.length) % images.length;
    renderImage();
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") removeOverlay();
    if (images.length > 1 && event.key === "ArrowLeft") showImage(-1);
    if (images.length > 1 && event.key === "ArrowRight") showImage(1);
  };

  const removeOverlay = () => {
    document.removeEventListener("keydown", handleKeydown);
    overlay.remove();
  };
  close.addEventListener("click", removeOverlay);
  prev?.addEventListener("click", () => showImage(-1));
  next?.addEventListener("click", () => showImage(1));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) removeOverlay();
  });
  document.addEventListener("keydown", handleKeydown);

  renderImage();
  document.body.appendChild(overlay);
  close.focus();
}

function wireScheduleImagePreview() {
  if (!scheduleEl) return;

  scheduleEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-image-src]");
    if (!button) return;
    let gallerySources = [];
    try {
      gallerySources = JSON.parse(button.dataset.scheduleImageList || "[]");
    } catch (error) {
      gallerySources = [];
    }
    openEventBuyingLightbox(
      button.dataset.scheduleImageSrc,
      button.dataset.scheduleImageTitle,
      gallerySources
    );
  });
}

function wireMerchImagePreview() {
  if (!merchandiseEl) return;

  merchandiseEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-merch-image-src]");
    if (!button) return;
    openEventBuyingLightbox(button.dataset.merchImageSrc, button.dataset.merchImageTitle);
  });
}

function wireGroupImagePreview() {
  if (!groupsEl) return;

  groupsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-group-image-src]");
    if (!button) return;
    openEventBuyingLightbox(button.dataset.groupImageSrc, button.dataset.groupImageTitle);
  });
}

function loadAnalyticsWhenIdle() {
  if (!UMAMI_WEBSITE_ID || location.protocol === "file:") return;

  const injectAnalytics = () => {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://cloud.umami.is/script.js";
    script.dataset.websiteId = UMAMI_WEBSITE_ID;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  };

  const scheduleAnalytics = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(injectAnalytics, { timeout: 3500 });
      return;
    }
    window.setTimeout(injectAnalytics, 2500);
  };

  if (document.readyState === "complete") {
    scheduleAnalytics();
    return;
  }

  window.addEventListener("load", scheduleAnalytics, { once: true });
}

function wireEventBuying() {
  if (!eventBuyingEl) return;

  eventBuyingEl.addEventListener("click", (event) => {
    const detailCard = event.target.closest("[data-event-buying-detail]");
    if (detailCard) {
      renderEventBuyingDetail(getEventBuyingItemById(detailCard.dataset.eventBuyingDetail));
      eventBuyingEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (event.target.closest("[data-event-buying-back]")) {
      renderEventBuyingList();
      eventBuyingEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const imageButton = event.target.closest(".event-buying-image");
    if (imageButton) {
      openEventBuyingLightbox(imageButton.dataset.imageSrc, imageButton.dataset.imageTitle);
      return;
    }

    const gallery = event.target.closest(".event-buying-gallery");
    if (!gallery) return;

    const viewport = gallery.querySelector(".event-buying-gallery__viewport");
    if (!viewport) return;

    if (event.target.closest("[data-event-buying-gallery-prev]")) {
      viewport.scrollBy({ left: -viewport.clientWidth, behavior: "smooth" });
      return;
    }

    if (event.target.closest("[data-event-buying-gallery-next]")) {
      viewport.scrollBy({ left: viewport.clientWidth, behavior: "smooth" });
      return;
    }

    const dot = event.target.closest("[data-event-buying-gallery-dot]");
    if (dot) {
      const index = Number(dot.dataset.eventBuyingGalleryDot);
      viewport.scrollTo({ left: viewport.clientWidth * index, behavior: "smooth" });
    }
  });

  eventBuyingEl.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const detailCard = event.target.closest("[data-event-buying-detail]");
    if (!detailCard) return;

    event.preventDefault();
    renderEventBuyingDetail(getEventBuyingItemById(detailCard.dataset.eventBuyingDetail));
    eventBuyingEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  eventBuyingEl.addEventListener("scroll", (event) => {
    const viewport = event.target.closest(".event-buying-gallery__viewport");
    if (!viewport) return;

    const gallery = viewport.closest(".event-buying-gallery");
    const dots = [...gallery.querySelectorAll(".event-buying-gallery__dot")];
    if (dots.length === 0) return;

    const activeIndex = Math.round(viewport.scrollLeft / Math.max(viewport.clientWidth, 1));
    dots.forEach((dot, index) => {
      dot.classList.toggle("event-buying-gallery__dot--active", index === activeIndex);
    });
  }, true);

  renderEventBuyingList();
}

function activateModule(targetId) {
  if (targetId === "merchandise" && !deferredModules.merchandiseRendered) {
    renderMerchandise(deferredModules.merchandise);
    deferredModules.merchandiseRendered = true;
  }

  if (targetId === "groups" && !deferredModules.groupsRendered) {
    renderGroups(deferredModules.groups);
    deferredModules.groupsRendered = true;
  }

  const panels = [scheduleEl, merchandiseEl, groupsEl, eventBuyingEl].filter(Boolean);

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
      const targetId = tab.dataset.moduleTarget;
      if (targetId === "event-buying" && eventBuyingEl?.querySelector(".event-buying-detail")) {
        renderEventBuyingList();
      }
      activateModule(targetId);
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
    deferredModules.merchandise = merchandise;
    deferredModules.groups = groups;
    deferredModules.merchandiseRendered = false;
    deferredModules.groupsRendered = false;
    updateHeroStats(events, merchandise, groups);
    renderSchedule(grouped);
    if (merchandiseEl?.classList.contains("content-panel--active")) {
      renderMerchandise(merchandise);
      deferredModules.merchandiseRendered = true;
    }
    if (groupsEl?.classList.contains("content-panel--active")) {
      renderGroups(groups);
      deferredModules.groupsRendered = true;
    }
  } catch (err) {
    console.error("Failed to load schedule:", err);
    showError(
      "无法加载行程数据。请确认 data.json 与网页在同一目录，并通过本地服务器或网站访问（直接打开 file:// 可能无法读取 JSON）。"
    );
  }
}

wireModuleTabs();
wireScheduleImagePreview();
wireMerchImagePreview();
wireGroupImagePreview();
wireEventBuying();
loadAnalyticsWhenIdle();
loadSchedule();
