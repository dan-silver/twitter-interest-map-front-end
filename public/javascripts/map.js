var geochart, data=[], options, zoomLevel, country, state;
    function defaultOptions() {
      options = {colorAxis: {colors: ['#A6C3FF', '#1D61EE']}, enableRegionInteractivity:true,width: 750, height: 550};
    }
    google.load('visualization', '1', {packages: ['geochart']});
    function drawVisualization() {
      geochart = new google.visualization.GeoChart(document.getElementById('visualization'));
      
      google.visualization.events.addListener(
      geochart, 'regionClick', function(e) {
        var type, location
        options.region = e.region
        if (e.region.indexOf("-") != -1) { //clicked on a state, view cities (US only)
          console.log("Clicked on state %s", e.region);
          zoomLevel = 3
          options.resolution = 'provinces'
          options.displayMode = 'markers'
          state = e.region
          type = 'city'
          location = state
        } else if (e.region == 'US') { //clicked on the US, display states
          console.log("Clicked on country %s", e.region);
          zoomLevel = 2
          options.resolution = 'provinces'
          options.displayMode = 'regions'
          country = e.region
          type = 'state'
          location = country
        } else { //clicked on a country (NOT US), display top cities
          console.log("Clicked on not US country: %s", e.region)
          zoomLevel = 2
          options.resolution = 'countries'
          options.displayMode = 'markers'
          country = e.region
          type = 'city'
          location = country
        }
        if (!data[e.region]) {
          $.get("/"+interest_id+"/"+type+"/"+location, function(returnedData) {
            data[e.region] = new google.visualization.DataTable(returnedData);
            geochart.draw(data[e.region], options);
            console.log(returnedData);
          });
        } else {
            geochart.draw(data[e.region], options);
        }
        if (zoomLevel > 1) {
          $('#zoom-out').fadeIn();
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

	$(function() {
		google.setOnLoadCallback(function() {
			$.get("/country/"+interest_id, function(returnedData) {
			data['world'] = new google.visualization.DataTable(returnedData);
		  drawVisualization();
		 });
		});
	});