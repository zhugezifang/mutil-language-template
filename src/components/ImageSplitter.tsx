// components/ImageSplitter.js
import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ImageSplitter = ({
  locale = '',
  indexLanguageText
  }) => {
  const [image, setImage] = useState(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [chunks, setChunks] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSplitAndDisplay = () => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const { width, height } = img;
      const chunkWidth = Math.floor(width / cols);
      const chunkHeight = Math.floor(height / rows);

      const newChunks = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = chunkWidth;
          canvas.height = chunkHeight;

          ctx.drawImage(
            img,
            col * chunkWidth,
            row * chunkHeight,
            chunkWidth,
            chunkHeight,
            0,
            0,
            chunkWidth,
            chunkHeight
          );

          newChunks.push(canvas.toDataURL('image/png'));
        }
      }

      setChunks(newChunks);
    };
  };

  const handleDownload = () => {
    const zip = new JSZip();

    chunks.forEach((chunk, index) => {
      const base64Data = chunk.split(',')[1];
      zip.file(`chunk_${index}.png`, base64Data, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'image_chunks.zip');
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
        />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 w-full sm:w-auto">
          <label className="flex flex-col items-center w-full sm:w-auto">
            <span className="text-gray-700">{indexLanguageText.RowText}</span>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              min="1"
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
            />
          </label>
          <label className="flex flex-col items-center w-full sm:w-auto">
            <span className="text-gray-700">{indexLanguageText.ColText}</span>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              min="1"
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
            />
          </label>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 w-full sm:w-auto">
          <button
            onClick={handleSplitAndDisplay}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
          >
            {indexLanguageText.btn1}
          </button>
          <button
            onClick={handleDownload}
            disabled={chunks.length === 0}
            className={`px-4 py-2 rounded-lg w-full sm:w-auto ${chunks.length === 0 ? 'bg-gray-400' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            {indexLanguageText.btn2}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full sm:w-auto">
          {chunks.map((chunk, index) => (
            <img key={index} src={chunk} alt={`Chunk ${index}`} className="border border-gray-300 rounded-lg" />
          ))}
        </div>
        {image && <img src={image} alt="Uploaded" className="hidden" />}
      </div>
    </div>

  );
};

export default ImageSplitter;
