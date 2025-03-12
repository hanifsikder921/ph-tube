// https://openapi.programming-hero.com/api/phero-tube/categories


const CategoryButton = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/phero-tube/categories');
    const data = await response.json();
    displayCategories(data.categories);

}

const showloader=()=>{
    document.getElementById("loader").classList.remove('hidden');
    document.getElementById('video_container').classList.add('hidden')
}

const hideLoader=()=>{
    document.getElementById("loader").classList.add('hidden');
    document.getElementById('video_container').classList.remove('hidden')
}
const displayCategories = (categories) => {

    const categoryContainer = document.getElementById('categoryContainer');
    for (const cat of categories) {

        const newButton = document.createElement('div');
        newButton.innerHTML = `
        <button id="btn-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-orange-600 hover:text-white">${cat.category}</button>
        `
        categoryContainer.append(newButton);

    }




}

CategoryButton();


// ================================================================================>
// ================================================================================>

/*
const loadVideo = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/phero-tube/videos');
    const data = await response.json();
    document.getElementById('btn-all').classList.add('active');  
    displayVideos(data.videos);
};

*/


function loadVideo(seachText="") {
    showloader();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${seachText}`)
        .then((response) => response.json())
        .then((data) => {
            removeActiveClass();
            document.getElementById('btn-all').classList.add('active');
            displayVideos(data.videos);

        })
}
const displayVideos = (videos) => {
    const video_container = document.getElementById('video_container');
    video_container.innerHTML = ``;

    if (videos.length == 0) {
        video_container.innerHTML = `
          
        <div class="col-span-4 text-center py-60">
            <img class="mx-auto" src="asset/Icon.png" alt="">
            <h2 class="text-3xl font-bold">Opps ! <br> There is No Videos Here</h2>
        </div>
  
        `
    }

    hideLoader();


    videos.forEach((video) => {
        const videoCard = document.createElement('div');


        const verifiedIcon = video.authors[0].verified ? '<img class="w-5" src="asset/verified.png" alt="Verified">' : '';
        const time = video.others.posted_date;
        const finalTime = convertSecondsToTime(time);


        videoCard.innerHTML = `
          <div class="rounded-lg overflow-hidden shadow-lg font-sans">
          <div class="relative  h-56">
                <img class="w-full h-full object-cover" src="${video.thumbnail}" alt="Video Thumbnail">           
                <span class="bg-gray-900 rounded-md p-2 text-xl text-white absolute right-4 bottom-4">${finalTime}</span>

            </div>
            <div class="p-4">
                <div class="text-lg font-bold mb-2 line-clamp-2">${video.title}</div>
                <div class="flex items-center mt-3">
                    <img class="w-10 h-10 rounded-full mr-3" src="${video.authors[0].profile_picture}" alt="Author">
                    <div>
                        <div class="flex items-center gap-3">
                            <div class="text-sm font-semibold">${video.authors[0].profile_name}</div>
                            ${verifiedIcon}
                        </div>
                        <div class="text-xs text-gray-500">${video.others.views} views</div>
                    </div>
                    </div>
                    <button onclick=loadvideoDetails('${video.video_id}')  class="btn btn-block my-2 bg-gray-300">See Details</button>
            </div>
        </div>`;



        video_container.append(videoCard);

        hideLoader();

    });

};

loadVideo();




function convertSecondsToTime(seconds) {
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds % 86400) / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ${hours}hrs ${minutes} min ago`;
    } else if (hours > 0) {
        return `${hours}hrs ${minutes} min ago`;
    } else {
        return `${minutes} min ago`;
    }
}










// ================================================================================>


const loadCategoryVideos = (id) => {


    showloader();

    const url = `
        https://openapi.programming-hero.com/api/phero-tube/category/${id}
        `

    fetch(url)
        .then(response => response.json())
        .then(data => {
            removeActiveClass();
            const clickedButton = document.getElementById(`btn-${id}`)
            clickedButton.classList.add('active')

            displayVideos(data.category)
        });





}

// ================================================================================>


function removeActiveClass() {

    const activeButton = document.getElementsByClassName('active');

    for (const btn of activeButton) {
        btn.classList.remove('active')

    }

}



const loadvideoDetails = (videoId) => {


    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayVideoDetails(data.video))


}

const displayVideoDetails=(details)=>{

    document.getElementById("videoDetails").showModal();

    const DetailsContainer=document.getElementById('DetailsContainer');

    DetailsContainer.innerHTML=`

    <div class="card bg-base-100 shadow-sm">
      <figure>
        <img class="w-full h-full" src="${details.thumbnail}" alt="Shoes" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
            ${details.title}
            <div class="badge badge-secondary">${details.others.views} views</div>
        </h2>
        <p>${details.description}</p>
        <div class="card-actions justify-end">
            <div class="badge badge-outline">${details.authors[0].profile_name}</div>
        </div>
       </div>
    </div>


    `
  
    
    

}


document.getElementById('searchBox').addEventListener("keyup",(e)=>{

const userInput=e.target.value;

loadVideo(userInput);

})