import React, { useEffect, useState } from "react";
import { ws } from "../utils/ws";

type AppMessage = {
  message: string;
};

const Counter = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [connecting, setConnecting] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  ws.onopen = () => {
    console.log("Connected to the server");
    setIsConnected(true);
    setIsClosed(false);
    setConnecting(false);
  };

  ws.onclose = () => {
    console.log("Disconnected from the server");
    setIsClosed(true);
    setIsConnected(false);
    setConnecting(false);
  };

  ws.onerror = (error) => {
    console.log("Error:", error);
  };

  const sendMessage = async (newCount: number) => {
    try {
      const sentMessage: AppMessage = {
        message: newCount.toString(),
      };
      ws.send(sentMessage);
    } catch (error) {
      console.log("Error on sending message", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    if (count > 0) {
      sendMessage(count);
    }
  }, [count]);

  const handleClose = () => {
    ws.close();
  };

  const handleReconnect = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="min-h-screen min-w-[800px] mt-5 rounded bg-gray-700">
        <div className="w-full h-full flex gap-5 items-center justify-center my-5">
          {isConnected && (
            <h3 className="text-lg font-semibold">Websocket open</h3>
          )}
          {isClosed && (
            <h3 className="text-lg font-semibold">Websocket closed</h3>
          )}
          {connecting && (
            <h3 className="text-lg font-semibold">Websocket connecting</h3>
          )}

          <button
            onClick={isConnected ? handleClose : handleReconnect}
            className={` ${
              connecting ? `hidden` : `block`
            } bg-blue-500 rounded-lg py-1.5 px-2 font-semibold hover:bg-gray-900`}
          >
            {isConnected ? "Close" : "Reconnect"}
          </button>
        </div>
        <div className="mt-5 text-center text-white">
          <h1 className="text-4xl">Count: {count}</h1>
        </div>
      </div>
    </div>
  );
};

export default Counter;