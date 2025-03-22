import React, { useState } from "react";
import "./App.css";

function MusafirConnectApp() {
  const [screen, setScreen] = useState("login");
  const [nickname, setNickname] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [rsvps, setRsvps] = useState({});

  const handleLogin = () => {
    if (accessCode.trim() && nickname.trim()) {
      setScreen("app");
    } else {
      alert("Please enter both access code and nickname.");
    }
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      const newMsg = {
        sender: nickname,
        content: chatInput,
        time: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMsg]);
      setChatInput("");
    }
  };

  const handleRSVP = (eventId) => {
    setRsvps({ ...rsvps, [eventId]: true });
    alert(`You've joined the event! Other guests have been notified.`);
  };

  const events = [
    {
      id: "yoga",
      title: "Sunrise Yoga Session",
      time: "6:00 AM - 7:00 AM",
      location: "Rooftop Terrace",
      description:
        "Start your day with energizing yoga and breathtaking views.",
    },
    {
      id: "jam",
      title: "Acoustic Jam Session",
      time: "8:00 PM - 10:00 PM",
      location: "Common Area",
      description: "Bring your instruments or just your voice and share music.",
    },
    {
      id: "market",
      title: "Local Market Tour",
      time: "Tomorrow, 10:00 AM - 1:00 PM",
      location: "Meet at Reception",
      description: "Explore the vibrant local market with our guide.",
    },
    {
      id: "art",
      title: "Art Workshop: Mandala Drawing",
      time: "Tomorrow, 4:00 PM - 6:00 PM",
      location: "Creative Space",
      description:
        "Learn mandala drawing in this relaxing and creative workshop.",
    },
  ];

  return (
    <div className="container">
      {screen === "login" ? (
        <div className="login-container">
          <div className="login-logo">Musafir Connect</div>
          <div className="login-form">
            <div className="form-group">
              <label>Guest Access Code</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter the code provided at check-in"
              />
            </div>
            <div className="form-group">
              <label>Choose a Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="How others will see you"
              />
            </div>
            <button className="login-button" onClick={handleLogin}>
              Connect to Musafir
            </button>
          </div>
          <div className="login-footer">Need help? Ask at the reception.</div>
        </div>
      ) : (
        <>
          <header>Musafir Connect</header>

          {/* Home Tab */}
          {activeTab === "home" && (
            <div className="main-content">
              <h2>Welcome, {nickname}!</h2>
              <p>
                Discover activities, meet fellow travelers, and make memories.
              </p>
              <h3>Today's Highlights</h3>
              {events.slice(0, 2).map((event) => (
                <div key={event.id} className="event-card">
                  <h4>{event.title}</h4>
                  <p>
                    {event.time} | {event.location}
                  </p>
                  <p>{event.description}</p>
                  <button
                    className="button"
                    onClick={() => handleRSVP(event.id)}
                  >
                    {rsvps[event.id] ? "Joined" : "Join"}
                  </button>
                </div>
              ))}
              <h3>Announcements</h3>
              <div className="event-card">
                <h4>Happy Hour at Cafe!</h4>
                <p>5:00 PM - 7:00 PM</p>
                <p>50% off on all beverages at our café. Don't miss out!</p>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="main-content">
              <h2>All Upcoming Events</h2>
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <h4>{event.title}</h4>
                  <p>
                    {event.time} | {event.location}
                  </p>
                  <p>{event.description}</p>
                  <button
                    className="button"
                    onClick={() => handleRSVP(event.id)}
                  >
                    {rsvps[event.id] ? "Joined" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="main-content">
              <h2>Hostel Chat</h2>
              <div className="chat-container">
                {messages.map((msg, index) => (
                  <div key={index} className="message">
                    <strong>{msg.sender}:</strong> {msg.content}{" "}
                    <span style={{ fontSize: "0.7rem", color: "#999" }}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button className="button" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="main-content">
              <h2>Your Profile</h2>
              <p>
                <strong>Nickname:</strong> {nickname}
              </p>
              <p>
                <strong>Stay Dates:</strong> March 5 - March 8, 2025
              </p>
              <p>
                <strong>Room:</strong> Dorm 3, Bed 2
              </p>
              <h3>My Activities</h3>
              {Object.keys(rsvps)
                .filter((id) => rsvps[id])
                .map((id) => (
                  <p key={id}>• {events.find((e) => e.id === id)?.title}</p>
                ))}
              <button
                className="button"
                onClick={() => setScreen("login")}
                style={{ marginTop: "1rem" }}
              >
                Log Out
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="tab-bar">
            <div
              className={`tab-item ${activeTab === "home" ? "active" : ""}`}
              onClick={() => setActiveTab("home")}
            >
              Home
            </div>
            <div
              className={`tab-item ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </div>
            <div
              className={`tab-item ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </div>
            <div
              className={`tab-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MusafirConnectApp;
