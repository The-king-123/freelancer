import VideoPlayer from './source';

function video(props) {
  const videolink =  props.videolink

  const source = props.source;
  
  return (
      <VideoPlayer id="player1" publicId={source + "/videos.php?zlonk=1733&zlink=" + videolink} />
  );
}

export default video;
