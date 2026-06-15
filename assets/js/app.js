const grid = document.querySelector("#gallery-grid");
const emptyState = document.querySelector("#empty-state");
const siteCount = document.querySelector("#site-count");
const template = document.querySelector("#site-card-template");

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return dateFormatter.format(date);
}

function renderSite(site) {
  const node = template.content.firstElementChild.cloneNode(true);
  const imageLink = node.querySelector(".thumbnail-button");
  const image = node.querySelector("img");
  const title = node.querySelector("h3");
  const description = node.querySelector(".site-card__description");
  const time = node.querySelector("time");
  const siteButton = node.querySelector(".button--primary");
  const repoButton = node.querySelector(".button--secondary");

  imageLink.href = site.url;
  image.src = site.thumbnail;
  image.alt = `${site.title} のトップページスクリーンショット`;
  title.textContent = site.title;
  description.textContent = site.description || "GitHub Pages site";
  time.dateTime = site.createdAt;
  time.textContent = formatDate(site.createdAt);
  siteButton.href = site.url;
  repoButton.href = site.repoUrl;

  grid.appendChild(node);
}

fetch("./data/sites.json")
  .then((response) => response.json())
  .then((sites) => {
    const sorted = [...sites].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    siteCount.textContent = `${sorted.length} Sites`;
    emptyState.hidden = sorted.length !== 0;
    sorted.forEach(renderSite);
  })
  .catch(() => {
    siteCount.textContent = "0 Sites";
    emptyState.hidden = false;
    emptyState.textContent = "サイト一覧を読み込めませんでした。";
  });
