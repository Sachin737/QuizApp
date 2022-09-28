const username = document.getElementById('username');
const savescorebutton = document.getElementById('savescorebutton');
const RecentScore = localStorage.getItem("RecentScore");
const finalScore = document.getElementById("finalScore");
finalScore.innerText = RecentScore;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

username.addEventListener('keyup', ()=>{
    savescorebutton.disabled = !username.value;
});

saveScore = (e) => {
    console.log("Saved!");
    e.preventDefault();

    const score = {
        Score: RecentScore,
        username: username.value
    };

    highScores.push(score);
    highScores.sort((a,b)=>{
        return b.Score - a.Score;
    });
    highScores.splice(5);

    // console.log(highScores);
    // console.log(score);

    localStorage.setItem("highScores",JSON.stringify(highScores));

    // console.log(highScores);

    window.location.assign("/");
}