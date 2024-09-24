
(function (w, d) {

  var settings = w.until.settings;
  //console.log(settings);

  var untilApp = function (s) {
    var functions = {
      init: function () {
        var inner = document.querySelector('.inner');
        var title = document.createElement('h1');
        title.innerHTML = s.coupleName;
        document.getElementById('wrap').insertBefore(title, inner);

        app.background(s);

        setTimeout(function () {
          $('#wrap').fadeIn();
        }, 1000);

        setInterval(function () {
          const weddingDateTs = parseInt(s.date);
          nowTs = new Date().getTime();
          untilTs = weddingDateTs - nowTs;
          seconds = Math.floor(untilTs / 1000);
          minutes = Math.floor(seconds / 60);
          hours = Math.floor(minutes / 60);
          days = Math.floor(hours / 24);

          if (seconds <= 0) {
            seconds *= -1;
            minutes *= -1;
            hours *= -1;
            days *= -1;
            $('.have-been-married').html('Have Been Married for');
            $('.tagline').html('');
          } else {
            $('.have-been-married').html('')
            $('.tagline').html('...till Our Wedding')
          }
          const remainDaysByWeeks = (days % 7);
          const remainWeeks = Math.floor(days / 7);
          var bracketString = "";
          if (remainWeeks != 0) {
            bracketString += remainWeeks + " Weeks";
            if (remainDaysByWeeks != 0) bracketString += " " + remainDaysByWeeks + " day" + (remainDaysByWeeks == 1 ? "" : "s");
          }
          if (bracketString) bracketString = "(" + bracketString + ")";
          $('.days').html(days == 0 ? "" : (days + ' Day' + (days <= 1 ? "" : "s") + bracketString));
          $('.hours').html(hours % 24 + ' Hour' + (hours % 24 <= 1 ? "" : "s"));
          $('.minutes').html(minutes % 60 + ' Minute' + (minutes % 60 <= 1 ? "" : "s"));
          $('.seconds').html(seconds % 60 + ' Second' + (seconds % 60 <= 1 ? "" : "s"));
        }, 1000);

      },
      background: function (s) {
        var backgroundStyles = 'body {background: url(' + s.imageUrl + '); background-repeat: no-repeat; background-position: left; background-attachment: fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;}';
        bkgStyles = d.createElement('style');
        bkgStyles.setAttribute('type', 'text/css');
        bkgStyles.innerHTML = backgroundStyles;
        d.getElementsByTagName('head')[0].appendChild(bkgStyles);
      }
    }
    return functions;

  }

  var app = new untilApp(settings);
  app.init();

})(window, document);


