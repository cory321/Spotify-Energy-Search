var isSongPlaying = false;
var prevCardId = "card-0";

var playSong = function(cardId, previewURL) {
	var container = document.getElementById("container");
	var audio = document.getElementById("audio");
	var card = document.getElementById(cardId);
	var prevCard = document.getElementById(prevCardId);
	
	if(cardId === prevCardId){

		audio.pause();
		card.firstChild.classList.remove("glow");
		prevCardId = "card-null";

	} else if(previewURL !== null) {
		
		audio.pause();

		if(prevCard.getAttribute("id") !== "card-null") {
			prevCard.firstChild.classList.remove("glow");
		}
		
		card.firstChild.classList.add("glow");
		
		audio.setAttribute("src", previewURL);		
		audio.play();
		prevCardId = cardId;
		
	}
};

$(function(){

	var api_key = "PVZ5JKAQ02K51LVIC";
	var results = 48;

	var $c = $("#content");
	var $alerts = $("#alerts");
	var $submitButton = $("#submit");
	var $genreDiv = $("#genreDiv");

	var min_danceability = 0;
	var max_danceability = 999999;

	var min_tempo = 0;
	var max_tempo = 300;

	var min_energy = 0;
	var max_energy = 999999;

	var min_duration = 0;
	var max_duration = 600;

	var audio = $("<audio></audio>", {
					id:"audio_preview",
					src: ""
				});

	$("input[type*='range']").on("change mousemove", function() {
    	$(this).next().html($(this).val());
	});

	$("#DanceSlider").slider({
		range : true,
		min : 0,
		max: 999999,
		values: [250000, 750000 ],
		slide: function(event, ui) {
			$(this).next().html("0."+ui.values[0] + " - " + "0."+ui.values[1]);
			min_danceability = ui.values[0];
			max_danceability = ui.values[1];
		}
	});

	$("#TempoSlider").slider({
		range : true,
		min : 0,
		max: 300,
		values: [75,225],
		slide: function(event, ui) {
			$(this).next().html(ui.values[0] + " bpm - "+ ui.values[1]+" bpm");
			min_tempo = ui.values[0];
			max_tempo = ui.values[1];
		}
	});

	$("#EnergySlider").slider({
		range : true,
		min : 0,
		max: 999999,
		values: [250000, 750000],
		slide: function(event, ui) {
			$(this).next().html("0."+ui.values[0] + " - " + "0."+ui.values[1]);
			min_energy = ui.values[0];
			max_energy = ui.values[1];
		}
	});

	$("#DurationSlider").slider({
		range : true,
		min : 0,
		max: 600,
		values: [150, 450],
		slide: function(event, ui) {
			$(this).next().html(ui.values[0] + " - "+ui.values[1]);
			min_duration = ui.values[0];
			max_duration = ui.values[1];
		}
	});

	$submitButton.click(function(){
		
		event.preventDefault();

		var $genre = $("#genre").val();

		if($genre === "") {

			$alerts.empty();

			var alert = "<div class=\"alert alert-warning\" role=\"alert\">You must specify a Music Genre! See a list of all possible inputs here: <a href=\"http://spotgate.org/help/spotify_genres/all/all.shtml\">http://spotgate.org/help/spotify_genres/all/all.shtml</a></div>";
			$genreDiv.addClass("has-error");
			$alerts.append(alert);
			return;
		}

		$c.empty();
		$alerts.empty();
		$genreDiv.removeClass("has-error");

		var sort = "artist_familiarity-desc";

		var resultIds = [];
		var resultsURL = "https://api.spotify.com/v1/tracks/?ids=";
		var searchURL = "http://developer.echonest.com/api/v4/song/search?api_key="+api_key+"&style="+ $genre +"&min_danceability=0."+min_danceability+"&max_danceability=0."+max_danceability+"&min_tempo="+min_tempo+"&max_tempo="+max_tempo+"&min_energy=0."+min_energy+"&max_energy=0."+max_energy+"&min_duration="+min_duration+"&max_duration="+max_duration+"&results="+results+"&sort="+sort+"&bucket=id:spotify&bucket=tracks&limit=true";

		$.ajax({
			method: "GET",
			url: searchURL,
			jsonp: "callback",
			datatype: "jsonp",
			success: function(data) {
				for (var i = 0; i < data.response.songs.length; i++) {
					resultIds.push(data.response.songs[i].tracks[0].foreign_id.split("spotify:track:")[1]);
				}
				resultIds = resultIds.toString();
				
				//console.log(resultsURL + resultIds);
				resultsURL += resultIds;
			}
		})

		.done(function(){
			$.ajax({
				method: "GET",
				url: resultsURL,
				jsonp: "callback",
				success: function(data) {
					//console.log(data);

					for (var i = 0; i < data.tracks.length; i++) {

						var songPreview = data.tracks[i].preview_url;

						var aHTMLprepend = "<div id=\"card-"+i+"\" class=\"col-xs-3 col-md-3\"><a href=\"#\" class=\"thumbnail\" onclick=\"playSong(\'card-"+i+"\',\'"+ data.tracks[i].preview_url + "\')\">";
						var aHTMLappend = "</a></div>";


						if(i > 0 && i % 4 === 0) {
							$c.append("<div class=\"row\">");
						}
						
						$c.append(aHTMLprepend + "<img src="+data.tracks[i].album.images[1].url+">"+ aHTMLappend);
						

						if(i > 0 && i % 4 === 0) {
							$c.append("</div>");
						}
					}
					
					$("a").click(function(){ 
						event.preventDefault(); 
					});
				}
			});
		});

	});
});