/*
* United States Live Fundmap (Early Stage)
*
* Author: Carl Cortright
*/

var CSV_DATA = []

/*
* Creates a tooltip for each
*/
function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
	return "<h4>"+n+"</h4><table>"+
		"<tr><td>Companies: </td><td>"+(d.num)+"</td></tr>"+
		"</table>";
}

/*
* Gets the url parameters
*/
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};

/*
* Updates the map when a fund is selected/deselected
*/
function updateMap(color, data, minimum_opacity) {
  var StatesData = []
  var statesData = ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
  "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
  "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
  "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
  var totalNum = 0;
  var largestState = 0;
  statesData.forEach(function(d){
      var num=0;
      var inv=0;
      for(i = 0; i < data.length; i++){
        var obj = data[i]
        if (obj.State === d) {
          num += 1;
        }
      }
      if(num>largestState){
        largestState = num;
      }
      totalNum += num
    });

  statesData.forEach(function(d){
      var num=0;
      var inv=0;
      for(i = 0; i < data.length; i++){
        var obj = data[i]
        if (obj.State === d &&
					 ((obj.Type.toLowerCase() == "fund" && document.getElementById("funds-color-box").checked)
					  || obj.Type.toLowerCase() == "company" && document.getElementById("companies-color-box").checked)) {
          num += 1;
        }
      }
			if(num != 0){
				var min_color = d3.interpolate("#FFFFFF", color)(minimum_opacity);
	      StatesData[d]={num:num, inv:inv.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), color:d3.interpolate(min_color, color)(num/largestState)};
			} else {
				StatesData[d]={num:num, inv:inv.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), color:d3.interpolate("#FFFFFF", color)(num/largestState)};
			}

    });

  var width = 1000;
  var height = 600;

  // D3 Projection
  var projection = d3.geo.albersUsa()
              .translate([(width/2) - 27.5, (height/2) - 17])  // translate to center of screen - this part is pretty hacky
              .scale([1265]);

  /* draw states on id #statesvg */
  d3.select("svg").selectAll("*").remove()

  uStates.draw("#statesvg", StatesData, tooltipHtml);
  let elements = Array.from(document.getElementsByClassName("state"));
  elements.forEach(function(elem){
    elem.style.stroke = color;
  });

  for(i=0; i < data.length; i++){
    var d = data[i]
		if(document.getElementById("companies-dot-box").checked && d.Type.toLowerCase() == "company"){
			d3.select("#statesvg")
	    .append("circle")
	    .attr("cx", projection([d.Longitude, d.Latitude])[0])
	    .attr("cy", projection([d.Longitude, d.Latitude])[1])
	    .attr("r", 5)
	    .style("fill", "#1E2832")
	    .style("opacity", 0.6);
		}
		if(document.getElementById("funds-dot-box").checked && d.Type.toLowerCase() == "fund"){
			d3.select("#statesvg")
	    .append("circle")
	    .attr("cx", projection([d.Longitude, d.Latitude])[0])
	    .attr("cy", projection([d.Longitude, d.Latitude])[1])
	    .attr("r", 5)
	    .style("fill", "#1E2832")
	    .style("opacity", 0.6);
		}
  }
}


d3.csv("data/" + dataFile + "?q=" + Math.floor(Math.random() * 10000000), function(data) { CSV_DATA = data; updateMap("#EA862D", CSV_DATA, 0.1); });
d3.select(self.frameElement).style("height", "600px");
