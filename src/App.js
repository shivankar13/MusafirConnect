import React, { useState } from "react";
import "./App.css";

// Simple in-memory data model to demonstrate Admin features
// In production, you'd connect to a real backend (Firebase, Supabase, etc.)

function MusafirConnectApp() {
  // Screen states: 'login' (guest), 'staffLogin', or 'app' (guest), or staff portal
  const [screen, setScreen] = useState("login");

  // Guest states
  const [nickname, setNickname] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Staff states
  const [staffLoggedIn, setStaffLoggedIn] = useState(false);
  const [staffUsername, setStaffUsername] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [adminTab, setAdminTab] = useState("events");

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // RSVPs: { eventId: [nicknames...], ... }
  const [rsvps, setRsvps] = useState({});

  // Access codes staff can generate
  const [codes, setCodes] = useState(["ABC123", "XYZ789"]);

  // Events array (Staff can CRUD)
  const [events, setEvents] = useState([
    {
      id: "yoga",
      title: "Sunrise Yoga Session",
      time: "6:00 AM - 7:00 AM",
      location: "Rooftop Terrace",
      description: "Start your day with energizing yoga and breathtaking views.",
      image: "https://placehold.co/500x200?text=Sunrise+Yoga"
    },
    {
      id: "jam",
      title: "Acoustic Jam Session",
      time: "8:00 PM - 10:00 PM",
      location: "Common Area",
      description: "Bring your instruments or just your voice and share music.",
      image: "https://placehold.co/500x200?text=Acoustic+Jam"
    },
    {
      id: "market",
      title: "Local Market Tour",
      time: "Tomorrow, 10:00 AM - 1:00 PM",
      location: "Meet at Reception",
      description: "Explore the vibrant local market with our guide.",
      image: "https://placehold.co/500x200?text=Local+Market"
    },
    {
      id: "art",
      title: "Art Workshop: Mandala Drawing",
      time: "Tomorrow, 4:00 PM - 6:00 PM",
      location: "Creative Space",
      description: "Learn mandala drawing in this relaxing and creative workshop.",
      image: "https://placehold.co/500x200?text=Mandala+Drawing"
    }
  ]);

  // Form states for adding a new event (Admin)
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventImage, setNewEventImage] = useState("");

  /* ---------------------------
     GUEST LOGIN / FLOW
  ---------------------------- */
  const handleGuestLogin = () => {
    // For now, we don't strictly validate the code.
    // In a real system, you'd check if accessCode is in 'codes' array or server.
    if (accessCode.trim() && nickname.trim()) {
      setScreen("app");
    } else {
      alert("Please enter both access code and nickname.");
    }
  };

  // Send message in chat
  const sendMessage = () => {
    if (chatInput.trim()) {
      const newMsg = {
        sender: nickname,
        content: chatInput,
        time: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMsg]);
      setChatInput("");
    }
  };

  // RSVP an event
  const handleRSVP = (eventId) => {
    const currentRSVPs = rsvps[eventId] || [];
    if (!currentRSVPs.includes(nickname)) {
      const updated = {
        ...rsvps,
        [eventId]: [...currentRSVPs, nickname]
      };
      setRsvps(updated);
      alert(`You (${nickname}) joined the event!`);
    } else {
      alert("You have already joined this event.");
    }
  };

  /* ---------------------------
     STAFF LOGIN / ADMIN FLOW
  ---------------------------- */
  const handleStaffLogin = () => {
    // Basic check: in real app, you'd do secure auth
    if (staffUsername === "admin" && staffPassword === "admin") {
      setStaffLoggedIn(true);
    } else {
      alert("Invalid staff credentials");
    }
  };

  // Add new event (Admin)
  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      alert("Please enter an event title.");
      return;
    }
    // Simple ID generation
    const id =
      newEventTitle.toLowerCase().replace(/ /g, "-") + Date.now().toString();
    const newEvent = {
      id,
      title: newEventTitle,
      time: newEventTime,
      location: newEventLocation,
      description: newEventDescription,
      image: newEventImage
    };
    setEvents([...events, newEvent]);

    // Reset form
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventLocation("");
    setNewEventDescription("");
    setNewEventImage("");
    alert("New event added!");
  };

  // Delete an event (Admin)
  const handleDeleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  // Generate new access code (Admin)
  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCodes([...codes, code]);
  };

  // Basic analytics
  const totalRSVPCount = Object.values(rsvps).reduce(
    (acc, arr) => acc + arr.length,
    0
  );
  const totalMessages = messages.length;
  const totalEvents = events.length;

  // Staff Logged In Portal
  const [staffLoggedIn, setStaffLoggedIn2] = useState(false);

  /* ---------------------------
     STAFF PORTAL UI
  ---------------------------- */
  if (staffLoggedIn) {
    return (
      <div className="container" style={{ paddingBottom: "5rem" }}>
        <header>Musafir Connect - Admin Portal</header>

        {/* Admin Tab Navigation */}
        <div className="tab-bar" style={{ position: "relative" }}>
          <div
            className={`tab-item ${adminTab === "events" ? "active" : ""}`}
            onClick={() => setAdminTab("events")}
          >
            Events
          </div>
          <div
            className={`tab-item ${adminTab === "codes" ? "active" : ""}`}
            onClick={() => setAdminTab("codes")}
          >
            Codes
          </div>
          <div
            className={`tab-item ${adminTab === "analytics" ? "active" : ""}`}
            onClick={() => setAdminTab("analytics")}
          >
            Analytics
          </div>
          <div
            className="tab-item"
            onClick={() => {
              setStaffLoggedIn(false);
              setStaffUsername("");
              setStaffPassword("");
            }}
          >
            Logout
          </div>
        </div>

        {/* Events Management Tab */}
        {adminTab === "events" && (
          <div className="main-content">
            <h2>Manage Events</h2>

            {/* Add Event Form */}
            <div
              style={{
                marginBottom: "1rem",
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "5px"
              }}
            >
              <h3>Add a New Event</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
              >
                <input
                  placeholder="Event Title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
                <input
                  placeholder="Time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
                <input
                  placeholder="Location"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                />
                <input
                  placeholder="Image URL"
                  value={newEventImage}
                  onChange={(e) => setNewEventImage(e.target.value)}
                />
                <button className="button" onClick={handleAddEvent}>
                  Add Event
                </button>
              </div>
            </div>

            {/* List of existing events */}
            {events.map((ev) => (
              <div key={ev.id} className="event-card">
                {ev.image && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <img
                      src={ev.image}
                      alt={ev.title}
                      style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
                <h4>{ev.title}</h4>
                <p>
                  {ev.time} | {ev.location}
                </p>
                <p>{ev.description}</p>
                <p>RSVP Count: {rsvps[ev.id] ? rsvps[ev.id].length : 0}</p>
                <button className="button" onClick={() => handleDeleteEvent(ev.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Access Code Management Tab */}
        {adminTab === "codes" && (
          <div className="main-content">
            <h2>Access Codes</h2>
            <button className="button" onClick={generateAccessCode} style={{ marginBottom: "1rem" }}>
              Generate New Code
            </button>
            {codes.map((c) => (
              <div key={c} style={{ marginBottom: "0.5rem" }}>
                {c}
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {adminTab === "analytics" && (
          <div className="main-content">
            <h2>Guest Engagement Analytics</h2>
            <p>Total Events: {totalEvents}</p>
            <p>Total RSVPs: {totalRSVPCount}</p>
            <p>Total Messages in Chat: {totalMessages}</p>
            {/* You can add more analytics as needed */}
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------
     STAFF LOGIN SCREEN
  ---------------------------- */
  if (screen === "staffLogin") {
    return (
      <div className="container login-container">
        <div className="login-logo">Musafir Admin Login</div>
        <div className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={staffUsername}
              onChange={(e) => setStaffUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              placeholder="admin"
            />
          </div>
          <button className="login-button" onClick={handleStaffLogin}>
            Login as Staff
          </button>
        </div>
        <div className="login-footer" style={{ marginTop: "1rem" }}>
          <button className="button" onClick={() => setScreen("login")}>Go Back</button>
        </div>
      </div>
    );
  }

  /* ---------------------------
     GUEST LOGIN SCREEN
  ---------------------------- */
  if (screen === "login") {
    return (
      <div className="container" id="login-screen">
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
            <button className="login-button" onClick={handleGuestLogin}>
              Connect to Musafir
            </button>
          </div>
          <div className="login-footer">
            Need help? Ask at the reception.
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button className="button" onClick={() => setScreen("staffLogin")}>Staff Login</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------
     GUEST MAIN APP SCREEN
  ---------------------------- */
  if (screen === "app") {
    return (
      <div className="container" id="app-screen">
        <header>Musafir Connect</header>

        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="main-content" id="home-tab-content">
            <h2>Welcome, {nickname}!</h2>
            <p>Discover activities, meet fellow travelers, and make memories.</p>

            <h3>Today's Highlights</h3>
            {events.slice(0, 2).map((event) => (
              <div key={event.id} className="event-card">
                {event.image && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
                <h4>{event.title}</h4>
                <p>
                  {event.time} | {event.location}
                </p>
                <p>{event.description}</p>
                <div>RSVP Count: {rsvps[event.id] ? rsvps[event.id].length : 0}</div>
                <button
                  className="button"
                  onClick={() => handleRSVP(event.id)}
                >
                  {rsvps[event.id]?.includes(nickname) ? "Joined" : "Join"}
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
          <div className="main-content" id="events-tab-content">
            <h2>All Upcoming Events</h2>
            {events.map((event) => (
              <div key={event.id} className="event-card">
                {event.image && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                    />
                  </div>
                )}
                <h4>{event.title}</h4>
                <p>
                  {event.time} | {event.location}
                </p>
                <p>{event.description}</p>
                <div>RSVP Count: {rsvps[event.id] ? rsvps[event.id].length : 0}</div>
                <button
                  className="button"
                  onClick={() => handleRSVP(event.id)}
                >
                  {rsvps[event.id]?.includes(nickname) ? "Joined" : "Join"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="main-content" id="chat-tab-content">
            <h2>Hostel Chat</h2>
            <div className="chat-container">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <strong>{msg.sender}:</strong> {msg.content}
                  <div style={{ fontSize: "0.7rem", color: "#999" }}>{msg.time}</div>
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
          <div className="main-content" id="profile-tab-content">
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
            {Object.entries(rsvps)
              .filter(([eventId, nicks]) => nicks.includes(nickname))
              .map(([eventId]) => {
                const e = events.find((ev) => ev.id === eventId);
                return <p key={eventId}>• {e?.title}</p>;
              })}
            <button
              className="button"
              style={{ width: "100%", marginTop: "2rem" }}
              onClick={() => {
                setScreen("login");
                setNickname("");
                setAccessCode("");
              }}
            >
              Log Out
            </button>
          </div>
        )}

        {/* Bottom Nav Tabs */}
        <div className="tab-bar">
          <div
            className={`tab-item ${activeTab === "home" ? "active" : ""}`}
            id="home-tab"
            onClick={() => setActiveTab("home")}
          >
            Home
          </div>
          <div
            className={`tab-item ${activeTab === "events" ? "active" : ""}`}
            id="events-tab"
            onClick={() => setActiveTab("events")}
          >
            Events
          </div>
          <div
            className={`tab-item ${activeTab === "chat" ? "active" : ""}`}
            id="chat-tab"
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </div>
          <div
            className={`tab-item ${activeTab === "profile" ? "active" : ""}`}
            id="profile-tab"
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </div>
        </div>
      </div>
    );
  }

  // Fallback if something goes wrong
  return <div>Something went wrong.</div>;
}

export default MusafirConnectApp;
