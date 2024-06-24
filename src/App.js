import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // For additional styling if needed

const GeometricArtGenerator = () => {
  const canvasRef = useRef(null);
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [fillShapes, setFillShapes] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [intervalId, setIntervalId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(duration * 60 * 1000);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setRemainingTime(duration * 60 * 1000);
    }
  }, [duration]);

  const generateShape = (ctx, centerX, centerY, radius, sides) => {
    const angleOffset = Math.random() * 2 * Math.PI; // Random orientation

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = angleOffset + (i / sides) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = `hsla(${Math.random() * 360}, ${Math.random() * 100}%, ${Math.random() * 50}%, 0.8)`;
    ctx.fill();
  };

  const startGeneration = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (!startTime) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      setStartTime(Date.now());
    }

    const minRadius = Math.min(width, height) / 20;
    const maxRadius = Math.min(width, height) / 10;
    const shapeInterval = 50; 

    const generateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setRemainingTime(duration * 60 * 1000 - elapsed);

      if (elapsed >= duration * 60 * 1000) {
        clearInterval(generateInterval);
        setIsRunning(false);
        setRemainingTime(0);
        return;
      }

      const centerX = Math.random() * width;
      const centerY = Math.random() * height;
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      const sides = Math.floor(Math.random() * 4) + 3;

      generateShape(ctx, centerX, centerY, radius, sides);
    }, shapeInterval);

    setIntervalId(generateInterval);
  };

  const restartGeneration = () => {
    setIsRunning(false);
    setStartTime(null);
    clearCanvas();
    setRemainingTime(duration * 60 * 1000);
    startGeneration();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveArt = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'geometric-art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Geometric Art Generator</h1>
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="duration" className="block mb-2">Duration (minutes): {duration}</label>
        <input
          id="duration"
          type="range"
          min="1"
          max="360"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="backgroundColor" className="block mb-2">Background Color:</label>
        <input
          id="backgroundColor"
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-full border p-2"
        />
      </div>
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="fillShapes" className="block mb-2">Fill Shapes:</label>
        <input
          id="fillShapes"
          type="checkbox"
          checked={fillShapes}
          onChange={(e) => setFillShapes(e.target.checked)}
          className="w-full"
        />
      </div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={startGeneration}
          className={`px-6 py-2 rounded text-white ${isRunning ? 'bg-red-500' : 'bg-blue-500'}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={restartGeneration}
          className="bg-yellow-500 text-white px-6 py-2 rounded"
        >
          Restart
        </button>
        <button
          onClick={saveArt}
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          Download Artwork
        </button>
      </div>
      <div className="mb-4 text-lg font-semibold">
        Remaining Time: {formatTime(remainingTime)}
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={600}
        className="border mt-4 w-full bg-white"
      />
    </div>
  );
};

export default GeometricArtGenerator;

