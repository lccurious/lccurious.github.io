const ROUTE_COLORS = ["#c85032", "#187f7a", "#b67b22", "#316b91", "#755b7e", "#bd682b", "#3d7254"];

const GCJ_PI = Math.PI;
const GCJ_A = 6378245.0;
const GCJ_EE = 0.006693421622965943;

function transformLatitude(x, y) {
  let value = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  value += ((20 * Math.sin(6 * x * GCJ_PI) + 20 * Math.sin(2 * x * GCJ_PI)) * 2) / 3;
  value += ((20 * Math.sin(y * GCJ_PI) + 40 * Math.sin((y / 3) * GCJ_PI)) * 2) / 3;
  value += ((160 * Math.sin((y / 12) * GCJ_PI) + 320 * Math.sin((y * GCJ_PI) / 30)) * 2) / 3;
  return value;
}

function transformLongitude(x, y) {
  let value = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  value += ((20 * Math.sin(6 * x * GCJ_PI) + 20 * Math.sin(2 * x * GCJ_PI)) * 2) / 3;
  value += ((20 * Math.sin(x * GCJ_PI) + 40 * Math.sin((x / 3) * GCJ_PI)) * 2) / 3;
  value += ((150 * Math.sin((x / 12) * GCJ_PI) + 300 * Math.sin((x / 30) * GCJ_PI)) * 2) / 3;
  return value;
}

function toGcj02([latitude, longitude]) {
  if (longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271) {
    return [latitude, longitude];
  }
  let deltaLat = transformLatitude(longitude - 105, latitude - 35);
  let deltaLng = transformLongitude(longitude - 105, latitude - 35);
  const radLat = (latitude / 180) * GCJ_PI;
  let magic = Math.sin(radLat);
  magic = 1 - GCJ_EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  deltaLat = (deltaLat * 180) / (((GCJ_A * (1 - GCJ_EE)) / (magic * sqrtMagic)) * GCJ_PI);
  deltaLng = (deltaLng * 180) / ((GCJ_A / sqrtMagic) * Math.cos(radLat) * GCJ_PI);
  return [latitude + deltaLat, longitude + deltaLng];
}

const overallBounds = L.latLngBounds(
  ROADBOOK_DAYS.flatMap((day) => day.stops.map((stop) => toGcj02(stop.coord))),
);

const map = L.map("map", {
  zoomControl: false,
  attributionControl: true,
  minZoom: 5,
  maxZoom: 17,
  preferCanvas: true,
}).fitBounds(overallBounds, { padding: [55, 55] });

const standardLayer = L.tileLayer(
  "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
  { subdomains: "1234", maxZoom: 18, attribution: "© 高德地图" },
);
const satelliteBase = L.tileLayer(
  "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  { subdomains: "1234", maxZoom: 18, attribution: "© 高德地图" },
);
const satelliteLabels = L.tileLayer(
  "https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
  { subdomains: "1234", maxZoom: 18 },
);
const satelliteLayer = L.layerGroup([satelliteBase, satelliteLabels]);
standardLayer.addTo(map);

const routeLayer = L.featureGroup().addTo(map);
const markerLayer = L.featureGroup().addTo(map);
const routeCache = new Map();
let activeDay = "all";
let activeBaseLayer = "standard";
let renderToken = 0;

function icon(name) {
  const icons = {
    print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3M7 14h10v7H7z"/></svg>',
    bed: '<svg class="stay-icon" viewBox="0 0 40 40" aria-hidden="true"><path d="M6 30V13M34 30v-9a5 5 0 0 0-5-5H17v14M6 22h28M10 16h7v6H6v-2a4 4 0 0 1 4-4Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17.5v.1"/></svg>',
  };
  return icons[name] || "";
}

