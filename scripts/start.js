window.onload = Start;

var wins = [];

function Start() {
    wins.push(new Window("Default win", 100, 100));
    wins[0].setContent("I love Wiki");
    wins[0].createGUI();
    wins[0].setPosition(100,260);
}