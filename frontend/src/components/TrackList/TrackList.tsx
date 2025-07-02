import { Track } from "../../types/Track.ts";
import TrackListItem from "../TrackListItem/TrackListItem.tsx";
import "./TrackList.css"
import { useState } from "react";
import TrackEdit from "../TrackEdit/TrackEdit.tsx";
import ContextMenu from "../ContextMenu/ContextMenu.tsx";
import { Point } from "../../utils/commonTypes.ts";
import useContextMenuStore from "../../stores/ContextMenuStore.ts";


interface Props {
    tracks: Track[];
    handleTrackDelete: (track: Track) => void;
    handleBulkDelete: (tracks: string[]) => void;
    onEditApply: () => void;
    setCurrentTrack: (track: Track) => void;
    onUpload: () => void;
}

const TrackList = (props: Props) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<Point>({ x: 0, y: 0 });
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
    const [trackToEdit, setTrackToEdit] = useState<Track>();

    const currentTrackId = useContextMenuStore(state => state.currentTrackId);
    const selectedTracks = useContextMenuStore(state => state.selectedTracks);

    const { addTrack, removeTrack, setSelectedTracks, setCurrentTrackId} = useContextMenuStore();

    const handleContextMenu = (e: any, track: Track) => {
        e.preventDefault();

        setCurrentTrackId(track.id);
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.pageX, y: e.pageY });
    }

    const handleSelect = (trackId: string) => {
        if (selectedTracks.includes(trackId)) {
            removeTrack(trackId);
        } else {
            addTrack(trackId)
        }
        setShowContextMenu(false);
    }

    const handleClickOutside = () => {
        setShowContextMenu(false);
    };

    const handleClick = (trackId: string) => {
        if (selectedTracks.length === 0) return;

        if (selectedTracks.includes(trackId)) {
            removeTrack(trackId);
        } else {
            addTrack(trackId);
        }
    }

    const toggleAll = () => {
        if (selectedTracks.length === props.tracks.length)
            setSelectedTracks([]);
        else {
            setSelectedTracks(props.tracks.map(track => track.id));
        }
    }

    const onBulkDelete = () => {
        if (selectedTracks.length > 0)
            props.handleBulkDelete(selectedTracks);
        else {
            props.handleBulkDelete([currentTrackId]);
        }
        setSelectedTracks([])
    }

    const handleEditClick = (trackId: string) => {
        setTrackToEdit(props.tracks.find(track => track.id === trackId))
        setShowModalEdit(true);
    }

    return (
        <div className="track-list" onClick={handleClickOutside}>
            <div className={`all-selector ${selectedTracks.length === 0 ? "" : "active"} 
            ${selectedTracks.length === props.tracks.length ? "all" : ""}`}
                 onClick={() => {
                     toggleAll()
                 }}
                 data-testid="select-all"
            >
            </div>

            {props.tracks.length === 0 ? <div>Nothing there</div> : props.tracks.map((track) => (
                <TrackListItem track={track} key={track.id}
                               onDelete={props.handleTrackDelete}
                               handleEditClick={() => {
                                   handleEditClick(track.id)
                               }}
                               setCurrentTrack={props.setCurrentTrack}
                               onClick={handleClick}
                               onContextMenu={handleContextMenu}
                               isSelected={selectedTracks.includes(track.id)}
                               onUpload={props.onUpload}
                               data-testid={`track-item-${track.id}`}
                />
            ))}

            {showContextMenu && (
                <ContextMenu position={contextMenuPosition}
                             handleSelect={handleSelect}
                             handleEditClick={handleEditClick}
                             handleDeleteClick={onBulkDelete}
                />
            )}

            {showModalEdit && <TrackEdit track={trackToEdit}
                                         handleClose={() => {
                                             setShowModalEdit(false)
                                         }}
                                         onApply={props.onEditApply}/>}

        </div>
    )
}

export default TrackList;