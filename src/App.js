import React, { useEffect, useState } from "react";
import { signalRService } from "./signalrService";

function App() {
  const [tag, setTag] = useState(null);

  useEffect(() => {
      signalRService.startConnection();

      signalRService.listenForTagValueChanged((receivedTag) => {
          console.log("🔄 Tag Value Changed:", receivedTag);
          setTag(receivedTag);
      });

      return () => {
          signalRService.stopListening(); // Cleanup on unmount
      };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🔌 Tekno MES UI Demo</h1>
      <h2>Below PLC tag value is monitored in real-time through a SignalR hub:</h2>
      {tag ? (
          <h1><strong>{tag.name}:</strong> {tag.value}</h1>
      ) : (
          <p>Waiting for tag updates...</p>
      )}
    </div>
  );
}

export default App;
