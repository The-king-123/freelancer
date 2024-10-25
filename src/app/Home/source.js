import { useEffect, useRef } from 'react';
import cloudinary from 'cloudinary-video-player';
import 'cloudinary-video-player/cld-video-player.min.css';

const source = ({ id, publicId, ...props }) => {
  
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;

    const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
      cloud_name: 'freelancer.mg',
      sourceTypes: ['mp4', 'webm', 'ogv', 'flv', 'mov', 'mkv', 'avi', '3gp', 'm4v'],
      secure: true,
      controls: true,
    });

    player.source(publicId);
  }, []);

  return (
    <video
      ref={playerRef}
      id={id}
      className="cld-video-player cld-fluid"
      {...props}
    />
  );
};

export default source;
