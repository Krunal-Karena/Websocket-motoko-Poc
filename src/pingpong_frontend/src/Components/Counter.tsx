import React, { useEffect, useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { ws } from "../utils/ws"; // Ensure ws is correctly imported

type AppMessage = {
  message: string;
};

type uiMessage = {
  from: string;
  message: AppMessage;
};

const Counter = () => {
  const [messages, setMessages] = useState<uiMessage[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [counter, setCounter] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      console.log("Connected to the canister");
      setIsConnected(true);
      setIsClosed(false);
      setConnecting(false);
    };

    const handleClose = () => {
      console.log("Disconnected from the canister");
      setIsClosed(true);
      setIsConnected(false);
      setConnecting(false);
    };

    const handleError = (error) => {
      console.log("Error:", error);
    };

    const handleMessage = (event) => {
      try {
        setIsActive(true);
        const receivedMessage: AppMessage = JSON.parse(event.data);

        const fromBackendMessage: uiMessage = {
          from: "backend",
          message: receivedMessage,
        };
        setMessages((prev) => [...prev, fromBackendMessage]);
        setMessagesCount((prev) => prev + 1);
      } catch (error) {
        console.log("Error receiving message", error);
      }
    };

    ws.onopen = handleOpen;
    ws.onclose = handleClose;
    ws.onerror = handleError;
    ws.onmessage = handleMessage;

    return () => {
      ws.onopen = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
    };
  }, []);

  const sendMessage = () => {
    try {
      const sentMessage: AppMessage = { message: counter.toString() };
      ws.send(sentMessage);

      const fromFrontendMessage: uiMessage = {
        from: "frontend",
        message: sentMessage,
      };
      setMessages((prev) => [...prev, fromFrontendMessage]);
    } catch (error) {
      console.log("Error sending message", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const intervalId = setInterval(() => {
        setCounter((prev) => {
          const newCounter = prev + 1;
          sendMessage(); // Send message with the new counter value
          return newCounter;
        });
      }, 2000);

      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [isConnected]);

  useEffect(() => {
    if (messagesCount === 25) {
      ws.close();
    }
  }, [messagesCount]);

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
            <h3 className="text-lg font-semibold">WebSocket open</h3>
          )}
          {isClosed && (
            <h3 className="text-lg font-semibold">WebSocket closed</h3>
          )}
          {connecting && (
            <h3 className="text-lg font-semibold">WebSocket connecting</h3>
          )}
          {!isActive && !connecting ? (
            <button
              onClick={handleReconnect}
              className={` ${
                connecting ? `hidden` : `block`
              } bg-blue-500 rounded-lg py-1.5 px-2 font-semibold hover:bg-gray-900`}
            >
              Replay
            </button>
          ) : (
            <button
              onClick={isConnected ? handleClose : handleReconnect}
              className={` ${
                connecting ? `hidden` : `block`
              } bg-blue-500 rounded-lg py-1.5 px-2 font-semibold hover:bg-gray-900`}
            >
              {isConnected ? "Close" : "Reconnect"}
            </button>
          )}
        </div>
        <div className="mt-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={` ${
                message.from === "backend"
                  ? `bg-gray-900 text-gray-200`
                  : `bg-gray-200 text-gray-950`
              } mx-5 p-2 flex gap-10`}
            >
              <span className="flex gap-3 items-center">
                {message.from === "backend" ? <BsArrowDown /> : <BsArrowUp />}{" "}
                <h1>{message.from === "backend" ? "Backend" : "Frontend"}</h1>
              </span>
              <h1>{message.message.message}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Counter;
