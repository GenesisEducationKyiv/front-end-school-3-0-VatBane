import './TrackCreate.css'
import {ChangeEvent, useState} from "react";
import TagInput from "../TagInput/TagInput.tsx";
import useGenres from "../../hooks/useGenres.ts";
import musicIcon from "../../assets/musicIcon.png"
import saveIcon from "../../assets/saveIcon.png"
import {saveTrack} from "../../api/apiTracks.ts";
import {isValidImageUrl} from "../../utils/validationUtils.ts";
import {Track} from "../../schemas/track.ts";


interface Props {
    handleClose: () => void;
    onSave: (track: Track) => void;
}

const TrackCreate = ({handleClose, onSave}: Props) => {
    const [title, setTitle] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [album, setAlbum] = useState<string>('');
    const [genres, setGenres] = useState<string[]>([]);
    const [coverImage, setCoverImage] = useState<string>('');

    const possibleGenres = useGenres();

    const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCoverImage(e.target.value);
    }

    const onApply = async () => {
        if (title.trim() === "") {
            alert("Please enter title!");
            return;
        }
        if (artist.trim() === "") {
            alert("Please enter artist!");
            return;
        }
        const result = isValidImageUrl(coverImage)
        if (!result) {
            alert("Cover image url is invalid!")
            return;
        }
        const data = await saveTrack({title, artist, album, genres, coverImage});

        if (data.isOk()) {
            handleClose();
            onSave(data.value);
        }
        else {
            return;
        }
    }

    return (
        <div className='modal-back' onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}
                 data-testid="track-form"
            >
                <div className="modal-header">
                    <div className="modal-title-container">
                        <img src={musicIcon} alt={'Icon'} className="music-icon"/>
                        <h2 className="modal-title">Add Track</h2>
                    </div>
                    <button className="close-button" onClick={handleClose}>
                        X
                    </button>
                </div>

                <div className='modal-input'>
                    <div className='input-block'>
                        <label title={'track-title'} data-testid="input-title">Title</label>
                        <input type='text' placeholder='Track title' value={title}
                               onChange={(e) => {
                                   setTitle(e.target.value)
                               }} title={'track-title'}/>
                    </div>

                    <div className="input-block">
                        <label title={'track-artist'} data-testid="input-artist">Artist</label>
                        <input type='text' placeholder='Track artist' value={artist}
                               title={'track-artist'}
                               onChange={(e) => {
                                   setArtist(e.target.value)
                               }}
                        />
                    </div>

                    <div className="input-block">
                        <label title='track-album' data-testid="input-album">Album</label>
                        <input type='text' placeholder='Track album' value={album}
                               title='track-album'
                               onChange={(e) => {
                                   setAlbum(e.target.value)
                               }}
                        />
                    </div>

                    <div className="input-block">
                        <label title={'track-genres'} data-testid="genre-selector">Genres</label>
                        <TagInput tags={genres} setTags={setGenres} possibleTags={possibleGenres}/>
                    </div>

                    <div className="input-block">
                        <label title={'track-cover-image'} data-testid="input-cover-image">Cover Image</label>
                        <input type='text' placeholder='Cover Image' value={coverImage}
                               onChange={handleCoverImageChange}/>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onApply} data-testid="submit-button">
                        <img src={saveIcon} alt="saveIcon"/>
                        <span>Save Track</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TrackCreate;