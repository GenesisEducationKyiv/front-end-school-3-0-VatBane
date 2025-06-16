import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Track} from "../../types/Track.ts";
import './AudioPlayer.css'
import emptyCover from "../../assets/emptyCover.png";
import playIcon from "../../assets/playIcon.png";
import pauseIcon from "../../assets/pauseIcon.png";
import {fetchTrackAudio} from "../../api/apiFiles.ts";

interface Props {
    isVisible: boolean;
    currentTrack: Track | null;
    onClose: () => void;
}

const AudioPlayer = ({isVisible, currentTrack, onClose}: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [audioTrack, setAudioTrack] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    }

    const handleCanPlayThrough = () => {
        // Start playing automatically when the track is loaded

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
    }

    const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
        const seekTime = parseFloat(e.target.value);
        setCurrentTime(seekTime);
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const loadAudioTrack = async () => {
        if (!currentTrack) {
            return
        }
        if (currentTrack.audioFile == null) {
            alert("Track do not have audio file!")
            audioRef.current?.pause();
            audioRef.current.src = "";
            setAudioTrack(null);
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            return;
        }

        const trackAudio = await fetchTrackAudio(currentTrack.audioFile);
        if (!trackAudio) {
            alert("Audio not loaded! Try again!");
            return
        }
        setAudioTrack(URL.createObjectURL(trackAudio));
    }

    const VolumeIcon = () => {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {volume > 0 && (
                    <>
                        <path d="M15 8a5 5 0 0 1 0 8"/>
                        {volume > 0.5 && <path d="M18 5a9 9 0 0 1 0 14"/>}
                    </>
                )}
            </svg>
        );
    }

    const progressBarStyles = (currentValue: number, maxValue: number) => {
        return {
            background: `linear-gradient(to right, #7E22CE ${currentValue / maxValue * 100}%, #27272A ${currentValue / maxValue * 100}%)`,
            borderRadius: `10px`,
        }
    }

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

    return (
        <div className={`audio-player-panel ${isVisible ? "open" : ""}`}>
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
                             e.currentTarget.onerror = null
                             e.currentTarget.src = emptyCover
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
                    <VolumeIcon/>
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
                           className="progress-bar-input"
                           style={progressBarStyles(volume, 1)}
                    />
                    <button onClick={onClose} className="player-close-button">X</button>
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer;