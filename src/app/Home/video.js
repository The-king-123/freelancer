import VideoPlayer from './source';

function video(props) {
  const videolink =  props.videolink

  const source = props.source;
  
  return (
    <>
      <VideoPlayer id="player1" publicId={source + "/videos/post/" + videolink} />
    </>
  );
}

export default video;
