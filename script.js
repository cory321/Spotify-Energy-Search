$(function(){

	var api_key = "PVZ5JKAQ02K51LVIC";
	var results = 48;

	var $c = $("#content");
	var $alerts = $("#alerts");
	var $submitButton = $("#submit");
	var $genreDiv = $("#genreDiv");

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

		var min_danceability = 0.0;
		var max_danceability = 0.99;

		var min_tempo = 0;
		var max_tempo = 200;

		var min_energy = 0.2;
		var max_energy = 0.9;

		var min_duration = 0;
		var max_duration = 5000;

		var sort = "artist_familiarity-desc";

		var resultIds = [];
		var resultsURL = "https://api.spotify.com/v1/tracks/?ids=";
		var searchURL = "http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&style=" + $genre + "&min_danceability="+ min_danceability +"&min_tempo="+min_tempo+"&max_tempo="+max_tempo+"&min_energy="+min_energy+"&max_energy="+max_energy+"&min_duration="+min_duration+"&max_duration="+max_duration + "&results=" + results + "&sort=" + sort + "&bucket=id:spotify&bucket=tracks&limit=true";

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
				
				console.log(resultsURL + resultIds);
				resultsURL += resultIds;
			}
		})

		.done(function(){
			$.ajax({
				method: "GET",
				url: resultsURL,
				jsonp: "callback",
				success: function(data) {
					var aHTMLprepend = "<div class=\"col-xs-3 col-md-3\"><a href=\"#\" class=\"thumbnail\">";
					var aHTMLappend = "</a></div>";
					for (var i = 0; i < data.tracks.length; i++) {
						if(i > 0 && i % 4 === 0) {
							$c.append("<div class=\"row\">");
						}
						
						$c.append(aHTMLprepend + "<img src="+data.tracks[i].album.images[1].url+">" + aHTMLappend);

						if(i > 0 && i % 4 === 0) {
							$c.append("</div>");
						}
					}
				}
			});
		});

	});
});