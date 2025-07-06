import './TrackListPage.css';
import { useState } from "react";
import FilterPanel from "../../components/FilterPanel/FilterPanel.tsx";
import { Track } from "../../schemas/track.ts";
import { Filters } from "../../types/Filters.ts";
import useFilterStore from "../../stores/FilterStore.ts";
import useTracks from "../../hooks/useTracks.ts";
import Header from "../../components/Header/Header.tsx";
import TrackList from "../../components/TrackList/TrackList.tsx";
import { PageScroll } from "../../components/PageScroll/PageScroll.tsx";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer.tsx";
import TrackCreate from "../../components/TrackCreate/TrackCreate.tsx";
import { TracksApiClient } from "../../api/apiTracks.ts";
import Loader from "../../components/Loader/Loader.tsx";
import useAudioStore from "../../stores/AudioStore.ts";

const TrackListPage = () => {
    const [page, setPage] = useState<number>(1);
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const filters: Filters = useFilterStore(state => state.filters);

    const { setCurrentTrack } = useAudioStore();
    const { setIsPlayerVisible } = useAudioStore();
    // Using the custom hook with GraphQL
    const {
        tracks,
        totalPages,
        isLoading,
        error,
    } = useTracks({
        page,
        limit: 10, // You can make this configurable
        filters
    });

    const updatePagination = (page: number) => {
        if (page > totalPages)
            page = totalPages;
        if (page < 0)
            page = 1;

        setPage(page);
    };

    const handleClose = () => {
        setShowModalCreate(false);
    };

    const onTrackDelete = (deletedTrack: Track) => {
        console.log(deletedTrack);
    };

    const handleBulkDelete = async (tracks: string[]) => {
        await TracksApiClient.bulkDeleteTracks(tracks);
    };

    const onTrackSave = (track: Track) => {
        console.log(track);
    };

    // Handle GraphQL errors
    if (error && !tracks.length) {
        return (
            <div className="body-container">
                <Header/>
                <div className="error-container">
                    <p>Error loading tracks: {error.message}</p>
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
                    }}
                    handleTrackDelete={onTrackDelete}
                    handleBulkDelete={handleBulkDelete}
                    setCurrentTrack={(track: Track) => {
                        setCurrentTrack(track);
                        setIsPlayerVisible(true);
                    }}
                />
            )}

            <PageScroll page={page} totalPages={totalPages} updatePagination={updatePagination}/>
            <AudioPlayer/>
            {showModalCreate && <TrackCreate handleClose={handleClose} onSave={onTrackSave}/>}
        </div>
    );
};

export default TrackListPage;