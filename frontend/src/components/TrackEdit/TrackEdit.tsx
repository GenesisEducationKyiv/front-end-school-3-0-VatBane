import './TrackEdit.css'
import {ChangeEvent, useState} from "react";
import TagInput from "../TagInput/TagInput.tsx";
import {Track, TrackMeta} from "../../types/Track.ts";
import useGenres from "../../hooks/useGenres.ts";
import musicIcon from "../../assets/musicIcon.png"
import saveIcon from "../../assets/saveIcon.png"
import {TracksApiClient} from "../../api/apiTracks.ts";
import uploadIcon from "../../assets/uploadIcon.png";
import removeIcon from "../../assets/removeIcon.png"
import { FilesApiClient } from "../../api/apiFiles.ts";


interface Props {
    track: Track;
    handleClose: () => void;
    onApply: (trackId: string, track: TrackMeta) => void;
}

const TrackEdit = ({track, handleClose, onApply}: Props) => {
    const [title, setTitle] = useState<string>(track.title);
    const [artist, setArtist] = useState<string>(track.artist);
    const [album, setAlbum] = useState<string>(track.album);
    const [genres, setGenres] = useState<string[]>(track.genres);
    const [audioFile, setAudioFile] = useState<string>(track.audioFile);
    const [fileBlob, setFileBlob] = useState<string>(track.audioFile);
    const [coverImage, setCoverImage] = useState<string>(track.coverImage ?? "");
    const allowedTypes = ["audio/mp3", "audio/wav", "audio/mpeg", "audio/x-wav"];

    const possibleGenres = useGenres();

    const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCoverImage(e.target.value);
    }

    const onApplyChanges = async () => {
        if (!window.confirm("Are you sure you want to apply changes?")) return;
        const data = await TracksApiClient.updateTrack(track.id, {title, artist, album, genres, coverImage});
        if (data == null) {
            return;
        }
        handleClose();
        onApply(track.id, data);
    }

    const onUploadClick = async (file: File) => {
        if (!file) return;  // prevent saving empty file

        // check MIME type
        if (!allowedTypes.includes(file.type)) {
            alert('Allowed only .mp3 and .wav files!')
            return;
        }

        // packing and sending request
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8000/api/tracks/" + track.id + "/upload", {
            method: "POST",
            body: formData,
        })

        // process response
        if (response.status < 200 || response.status >= 300) {
            alert(await response.json())
        } else {
            console.log("Successfully uploaded")
        }
    }

    return (
        <div className='modal-back' onClick={handleClose}>
            <div className="modal-edit" onClick={(e) => e.stopPropagation()}>
                <div className="modal-edit-header">
                    <div className="modal-edit-title-container">
                        <img src={musicIcon} alt={'Icon'} className="music-icon"/>
                        <h2 className="modal-edit-title">Edit Track</h2>
                    </div>
                    <button className="close-button" onClick={handleClose}>
                        X
                    </button>
                </div>

                <div className='modal-input'>
                    <div className='input-block'>
                        <label title={'track-title'}>Title</label>
                        <input type='text' placeholder='Track title' value={title}
                               onChange={(e) => {
                                   setTitle(e.target.value)
                               }} title={'track-title'}/>
                    </div>

                    <div className="input-block">
                        <label title={'track-artist'}>Artist</label>
                        <input type='text' placeholder='Track artist' value={artist}
                               title={'track-artist'}
                               onChange={(e) => {
                                   setArtist(e.target.value)
                               }}
                        />
                    </div>

                    <div className="input-block">
                        <label title='track-album'>Album</label>
                        <input type='text' placeholder='Track album' value={album}
                               title='track-album'
                               onChange={(e) => {
                                   setAlbum(e.target.value)
                               }}
                        />
                    </div>

                    <div className="input-block">
                        <label title={'track-genres'}>Genres</label>
                        <TagInput tags={genres} setTags={setGenres} possibleTags={possibleGenres}/>
                    </div>

                    <div className="input-block-row">
                        <label>File
                            <input className="file-input" type="file" accept="audio/mp3, audio/wav"
                                   onChange={(e) => {
                                       const file = e.target.files?.[0];
                                       if (!file) return;  // safety check

                                       onUploadClick(file)
                                   }}/>
                            <img className="edit-file-upload-image" src={uploadIcon} alt='Upload'/>
                        </label>
                        {audioFile && (<img src={removeIcon} alt={"remove"} className="remove-file-button"
                                            onClick={async () => {
                                                if (!window.confirm("Are you sure you want delete audio file?")) return;
                                                await FilesApiClient.removeFile(track.id)
                                                setAudioFile("")
                                            }}
                        />)}
                    </div>
                    <div className="input-block">
                        <label title={'track-cover-image'}>Cover Image</label>
                        <input type='text' placeholder='Cover Image' value={coverImage}
                               onChange={handleCoverImageChange}/>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onApplyChanges}>
                        <img src={saveIcon} alt="saveIcon"/>
                        <span>Save Track</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TrackEdit;