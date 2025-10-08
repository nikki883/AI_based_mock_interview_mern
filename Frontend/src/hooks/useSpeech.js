// import { useState, useEffect, useRef } from "react";

// export default function useSpeech() {
//   const [listening, setListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const recognitionRef = useRef(null);

//   // Initialize Speech Recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.warn("Speech Recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.lang = "en-US";

//     recognition.onresult = (event) => {
//       const result = event.results[0][0].transcript;
//       setTranscript(result);
//       setListening(false);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       setListening(false);
//     };

//     recognition.onend = () => {
//       setListening(false); // Ensure listening is false when recognition ends
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const startListening = () => {
//     if (recognitionRef.current && !listening) {
//       setTranscript("");
//       setListening(true);
//       try {
//         recognitionRef.current.start();
//       } catch (err) {
//         console.error("Error starting speech recognition:", err);
//         setListening(false);
//       }
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current && listening) {
//       recognitionRef.current.stop();
//       setListening(false);
//     }
//   };

//   const speak = (text) => {
//     if (!window.speechSynthesis) {
//       console.warn("Speech Synthesis not supported in this browser");
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     window.speechSynthesis.speak(utterance);
//   };

//   return {
//     listening,
//     transcript,
//     startListening,
//     stopListening,
//     speak,
//   };
// }

import { useState, useEffect, useRef, useCallback } from "react";

export default function useSpeech() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if (isInitializedRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      console.log("Speech recognized:", result);
      setTranscript(result);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      
      if (event.error === 'no-speech') {
        console.warn("No speech detected. Please try again.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please allow microphone access in your browser settings.");
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setListening(false);
    };

    recognitionRef.current = recognition;
    isInitializedRef.current = true;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log("Recognition already stopped");
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not initialized");
      return;
    }

    if (listening) {
      console.log("Already listening");
      return;
    }

    setTranscript(""); // Clear previous transcript
    setListening(true);
    
    try {
      recognitionRef.current.start();
      console.log("Speech recognition started");
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setListening(false);
      
      // If already started, stop and restart
      if (err.message.includes("already started")) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setListening(true);
          }, 100);
        } catch (restartErr) {
          console.error("Error restarting recognition:", restartErr);
        }
      }
    }
  }, [listening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not initialized");
      return;
    }

    if (!listening) {
      console.log("Not currently listening");
      return;
    }

    try {
      recognitionRef.current.stop();
      console.log("Speech recognition stopped");
      setListening(false);
    } catch (err) {
      console.error("Error stopping speech recognition:", err);
      setListening(false);
    }
  }, [listening]);

  const speak = useCallback((text) => {
    if (!text) {
      console.warn("No text provided to speak");
      return;
    }

    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      console.log("Started speaking");
    };

    utterance.onend = () => {
      console.log("Finished speaking");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    listening,
    transcript,
    startListening,
    stopListening,
    speak,
  };
}