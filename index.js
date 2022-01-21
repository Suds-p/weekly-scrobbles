/* Utility function to get last.fm play counts */
const countScrobbles = async (user) => {
  try {
    let data = await $.get(`https://cors-anywhere.herokuapp.com/https://www.last.fm/user/${user}/library/artists?from=2022-01-14&to=2022-01-21`);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(data, 'text/html');
    let trs = htmlDoc.getElementsByTagName("tbody");
    if (trs === undefined) {
      return undefined;
    }

    trs = Array.from(trs[0].getElementsByTagName("tr"));
    let totalCount = 0;
    trs.forEach(row => {
      const spans = row.getElementsByClassName("chartlist-count-bar-value");
      if (spans[0] !== undefined) {
        const spanCount = +(spans[0].innerHTML.trim().split(" ")[0]);
        totalCount += spanCount;
      }
    });
    return totalCount;
  } catch (e) {
    return undefined;
  }
}

/* Get DOM elements */
let toggleButton = document.getElementById("toggleBtn");
let body = document.getElementById("body");
let compareBtn = document.getElementById("compareBtn");
let input1 = document.getElementById('user1');
let input2 = document.getElementById('user2');

/* Change handlers to remove unnecessary CSS classes */
input1.addEventListener('change', (e) => {
  input1.classList.remove("invalidInput");
  document.getElementsByClassName('errorSub')[0].innerHTML = "";
})
input2.addEventListener('change', (e) => {
  input2.classList.remove("invalidInput");
  document.getElementsByClassName('errorSub')[1].innerHTML = "";
})

/* Click handler */
let main = () => {
  event.preventDefault();
  Array.from(document.getElementsByClassName("resultsBody"))
    .forEach(b => b.style.display = "initial");

  document.getElementById('plays1').innerHTML = 'loading...';
  document.getElementById('plays2').innerHTML = 'loading...';

  (async () => {
    let count1 = await countScrobbles(input1.value);
    let count2 = await countScrobbles(input2.value);

    if ((count1 && count2 ) === undefined) {
      console.log("hol up did this ever happen?")
      input1.classList.add("invalidInput");
      input2.classList.add("invalidInput");

      Array.from(document.getElementsByClassName("resultsBody"))
        .forEach(b => b.style.display = "none");
      
      if (count1 === undefined) {
        document.getElementsByClassName('errorSub')[0].innerHTML = "That username doesn't exist!";
      }
      if (count2 === undefined) {
        document.getElementsByClassName('errorSub')[1].innerHTML = "That username doesn't exist!";
      }
      return;
    }

    document.getElementById('plays1').innerHTML = count1;
    document.getElementById('plays2').innerHTML = count2;
  })();
};