import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AudioPlayer component
 * 
 * This component provides audio playback functionality for dialog messages.
 * 
 * @param {Object} props - Component props
 * @param {string} props.audioUrl - The URL of the audio file
 * @param {boolean} props.autoPlay - Whether to autoplay the audio
 * @param {Function} props.onPlay - Callback when audio starts playing
 * @param {Function} props.onEnd - Callback when audio ends
 * @param {Function} props.onError - Callback when audio encounters an error
 */
const AudioPlayer = ({
  audioUrl,
  autoPlay = false,
  onPlay,
  onEnd,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioUrl) return;
    
    const audio = audioRef.current;
    
    if (!audio) return;
    
    // Set audio source
    audio.src = audioUrl;
    
    // Load audio metadata
    audio.load();
    
    // Clean up on unmount
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);
  
  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    // Event handlers
    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onEnd) onEnd();
    };
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      
      // Autoplay if enabled
      if (autoPlay) {
        audio.play().catch(error => {
          console.error('Error autoplaying audio:', error);
          if (onError) onError(error);
        });
      }
    };
    
    const handleError = (error) => {
      console.error('Audio error:', error);
      if (onError) onError(error);
    };
    
    // Add event listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    
    // Clean up event listeners on unmount
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, autoPlay, onPlay, onEnd, onError]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        if (onError) onError(error);
      });
    }
  };
  
  // Handle progress bar click
  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    
    if (!audio || duration === 0) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Set new time
    audio.currentTime = clickPosition * duration;
  };
  
  // If no audio URL is provided, don't render anything
  if (!audioUrl) {
    return null;
  }
  
  return (
    <div className="audio-player bg-gray-100 rounded-lg p-2 flex items-center">
      {/* Play/pause button */}
      <button
        onClick={togglePlayPause}
        className="play-pause-button w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
      >
        {isPlaying ? (
          <span className="pause-icon">❚❚</span>
        ) : (
          <span className="play-icon">▶</span>
        )}
      </button>
      
      {/* Progress bar */}
      <div className="progress-container flex-grow mx-3">
        <div
          className="progress-bar h-2 bg-gray-300 rounded cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="progress h-full bg-blue-500 rounded"
            style={{ width: `${(progress / duration) * 100}%` }}
          ></div>
        </div>
        
        {/* Time display */}
        <div className="time-display flex justify-between text-xs text-gray-600 mt-1">
          <span className="current-time">{formatTime(progress)}</span>
          <span className="duration">{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

AudioPlayer.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  onPlay: PropTypes.func,
  onEnd: PropTypes.func,
  onError: PropTypes.func
};

export default AudioPlayer;