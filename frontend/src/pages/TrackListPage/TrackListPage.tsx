import './TrackListPage.css';
import { useState } from "react";
import FilterPanel from "../../components/FilterPanel/FilterPanel.tsx";
import { Track } from "../../types/Track.ts";
import { Filters } from "../../types/Filters.ts";
import useFilterStore from "../../stores/FilterStore.ts";
import useTracks from "../../hooks/useTracks.ts";
import Header from "../../components/Header/Header.tsx";
import TrackList from "../../components/TrackList/TrackList.tsx";
import { PageScroll } from "../../components/PageScroll/PageScroll.tsx";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer.tsx";
import TrackCreate from "../../components/TrackCreate/TrackCreate.tsx";
import Loader from "../../components/Loader/Loader.tsx";
import { TracksApiClient } from "../../api/apiTracks.ts";

const TrackListPage = () => {
    const [page, setPage] = useState<number>(1);
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [showPlayer, setShowPlayer] = useState<boolean>(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const filters: Filters = useFilterStore(state => state.filters);

    // Using the custom hook with GraphQL
    const {
        tracks,
        totalPages,
        total,
        isLoading,
        error,
        refetch
    } = useTracks({
        page,
        limit: 10, // You can make this configurable
        filters
    });

    const updatePagination = (newPage: number) => {
        if (newPage > totalPages)
            newPage = totalPages;
        if (newPage < 1)
            newPage = 1;

        setPage(newPage);
    };

    const handleClose = () => {
        setShowModalCreate(false);
    };

    const onTrackDelete = (deletedTrack: Track) => {
        console.log(deletedTrack);
        refetch();
    };

    const handleBulkDelete = async (tracks: string[]) => {
        await TracksApiClient.bulkDeleteTracks(tracks);
        await refetch();
    };

    const onTrackSave = (track: Track) => {
        console.log(track);
        refetch();
    };

    // Handle GraphQL errors
    if (error && !tracks.length) {
        return (
            <div className="body-container">
                <Header/>
                <div className="error-container">
                    <p>Error loading tracks: {error.message}</p>
                    <button onClick={() => refetch()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="body-container">
            <Header/>
            <FilterPanel handleAddClick={() => {
                setShowModalCreate(true);
            }}/>
            <PageScroll page={page} totalPages={totalPages} updatePagination={updatePagination}/>

            {isLoading ? (
                <div className="tracks-loading-container">
                    <Loader size="large" text="Loading tracks..." data-testid="loading-tracks"/>
                </div>
            ) : (
                <TrackList tracks={tracks}
                    onEditApply={() => {
                        refetch();
                    }}
                    handleTrackDelete={onTrackDelete}
                    handleBulkDelete={handleBulkDelete}
                    onUpload={refetch}
                    setCurrentTrack={(track: Track) => {
                        setCurrentTrack(track);
                        setShowPlayer(true);
                    }}
                />
            )}

            <PageScroll page={page} totalPages={totalPages} updatePagination={updatePagination}/>
            <AudioPlayer
                isVisible={showPlayer}
                currentTrack={currentTrack}
                onClose={() => {
                    setShowPlayer(false);
                }}
            />
            {showModalCreate && <TrackCreate handleClose={handleClose} onSave={onTrackSave}/>}
        </div>
    );
};

export default TrackListPage;