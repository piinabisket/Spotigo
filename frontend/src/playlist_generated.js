import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
import axios from 'axios'
import "./css/playlist_generated.css"
import Table from './Table.js'

export default function PlaylistGenerated() {
    const [playlist, setPlaylist] = useState([]);
    const { id } = useParams();
    const [albumCover, setAlbumCover] = useState();
    const [author_url, setAuthorUrl] = useState();

    async function likePlaylist() {
        var img = document.getElementById("likeButton");
        if (img.className === "liked-button") {
            const response = await axios({
                method: 'get',
                url: 'https://spotigo.azurewebsites.net/users?email=' + localStorage.email,
            });
            response.data.users_list[0].liked_songs = response.data.users_list[0].liked_songs.filter(function(item) {
                return item !== id;
            });
            try {
                await axios({
                    method: 'put',
                    url: "https://spotigo.azurewebsites.net/users",
                    data: response.data.users_list[0]
                });
                img.className = "like-button";
                img.src = "likeButton.png"
            } catch (error) {
                alert(error);
            }
        }
        else {
            const response = await axios({
                method: 'get',
                url: 'https://spotigo.azurewebsites.net/users?email=' + localStorage.email,
            });
            response.data.users_list[0].liked_songs.push(id);
            try {
                await axios({
                    method: 'put',
                    url: "https://spotigo.azurewebsites.net/users",
                    data: response.data.users_list[0]
                });
                img.className = "liked-button";
                img.src = "likedButton.png"
            } catch (error) {
                alert(error);
            }
        }
    }

    async function likePlaylistToSpotify() {
        try {
            await axios({
                method: 'put',
                url: 'https://api.spotify.com/v1/playlists/' + id + '/followers',
                headers: { 'Authorization': 'Bearer ' + localStorage.accessToken },
                data: {
                    "public": false
                }
            })
            alert("Saved playlist to your Spotify account");
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        async function parsePlaylist(id) {
            const url = `https://api.spotify.com/v1/playlists/${id}`;
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.accessToken}`,
                }
            });
            const response = await axios({
                method: 'get',
                url: 'https://spotigo.azurewebsites.net/users?email=' + localStorage.email,
            });

            var img = document.getElementById("likeButton");
            if (response.data.users_list[0].liked_songs.includes(id)) {
                img.className = "liked-button";
                img.src = "likedButton.png"
            }
            else {
                img.className = "like-button";
                img.src = "likeButton.png"
            }

            var auth_desc = data.owner.display_name;
            if (data.description)
                auth_desc += ' | ' + data.description;
            if (auth_desc.length >= 70)
                auth_desc = auth_desc.substring(0, 67) + "..."
            document.getElementById('playlist-owner-desc').innerHTML = auth_desc;
            document.getElementById('playlist-name-title').innerHTML = data.name;

            const songs = { listOfSongs: [], albumCover: data.images[0].url, authorUrl: data.external_urls.spotify }
            for (let i = 0; i < data.tracks.items.length; i++) {
                songs['listOfSongs'].push(
                    {
                        picture: data.tracks.items[i].track.album.images[0].url,
                        name: data.tracks.items[i].track.name,
                        artist: data.tracks.items[i].track.artists[0].name,
                        album: data.tracks.items[i].track.album.name,
                        length: millisToMinutesAndSeconds(data.tracks.items[i].track.duration_ms).toString()
                    }
                );
            }
            return songs;
        }

        parsePlaylist(id).then(result => {
            if (result) {
                setPlaylist(result['listOfSongs']);
                setAlbumCover(result['albumCover'])
                setAuthorUrl(result['authorUrl'])
            }
        });
    }, [id]);

    useEffect(() => {
        async function initialize_like_button(id) {
            var img = document.getElementById("likeButton");

            const response = await axios({
                method: 'get',
                url: 'https://spotigo.azurewebsites.net/users?email=' + localStorage.email,
            });
            if (response.data.users_list[0].liked_songs.includes(id)) {
                img.className = "liked-button";
                img.src = "likedButton.png"
            }
            else {
                img.className = "like-button";
                img.src = "likeButton.png"
            }
        }
        initialize_like_button();
    }, [id]);

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    return (
        <html>
            <div id="conditional">
                <h1 className="top-bar-playlist-gen">
                  <Link to="/home">
                     <svg text-anchor="center" vertical-align="center" width="50" height="43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clip-rule="evenodd" d="M23 42C34.4819 42 43.7898 32.598 43.7898 21C43.7898 20.1962 43.7451 19.4029 43.658 18.6225L38.9425 19.903L35.8553 25.3C35.836 25.3369 35.8159 25.3736 35.7951 25.41C34.9078 26.9611 32.9467 27.4949 31.4149 26.6024C29.883 25.7099 29.3605 23.729 30.2477 22.1779L30.2618 22.1536L30.261 22.1532L34.6984 14.3959L34.6968 14.3898L41.9778 12.4127C38.728 5.09608 31.4532 0 23 0C11.5182 0 2.21027 9.40202 2.21027 21C2.21027 22.9999 2.48703 24.9346 3.00399 26.767C2.97617 26.6674 2.94903 26.5675 2.92256 26.4672C2.6208 25.3239 2.41905 24.1772 2.31188 23.0363L7.36872 21.6632L10.4561 16.266C10.4753 16.2292 10.4954 16.1925 10.5162 16.1561C11.4035 14.6051 13.3646 14.0712 14.8964 14.9638C16.4283 15.8563 16.9508 17.8372 16.0635 19.3883L16.0495 19.4126L16.0503 19.413L11.6128 27.1703L11.6144 27.1764L3.88651 29.2749C7.06602 36.7584 14.427 42 23 42ZM15.835 33.5973C14.3095 32.7087 13.7888 30.7371 14.6722 29.1935L26.1223 9.1842C27.0057 7.64057 28.9584 7.10951 30.484 7.99804C32.0095 8.88658 32.5301 10.8582 31.6468 12.4019L20.1967 32.4111C19.3133 33.9548 17.3605 34.4858 15.835 33.5973Z" fill="black" />
                     </svg>
                     </Link>
                     Spotigo
                </h1>
                <div className="playlist-generated">
                    <img class="album-cover" src={albumCover} alt=""></img>
                    <h1 className="title-label">
                        Title
                        <h1 className="album-label">Album</h1>

                        <svg className="length-circle" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="#767676" stroke-width="2" />
                            <svg className="length-clock-hand" x="2" y="4" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 0V6L4.5 9.5" stroke="#767676" stroke-width="2.4" />
                            </svg>
                        </svg>
                    </h1>
                    <div className="playlist-table" >
                        {
                            playlist.length > 1 &&
                            <Table playlistData={playlist} />
                        }
                    </div>
                    <a href={author_url} className="playlist-name" id="playlist-name-title" target="_blank" rel="noreferrer"> </a>
                    <p className="author-description" id="playlist-owner-desc"></p>
                    <div>
                        <button id="likeButton" className="like-button" onClick={likePlaylist}>
                            <image src="likeButton.png" alt="no image"></image>
                        </button>
                        <button id="shareButton" className="share-button" onClick={likePlaylistToSpotify}>
                            <image src="shareButton.png" alt="no image"></image>
                        </button>
                    </div>
                </div>
            </div>
        </html>
    )
}
