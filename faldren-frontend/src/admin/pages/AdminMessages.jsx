import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  MessageSquare,
  Search,
  Send
} from "lucide-react";

import AdminSidebar
  from "../components/AdminSidebar";

import "../admin.css";


const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


function AdminMessages() {

  const [conversations, setConversations] =
    useState([]);

  const [
    selectedConversation,
    setSelectedConversation
  ] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [messageText, setMessageText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");


  const messageEndRef =
    useRef(null);


  const adminName =
    localStorage.getItem(
      "adminName"
    ) || "Administrator";


  // ==========================================
  // AUTH ERROR
  // ==========================================

  const logoutAdmin = () => {

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminName"
    );

    localStorage.removeItem(
      "adminEmail"
    );

    localStorage.removeItem(
      "adminRole"
    );

    localStorage.removeItem(
      "adminLoggedIn"
    );


    window.location.href =
      "/admin/login";

  };


  // ==========================================
  // LOAD ALL CONVERSATIONS
  // ==========================================

  const loadConversations =
    async (silent = false) => {

      const token =
        localStorage.getItem(
          "adminToken"
        );


      if (!token) {

        logoutAdmin();

        return;

      }


      if (!silent) {

        setLoading(true);

      }


      try {

        const response =
          await fetch(
            `${API_BASE}/api/admin/messages`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logoutAdmin();

          return;

        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load conversations."
          );

        }


        const conversationList =
          Array.isArray(data)
            ? data
            : [];


        setConversations(
          conversationList
        );


        setSelectedConversation(
          current => {

            if (
              conversationList.length === 0
            ) {

              return null;

            }


            if (!current) {

              return conversationList[0];

            }


            return (
              conversationList.find(
                conversation =>
                  conversation
                    .conversationId ===
                  current.conversationId
              ) ||
              conversationList[0]
            );

          }
        );


        setError("");


      } catch (error) {

        console.error(
          "Conversation loading error:",
          error
        );


        if (!silent) {

          setError(
            error.message ||
            "Unable to load conversations."
          );

        }


      } finally {

        if (!silent) {

          setLoading(false);

        }

      }

    };


  // ==========================================
  // LOAD SELECTED CHAT
  // ==========================================

  const loadMessages =
    async (
      conversationId,
      silent = false
    ) => {

      if (!conversationId) {

        setMessages([]);

        return;

      }


      const token =
        localStorage.getItem(
          "adminToken"
        );


      if (!token) {

        logoutAdmin();

        return;

      }


      if (!silent) {

        setLoadingMessages(true);

      }


      try {

        const response =
          await fetch(
            `${API_BASE}/api/admin/messages/${conversationId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logoutAdmin();

          return;

        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load messages."
          );

        }


        setMessages(
          Array.isArray(data)
            ? data
            : []
        );


        setError("");


      } catch (error) {

        console.error(
          "Message loading error:",
          error
        );


        if (!silent) {

          setError(
            error.message ||
            "Unable to load messages."
          );

        }


      } finally {

        if (!silent) {

          setLoadingMessages(false);

        }

      }

    };


  // ==========================================
  // INITIAL + CONVERSATION POLLING
  // ==========================================

  useEffect(() => {

    loadConversations();


    const interval =
      window.setInterval(
        () => {

          loadConversations(true);

        },
        3000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, []);


  // ==========================================
  // SELECTED CHAT POLLING
  // ==========================================

  useEffect(() => {

    const conversationId =
      selectedConversation
        ?.conversationId;


    if (!conversationId) {

      setMessages([]);

      return;

    }


    loadMessages(
      conversationId
    );


    const interval =
      window.setInterval(
        () => {

          loadMessages(
            conversationId,
            true
          );

        },
        3000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    selectedConversation
      ?.conversationId
  ]);


  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {

    messageEndRef.current
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }, [messages]);


  // ==========================================
  // SEND ADMIN REPLY
  // ==========================================

  const handleSend =
    async (event) => {

      event.preventDefault();


      const conversationId =
        selectedConversation
          ?.conversationId;


      const cleanedMessage =
        messageText.trim();


      if (
        !conversationId ||
        !cleanedMessage
      ) {

        return;

      }


      const token =
        localStorage.getItem(
          "adminToken"
        );


      if (!token) {

        logoutAdmin();

        return;

      }


      setSending(true);

      setError("");


      try {

        const response =
          await fetch(
            `${API_BASE}/api/admin/messages/${conversationId}`,
            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },

              body:
                JSON.stringify({
                  message:
                    cleanedMessage
                })
            }
          );


        if (
          response.status === 401 ||
          response.status === 403
        ) {

          logoutAdmin();

          return;

        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to send message."
          );

        }


        setMessages(
          current => [
            ...current,
            data
          ]
        );


        setMessageText("");


        loadConversations(
          true
        );


      } catch (error) {

        console.error(
          "Message sending error:",
          error
        );


        setError(
          error.message ||
          "Unable to send message."
        );


      } finally {

        setSending(false);

      }

    };


  // ==========================================
  // FILTER CLIENTS
  // ==========================================

  const filteredConversations =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {

        return conversations;

      }


      return conversations.filter(
        conversation => {

          return (

            conversation
              .clientName
              ?.toLowerCase()
              .includes(query)

            ||

            conversation
              .companyName
              ?.toLowerCase()
              .includes(query)

            ||

            conversation
              .lastMessage
              ?.toLowerCase()
              .includes(query)

          );

        }
      );

    }, [
      conversations,
      search
    ]);


  // ==========================================
  // DATE
  // ==========================================

  const formatTime =
    value => {

      if (!value) {

        return "";

      }


      return new Date(
        value
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }
      );

    };


  return (

    <div className="admin-dashboard">

      <AdminSidebar />


      <main className="admin-main">


        {/* ================= HEADER ================= */}

        <header className="admin-topbar">

          <div>

            <span className="admin-page-label">
              FALDREN / ADMIN
            </span>

            <h1>
              Messages
            </h1>

          </div>


          <div className="admin-profile">

            <div className="admin-profile-copy">

              <strong>
                {adminName}
              </strong>

              <span>
                FALDREN
              </span>

            </div>


            <div className="admin-avatar">

              {adminName
                .charAt(0)
                .toUpperCase()}

            </div>

          </div>

        </header>



        {/* ================= TITLE ================= */}

        <section className="admin-welcome">

          <div>

            <span>
              COMMUNICATION
            </span>

            <h2>
              Client conversations.
            </h2>

            <p>
              Private conversations between
              FALDREN admin and clients.
            </p>

          </div>


          <span className="admin-welcome-index">
            SUPPORT / INBOX
          </span>

        </section>



        {/* ================= ERROR ================= */}

        {error && (

          <div
            style={{
              marginBottom: "18px",
              padding: "12px 15px",
              border:
                "1px solid rgba(130,74,60,.25)",
              color: "#7c463b"
            }}
          >

            {error}

          </div>

        )}



        {/* ================= CHAT APP ================= */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "340px minmax(0, 1fr)",
            minHeight: "650px",
            border:
              "1px solid rgba(25,24,22,.14)",
            background:
              "rgba(255,255,255,.16)"
          }}
        >


          {/* ================= LEFT SIDE ================= */}

          <aside
            style={{
              borderRight:
                "1px solid rgba(25,24,22,.14)",
              display: "flex",
              flexDirection: "column",
              minWidth: 0
            }}
          >


            <div
              style={{
                padding: "20px",
                borderBottom:
                  "1px solid rgba(25,24,22,.12)"
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginBottom: "14px"
                }}
              >

                <MessageSquare
                  size={17}
                />

                <strong
                  style={{
                    fontSize: "13px"
                  }}
                >
                  Conversations
                </strong>

                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    opacity: 0.6
                  }}
                >
                  {conversations.length}
                </span>

              </div>


              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "10px 12px",
                  border:
                    "1px solid rgba(25,24,22,.14)"
                }}
              >

                <Search
                  size={15}
                />

                <input
                  type="text"
                  value={search}
                  onChange={
                    event =>
                      setSearch(
                        event.target.value
                      )
                  }
                  placeholder="Search clients..."
                  style={{
                    width: "100%",
                    border: 0,
                    outline: 0,
                    background:
                      "transparent",
                    font: "inherit",
                    fontSize: "12px"
                  }}
                />

              </div>

            </div>



            <div
              style={{
                overflowY: "auto",
                flex: 1
              }}
            >

              {loading ? (

                <div
                  style={{
                    padding: "25px 20px",
                    fontSize: "12px",
                    opacity: 0.6
                  }}
                >
                  Loading conversations...
                </div>

              ) : filteredConversations
                    .length === 0 ? (

                <div
                  style={{
                    padding: "30px 20px",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    opacity: 0.6
                  }}
                >
                  No client conversations yet.
                </div>

              ) : (

                filteredConversations.map(
                  conversation => {

                    const selected =
                      selectedConversation
                        ?.conversationId ===
                      conversation
                        .conversationId;


                    const initial =
                      conversation
                        .clientName
                        ?.charAt(0)
                        .toUpperCase() ||
                      "C";


                    return (

                      <button
                        type="button"
                        key={
                          conversation
                            .conversationId
                        }
                        onClick={() =>
                          setSelectedConversation(
                            conversation
                          )
                        }
                        style={{
                          width: "100%",
                          border: 0,
                          borderBottom:
                            "1px solid rgba(25,24,22,.08)",
                          padding:
                            "17px 18px",
                          background:
                            selected
                              ? "#171812"
                              : "transparent",
                          color:
                            selected
                              ? "#f1ece2"
                              : "#171812",
                          cursor:
                            "pointer",
                          textAlign:
                            "left",
                          display:
                            "flex",
                          gap: "12px"
                        }}
                      >

                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            flexShrink: 0,
                            borderRadius:
                              "50%",
                            display:
                              "grid",
                            placeItems:
                              "center",
                            background:
                              selected
                                ? "#f1ece2"
                                : "#171812",
                            color:
                              selected
                                ? "#171812"
                                : "#f1ece2",
                            fontSize:
                              "12px",
                            fontWeight:
                              600
                          }}
                        >
                          {initial}
                        </div>


                        <div
                          style={{
                            minWidth: 0,
                            flex: 1
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              gap: "10px"
                            }}
                          >

                            <strong
                              style={{
                                fontSize:
                                  "12px",
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap"
                              }}
                            >
                              {
                                conversation
                                  .clientName
                              }
                            </strong>


                            <span
                              style={{
                                flexShrink: 0,
                                fontSize:
                                  "8px",
                                opacity: 0.55
                              }}
                            >
                              {formatTime(
                                conversation
                                  .lastMessageTime
                              )}
                            </span>

                          </div>


                          <span
                            style={{
                              display:
                                "block",
                              marginTop:
                                "3px",
                              fontSize:
                                "9px",
                              opacity: 0.55,
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap"
                            }}
                          >
                            {
                              conversation
                                .companyName ||
                              "Client"
                            }
                          </span>


                          <p
                            style={{
                              margin:
                                "7px 0 0",
                              fontSize:
                                "10px",
                              lineHeight:
                                1.4,
                              opacity: 0.7,
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace:
                                "nowrap"
                            }}
                          >
                            {
                              conversation
                                .lastMessage ||
                              "No message"
                            }
                          </p>

                        </div>

                      </button>

                    );

                  }
                )

              )}

            </div>

          </aside>



          {/* ================= RIGHT CHAT ================= */}

          <div
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column"
            }}
          >

            {!selectedConversation ? (

              <div
                style={{
                  flex: 1,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  padding: "40px"
                }}
              >

                <div>

                  <MessageSquare
                    size={30}
                    strokeWidth={1.2}
                  />

                  <h3
                    style={{
                      margin:
                        "18px 0 8px",
                      fontSize: "24px",
                      fontWeight: 400
                    }}
                  >
                    Select a conversation
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      opacity: 0.6
                    }}
                  >
                    Choose a client from the
                    inbox to view messages.
                  </p>

                </div>

              </div>

            ) : (

              <>


                {/* CHAT HEADER */}

                <div
                  style={{
                    minHeight: "78px",
                    padding: "15px 20px",
                    borderBottom:
                      "1px solid rgba(25,24,22,.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "13px"
                  }}
                >

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius:
                        "50%",
                      display: "grid",
                      placeItems:
                        "center",
                      background:
                        "#171812",
                      color:
                        "#f1ece2",
                      fontWeight: 600
                    }}
                  >
                    {selectedConversation
                      .clientName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>


                  <div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: "13px"
                      }}
                    >
                      {
                        selectedConversation
                          .clientName
                      }
                    </strong>

                    <span
                      style={{
                        display: "block",
                        marginTop: "4px",
                        fontSize: "10px",
                        opacity: 0.55
                      }}
                    >
                      {
                        selectedConversation
                          .companyName ||
                        "FALDREN Client"
                      }
                    </span>

                  </div>


                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "9px",
                      letterSpacing:
                        "0.1em",
                      opacity: 0.5
                    }}
                  >
                    PRIVATE SUPPORT
                  </span>

                </div>



                {/* MESSAGES */}

                <div
                  style={{
                    height: "465px",
                    overflowY: "auto",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }}
                >

                  {loadingMessages ? (

                    <div
                      style={{
                        margin: "auto",
                        fontSize: "12px",
                        opacity: 0.6
                      }}
                    >
                      Loading messages...
                    </div>

                  ) : messages.length === 0 ? (

                    <div
                      style={{
                        margin: "auto",
                        textAlign: "center"
                      }}
                    >

                      <h3
                        style={{
                          fontSize: "22px",
                          fontWeight: 400
                        }}
                      >
                        No messages yet.
                      </h3>

                    </div>

                  ) : (

                    messages.map(
                      message => {

                        const adminMessage =
                          message
                            .senderRole ===
                          "ADMIN";


                        return (

                          <div
                            key={message.id}
                            style={{
                              display: "flex",
                              justifyContent:
                                adminMessage
                                  ? "flex-end"
                                  : "flex-start"
                            }}
                          >

                            <div
                              style={{
                                maxWidth:
                                  "70%",
                                padding:
                                  "12px 14px",
                                border:
                                  adminMessage
                                    ? "1px solid #171812"
                                    : "1px solid rgba(25,24,22,.15)",
                                background:
                                  adminMessage
                                    ? "#171812"
                                    : "rgba(255,255,255,.24)",
                                color:
                                  adminMessage
                                    ? "#f1ece2"
                                    : "#171812"
                              }}
                            >

                              <div
                                style={{
                                  display:
                                    "flex",
                                  gap: "16px",
                                  justifyContent:
                                    "space-between",
                                  marginBottom:
                                    "6px"
                                }}
                              >

                                <strong
                                  style={{
                                    fontSize:
                                      "9px",
                                    letterSpacing:
                                      "0.1em"
                                  }}
                                >
                                  {adminMessage
                                    ? "YOU"
                                    : message.senderName}
                                </strong>


                                <span
                                  style={{
                                    fontSize:
                                      "8px",
                                    opacity:
                                      0.55
                                  }}
                                >
                                  {formatTime(
                                    message
                                      .createdAt
                                  )}
                                </span>

                              </div>


                              <p
                                style={{
                                  margin: 0,
                                  whiteSpace:
                                    "pre-wrap",
                                  wordBreak:
                                    "break-word",
                                  fontSize:
                                    "12px",
                                  lineHeight:
                                    1.55
                                }}
                              >
                                {message.message}
                              </p>

                            </div>

                          </div>

                        );

                      }
                    )

                  )}


                  <div
                    ref={messageEndRef}
                  />

                </div>



                {/* INPUT */}

                <form
                  onSubmit={
                    handleSend
                  }
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr auto",
                    gap: "10px",
                    padding: "15px 18px",
                    borderTop:
                      "1px solid rgba(25,24,22,.12)"
                  }}
                >

                  <textarea
                    value={messageText}
                    onChange={
                      event =>
                        setMessageText(
                          event.target.value
                        )
                    }
                    placeholder={
                      `Reply to ${
                        selectedConversation
                          .clientName
                      }...`
                    }
                    rows="1"
                    maxLength="5000"
                    disabled={sending}
                    onKeyDown={
                      event => {

                        if (
                          event.key ===
                            "Enter" &&
                          !event
                            .shiftKey
                        ) {

                          event
                            .preventDefault();

                          event
                            .currentTarget
                            .form
                            ?.requestSubmit();

                        }

                      }
                    }
                    style={{
                      minHeight:
                        "48px",
                      maxHeight:
                        "130px",
                      resize:
                        "vertical",
                      boxSizing:
                        "border-box",
                      padding:
                        "13px 14px",
                      border:
                        "1px solid rgba(25,24,22,.18)",
                      outline: 0,
                      background:
                        "transparent",
                      font:
                        "inherit",
                      fontSize:
                        "12px"
                    }}
                  />


                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !messageText.trim()
                    }
                    style={{
                      width: "105px",
                      border:
                        "1px solid #171812",
                      background:
                        sending ||
                        !messageText.trim()
                          ? "rgba(23,24,18,.45)"
                          : "#171812",
                      color:
                        "#f1ece2",
                      cursor:
                        sending ||
                        !messageText.trim()
                          ? "not-allowed"
                          : "pointer",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      gap: "7px",
                      font:
                        "inherit",
                      fontSize:
                        "11px"
                    }}
                  >

                    <Send
                      size={14}
                    />

                    {sending
                      ? "Sending"
                      : "Send"}

                  </button>

                </form>

              </>

            )}

          </div>

        </section>

      </main>

    </div>

  );

}


export default AdminMessages;