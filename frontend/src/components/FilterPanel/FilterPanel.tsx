import './FilterPanel.css'
import filterIcon from "../../assets/filterIcon.png"
import {useEffect, useState} from "react";
import useGenres from "../../hooks/useGenres.ts";
import sortIcon from "../../assets/sortDescIcon.png"
import {Filters} from "../../types/Filters.ts";
import useFilterStore from "../../stores/FilterStore.ts";
import {useDebounceValue} from "../../hooks";


interface Props {
    handleAddClick: () => void;
}

const FilterPanel = ({handleAddClick}: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const possibleGenres = useGenres();
    const [artist, setArtist] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [localSearchValue, setLocalSearchValue] = useState<string>("");
    const [limit, setLimit] = useState<number>(10);
    const debouncedValue = useDebounceValue(localSearchValue, 500)

    const filters: Filters = useFilterStore(state => state.filters);

    const {
        setSearchValue,
        setFilters,
        resetFilters
    } = useFilterStore();

    const applyFilters = () => {
        const newFilters: Filters = {
            searchValue: filters.searchValue,
            artist: artist,
            genre: genre,
            sortBy: sortBy,
            sortOrder: sortOrder,
            limit: limit,
        }

        setFilters(newFilters);
    }

    const reset = () => {
        setArtist("")
        setGenre("")
        setSortBy("createdAt")
        setSortOrder("desc")
        resetFilters()
    }

    useEffect(() => {
        setSearchValue(debouncedValue)
    }, [debouncedValue])

    return (
        <div className='filter-panel'>
            <div className="default-filter-panel">
                <div className="panel-container">
                    <input className="search-input" type="text" placeholder="Search by title, artist or album"
                           value={localSearchValue} data-testid="search-input"
                           onChange={(e) => setLocalSearchValue(e.target.value)}/>
                    <img className="filter-button" src={filterIcon} alt="Filter"
                         onClick={() => setIsOpen(!isOpen)}
                    />
                </div>

                <div className="add-container">
                    <button className="add-button" onClick={handleAddClick}
                            data-testid="create-track-button">+ Add track
                    </button>
                </div>
            </div>

            <div className={`advanced-filter-panel-container ${isOpen ? 'open' : ''}`}>
                <div className="advanced-filter-panel">
                    <span>Advanced filters</span>

                    <div className="input-container">
                        <label htmlFor="artist-input">Artist</label>
                        <input className="search-input" type="text" placeholder="Search by artist" value={artist}
                               id="artist-input" data-testid="filter-artist"
                               onChange={(e) => setArtist(e.target.value)}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="genre-input">Genre</label>
                        <select value={genre} id={"genre-input"} className="selector" data-testid="filter-genre"
                                onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value={""}>All</option>
                            {possibleGenres && possibleGenres.map((genre, i) => (
                                <option value={genre} key={i}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-container">
                        <label htmlFor="sort-input">Sort by</label>
                        <div className="sort-selector-container">
                            <select value={sortBy} id="sort-input" className="selector" data-testid="sort-select"
                                    onChange={(e) => setSortBy(e.target.value)}>
                                <option value={"title"}>Title</option>
                                <option value={"artist"}>Artist</option>
                                <option value={"album"}>Album</option>
                                <option value={"createdAt"}>Date</option>
                            </select>
                            <img src={sortIcon} className={`sort-icon ${sortOrder}`} alt={"Order"}
                                 onClick={() => sortOrder === "desc" ? setSortOrder("asc") : setSortOrder("desc")}
                            />
                        </div>
                    </div>

                    <div className="input-container">
                        <label htmlFor="limit-input">Tracks to show</label>
                        <input className="search-input" type="number" placeholder="Search by tracks to show"
                               value={limit} step="5" onChange={(e) => setLimit(e.target.value)}
                        />
                    </div>
                    <div className="advanced-filter-footer">
                        <button className="reset-button" onClick={reset}>Reset filters</button>
                        <button className="add-button" onClick={applyFilters}>Apply filters</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterPanel;