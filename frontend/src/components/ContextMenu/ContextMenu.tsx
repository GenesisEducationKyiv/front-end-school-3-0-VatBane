import { Point } from "../../utils/commonTypes";
import useContextMenuStore from "../../stores/ContextMenuStore.ts";
import './ContextMenu.css';


interface Props {
    position: Point

    handleSelect: (trackId: string) => void;
    handleEditClick: (trackId: string) => void;
    handleDeleteClick: () => void;
}

const ContextMenu = (props: Props) => {
    const currentTrackId = useContextMenuStore(state => state.currentTrackId);
    const selectedTracks = useContextMenuStore(state => state.selectedTracks);

    return (
        <div
            className="context-menu"
            style={{ top: props.position.y, left: props.position.x }}
        >
            <ul className="context-menu-list">
                <li className="context-menu-item" onClick={() => {
                    props.handleSelect(currentTrackId);
                }}
                data-testid="select-mode-toggle"
                >{selectedTracks.includes(currentTrackId) ? "Undo" : "Select"}</li>
                {selectedTracks.length <= 1 && (
                    <li className="context-menu-item"
                        onClick={() => {
                            props.handleEditClick(currentTrackId);
                        }}
                    >Edit</li>
                )}
                <li className="context-menu-item"
                    onClick={() => {
                        if (!window.confirm(`Are you sure you want to delete ${selectedTracks.length} tracks?`)) return;
                        props.handleDeleteClick();
                    }} data-testid="bulk-delete-button">Delete
                </li>
            </ul>
        </div>
    );
};

export default ContextMenu;
