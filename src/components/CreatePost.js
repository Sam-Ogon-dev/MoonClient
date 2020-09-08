import React from "react";
import {ADDRESS_AUTHORIZATION, ADDRESS_NEWS_FEED, API_CREATE_POST, API_GET_NEWS_FEED} from "../Properties";
import Cookies from "universal-cookie";
import {isAuth} from "../Service";

export default function CreatePost() {
    const [uploadPhotos, setUploadPhotos] = React.useState([]);
    const cookies = new Cookies();

    React.useEffect(() => {
        isAuth().then(r => {
            if (r) {
                window.location.assign(ADDRESS_AUTHORIZATION)
            }
        });
    });

    function inputImages(e) {
        e.persist();
        let blobPhotos = []
        for (let i = 0; i < e.target.files.length; i++) {
            blobPhotos.push(e.target.files[i]);
        }

        setUploadPhotos(blobPhotos);
    }

    function removeImages(index) {
        let blobPhotos= [...uploadPhotos];
        blobPhotos.splice(index, 1)
        setUploadPhotos(blobPhotos);
    }

    async function sendNewPost(formData) {
        let text = "";
        let photos = [];

        for(let i = 0; i < uploadPhotos.length; i++) {
            await new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    photos.push([...new Uint8Array(reader.result)]);
                    resolve();
                }
                reader.readAsArrayBuffer(uploadPhotos[i]);
            })


        }

        for (const input of formData) {
            if(input.id === "text") { text = input.value }
        }

        fetch(API_CREATE_POST, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                text,
                photos
            })
        }).then(r => r.json())
            .then(r => {
                if(!r.err) { window.location.assign(ADDRESS_NEWS_FEED) }
            });

    }

    return (
        <form className="create_post_page">
            <div className="photo_list">
                {uploadPhotos.map((photo, index) =>
                    <img key={index} src={ URL.createObjectURL(photo) } onClick={() => removeImages(index)}/>
                )}


                <input type="file"  required multiple id="inputImage" accept="image/jpeg" onChange={ e => {inputImages(e) }}/>
                <label htmlFor="inputImage" className="upload_button" />
            </div>
            <hr />
            <textarea id="text" placeholder="Введите текст поста"/>
            <button className="button" onClick={ e => {
                e.preventDefault();
                sendNewPost(e.target.form.elements);
            }}>Создать пост</button>
        </form>
    );
}