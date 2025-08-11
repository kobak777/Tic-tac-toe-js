const startBtn = document.querySelector("[data-start-btn]");
const cells = document.querySelectorAll("#field td");
const result = document.querySelector("[data-result-text]");
let counter = 0;


// function isVictory(){
//     let combos = [

//     ]
// }
function tapCell(event){
    if (counter%2===0){
        event.target.innerHTML = '<img src="./img/cross.png" alt="X" width = 150px>';
    }else{
        event.target.innerHTML = '<img src="./img/zero.png" alt="O" width = 150px>';
    }
    counter++;
    event.target.removeEventListener("click", tapCell);
}

function startGame(){
    result.innerText="";
    counter = 0;
    for (const cell of cells) {
        cell.innerHTML = "";
        cell.addEventListener("click", tapCell);
    }
}

startBtn.addEventListener("click", startGame);
