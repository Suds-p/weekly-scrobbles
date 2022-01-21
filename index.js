/* Utility function to find date of nearest past Friday (not including today) */
const findLastFriday = () => {
  // Friday is day 5
  /*
   day: 0 1 2 3 4 5 6
        1 2 3 4 5 6 7 (+1)
        1 2 3 4 5 6 0 (%7)
  -del: 2 3 4 5 6 7 1 (+1)
   */
  const resultDate = new Date();
  const day = resultDate.getDay();
  const del = ((day + 1) % 7) + 1;
  resultDate.setDate(resultDate.getDate() - del);
  return resultDate;
}

/* Utility function to get last.fm play counts */
const countScrobbles = async (user) => {
  try {
    // TODO: Get start date as last friday
    const start = findLastFriday().toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    let data = await $.get(`https://cors-anywhere.herokuapp.com/https://www.last.fm/user/${user}/library/artists?from=${start}&to=${today}`);
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

/* Set subtitle in corner to show correct date */
const lastFri = findLastFriday();
const month = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"][lastFri.getMonth()];
document.getElementsByClassName("subtitle")[0].innerHTML = 
  `Counting since ${month} ${lastFri.getDate()}, ${lastFri.getFullYear()}`;