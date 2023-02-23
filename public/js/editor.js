const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

// uploadInput.addEventListener('change', () => {
//     uploadImage(uploadInput, "image");
// })

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
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
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if(articleFeild.value.length && blogTitleField.value.length){
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        //access firstore with db variable;
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        })
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
    }
})

// publishBtn.addEventListener('click', () => {
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

//         //access MongoDB with db variable;
//         // const blog_post = {
//         //     title: blogTitleField.value,
//         //     article: articleField.value,
//         //     author: author.value,
//         //     bannerImage: bannerPath,
//         //     publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
//         //     comments: {}
//         // }

//         // async function addPostToDB() {
//         //     try {
//         //         await client.connect();
               
//         //         await addBlogPost(client, db, blog_post);
        
//         //     } catch (e) {
//         //         console.error(e);
//         //     } finally {
//         //         await client.close();
//         //     }
//         // }
//         // addPostToDB().catch(console.error);


//         db.collection("blogs").doc(docName).set()
//         .then(() => {
//             location.href = `/${docName}`;
//         })
//         .catch((err) => {
//             console.error(err);
//         })
//     }
// })


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
        // if (!place.geometry) {
        //     window.alert("Autocomplete's returned place contains no geometry");
        //     return;
        // }

        // // If the place has a geometry, then present it on a map.
        // if (place.geometry.viewport) {
        //     map.fitBounds(place.geometry.viewport);
        // } else {
        //     map.setCenter(place.geometry.location);
        //     map.setZoom(17);
        // }
        // marker.setIcon(({
        //     url: place.icon,
        //     size: new google.maps.Size(71, 71),
        //     origin: new google.maps.Point(0, 0),
        //     anchor: new google.maps.Point(17, 34),
        //     scaledSize: new google.maps.Size(35, 35)
        // }));
        // marker.setPosition(place.geometry.location);
        // marker.setVisible(true);
    })
};