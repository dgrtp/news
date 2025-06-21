function renderFeed(data, targetId, siteUrl, title) {
  const container = document.getElementById(targetId);
  if (!container) return;

  let html = `
    <div class="feed-header" style="display:flex;align-items:center;margin-bottom:10px;">
      <div style="background:#aab793;color:#fff;padding:6px 12px;font-weight:bold;font-size:14px;">${title}</div>
      <div style="flex:1;height:1px;border-bottom:2px dotted #bbb;margin:0 10px;"></div>
      <a href="${siteUrl}" style="font-size:13px;color:#0b8043;text-decoration:none;font-weight:bold;">TAMPILKAN SELENGKAPNYA &raquo;</a>
    </div>
    <div class="feed-content" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;">`;

  const entries = data.feed.entry || [];
  for (let i = 0; i < Math.min(entries.length, 4); i++) {
    const entry = entries[i];
    const title = entry.title.$t;
    const link = entry.link.find(l => l.rel === 'alternate').href;
    const content = entry.content?.$t || entry.summary?.$t || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    const image = imgMatch ? imgMatch[1] : 'https://via.placeholder.com/300x200?text=No+Image';
    const descText = content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';

    html += `
      <div style="background:#f5f5f5;padding:10px;border-radius:8px;">
        <a href="${link}" target="_blank" style="text-decoration:none;color:inherit;">
          <img src="${image}" style="width:100%;height:auto;border-radius:6px;margin-bottom:8px;">
          <h4 style="margin:0 0 6px;font-size:16px;">${title}</h4>
          <p style="margin:0;font-size:14px;color:#444;">${descText}</p>
        </a>
      </div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".feed-box").forEach((box, index) => {
    const site = box.getAttribute("data-feed");
    const targetId = box.getAttribute("data-target");
    const title = box.getAttribute("data-title") || "Feed";
    const callbackName = `showFeed${index}`;

    // Buat container yang akan diisi
    const innerDiv = document.createElement("div");
    innerDiv.id = targetId;
    box.appendChild(innerDiv);

    // Buat function global callback
    window[callbackName] = (data) => renderFeed(data, targetId, site, title);

    // Buat <script> JSONP Blogger
    const script = document.createElement("script");
    script.src = `${site}/feeds/posts/default?alt=json-in-script&callback=${callbackName}`;
    document.body.appendChild(script);
  });
});
