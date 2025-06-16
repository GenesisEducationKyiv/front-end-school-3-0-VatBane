import TrackListItem from "../TrackListItem/TrackListItem.tsx";
import "./TrackList.css"
import React, {useState} from "react";
import TrackEdit from "../TrackEdit/TrackEdit.tsx";
import {Track} from "../../schemas/track.ts";


interface ContextMenu {
    visible: boolean;
    x: number;
    y: number;
    trackId: string;
}

interface Props {
    tracks: Track[];
    handleTrackDelete: (track: Track) => void;
    handleBulkDelete: (tracks: string[]) => void;
    onEditApply: () => void;
    setCurrentTrack: (track: Track) => void;
    onUpload: () => void;
}

const TrackList = (props: Props) => {
    const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
    const [contextMenu, setContextMenu] = useState<ContextMenu>({visible: false, x: 0, y: 0, trackId: ""});
    const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
    const [trackToEdit, setTrackToEdit] = useState<Track>();

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, track: Track) => {
        e.preventDefault();

        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            trackId: track.id,
        });

    }

    const handleSelect = (trackId: string) => {
        if (selectedTracks.includes(trackId)) {
            setSelectedTracks(selectedTracks.filter(track => track !== trackId))
            return
        }

        setContextMenu({visible: false, x: 0, y: 0, trackId: ""});
        setSelectedTracks([...selectedTracks, trackId])
    }

    // Handle clicking outside to close context menu
    const handleClickOutside = () => {
        setContextMenu({...contextMenu, visible: false});
    };

    const handleClick = (trackId: string) => {
        if (selectedTracks.length === 0) return;

        if (selectedTracks.includes(trackId)) {
            setSelectedTracks(selectedTracks.filter(track => track !== trackId));
        } else {
            setSelectedTracks([...selectedTracks, trackId]);
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
            props.handleBulkDelete([contextMenu.trackId]);
        }
        setSelectedTracks([])
    }

    const handleEditClick = () => {
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
                                   setTrackToEdit(track);
                                   handleEditClick()
                               }}
                               setCurrentTrack={props.setCurrentTrack}
                               onClick={handleClick}
                               onContextMenu={handleContextMenu}
                               isSelected={selectedTracks.includes(track.id)}
                               onUpload={props.onUpload}
                               data-testid={`track-item-${track.id}`}
                />
            ))}

            {contextMenu.visible && (
                <div
                    className="context-menu"
                    style={{top: contextMenu.y, left: contextMenu.x}}
                >
                    <ul className="context-menu-list">
                        <li className="context-menu-item" onClick={() => {
                            handleSelect(contextMenu.trackId)
                        }}
                            data-testid="select-mode-toggle"
                        >{selectedTracks.includes(contextMenu.trackId) ? "Undo" : "Select"}</li>
                        {selectedTracks.length <= 1 && (
                            <li className="context-menu-item"
                                onClick={() => {
                                    // @ts-ignore there is always can be needed track, because in props we receive
                                    // N-tracks and we can call contextMenu only on these N-tracks
                                    setTrackToEdit(props.tracks.find(track => track.id === contextMenu.trackId))
                                    handleEditClick()
                                }}
                            >Edit</li>
                        )}
                        <li className="context-menu-item"
                            onClick={() => {
                                if (!window.confirm(`Are you sure you want to delete ${selectedTracks.length} tracks?`)) return
                                onBulkDelete()
                            }} data-testid="bulk-delete-button">Delete
                        </li>
                    </ul>
                </div>
            )}

            {
                showModalEdit &&
                trackToEdit &&
                <TrackEdit track={trackToEdit}
                           handleClose={() => {
                               setShowModalEdit(false)
                           }}
                           onApply={props.onEditApply}/>
            }

        </div>
    )
}

export default TrackList;