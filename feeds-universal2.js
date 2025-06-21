function fetchFeeds() {
  document.querySelectorAll(".feed-box").forEach((box, index) => {
    const feedUrl = box.dataset.feed;
    const targetId = box.dataset.target;
    const title = box.dataset.title;

    // Tambahkan elemen target
    const container = document.createElement("div");
    container.id = targetId;
    box.appendChild(container);

    // Buat callback unik
    const callbackName = `feedCallback_${index}`;

    window[callbackName] = function(data) {
      let html = `
        <div style="display:flex;align-items:center;margin-bottom:10px;">
          <div style="background:#aab793;color:#fff;padding:6px 12px;font-weight:bold;font-size:14px;">${title}</div>
          <div style="flex:1;height:1px;border-bottom:2px dotted #bbb;margin:0 10px;"></div>
          <a href="${feedUrl}" style="font-size:13px;color:#0b8043;text-decoration:none;font-weight:bold;">TAMPILKAN SELENGKAPNYA &raquo;</a>
        </div>
      `;
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;">';

      const entries = data.feed.entry || [];
      entries.slice(0, 3).forEach(entry => {
        const title = entry.title.$t;
        const link = (entry.link.find(l => l.rel === "alternate") || {}).href || "#";
        const content = entry.content?.$t || entry.summary?.$t || "";
        const img = content.match(/<img[^>]+src="([^">]+)"/);
        const image = img ? img[1] : "https://via.placeholder.com/300x200?text=No+Image";

        const div = document.createElement("div");
        div.innerHTML = content;
        const description = div.textContent.trim().substring(0, 100) + "...";

        html += `
          <div style="background:#f5f5f5;padding:10px;border-radius:8px;">
            <a href="${link}" target="_blank" style="text-decoration:none;color:inherit;">
              <img src="${image}" style="width:100%;height:auto;border-radius:6px;margin-bottom:8px;">
              <h4 style="margin:0 0 6px;font-size:16px;">${title}</h4>
              <p style="margin:0;font-size:14px;color:#444;">${description}</p>
            </a>
          </div>
        `;
      });

      html += "</div>";
      document.getElementById(targetId).innerHTML = html;
    };

    // Buat script JSONP
    const script = document.createElement("script");
    script.src = `${feedUrl}/feeds/posts/default?alt=json-in-script&callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", fetchFeeds);
