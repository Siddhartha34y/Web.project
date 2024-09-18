console.log("lets write Javascript");
let currentSong = new Audio();
let songs;
let currentFolder;

// Assuming you have the following function defined
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  } // throw new Error('Input must be a non-negative integer.');
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])

    }
  }


  //show all the song in playlist
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
                    <img class="invert" src="music.svg" alt="">
                    <div class="info">
                        <div> ${song.replaceAll("%20", " ")}</div>
                        <div> Pawan</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="play.svg" alt="">
                    </div> </li>`;
  }
  //Attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })

  })
  return songs
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currentFolder}/` + track
  if (!pause) {
    currentSong.play()
    play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = track
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
 let cardContainer = document.querySelector(".cardContainer")
let array= Array.from(anchors)

      for (index = 0; index > array.length; index++) {
       const e = array[index];



      if (e.href.includes("/songs")) {
        let folder = e.href.split("/").slice(-1)[0]
        //Get the metadata of the folder
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
        let response = await a.json();
        console.log(response)
         cardContainer.innerHTML = cardContainer.innerHTML + `<div  data-folder="${folder}" class="card ">
                       <div  class="play2">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                 <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                     stroke-linejion="round" />
                             </svg>

                         </div>
                         <img src="/songs/${folder}/cover.jpg"alt="">
                         <p>
                         <h2>${response.title}</h2>${response.description}</p>
                 </div>`

      }
    
  }
  //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })
  })

}


async function main() {

  // Get the list of the songs
  await getSongs("songs/ncs")
  playMusic(songs[0], true)

  //display all the albums on the page
  displayAlbums()


  //Attach an event listerner to play, next and previous

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "play.svg"
    }
  })

  //Listen for time update events
  currentSong.addEventListener("timeupdate", () => {
    (currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add an event listerner to seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  //Add an event listerner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  //Add an event listerner for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })

  //Add an event listener to previous and next
  previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
  })
  //Add an event listener to  next
  next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
  })

  //Add and event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/100")
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume>0){
      document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
    }

  })

  

 //Add event listener to mute the track
 document.querySelector(".volume>img").addEventListener("click",e=>{
  console.log(e.target)
  console.log("changing",e.target.src)
  if(e.target.src.includes("volume.svg")){
    e.target.src= e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
  }
  else{
    e.target.src=e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;
  }
 })

}

main()