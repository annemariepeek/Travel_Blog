const article = document.querySelector('.article')

// banner
const bannerImage = document.querySelector('#banner-upload')
const banner_path = document.querySelector('#banner_path')
const banner = document.querySelector(".banner")
let bannerPath

const uploadInput = document.querySelector('#image-upload')

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner")
})


uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image")
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files
    if(file && file.type.includes("image")){
        const formdata = new FormData()
        formdata.append('image', file)

        fetch('/upload_image', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(uploadType == "image"){
                addImage(data, file.name)
            } else{
                bannerPath = `/${data}`
                // bannerPath = `${location.origin}/${data}`

                console.log(bannerPath)
                banner.style.backgroundImage = `url("${bannerPath}")`
                document.getElementById('banner_path').value = bannerPath
            }
        })
    } else{
        alert("upload Image only")
    }
}

const addImage = (imagepath, alt) => {
    let curPos = article.selectionStart
    let textToInsert = `\r![${alt}](${imagepath})\r`
    article.innerHTML = article.value.slice(0, curPos) + textToInsert + article.value.slice(curPos)
    console.log("hello")
}



//Place autocomplete
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
    })
    var input = document.getElementById('searchInput')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

    var autocomplete = new google.maps.places.Autocomplete(input,  {
        types: ['geocode'],
        componentRestrictions: {
         country: ["THA", "KHM", "IDN", "VNM"]
        }
       })
    autocomplete.bindTo('bounds', map)

    var infowindow = new google.maps.InfoWindow()
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    })

    autocomplete.addListener('place_changed', function() {
        infowindow.close()
        marker.setVisible(false)
        var place = autocomplete.getPlace()
    })
}
