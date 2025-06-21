(function() {
  var feeds = document.querySelectorAll('.feed-box');
  feeds.forEach(function(feedBox) {
    var feedUrl = feedBox.getAttribute('data-feed') + '/feeds/posts/default?alt=json-in-script&callback=?';
    var target = feedBox.getAttribute('data-target');
    var title = feedBox.getAttribute('data-title');

    var script = document.createElement('script');
    script.src = feedUrl.replace('callback=?', 'callback=showFeed_' + target);
    document.body.appendChild(script);

    window['showFeed_' + target] = function(data) {
      var output = '<h3 style="margin:0 0 8px 0;">' + title + '</h3><ul>';
      var entries = data.feed.entry || [];
      for (var i = 0; i < Math.min(entries.length, 5); i++) {
        var entry = entries[i];
        var link = '';
        for (var j = 0; j < entry.link.length; j++) {
          if (entry.link[j].rel === 'alternate') {
            link = entry.link[j].href;
            break;
          }
        }
        output += '<li><a href="' + link + '" target="_blank">' + entry.title.$t + '</a></li>';
      }
      output += '</ul>';
      document.getElementById(target).innerHTML = output;
    };
  });
})();
