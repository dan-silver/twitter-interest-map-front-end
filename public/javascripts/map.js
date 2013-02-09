var geochart, data=[], options, zoomLevel, country, state;
    function defaultOptions() {
      options = {colorAxis: {colors: ['#A6C3FF', '#1D61EE']}, enableRegionInteractivity:true,width: 556, height: 347};
    }
    google.load('visualization', '1', {packages: ['geochart']});
    function drawVisualization() {
      geochart = new google.visualization.GeoChart(document.getElementById('visualization'));
      
      google.visualization.events.addListener(
      geochart, 'regionClick', function(e) {
        if (data[e.region] ) {
        options.region =  e.region;
        options.resolution = 'provinces';
          if (e.region.indexOf("-") != -1) { //"US-MO" vs "US"
            options.displayMode = 'markers';
            zoomLevel = 3;
            state = e.region;
            console.log("Clicked on state %s", state);
          } else {
            zoomLevel = 2;
            country = e.region;
            console.log("Clicked on country %s", country);
          }
          //console.log("Your zoomLevel is %d", zoomLevel);
          geochart.draw(data[e.region] , options);
          if (zoomLevel > 1) {
            $('#zoom-out').fadeIn();
          }
        } else {
          console.log("No data available for this region");
        }
      });
      initalZoom();
    }
    
    function initalZoom() {
      zoomLevel=1;
      defaultOptions();
      geochart.draw(data['world'], options);
      $('#zoom-out').fadeOut();
    };
    
    function zoomOut() {
     // console.log("Your zoomLevel is %d", zoomLevel);
      if (zoomLevel == 2) {
        initalZoom();
      } else if (zoomLevel == 3) {
        options.region = country;
        options.displayMode = 'regions';
        geochart.draw(data[country], options);
        zoomLevel = 2;
      }
    }
    
    google.setOnLoadCallback(function() {
        data['world'] = google.visualization.arrayToDataTable([
        ['Country', 'User Count'],
        ['Germany', 200],
        ['United States', 300],
        ['Brazil', 400],
        ['Canada', 500],
        ['France', 600],
        ['RU', 700],
        ['Great Britain', 50]
      ]);  
      data['US'] = google.visualization.arrayToDataTable([
        ['state', 'User Count'],
        ['Missouri', 200],
        ['IL', 300],
        ['CA', 400],
        ['FL', 500],
        ['VA', 600],
        ['AL', 700]
      ]);
      data['US-MO'] = google.visualization.arrayToDataTable([
        ['City', 'User Count'],
        ['Jefferson City', 200],
        ['Columbia', 300],
        ['St. Louis', 400],
        ['Chesterfield', 500],
        ['Kirkwood', 600],
        ['Boonville', 700]
      ]);
      drawVisualization();
    });