function navUrl(keyword) {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}&callnative=0`;
}

function markedPlaceKeyword(place) {
  const withoutTime = place.name.replace(/^\d{1,2}:\d{2}\s*/, "");
  const name = withoutTime.includes("｜") ? withoutTime.split("｜").slice(1).join("｜") : withoutTime;
  return `${name} ${place.address}`;
}

function placeCategory(name) {
  if (/^\d{1,2}:\d{2}/.test(name)) return "路线标记";
  if (name.startsWith("医疗｜")) return "医疗";
  if (name.startsWith("休息｜")) return "休息";
  if (/^(补给|张掖补给|加油|零食|饮品|特产)｜/.test(name)) return "补给";
  return "餐饮";
}

function markedPlacesFor(day) {
  return MARKED_PLACES.filter((place) => place.folder === day.folder);
}

function renderRail() {
  document.querySelector("#day-rail-items").innerHTML = ROADBOOK_DAYS.map(
    (item) => `
      <button class="day-chip" type="button" data-day="${item.day}" aria-label="第 ${item.day} 天 ${item.date} ${item.shortRoute}" aria-pressed="false">
        <span>${item.day}</span><small>DAY</small>
      </button>`,
  ).join("");
}

function renderOfficialLinks() {
  return OFFICIAL_LINKS.map(
    (link) => `
      <a class="official-link" href="${link.url}" target="_blank" rel="noreferrer">
        <span><strong>${link.label}</strong><small>${link.note}</small></span><b aria-hidden="true">↗</b>
      </a>`,
  ).join("");
}

function renderOverview() {
  const rows = ROADBOOK_DAYS.map((item) => {
    const middle = item.stops.slice(1, -1).map((stop) => stop.name).join(" · ");
    return `
      <button class="overview-day" type="button" data-day="${item.day}">
        <span class="overview-index">D${item.day}</span>
        <span>
          <span class="overview-route-name">${item.date} · ${item.shortRoute}</span>
          <span class="overview-highlights">${middle || item.stops[0].name}</span>
        </span>
        <span class="overview-distance">${item.distance}</span>
      </button>`;
  }).join("");

  document.querySelector("#guide-content").innerHTML = `
    <div class="guide-inner">
      <div class="eyebrow-row">
        <p class="eyebrow">${ROADBOOK_INFO.direction} · ${ROADBOOK_INFO.days} 天 ${ROADBOOK_INFO.nights} 夜 · ${ROADBOOK_INFO.dates}</p>
        <button class="text-button" type="button" data-action="print" aria-label="打印路书或存为 PDF">${icon("print")} 打印 / 存为 PDF</button>
      </div>
      <h1 class="guide-title">${ROADBOOK_INFO.title}<span class="accent-dot">。</span></h1>
      <p class="guide-lede">曹家堡机场取车后，经乌鞘岭到武威，参观鸠摩罗什寺，再走张掖、嘉峪关、敦煌；进入柴达木后往返察尔汗，经青海中控发电站、德令哈、柏树山与琉璃湖抵达茶卡，最后沿青海湖经同宝山返回机场。</p>
      <div class="route-meta">
        <div class="meta-cell"><span class="meta-label">总里程</span><span class="meta-value">${ROADBOOK_INFO.distance}</span></div>
        <div class="meta-cell"><span class="meta-label">正式路线点</span><span class="meta-value">${ROADBOOK_DAYS.reduce((sum, day) => sum + day.stops.length, 0)} 个</span></div>
        <div class="meta-cell"><span class="meta-label">备选标记</span><span class="meta-value">${MARKED_PLACES.length} 个</span></div>
      </div>
      <section class="section" aria-labelledby="overview-heading">
        <div class="section-heading"><h2 id="overview-heading" class="section-title">七日路线</h2><span class="section-note">点击查看分日轨迹</span></div>
        <div class="overview-route">${rows}</div>
      </section>
      <section class="section" aria-labelledby="official-heading">
        <div class="section-heading"><h2 id="official-heading" class="section-title">出发前实时查询</h2><span class="section-note">官方入口</span></div>
        <div class="official-grid">${renderOfficialLinks()}</div>
        <p class="section-footnote">每天出发前复核实时路况与天气。</p>
      </section>
      <footer class="guide-footer">
        <span class="section-note">实际驾驶以高德实时导航为准</span>
        <button class="next-day" type="button" data-day="1">从第一天出发 ${icon("arrow")}</button>
      </footer>
    </div>`;
}

function renderMarkedPlaces(item) {
  const places = markedPlacesFor(item);
  const categories = ["路线标记", "餐饮", "补给", "休息", "医疗"];
  const groups = categories.map((category) => {
    const rows = places.filter((place) => placeCategory(place.name) === category);
    if (!rows.length) return "";
    return `
      <section class="place-group">
        <div class="place-group-heading"><h3>${category}</h3><span>${rows.length}</span></div>
        <div class="place-list">
          ${rows.map((place) => `
            <article class="place-card">
              <div class="place-card-copy">
                <strong>${place.name}</strong>
                ${place.note ? `<p>${place.note}</p>` : ""}
                <small>${place.address}</small>
              </div>
              <a href="${navUrl(markedPlaceKeyword(place))}" target="_blank" rel="noreferrer" aria-label="在高德地图定位 ${place.name}">高德定位 ↗</a>
            </article>`,
          ).join("")}
        </div>
      </section>`;
  }).join("");

  return `
    <details class="places-drawer">
      <summary><span>沿途备选地点</span><small>${places.length} 个地点</small></summary>
      <div class="places-body">
        <p class="drawer-intro">需要时点开高德定位；餐厅营业时间以当天为准。</p>
        ${groups}
      </div>
    </details>`;
}

function renderRoadServices() {
  const phones = EMERGENCY_PHONES.map(
    (phone) => `<a class="phone-link" href="tel:${phone.number}"><strong>${phone.number}</strong><span>${phone.label}</span></a>`,
  ).join("");
  return `
    <details class="places-drawer road-service-drawer">
      <summary><span>实时路况、天气与应急</span><small>官方入口</small></summary>
      <div class="places-body">
        <div class="official-grid official-grid--compact">${renderOfficialLinks()}</div>
        <div class="phone-grid" aria-label="紧急电话">${phones}</div>
      </div>
    </details>`;
}

function renderDay(dayNumber) {
  const item = ROADBOOK_DAYS[dayNumber - 1];
  const routeChain = item.stops.map((stop) => stop.name).join(" → ");
  const stops = item.stops.map(
    (stop) => `
      <li class="stop">
        <span class="stop-dot" aria-hidden="true"></span>
        <div>
          <div class="stop-main"><span class="stop-name">${stop.name}</span><time class="stop-time">${stop.time}</time></div>
          <p class="stop-copy">${stop.copy}</p>
          <div class="stop-nav-row">
            <span>${stop.address}</span>
            <a class="stop-nav" href="${navUrl(`${stop.nav} ${stop.address}`)}" target="_blank" rel="noreferrer">高德定位 ↗</a>
          </div>
        </div>
      </li>`,
  ).join("");
  const tabs = ROADBOOK_DAYS.map(
    (day) => `<button class="day-tab ${day.day === dayNumber ? "is-active" : ""}" type="button" data-day="${day.day}" aria-label="查看第 ${day.day} 天">${day.day}</button>`,
  ).join("");
  const next = dayNumber === ROADBOOK_DAYS.length ? "all" : dayNumber + 1;
  const nextLabel = dayNumber === ROADBOOK_DAYS.length ? "回到总览" : `下一程 · D${next}`;

  document.querySelector("#guide-content").innerHTML = `
    <div class="guide-inner">
      <div class="eyebrow-row">
        <p class="eyebrow">第 ${dayNumber} 天 · ${item.date}</p>
        <button class="text-button" type="button" data-action="overview">返回总览</button>
      </div>
      <h1 class="guide-title">${item.title}<span class="accent-dot">。</span></h1>
      <p class="guide-lede">${item.shortRoute}</p>
      <div class="route-meta">
        <div class="meta-cell"><span class="meta-label">今日里程</span><span class="meta-value">${item.distance}</span></div>
        <div class="meta-cell"><span class="meta-label">正式路线点</span><span class="meta-value">${item.stops.length} 个</span></div>
        <div class="meta-cell"><span class="meta-label">当晚安排</span><span class="meta-value meta-value--small">${item.stay}</span></div>
      </div>
      <section class="road-brief" aria-label="正式行进路线">
        <div class="road-brief-heading"><span class="road-brief-kicker">正式行进路线</span><span class="traffic-status">驾车</span></div>
        <p class="road-chain">${routeChain}</p>
      </section>
      <div class="schedule-notice">${icon("alert")}<p><strong>行程核对</strong>${item.notice}</p></div>
      <section class="section" aria-labelledby="route-heading-${dayNumber}">
        <div class="section-heading"><h2 id="route-heading-${dayNumber}" class="section-title">当天行车路线</h2><span class="section-note">行程顺序</span></div>
        <ol class="route-timeline">${stops}</ol>
      </section>
      <section class="section" aria-labelledby="places-heading-${dayNumber}">
        <div class="section-heading"><h2 id="places-heading-${dayNumber}" class="section-title">沿途资料</h2><span class="section-note">餐饮 · 补给 · 休整</span></div>
        ${renderMarkedPlaces(item)}
        ${renderRoadServices()}
      </section>
      <section class="section" aria-labelledby="stay-heading-${dayNumber}">
        <div class="stay-note">
          <div><h3 id="stay-heading-${dayNumber}">${dayNumber === 7 ? item.stay : `住在 ${item.stay}`}</h3><p>${item.stayNote}</p><a class="stay-nav" href="${navUrl(item.stayNav)}" target="_blank" rel="noreferrer">高德定位 · ${item.stayNav} ↗</a></div>
          ${icon("bed")}
        </div>
      </section>
      <footer class="guide-footer">
        <div class="day-tabs" aria-label="切换日期">${tabs}</div>
        <button class="next-day" type="button" data-day="${next}">${nextLabel} ${icon("arrow")}</button>
      </footer>
    </div>`;
}

function markerIcon(label, color) {
  return L.divIcon({
    className: "route-marker",
    html: `<div class="marker-shell" style="--marker-color:${color}"><span>${label}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 31],
    tooltipAnchor: [0, -27],
  });
}

