import React, { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const VIDEO_WIDTH = 360;
  const VIDEO_HEIGHT = 640;

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { exact: 'environment' },
          width: { ideal: VIDEO_WIDTH },
          height: { ideal: VIDEO_HEIGHT }
        }
      };
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan dan tidak ada aplikasi lain yang sedang menggunakan kamera.');
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    context.drawImage(videoRef.current, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    canvasRef.current.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.7);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!stream ? (
        <button type="button" onClick={startCamera} className="px-3 py-1 bg-blue-500 text-white rounded">Open Camera</button>
      ) : (
        <>
          <video
            ref={videoRef}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            autoPlay
            playsInline
            muted
            className="rounded border"
            style={{ background: '#000', transform: 'none' }}
          />
          <canvas ref={canvasRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ display: 'none' }} />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={handleCapture} className="px-3 py-1 bg-green-500 text-white rounded">Take Picture</button>
            <button type="button" onClick={stopCamera} className="px-3 py-1 bg-gray-400 text-white rounded">Close</button>
          </div>
        </>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default CameraCapture;
