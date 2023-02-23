
// import { connectToCluster } from './database';
// MONGO_DB_USERNAME = "annemariepeek"
// MONGO_DB_PASSWORD = "dRlpnXen5ycGIgWI"
// MONGO_DB_NAME = "TRAVEL_BLOG"
// MONGO_COLLECTION = "blog_posts"
// API_KEY = "AIzaSyBt6PrdLoAGpNvHozhtuhrHyvQrmYfppMs"

// // const DB_URI = `mongodb+srv:\/\/annemariepeek:dRlpnXen5ycGIgWI@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majorit/`;

// const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
// const mongoClient = new MongoClient(`mongodb+srv:\/\/annemariepeek:dRlpnXen5ycGIgWI@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majorit/`, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
const author = document.querySelector('.author')

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

if (uploadInput) {
    uploadInput.addEventListener('change', () => {
        uploadImage(uploadInput, "image");
    })
}

// const mongoClient = global.mongoClient
// const db = global.db

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

// publishBtn.addEventListener('click', () => {
//     if(articleFeild.value.length && blogTitleField.value.length){
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

//         //access firstore with db variable;
//         db.collection("blogs").doc(docName).set({
//             title: blogTitleField.value,
//             article: articleFeild.value,
//             bannerImage: bannerPath,
//             publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
//         })
//         .then(() => {
//             location.href = `/${docName}`;
//         })
//         .catch((err) => {
//             console.error(err);
//         })
//     }
// })

publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length){
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

        // access MongoDB with db variable;
        const blog_post = {
            docName: docName,
            title: blogTitleField.value,
            article: articleField.value,
            author: author.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            comments: {}
        }

        async function addPostToDB() {
            try {
                await mongoClient.connect();
               
                await addBlogPost(mongoClient, db, blog_post);
        
            } catch (e) {
                console.error(e);
            } finally {
                await mongoClient.close();
            }
        }
        addPostToDB()
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        });

        response.sendFile(path.join(initial_path, "uploads/home.html"))


        // db.collection("blogs").doc(docName).set()
        // .then(() => {
        //     location.href = `/${docName}`;
        // })
        // .catch((err) => {
        //     console.error(err);
        // })
    }
})

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

async function addBlogPost(mongoClient, db, new_post) {
    await mongoClient.db(db.db).collection(db.collection).insertOne(new_post);
}