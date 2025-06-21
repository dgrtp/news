function loadFeeds() {
  const feedBoxes = document.querySelectorAll('.feed-box');

  feedBoxes.forEach((box, i) => {
    const feedUrl = box.getAttribute('data-feed');
    const targetId = box.getAttribute('data-target');
    const callbackName = 'showFeed' + i;

    window[callbackName] = function (data) {
      const container = document.getElementById(targetId);
      if (!container) return;

      let html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;">';
      const entries = data.feed.entry || [];

      for (let j = 0; j < Math.min(entries.length, 3); j++) {
        const entry = entries[j];
        const title = entry.title.$t;
        const link = entry.link.find(l => l.rel === 'alternate').href;
        const content = entry.content?.$t || entry.summary?.$t || '';
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        const image = imgMatch ? imgMatch[1] : 'https://via.placeholder.com/300x200?text=No+Image';

        const div = document.createElement('div');
        div.innerHTML = content;
        const description = div.textContent.trim().substring(0, 100) + '...';

        html += `
          <div style="background:#f5f5f5;padding:10px;border-radius:8px;">
            <a href="${link}" target="_blank" style="text-decoration:none;color:inherit;">
              <img src="${image}" style="width:100%;height:auto;border-radius:6px;margin-bottom:8px;">
              <h4 style="margin:0 0 6px;font-size:16px;">${title}</h4>
              <p style="margin:0;font-size:14px;color:#444;">${description}</p>
            </a>
          </div>
        `;
      }

      html += '</div>';
      container.innerHTML = html;
    };

    // Buat script JSONP dinamis
    const script = document.createElement('script');
    script.src = `${feedUrl}&callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', loadFeeds);
