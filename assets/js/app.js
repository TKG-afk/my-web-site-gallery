const DATA_URL = "./data/sites.json";

const grid = document.querySelector("#gallery-grid");
const emptyState = document.querySelector("#empty-state");
const countLabel = document.querySelector("#site-count");
const template = document.querySelector("#site-card-template");

const collator = new Intl.Collator("ja-JP", {
  numeric: true,
  sensitivity: "base",
});

function parseDateValue(value) {
  if (!value) return 0;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(value) {
  const timestamp = parseDateValue(value);
  if (!timestamp) return "作成日未設定";

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

function normalizeSites(rawSites) {
  if (!Array.isArray(rawSites)) return [];

  return rawSites
    .filter((site) => site && typeof site === "object")
    .map((site) => ({
      title: String(site.title || "Untitled Site").trim(),
      description: String(site.description || "説明文はまだ登録されていません。").trim(),
      url: String(site.url || "").trim(),
      repoUrl: String(site.repoUrl || "").trim(),
      thumbnail: String(site.thumbnail || "").trim(),
      createdAt: String(site.createdAt || "").trim(),
      tags: Array.isArray(site.tags) ? site.tags : [],
    }))
    .sort((a, b) => {
      const dateDiff = parseDateValue(b.createdAt) - parseDateValue(a.createdAt);
      if (dateDiff !== 0) return dateDiff;
      return collator.compare(a.title, b.title);
    });
}

function setThumbnail(card, site) {
  const image = card.querySelector(".thumbnail-button img");

  if (!site.thumbnail) {
    image.hidden = true;
    return;
  }

  image.src = site.thumbnail;
  image.alt = `${site.title} のサムネイル`;
  image.addEventListener(
    "error",
    () => {
      image.hidden = true;
    },
    { once: true },
  );
}

function setLink(link, url) {
  if (!url) {
    link.hidden = true;
    link.removeAttribute("href");
    return;
  }

  link.href = url;
}

function createCard(site) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".site-card");
  const title = card.querySelector("h3");
  const description = card.querySelector(".site-card__description");
  const createdAt = card.querySelector("time");
  const thumbnailButton = card.querySelector(".thumbnail-button");
  const mainButton = card.querySelector(".button--primary");
  const repoButton = card.querySelector(".button--secondary");

  title.textContent = site.title;
  description.textContent = site.description;
  createdAt.textContent = formatDate(site.createdAt);
  if (site.createdAt) createdAt.dateTime = site.createdAt;
  thumbnailButton.setAttribute("aria-label", `${site.title} のトップページを見る`);

  setThumbnail(card, site);
  setLink(thumbnailButton, site.url);
  setLink(mainButton, site.url);
  setLink(repoButton, site.repoUrl);

  return fragment;
}

function renderSites(sites) {
  grid.replaceChildren();
  countLabel.textContent = `${sites.length} ${sites.length === 1 ? "Site" : "Sites"}`;
  emptyState.hidden = sites.length > 0;

  const fragment = document.createDocumentFragment();
  sites.forEach((site) => {
    fragment.append(createCard(site));
  });
  grid.append(fragment);
}

async function loadSites() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${DATA_URL}`);
    const data = await response.json();
    renderSites(normalizeSites(data));
  } catch (error) {
    console.error(error);
    renderSites([]);
  }
}

loadSites();
