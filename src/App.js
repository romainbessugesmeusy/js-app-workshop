import React from "react";
import { Router } from "@reach/router";
import Listing from "./pages/Listing";
import axios from "axios";
import CreateLinkQuickAction from "./components/CreateLinkQuickAction";

class EventBus {
  listeners = [];
  on(event, callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    this.listeners.push({ event, callback });
  }
  dispatch(event, payload) {
    this.listeners
      .filter((l) => l.event === event)
      .forEach((l) => l.callback.call(null, payload));
  }
}

function App() {

  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const eventBus = new EventBus();

  return (
    <div className="App">
      <CreateLinkQuickAction
        apiClient={apiClient}
        onChange={(createdLink) =>
          eventBus.dispatch("links:change", createdLink)
        }
      />
      <Router>
        <Listing path="/" apiClient={apiClient} eventBus={eventBus} />
      </Router>
    </div>
  );
}

export default App;
