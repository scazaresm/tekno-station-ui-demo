import React, { useEffect, useState } from "react";
import { signalRService } from "./signalrService";

function App() {
  const [tag, setTag] = useState(null);
  const [stations, setStations] = useState([]);

  useEffect(() => {
      signalRService.startConnection();

      signalRService.listenForTagValueChanged((receivedTag) => {
          console.log("🔄 Tag Value Changed:", receivedTag);
          setTag(receivedTag);
      });

      fetch("http://localhost:8083/stations")
        .then(r => r.json())
        .then(stations => {
          setStations(stations);
        });

      return () => {
          signalRService.stopListening(); // Cleanup on unmount
      };
  }, []);


  const addStation = async () => {
    try {
      const response = await fetch("http://localhost:8083/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Station${stations.length + 1}`,
          ipAddress: `192.168.100.${stations.length + 1}`,
          hasCamera: Math.random() < 0.5,
          hasScanner: Math.random() < 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newStation = await response.json();
      setStations([...stations, newStation]); // Add new station to state
    } catch (error) {
      console.error("Error adding station:", error);
    }
  };



  return (
    <> 
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>🔌 Tekno MES UI Demo</h1>
        <h2>Below PLC tag value is monitored in real-time through a SignalR hub:</h2>
        {tag ? (
            <h1><strong>{tag.name}:</strong> {tag.value}</h1>
        ) : (
            <p>Waiting for tag updates...</p>
        )}
      </div>
      <br/>
      <div>
        <h1 style={{ textAlign: "center" }}>List of stations in databse:</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={addStation}>Add station</button>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>IP Address</th>
                <th>Has Camera</th>
                <th>Has Scanner</th>
              </tr>
            </thead>
            <tbody>
            {stations.length > 0 ? (
              stations.map((station) => (
                <tr key={station.id}>
                  <td>{station.id}</td>
                  <td>{station.name}</td>
                  <td>{station.ipAddress}</td>
                  <td>{station.hasCamera ? "Yes" : "No"}</td>
                  <td>{station.hasScanner ? "Yes" : "No"}</td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>There are no stations in the database</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
   
  );
}

export default App;
