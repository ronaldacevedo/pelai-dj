const deck1searchbox = document.querySelector("#deck1search");
deck1searchbox.value = ""
const deck2searchbox = document.querySelector("#deck2search");
deck2searchbox.value = ""

deck1searchbox.oninput = function(ev) {
	deck1title.innerText = "loading...";
	let query = deck1searchbox.value;
	let url = "/load?url=" + query;
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		let data = JSON.parse(this.responseText);
		loadDeck1(data.title, data.audio, data.image);
		deck1searchbox.value = ""
	}
	xhr.open("GET", url);
	xhr.send();
}

deck2searchbox.oninput = function(ev) {
	deck2title.innerText = "loading...";
	let query = deck2searchbox.value;
	let url = "/load?url=" + query;
	let xhr = new XMLHttpRequest();
	xhr.onload = function() {
		let data = JSON.parse(this.responseText);
		loadDeck2(data.title, data.audio, data.image);
		deck2searchbox.value = ""
	}
	xhr.open("GET", url);
	xhr.send();
}

