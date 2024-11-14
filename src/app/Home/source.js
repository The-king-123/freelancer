'use client'
import { useEffect, useRef } from 'react';
import cloudinary from 'cloudinary-video-player';
import "cloudinary-video-player/cld-video-player.min.css";

const VideoPlayer = ({ id, publicId }) => {
  const playerRef = useRef();
  const cloudinaryPlayerRef = useRef();  // Ref for the Cloudinary player instance

  useEffect(() => {
    if (cloudinaryPlayerRef.current) return;

    const videoElement = playerRef.current;

    if (videoElement) {
      cloudinaryPlayerRef.current = cloudinary.videoPlayer(videoElement, {
        cloud_name: 'freelancer.mg',
        sourceTypes: ['mp4', 'webm', 'ogv', 'flv', 'mov', 'mkv', 'avi', '3gp', 'm4v'],
        controls: false,
      });

      // Set the video source
      cloudinaryPlayerRef.current.source(publicId); // Set the Cloudinary video source
    }

  }, []); // Re-run the effect if publicId changes

  return (
    <video
      id={id}
      ref={playerRef}
      className="cld-video-player cld-fluid"
    />
  );
};

export default VideoPlayer;
