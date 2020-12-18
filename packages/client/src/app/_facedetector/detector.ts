import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import IDetectorProps from './detectorprops';

interface IExpression {
  faceLost: number;
  laughDetected: number;
}

const Detector = (props: IDetectorProps) => {
  const [expressions, setExpressions] = useState({
    // angry: 0,
    // disgusted: 0,
    // fearful: 0,
    // happy: 0,
    // neutral: 0,
    // sad: 0,
    // surprised: 0,
    faceLost: 0,
    laughDetected: 0,
  });

  useEffect(() => {
    async function loadModels() {
      // @ts-ignore
      await faceapi.nets.tinyFaceDetector.loadFromUri('/static/models');
      // @ts-ignore
      await faceapi.nets.faceLandmark68Net.loadFromUri('/static/models');
      // @ts-ignore
      await faceapi.nets.faceRecognitionNet.loadFromUri('/static/models');
      // @ts-ignore
      await faceapi.nets.faceExpressionNet.loadFromUri('/static/models');
    }

    loadModels();

    const interval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        (props.webcamRef.current as any).video,
        new faceapi.TinyFaceDetectorOptions(),
      ).withFaceExpressions();

      const faceLost = detections && !detections.length;
      const laughDetected = detections && detections[0] && detections[0].expressions.happy > 0.7;
      const time = new Date().getTime();

      const newExpressions = {
        ...expressions,
      };

      if (faceLost && !expressions.faceLost) {
        newExpressions.faceLost = time;
      }

      if (!faceLost && expressions.faceLost && new Date().getTime() - expressions.faceLost > 3000) {
        newExpressions.faceLost = 0;
      }

      if (laughDetected && !expressions.laughDetected) {
        newExpressions.laughDetected = time;
      }

      if (!laughDetected && expressions.laughDetected && new Date().getTime() - expressions.laughDetected > 3000) {
        newExpressions.laughDetected = 0;
      }

      setExpressions(newExpressions);
    }, 200);

    return () => clearInterval(interval);
  }, [expressions]);

  if (expressions.faceLost && new Date().getTime() - expressions.faceLost > 500) {
    return 'Show your face or loose!!';
  }

  if (expressions.laughDetected && new Date().getTime() - expressions.laughDetected > 500) {
    return 'You laughed, you LOOOOOOOSEEE!!';
  }

  return 'good to go';
};

export default Detector;
