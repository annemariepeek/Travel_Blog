// import  db  from "./database.js";

// const blogTitleField = document.querySelector('.title');
// const articleField = document.querySelector('.article');
// const author = document.querySelector('.author')

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

// const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

if (uploadInput) {
    uploadInput.addEventListener('change', () => {
        uploadImage(uploadInput, "image");
    })
}

const uploadImage = (uploadFile, uploadType) => {
    console.log("inupload image")
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload_image', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

// let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// publishBtn.addEventListener('click', () => {
//     console.log("hi")

//     if(articleField.value.length && blogTitleField.value.length){
//         // generating id
//         let letters = 'abcdefghijklmnopqrstuvwxyz';
//         let blogTitle = blogTitleField.value.split(" ").join("-");
//         let id = '';
//         for(let i = 0; i < 4; i++){
//             id += letters[Math.floor(Math.random() * letters.length)];
//         }

//         // setting up docName
//         let docName = `${blogTitle}-${id}`;
//         let date = new Date(); // for published at info
        
//         const blog_post = {
//             docName: docName,
//             title: blogTitleField.value,
//             article: articleField.value,
//             author: author.value,
//             bannerImage: bannerPath,
//             publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
//             comments: {}
//         }


//         //access firstore with db variable;
//         // db.collection("blogs").doc(docName).set({
//         //     title: blogTitleField.value,
//         //     article: articleField.value,
//         //     bannerImage: bannerPath,
//         //     publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
//         // })
//         db.collection("blog").doc(docName).set(blog_post)
//         .then(() => {
//             location.href = `/${docName}`;
//         })
//         .catch((err) => {
//             console.error(err);
//         })
//     }
// })


//Place autocomplete
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
    });
    var input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input,  {
        types: ['geocode'],
        componentRestrictions: {
         country: ["THA", "KHM", "IDN", "VNM"]
        }
       })
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
    })
};
