import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import borderImg from "../../src/assets/border.png";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const WebcamComponent = () => {
  
    const [overlayImage, setOverlayImage] = useState(borderImg);  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all([loadImage(imageSrc), loadImage(overlayImage)]).then(
      ([img1, img2]) => {
        context.drawImage(
          img1,
          0,
          0,
          videoConstraints.width,
          videoConstraints.height
        );
        context.drawImage(
          img2,
          0,
          0,
          videoConstraints.width,
          videoConstraints.height
        );
      }
    );
  }, [webcamRef, canvasRef]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setOverlayImage(url);
  };
  

  const saveImage = () => {
    canvasRef.current.toBlob((blob) => {
        saveAs(blob, "overlapped_image.png");
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <div>
        <div style={{ position: "relative", width: "640px", height: "480px" }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ position: "absolute" }}
            width={videoConstraints.width}
            height={videoConstraints.height}
          />
          <img
            src={overlayImage}
            alt="border"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={capture}>Capture</button>
        <button onClick={saveImage}>Save image</button>
      </div>

      <canvas
        ref={canvasRef}
        width={videoConstraints.width}
        height={videoConstraints.height}
      />
    </div>
  );
};

export default WebcamComponent;
