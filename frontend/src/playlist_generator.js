//import { useEffect } from "react";
//import { Router } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/playlist_generator.css"
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function PlaylistGenerator() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    // Constant to get a users liked songs
    const getSongs = async (playlist_url) => {
        const { data } = await axios.get(playlist_url, {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
            }
        });
        console.log(data);
        return data;
    }

    // Get username so we can use it in createPlaylist
    const getUserId = async () => {
        const url = 'https://api.spotify.com/v1/me';
        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
            }
        });
        return data.id;
    }

    //Creates an empty playlist
    const createPlaylist = async (userId) => {
        const url = 'https://api.spotify.com/v1/users/' + userId + '/playlists';
        const title = document.getElementById('playlist_title').value;
        const playlistData = {
            name: title,
            description: document.getElementById('description').value,
            public: true
        };
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
                'Content-Type': 'application/json'
            }
        }

        const data = await axios.post(url, JSON.stringify(playlistData), config);
        localStorage.setItem("playlistId", data.data.id);
        return data.data.id;
    }

    //Add songs into playlist
    const addTracksToPlaylist = async (playlistId, songs) => {
        const url = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';

        const trackData = {
            'uris': songs
        }

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        await axios.post(url, JSON.stringify(trackData), config);
    }

    //Function to get track tempo
    const getAudioAnalysis = async (track_id) => {
        const url = 'https://api.spotify.com/v1/audio-analysis/' + track_id; // need to instantiate track_id
        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
            }
        });
        return data.track.tempo;
    }

    // Returns a list of song that matches input tempo
    async function getSongsWithTempo() {
        let url = "https://api.spotify.com/v1/me/tracks?offset=0&limit=50&locale=en-US,en;q=0.5"
        let data = await getSongs(url);
        let songs = [];
        let tempoMatched = [];
        const userBpm = document.getElementById('userBpm').value;
        console.log("first 50");
        console.log(data);

        while (data) {
            for (let i = 0; i < data.items.length; i++) {
                songs.push(data.items[i].track.id);
            }
            for (let i = 0; i < songs.length; i++) {
                let tempo = await getAudioAnalysis(songs[i]);
                let min = tempo - 5;
                let max = tempo + 5;

                if (userBpm >= min & userBpm <= max) {
                    console.log('YES')
                    tempoMatched.push(data.items[i].track.uri);
                }
            }

            songs = [];
            if (data.next) {
                data = await getSongs(data.next);
            }
            else {
                data = null;
            }
            console.log("next 50");
        }

        return tempoMatched;
    }

     async function addPlaylistImage(playlistId) {
        if(document.getElementById('albumCov').files[0]){
            let blob = document.getElementById('albumCov').files[0];
            var reader = new FileReader();

            reader.onload = function(e){
                console.log(e.target.result); // Prints out data of image I think?
            }

            reader.readAsDataURL(blob);
        }
     }

    async function createPlaylistByTempo() {
        setIsLoading(true);
        const userId = await getUserId();
        const playlistId = await createPlaylist(userId);
        let songs = await getSongsWithTempo();
        //let image = await addPlaylistImage(playlistId);
        await addTracksToPlaylist(playlistId, songs);
        try {
            const title = document.getElementById('playlist_title').value;
            const desc = document.getElementById('description').value;
            const bpm = document.getElementById('userBpm').value;
            const url = `https://api.spotify.com/v1/playlists/${playlistId}`;
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.accessToken}`,
                }
            });
            await axios.post('https://spotigo.azurewebsites.net/home', { name: title, sid: playlistId, album_cover: data.images[0].url, description: desc, bpm: bpm, views: 1 });
        }
        catch (error) {
            alert(error);
        }

        navigate(`/playlist/${playlistId}`);
    }


    return (
        <html>
            <div class="playlist-generator screen">
                <h1 className="home-header">
                  <Link to="/home" disabled={isLoading}>
                     <svg text-anchor="center" vertical-align="center" width="50" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clip-rule="evenodd" d="M23 42C34.4819 42 43.7898 32.598 43.7898 21C43.7898 20.1962 43.7451 19.4029 43.658 18.6225L38.9425 19.903L35.8553 25.3C35.836 25.3369 35.8159 25.3736 35.7951 25.41C34.9078 26.9611 32.9467 27.4949 31.4149 26.6024C29.883 25.7099 29.3605 23.729 30.2477 22.1779L30.2618 22.1536L30.261 22.1532L34.6984 14.3959L34.6968 14.3898L41.9778 12.4127C38.728 5.09608 31.4532 0 23 0C11.5182 0 2.21027 9.40202 2.21027 21C2.21027 22.9999 2.48703 24.9346 3.00399 26.767C2.97617 26.6674 2.94903 26.5675 2.92256 26.4672C2.6208 25.3239 2.41905 24.1772 2.31188 23.0363L7.36872 21.6632L10.4561 16.266C10.4753 16.2292 10.4954 16.1925 10.5162 16.1561C11.4035 14.6051 13.3646 14.0712 14.8964 14.9638C16.4283 15.8563 16.9508 17.8372 16.0635 19.3883L16.0495 19.4126L16.0503 19.413L11.6128 27.1703L11.6144 27.1764L3.88651 29.2749C7.06602 36.7584 14.427 42 23 42ZM15.835 33.5973C14.3095 32.7087 13.7888 30.7371 14.6722 29.1935L26.1223 9.1842C27.0057 7.64057 28.9584 7.10951 30.484 7.99804C32.0095 8.88658 32.5301 10.8582 31.6468 12.4019L20.1967 32.4111C19.3133 33.9548 17.3605 34.4858 15.835 33.5973Z" fill="black" />
                     </svg>
                  </Link>
                     Spotigo
                </h1>
                <div class="playlist-art">
                    <div class='image-upload'>
                        <input type='file' accept='image/*' name='albumCov' id='albumCov'></input>
                        <label for='albumCov' className='album-cover-pg'></label>
                    </div>
                </div>
                <div class="flex-col">
                    <div class="title-1">
                        <div class="title-2 opensans-bold-white-45px">Title</div>
                        <form>
                            <input type="text" id="playlist_title" name="playlist_title" class="rectangle-13"></input>
                        </form>
                    </div>
                    <div class="flex-row">
                        <div class="bpm">
                            <div class="bpm-1 opensans-bold-white-45px">BPM</div>
                            <form>
                                <input type="text" id="userBpm" name="userBpm" class="rectangle-13-1"></input>
                            </form>
                        </div>
                    </div>
                    <div class="description">
                        <div class="description-1 opensans-bold-white-45px">Description</div>
                        <form>
                            <textarea id='description' name='description' class='rectangle-13-2'></textarea>
                        </form>
                    </div>
                    <button onClick={createPlaylistByTempo} disabled={isLoading} className="create-button">Create</button>
                </div>
                {isLoading ? <div className="spinner-container"><div className="loading-spinner">
                <svg width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M60.3788 120C93.5159 120 120.379 93.1371 120.379 60C120.379 57.7115 120.251 55.4529 120.001 53.2311L106.399 56.8757L97.363 72.5272L97.3626 72.527L97.3352 72.5751L97.3153 72.6098C94.7598 77.036 89.1 78.5526 84.6738 75.9971C80.2476 73.4416 78.7311 67.7819 81.2866 63.3557L81.3042 63.3252L81.3347 63.2733L81.3343 63.273L94.1184 41.1302L94.1535 41.1505L94.1363 41.086L115.146 35.4566C105.765 14.5564 84.7718 0 60.3788 0C27.2418 0 0.378845 26.8629 0.378845 60C0.378845 93.1371 27.2418 120 60.3788 120ZM27.5196 77.6744L5.33871 83.6178C4.23071 81.0229 3.29248 78.3182 2.54101 75.5136C1.67061 72.2653 1.08418 69.0077 0.76651 65.7673L15.2565 61.8848L24.2929 46.2333L24.2933 46.2335C24.3089 46.2058 24.3247 46.1782 24.3406 46.1506C26.8961 41.7244 32.5559 40.2079 36.9821 42.7634C41.4083 45.3188 42.9248 50.9786 40.3693 55.4048L40.3404 55.4545L40.3212 55.4872L40.3216 55.4874L27.5375 77.6302L27.5024 77.6099L27.5196 77.6744ZM39.7428 95.9618C35.3166 93.4063 33.8 87.7466 36.3555 83.3204L69.294 26.2692C71.8495 21.843 77.5092 20.3265 81.9354 22.882C86.3617 25.4374 87.8782 31.0972 85.3227 35.5234L52.3842 92.5745C49.8288 97.0007 44.169 98.5173 39.7428 95.9618Z" fill="whitesmoke"/>
                  </svg>                     
                  </div><h1>Generating - may take up to one minute</h1></div> : <div></div>}
            </div>
        </html>
    );
}
