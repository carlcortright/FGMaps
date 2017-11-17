var slider = document.getElementById("myRange");
slider.oninput = function() {
    OPACITY = this.value/100;
    updateMap(COLOR, CSV_DATA, this.value/100);
}
