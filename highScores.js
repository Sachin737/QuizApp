const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = 
    highScores.map(score =>{
        return `<li class="high-score">${score.Score} \u00A0\u00A0\u00A0  ${score.username}  </li>`;
    }).join("")

