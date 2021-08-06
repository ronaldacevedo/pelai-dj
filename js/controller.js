/* global variables */
// deck 1
let deck1out;
const deck1playbutton = document.querySelector("#d1playbutton");
const deck1tempofader = document.querySelector("#d1tempofader");
const deck1art = document.querySelector("#deck1disc");
const deck1title = document.querySelector("#deck1title");
// deck 2
let deck2out;
const deck2playbutton = document.querySelector("#d2playbutton");
const deck2tempofader = document.querySelector("#d2tempofader");
const deck2art = document.querySelector("#deck2disc");
const deck2title = document.querySelector("#deck2title");
// mixer
let masterout;
const deck1gainfader = document.querySelector("#deck1gain");
const deck2gainfader = document.querySelector("#deck2gain");
const crossfader = document.querySelector("#crossfader");
const masteroutfader = document.querySelector("#mastergain");


function loadDeck1(title, audioUrl, imageUrl) {
	if (deck1out != undefined) {
		deck1out.unload();
	}
	deck1out = new Howl({
		src: [audioUrl],
		html5: true
	});
	deck1playbutton.onclick = function() {
		if (deck1out.playing()) {
			deck1out.pause();
		} else {
			deck1out.play();
		}
	}
	deck1tempofader.oninput = function() {
		deck1out.rate(deck1tempofader.value)
	}
	deck1art.style.backgroundImage = "url(" + imageUrl + ")";
	deck1title.innerText = title;
	updateVolumes();
}

function loadDeck2(title, audioUrl, imageUrl) {
	if (deck2out != undefined) {
		deck2out.unload();
	}
	deck2out = new Howl({
		src: [audioUrl],
		html5: true
	});
	deck2playbutton.onclick = function() {
		if (deck2out.playing()) {
			deck2out.pause();
		} else {
			deck2out.play();
		}
	}
	deck2tempofader.oninput = function() {
		deck2out.rate(deck2tempofader.value)
	}
	deck2art.style.backgroundImage = "url(" + imageUrl + ")";
	deck2title.innerText = title;
	updateVolumes();
}

/* mixer */
function updateVolumes() {
	if (deck1out != undefined) {
		deck1out.volume(masteroutfader.value * deck1gainfader.value * (1.0 - crossfader.value));
	}
	if (deck2out != undefined) {
		deck2out.volume(masteroutfader.value * deck2gainfader.value * crossfader.value);
	}
}

deck1gainfader.oninput = updateVolumes;
deck2gainfader.oninput = updateVolumes;
crossfader.oninput = updateVolumes;
masteroutfader.oninput = updateVolumes;
