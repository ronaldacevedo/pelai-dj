const deck1search = document.querySelector("#deck1searchbox");

deck1search.oninput = function() {
	//let url = "http://localhost/dj/api.php" + deck1search.value
	let url = "http://localhost/dj/api.php"
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		let data = JSON.parse(this.responseText);
		loadDeck1("http://localhost" + data.audio);
	}
	xhr.open("GET", url);
	xhr.send();
}
