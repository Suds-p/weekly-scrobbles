/* Utility function to get last.fm play counts */
const countScrobbles = async (user) => {
  let data = await $.get(`https://cors-anywhere.herokuapp.com/https://www.last.fm/user/${user}/library/artists?from=2022-01-14&to=2022-01-21`);
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(data, 'text/html');
  let trs = htmlDoc.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
  trs = Array.from(trs);
  let totalCount = 0;
  trs.forEach(row => {
    const spans = row.getElementsByClassName("chartlist-count-bar-value");
    if (spans[0] !== undefined) {
      const spanCount = +(spans[0].innerHTML.trim().split(" ")[0]);
      totalCount += spanCount;
    }
  });
  return totalCount;
}

/* Get DOM elements */
let toggleButton = document.getElementById("toggleBtn");
let body = document.getElementById("body");
let compareBtn = document.getElementById("compareBtn");

/* Click handler */
compareBtn.onclick = () => {
  let user1 = document.getElementById('user1').value;
  let user2 = document.getElementById('user2').value;

  if (user1 === "" || user2 === "") {
    console.log("Bad input, both fields should have names");
    return;
  }

  Array.from(document.getElementsByClassName("resultsBody"))
   .forEach(b => b.style.display = "initial");

  document.getElementById('plays1').innerHTML = 'loading...';
  document.getElementById('plays2').innerHTML = 'loading...';

  (async () => {
    let count1 = await countScrobbles(user1);
    let count2 = await countScrobbles(user2);
    console.log(count1, count2);

    document.getElementById('plays1').innerHTML = count1;
    document.getElementById('plays2').innerHTML = count2;
  })();
};