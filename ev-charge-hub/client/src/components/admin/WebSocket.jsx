import { useEffect } from 'react';

const WebSocketComponent = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000/ws');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send('Hello from client');
    };

    socket.onmessage = (event) => {
      console.log('Received from server:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Example</h1>
      <p>Check the console for WebSocket messages.</p>
    </div>
  );
};

export default WebSocketComponent;
