$(function(){

	var api_key = "PVZ5JKAQ02K51LVIC";
	var style = "rock";
	var min_danceability = 0.65;
	var min_tempo = 140;
	var results = 5;
	var sort = "artist_familiarity-desc";
	var searchURL = "http://developer.echonest.com/api/v4/song/search?api_key=" + api_key + "&style=" + style + "&min_danceability="+ min_danceability +"&min_tempo="+ min_tempo +"&results=" + results + "&sort=" + sort + "&bucket=id:spotify&bucket=tracks&limit=true";
	var resultIds = [];
	var resultsURL = "https://api.spotify.com/v1/tracks/?ids=";

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
			
			console.log(resultsURL + resultIds);

		}
	});
});