
window.onload = function() {
	// console.log("window loaded");
	var menu = document.getElementsByClassName("menuBar");
	menu[0].innerHTML = '<table>' +
        '<tbody>' +
            '<td><a rel= "homepage" href= "index.html">Home</a></td>' +
            '<td><a rel= "typeExp" href= "typeExperiment.html">TypeExp</a></td>' +
            '<td><a rel= "brushExp" href= "brush.html">BrushExp</a></td>' +
            '<td><a rel= "animationExp" href= "animation.html">AnimationExp</a></td>' +
            '<td><a rel= "imgExp" href= "imageLoading.html">ImgExp</a></td>' +
            '<td><a rel= "colorExp" href= "colorLoading.html">ColorExp</a></td>' +
            '<td><a href= "universe.html"> Universe </a></td>' +
            '<tr>' +
            '<td></td>' +
            '<td><a href= "soundExp.html"> SoundExp</a></td>' +
            '<td><a href= "multiCanvas.html"> MultiCanvas </a></td>' +
            '<td><a href= "noiseExp.html"> NoiseExp </a></td>' +
            '<td><a href= "venture.html"> Venture </a></td>' +
            '<td><a href= "brainstorm.html"> Brainstorm </a></td>' +
            '<td><a href = "sonification.html">Sonification</a></td>' +
            '<tr>' +
            '<td></td>' +
            '<td><a href = "rhythm.html"> Ryhthm</a></td>' +
        '</tbody>' +
    '</table>';
}