window.onload = Start;

var wins = [];

function Start() {
    wins.push(new Window("Default win", 450, 250));
    wins[0].setPosition(100,260);
    wins[0].setContent("I love Wiki");
    wins[0].SetDraggingEvent();
}
