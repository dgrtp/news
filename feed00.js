function showFeed(data) {
  var container = document.getElementById("feed-content");
  var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px">';
  var entries = data.feed && data.feed.entry ? data.feed.entry : [];
  for (var i = 0; i < Math.min(entries.length, 3); i++) {
    var e = entries[i];
    var title = e.title && e.title.$t ? e.title.$t : 'No Title';
    var link = '#';

    if (Array.isArray(e.link)) {
      for (var j = 0; j < e.link.length; j++) {
        if (e.link[j].rel === 'alternate') {
          link = e.link[j].href;
          break;
        }
      }
    }

    var content = e.content && e.content.$t ? e.content.$t : (e.summary && e.summary.$t ? e.summary.$t : '');
    var img = 'https://via.placeholder.com/300x200';
    var imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) img = imgMatch[1];

    var tempDiv = document.createElement('div');
tempDiv.innerHTML = content;

var paragraphs = tempDiv.querySelectorAll('p');
var desc = 'Tidak ada deskripsi';

for (var p = 0; p < paragraphs.length; p++) {
  var text = paragraphs[p].textContent.trim();
  if (text && !paragraphs[p].innerHTML.includes('<b:')) {
    desc = text;
    break;
  }
}

    html += '<div style="background:#f5f5f5;padding:10px;border-radius:8px">' +
            '<a href="' + link + '" style="text-decoration:none;color:inherit" target="_blank" rel="noopener noreferrer">' +
            '<img src="' + img + '" style="width:100%;border-radius:6px;margin-bottom:8px">' +
            '<h4 style="margin:0 0 6px;font-size:16px">' + title + '</h4>' +
            '<p style="margin:0;font-size:14px;color:#444">' + desc + '</p>' +
            '</a></div>';
  }
  html += '</div>';
  container.innerHTML = html;
}
