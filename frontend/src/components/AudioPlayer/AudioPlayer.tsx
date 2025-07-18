import { ChangeEvent, useEffect, useRef, useState } from "react";
import { TracksApiClient } from "../../api/apiTracks.ts";
import './AudioPlayer.css';
import emptyCover from "../../assets/emptyCover.png";
import playIcon from "../../assets/playIcon.png";
import pauseIcon from "../../assets/pauseIcon.png";
import { FilesApiClient } from "../../api/apiFiles.ts";
import { formatTime } from "../../utils/formatTime.ts";
import { VolumeIcon } from "./VolumeIcon.tsx";
import useAudioStore from "../../stores/AudioStore.ts";


const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [audioTrack, setAudioTrack] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTrack = useAudioStore(state => state.currentTrack);

    const { isPlayerVisible } = useAudioStore();
    const { setIsPlayerVisible } = useAudioStore();

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleCanPlayThrough = () => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(error => {
                    alert(`Autoplay failed: ${error}`);
                    // Some browsers block autoplay unless there's user interaction
                    setIsPlaying(false);
                });
        }
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const seekTime = parseFloat(e.target.value);
        setCurrentTime(seekTime);
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
        }
    };

    const loadAudioTrack = async () => {
        if (!currentTrack) {
            return;
        }
        if (currentTrack.audioFile == null) {
            alert("Track do not have audio file!");
            audioRef.current?.pause();
            audioRef.current.src = "";
            setAudioTrack(null);
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            return;
        }

        const response = await FilesApiClient.fetchTrackAudio(currentTrack.audioFile);
        if (response.isOk()) {
            setAudioTrack(URL.createObjectURL(response.value));
        } else {
            alert(response.error);
        }
    };

    const progressBarStyles = (currentValue: number, maxValue: number) => {
        return {
            background: `linear-gradient(to right, #7E22CE ${currentValue / maxValue * 100}%, #27272A ${currentValue / maxValue * 100}%)`,
            borderRadius: `10px`,
        };
    };

    const handleTimeUpdate = (e: ChangeEvent<HTMLAudioElement>) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration ?? 0);
    };

    useEffect(() => {
        loadAudioTrack();
        // Reset state when track changes
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    }, [currentTrack]);

    useEffect(() => {
        let shouldContinue = true;
        
        const runLoop = async () => {
            while (shouldContinue && isPlaying) {
                if (currentTrack) {
                    console.log("isPlaying");
                    const variants = ["NAME 1", "NAME 2", "NAME 3"];
                    const newName = variants[Math.floor(Math.random() * 3)];
                    const updatedTrack = { ...currentTrack, title: newName };
                    TracksApiClient.updateTrack(currentTrack.id, updatedTrack);
                    await new Promise(res => setTimeout(res, 500));
                }
            }
        };

        runLoop();

        return () => {
            shouldContinue = false;
        };

    }, [isPlaying, currentTrack]);

    return (
        <div className={`audio-player-panel ${isPlayerVisible ? "open" : ""}`}>
            <audio onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlayThrough={handleCanPlayThrough}
                ref={audioRef}
                src={audioTrack ?? ""}
                preload="auto"
            />

            <div className={"audio-player"}>
                <div className={'audio-player-data'}>
                    <img className="cover-image" src={currentTrack?.coverImage || emptyCover} alt='coverImage'
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = emptyCover;
                        }}
                    />

                    <div className="track-data">
                        <span className="track-title">{currentTrack?.title}</span>
                        <span className="track-artist">{currentTrack?.artist}</span>
                    </div>
                </div>

                <div className={"audio-player-controls"}>
                    <img src={isPlaying ? pauseIcon : playIcon} alt={"play/pause"}
                        onClick={togglePlayPause} className={"audio-play-button"}
                    />
                    <div className={"progress-bar"}>
                        <span>{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek}
                            className={"progress-bar-input"}
                            style={progressBarStyles(currentTime, duration)}
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className={"audio-player-volume"}>
                    <VolumeIcon volume={volume}/>
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
                        className="progress-bar-input"
                        style={progressBarStyles(volume, 1)}
                    />
                    <button onClick={() => setIsPlayerVisible(true)} className="player-close-button">X</button>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;