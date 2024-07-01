import Counter from "./Components/Counter"
import Header from "./Components/Header";
import { AuthClient } from "@dfinity/auth-client";
import { useEffect, useState } from "react";

const App = () => {

  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthentication = async () => {
    const authClient = await AuthClient.create();

    try {
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          // console.log("Authenticated identity:", identity);

          setAuthenticated(true);

          // Store authentication state in localStorage
          localStorage.setItem("authenticated", "true");
          window.location.reload();
          // await createWebSocket();
        },
      });
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  useEffect(() => {
    // Check localStorage for previous authentication state
    const storedAuthenticated = localStorage.getItem("authenticated") === "true";
    const authenticate = async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        // await createWebSocket();
        setAuthenticated(true);
      }
      else {
        setAuthenticated(false);
      }
    };
    authenticate();
  }, []);


  return (

    <div className="bg-gray-900 text-gray-300">
      {!authenticated ? (
        <div className="authentication-container bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Not authenticated. Please Log in/Sign Up.</h1>
          <button className="auth-button bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" 
          onClick={handleAuthentication}>
            Continue with Internet identity
          </button>
        </div>
      ) : (
        <>
          <Header />
          <Counter />
        </>
      )}
    </div>
  );
};

export default App;
