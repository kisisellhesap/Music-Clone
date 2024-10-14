const musicList = document.querySelector(".music-list");
const searchInput = document.querySelector(".search-div input");
const footerSongsPlay = document.querySelector(".footer-songs-play");
const songTitle = document.querySelector(".song-title");
const artistName = document.querySelector(".artist-name");
const footerImg = document.querySelector(".footer-img");

const getApi = async () => {
  const url1 =
    "https://shazam.p.rapidapi.com/search?term=current%20joys&locale=en-US&offset=0&limit=5";
  const url2 =
    "https://shazam.p.rapidapi.com/search?term=beyaz%20hayvanlar&locale=en-US&offset=0&limit=5";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "ce411ca7a4msh233f6bb3e85d082p1dcbe3jsn6b03f3dd1383",
      "x-rapidapi-host": "shazam.p.rapidapi.com",
    },
  };

  try {
    const response1 = await fetch(url1, options);
    const resultOne = await response1.json();

    const response2 = await fetch(url2, options);
    const resultTwo = await response2.json();
    return [{ ...resultOne }, { ...resultTwo }];
  } catch (error) {
    console.error(error);
  }
};

const searchApi = async (url) => {
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "ce411ca7a4msh233f6bb3e85d082p1dcbe3jsn6b03f3dd1383",
      "x-rapidapi-host": "shazam.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener("DOMContentLoaded", async function () {
  const data = await getApi();
  displayData([...data[0].tracks.hits, ...data[1].tracks.hits]);
});

const createCard = (img, songName, title, mp3) => {
  const card = `
    
                <div class="music-card" data-source = "${mp3}">
              <i class="bi bi-play-fill m-card-play-icon" ></i>
              <div class="card-img-container">
                <img
                  src="${img}"
                  alt="${title}"
                />
              </div>

              <h3>${songName}</h3>
              <p>${title}</p>
            </div>
    
    
    `;

  return card;
};

const displayData = (data) => {
  musicList.innerHTML = "";
  for (const song of data) {
    const img = song.track.images.coverarthq;
    const songName = song.track.title;
    const title = song.track.subtitle;
    const mp3 = song.track.hub.actions[1].uri;

    const card = createCard(img, songName, title, mp3);

    musicList.insertAdjacentHTML("beforeend", card);
  }

  playSongs();
};

searchInput.addEventListener("keyup", async function (e) {
  const value = e.target.value.trim();
  const searchUrl = `https://shazam.p.rapidapi.com/search?term=${value}&locale=en-US&offset=0&limit=5`;

  if (e.key === "Enter") {
    if (value) {
      const data = await searchApi(searchUrl);
      displayData(data.tracks.hits);
      document.querySelector(
        ".content-title"
      ).textContent = `${value} için sonuçlar`;
    } else {
      const data = await getApi();
      displayData([...data[0].tracks.hits, ...data[1].tracks.hits]);
      document.querySelector(".content-title").textContent = `Popüler Müzikler`;
    }
  }
});

const playSongs = (mp3) => {
  const playIcons = document.querySelectorAll(".m-card-play-icon");
  for (const playIcon of playIcons) {
    playIcon.addEventListener("click", function (e) {
      const sourceCard = playIcon.parentElement.getAttribute("data-source");
      const img = playIcon.parentElement.children[1].children[0].src;
      const songName = playIcon.parentElement.children[2].textContent;
      const artistName = playIcon.parentElement.children[3].textContent;
      displayFooter(sourceCard, songName, artistName, img);

      if (playIcon.className !== "bi bi-pause-fill m-card-play-icon") {
        playIcon.className = "bi bi-pause-fill m-card-play-icon";
      } else {
        playIcon.className = "bi bi-play-fill m-card-play-icon";
      }
    });
  }
};

const displayFooter = (mp3, songNames, name, img) => {
  footerSongsPlay.innerHTML = "";

  const audioElement = document.createElement("audio");
  audioElement.controls = true;

  const source = document.createElement("source");
  source.src = mp3;
  audioElement.appendChild(source);
  footerSongsPlay.appendChild(audioElement);

  audioElement.play().catch((error) => {
    console.error("Playback prevented:", error);
  });

  footerImg.src = img;
  songTitle.textContent = songNames;
  artistName.textContent = name;
};

document.querySelector(".home").addEventListener("click", async function () {
  searchInput.value = "";
  const data = await getApi();
  displayData([...data[0].tracks.hits, ...data[1].tracks.hits]);
  document.querySelector(".content-title").textContent = `Popüler Müzikler`;
});
