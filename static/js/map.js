/*
* United States Live Fundmap (Early Stage)
*
* Author: Carl Cortright
*/

CSV_DATA = []

/*
* Creates a tooltip for each
*/
function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
	return "<h4>"+n+"</h4><table>"+
		"<tr><td>Companies: </td><td>"+(d.num)+"</td></tr>"+
		"</table>";
}

/*
* Loads the data from CSV
*/
function loadData(path){

}

/*
* Updates the map when a fund is selected/deselected
*/
function updateMap(color) {
  d3.csv("data/example.csv", function(data) {
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
          if (obj.State === d) {
            num += 1;
          }
        }
        StatesData[d]={num:num, inv:inv.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), color:d3.interpolate("#FFFFFF", color)(num/largestState)};
      });

    var width = 1000;
    var height = 600;

    // D3 Projection
    var projection = d3.geo.albersUsa()
    				   .translate([(width/2) - 27.5, (height/2) - 17])  // translate to center of screen
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
      if(true){
        d3.select("#statesvg")
      	.append("circle")
      	.attr("cx", projection([d.Longitude, d.Latitude])[0])
      	.attr("cy", projection([d.Longitude, d.Latitude])[1])
      	.attr("r", 5)
      	.style("fill", "#1E2832")
      	.style("opacity", 0.6);
      }
    }

  });

}

updateMap("#EA862D");
d3.select(self.frameElement).style("height", "600px");
