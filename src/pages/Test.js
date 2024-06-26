import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [webpFile, setWebpFile] = useState(null);
  const [webpURL, setWebpURL] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setWebpFile(compressedFile);
        const url = URL.createObjectURL(compressedFile);
        setWebpURL(url);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  
  console.log("url", webpURL);
  return (
    <div>
      <input type="file" accept="image/png" onChange={handleFileChange} />
      {webpFile && (
        <div>
          <h3>Converted WebP Image:</h3>
          <img src={webpURL} alt="Converted WebP" />
          <br />
          <a href={webpURL} download="converted_image.webp">
            Download WebP Image
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
