import './TrackListItem.css'
import {Track} from "../../types/Track.ts";
import deleteIcon from '../../assets/deleteIcon.png'
import editIcon from '../../assets/editIcon.png'
import uploadIcon from '../../assets/uploadIcon.png'
import emptyCover from '../../assets/emptyCover.png'
import {deleteTrack} from "../../api/apiTracks.ts";
import {uploadFile} from "../../api/apiFiles.ts";


interface Props {
    track: Track;
    onDelete: (track: Track) => void;
    handleEditClick: (track: Track) => void;
    setCurrentTrack: (track: Track) => void;
    onContextMenu: (e: any, track: Track) => void;
    onClick: (trackId: string) => void;
    isSelected: boolean;
    onUpload: () => void;
}

const TrackListItem = (props: Props) => {
    const allowedTypes = ["audio/mp3", "audio/wav", "audio/mpeg", "audio/x-wav"];

    const onDeleteClick = async () => {
        if (!window.confirm(`Are you sure you want to delete ${props.track.title}?`)) return

        if (!await deleteTrack(props.track.id))
            props.onDelete(props.track);

    }

    const onUploadClick = async (file: File) => {
        if (!file) return;  // prevent saving empty file

        if (!allowedTypes.includes(file.type)) {
            alert('Allowed only .mp3 and .wav files!')
            return;
        }

        if (!await uploadFile(props.track.id, file)) return
        props.onUpload()
    }

    return (
        <div className={`track-list-item ${props.isSelected ? "selected" : ""}`}
             data-testid={`track-item-${props.track.id}`}
             onContextMenu={(e) => props.onContextMenu(e, props.track)}
             onClick={() => {
                 props.onClick(props.track.id)
             }}>
            <div className='track-container'
                 onClick={() => {
                     props.setCurrentTrack(props.track)
                 }}
            >
                <img className="cover-image" src={props.track.coverImage || emptyCover} alt='coverImage'
                     onError={(e) => {
                         e.currentTarget.onerror = null
                         e.currentTarget.src = emptyCover
                     }}
                />

                <div className="track-data">
                    <span className="track-title"
                          data-testid={`track-item-${props.track.id}-title`}>
                        {props.track.title}
                    </span>
                    <span className="track-artist"
                          data-testid={`track-item-${props.track.id}-artist`}>
                            {props.track.artist}
                        </span>
                </div>
            </div>

            <div className="actions-panel">
                <label>
                    <input className="file-input" type="file" accept="audio/mp3, audio/wav"
                           onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;  // safety check

                               onUploadClick(file)
                           }}
                           data-testid={`upload-track-${props.track.id}`}
                    />
                    <img className="button-image" src={uploadIcon} alt='Upload'/>
                </label>
                <img className="button-image" src={editIcon} alt='Edit'
                     data-testid={`"edit-track-${props.track.id}`}
                     onClick={() => props.handleEditClick(props.track)}
                />
                <img className="button-image" src={deleteIcon} alt="Delete" onClick={onDeleteClick}
                     data-testid={`delete-track-${props.track.id}`}
                />
            </div>
        </div>
    )
}

export default TrackListItem;