function fallbackRoute(item) {
  return item.stops.map((stop) => toGcj02(stop.coord));
}

async function fetchRoadRoute(item) {
  if (routeCache.has(item.day)) return routeCache.get(item.day);
  const coordinates = item.stops.map((stop) => `${stop.coord[1]},${stop.coord[0]}`).join(";");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`,
      { signal: controller.signal },
    );
    if (!response.ok) throw new Error(`Route service returned ${response.status}`);
    const payload = await response.json();
    if (payload.code !== "Ok" || !payload.routes?.[0]?.geometry?.coordinates?.length) throw new Error("No route geometry");
    const route = payload.routes[0].geometry.coordinates.map(([lng, lat]) => toGcj02([lat, lng]));
    routeCache.set(item.day, route);
    return route;
  } finally {
    window.clearTimeout(timeout);
  }
}

function addMarkers(item, color) {
  item.stops.forEach((stop, index) => {
    const label = index === 0 ? "起" : index === item.stops.length - 1 ? "终" : index;
    const direction = index % 2 === 0 ? "top" : "right";
    L.marker(toGcj02(stop.coord), { icon: markerIcon(label, color), keyboard: false })
      .bindTooltip(stop.name, { className: "route-tooltip", direction, permanent: true, offset: [0, -3] })
      .addTo(markerLayer);
  });
}

async function drawDay(item, { fit = true, muted = false, token = renderToken } = {}) {
  let route;
  try {
    route = await fetchRoadRoute(item);
  } catch {
    route = fallbackRoute(item);
  }
  if (token !== renderToken) return;
  const color = ROUTE_COLORS[item.day - 1];
  const halo = L.polyline(route, {
    color: "#f7f1df",
    weight: muted ? 5 : 8,
    opacity: muted ? 0.62 : 0.9,
    lineCap: "round",
    lineJoin: "round",
    interactive: false,
  }).addTo(routeLayer);
  const line = L.polyline(route, {
    color,
    weight: muted ? 2.5 : 4.5,
    opacity: muted ? 0.78 : 1,
    lineCap: "round",
    lineJoin: "round",
    interactive: false,
  }).addTo(routeLayer);
  halo.bringToBack();
  if (fit) map.fitBounds(line.getBounds(), { paddingTopLeft: [88, 96], paddingBottomRight: [56, 70] });
}

async function showOverview() {
  activeDay = "all";
  renderToken += 1;
  const token = renderToken;
  routeLayer.clearLayers();
  markerLayer.clearLayers();
  renderOverview();
  updateNavigation();
  document.querySelector("#map-caption-text").textContent = "逆时针 · 武威 → 张掖 → 敦煌 → 察尔汗 → 德令哈 → 青海湖";
  document.querySelector(".route-swatch").style.background = "var(--vermilion)";
  map.fitBounds(overallBounds, { paddingTopLeft: [80, 90], paddingBottomRight: [50, 55] });
  await Promise.all(ROADBOOK_DAYS.map((item) => drawDay(item, { fit: false, muted: true, token })));
}

async function showDay(dayNumber) {
  const item = ROADBOOK_DAYS[dayNumber - 1];
  activeDay = dayNumber;
  renderToken += 1;
  const token = renderToken;
  routeLayer.clearLayers();
  markerLayer.clearLayers();
  renderDay(dayNumber);
  updateNavigation();
  document.querySelector("#map-caption-text").textContent = `D${dayNumber} · ${item.date} · ${item.shortRoute}`;
  document.querySelector(".route-swatch").style.background = ROUTE_COLORS[dayNumber - 1];
  addMarkers(item, ROUTE_COLORS[dayNumber - 1]);
  map.fitBounds(L.latLngBounds(item.stops.map((stop) => toGcj02(stop.coord))), {
    paddingTopLeft: [88, 96],
    paddingBottomRight: [56, 70],
  });
  await drawDay(item, { fit: true, muted: false, token });
  document.querySelector("#guide-content").scrollTop = 0;
}

function updateNavigation() {
  document.querySelectorAll("[data-day]").forEach((button) => {
    const value = button.dataset.day === "all" ? "all" : Number(button.dataset.day);
    const isActive = value === activeDay;
    button.classList.toggle("is-active", isActive && !button.classList.contains("is-overview"));
    if (button.classList.contains("day-chip")) button.setAttribute("aria-pressed", String(isActive));
  });
}

function fitActiveRoute() {
  const coords = activeDay === "all"
    ? ROADBOOK_DAYS.flatMap((day) => day.stops.map((stop) => toGcj02(stop.coord)))
    : ROADBOOK_DAYS[activeDay - 1].stops.map((stop) => toGcj02(stop.coord));
  map.fitBounds(L.latLngBounds(coords), { paddingTopLeft: [88, 96], paddingBottomRight: [56, 70] });
}

function toggleLayers() {
  if (activeBaseLayer === "standard") {
    map.removeLayer(standardLayer);
    satelliteLayer.addTo(map);
    activeBaseLayer = "satellite";
    document.querySelector("#layer-label").textContent = "标准";
  } else {
    map.removeLayer(satelliteLayer);
    standardLayer.addTo(map);
    activeBaseLayer = "standard";
    document.querySelector("#layer-label").textContent = "卫星";
  }
}

document.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    if (dayButton.dataset.day === "all") showOverview();
    else showDay(Number(dayButton.dataset.day));
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  if (actionButton.dataset.action === "overview") showOverview();
  if (actionButton.dataset.action === "fit") fitActiveRoute();
  if (actionButton.dataset.action === "layers") toggleLayers();
  if (actionButton.dataset.action === "print") {
    window.print();
  }
});

renderRail();
showOverview();
window.addEventListener("resize", () => map.invalidateSize({ animate: false }));
