import React, { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

const ScreenRecorder = () => {
    const videoRef = useRef(null);
    const [recorder, setRecorder] = useState(null);
    const [recording, setRecording] = useState(false);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        const newRecorder = new RecordRTC(stream, {
            type: 'video',
            mimeType: 'video/webm',
            bitsPerSecond: 128000,
        });

        newRecorder.startRecording();
        setRecorder(newRecorder);
        setRecording(true);
    };

    const stopRecording = () => {
        if (recorder) {
            recorder.stopRecording(() => {
                const blob = recorder.getBlob();
                const url = URL.createObjectURL(blob);
                videoRef.current.src = url;

                // Save the recorded video (you can customize this part)
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = url;
                a.download = 'recorded-video.webm';
                a.click();
                window.URL.revokeObjectURL(url);

                setRecorder(null);
                setRecording(false);
            });
        }
    };

    return (
        <div>
            <h1>Screen Recorder</h1>
            <div>
                <button onClick={startRecording} disabled={recording}>
                    Start Recording
                </button>
                <button onClick={stopRecording} disabled={!recording}>
                    Stop Recording
                </button>
            </div>
            {recording && <p>Recording...</p>}
            <video ref={videoRef} controls />
        </div>
    );
};

export default ScreenRecorder;
