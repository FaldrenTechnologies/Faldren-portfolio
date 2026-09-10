import React, { useState } from "react";
import "../styles/client.css";

function ClientDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const navItems = [
    "Dashboard",
    "Projects",
    "Milestones",
    "Messages",
    "Files",
    "Profile",
  ];

  const handleNav = (item) => {
    setActiveTab(item);
  };

  return (
    <main className="client-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="client-sidebar">

        <div className="client-logo">
          <span>FALDREN</span>
          <small>CLIENT PORTAL</small>
        </div>

        <nav className="client-nav">

          {navItems.map((item) => (
            <button
              key={item}
              className={activeTab === item ? "active" : ""}
              onClick={() => handleNav(item)}
            >
              <span>{item}</span>

              {item === "Messages" && (
                <b className="nav-count">04</b>
              )}
            </button>
          ))}

        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <span>Logout</span>
          <span>↗</span>
        </button>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <section className="client-content">

        {/* HEADER */}

        <header className="client-header">

          <div>
            <p className="dashboard-eyebrow">
              CLIENT / {activeTab.toUpperCase()}
            </p>

            <h1>
              {activeTab === "Dashboard"
                ? "Welcome back, Client."
                : activeTab}
            </h1>
          </div>

          <button
            className="client-avatar"
            onClick={() => setActiveTab("Profile")}
          >
            C
          </button>

        </header>


        {/* ================= DASHBOARD ================= */}

        {activeTab === "Dashboard" && (
          <>
            {/* STATS */}

            <section className="dashboard-stats">

              <div className="dashboard-card">
                <span>ACTIVE PROJECTS</span>
                <strong>02</strong>
                <small>Currently running</small>
              </div>

              <div className="dashboard-card">
                <span>COMPLETED</span>
                <strong>01</strong>
                <small>Successfully delivered</small>
              </div>

              <div className="dashboard-card">
                <span>UPCOMING</span>
                <strong>03</strong>
                <small>Milestones ahead</small>
              </div>

              <div className="dashboard-card">
                <span>MESSAGES</span>
                <strong>04</strong>
                <small>Unread conversations</small>
              </div>

            </section>


            {/* CURRENT PROJECT */}

            <section className="project-section">

              <div className="section-title">

                <div>
                  <p>CURRENT PROJECT</p>
                  <h2>Brand Identity Project</h2>
                </div>

                <span className="project-status">
                  IN PROGRESS
                </span>

              </div>


              <div className="project-progress">

                <div className="progress-info">
                  <span>Project Progress</span>
                  <strong>68%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: "68%" }}
                  />
                </div>

              </div>


              <div className="project-details">

                <div>
                  <span>START DATE</span>
                  <strong>12 AUG 2026</strong>
                </div>

                <div>
                  <span>DEADLINE</span>
                  <strong>30 SEP 2026</strong>
                </div>

                <div>
                  <span>NEXT MILESTONE</span>
                  <strong>Design Review</strong>
                </div>

              </div>

            </section>


            {/* RECENT ACTIVITY */}

            <section className="updates-section">

              <div className="section-title">
                <div>
                  <p>RECENT ACTIVITY</p>
                  <h2>Project Updates</h2>
                </div>
              </div>


              <div className="update-item">

                <span>01</span>

                <div>
                  <h3>Design concepts uploaded</h3>
                  <p>
                    Latest design concepts are ready for review.
                  </p>
                </div>

                <small>2 DAYS AGO</small>

              </div>


              <div className="update-item">

                <span>02</span>

                <div>
                  <h3>Project milestone completed</h3>
                  <p>
                    Initial strategy phase has been completed.
                  </p>
                </div>

                <small>5 DAYS AGO</small>

              </div>


              <div className="update-item">

                <span>03</span>

                <div>
                  <h3>Project started</h3>
                  <p>
                    FALDREN has started working on your project.
                  </p>
                </div>

                <small>8 DAYS AGO</small>

              </div>

            </section>
          </>
        )}


        {/* ================= PROJECTS ================= */}

        {activeTab === "Projects" && (
          <section className="portal-panel">

            <div className="panel-heading">
              <p>YOUR WORK</p>
              <h2>Projects</h2>
            </div>

            <div className="project-list">

              <article className="portal-project-card">
                <div>
                  <span>01 / ACTIVE</span>
                  <h3>Brand Identity Project</h3>
                  <p>Brand strategy, visual identity and digital direction.</p>
                </div>

                <strong>68%</strong>
              </article>

              <article className="portal-project-card">
                <div>
                  <span>02 / ACTIVE</span>
                  <h3>Website Experience</h3>
                  <p>Modern website design and development.</p>
                </div>

                <strong>32%</strong>
              </article>

              <article className="portal-project-card completed">
                <div>
                  <span>03 / COMPLETED</span>
                  <h3>Product Strategy</h3>
                  <p>Initial product research and strategic direction.</p>
                </div>

                <strong>100%</strong>
              </article>

            </div>

          </section>
        )}


        {/* ================= MILESTONES ================= */}

        {activeTab === "Milestones" && (
          <section className="portal-panel">

            <div className="panel-heading">
              <p>PROJECT TIMELINE</p>
              <h2>Milestones</h2>
            </div>

            <div className="milestone-list">

              <div className="milestone completed">
                <span>01</span>
                <div>
                  <h3>Project Discovery</h3>
                  <p>Completed successfully.</p>
                </div>
                <b>DONE</b>
              </div>

              <div className="milestone completed">
                <span>02</span>
                <div>
                  <h3>Strategy Phase</h3>
                  <p>Initial strategy has been approved.</p>
                </div>
                <b>DONE</b>
              </div>

              <div className="milestone current">
                <span>03</span>
                <div>
                  <h3>Design Review</h3>
                  <p>Next milestone — scheduled for review.</p>
                </div>
                <b>UP NEXT</b>
              </div>

              <div className="milestone">
                <span>04</span>
                <div>
                  <h3>Development</h3>
                  <p>Production development phase.</p>
                </div>
                <b>PENDING</b>
              </div>

            </div>

          </section>
        )}


        {/* ================= MESSAGES ================= */}

        {activeTab === "Messages" && (
          <section className="portal-panel">

            <div className="panel-heading">
              <p>COMMUNICATION</p>
              <h2>Messages</h2>
            </div>

            <div className="message-list">

              <article className="message-card unread">
                <span>F</span>
                <div>
                  <h3>FALDREN Team</h3>
                  <p>
                    The latest design concepts are ready for your review.
                  </p>
                  <small>2 DAYS AGO</small>
                </div>
              </article>

              <article className="message-card">
                <span>F</span>
                <div>
                  <h3>FALDREN Team</h3>
                  <p>
                    Strategy phase has been completed.
                  </p>
                  <small>5 DAYS AGO</small>
                </div>
              </article>

            </div>

          </section>
        )}


        {/* ================= FILES ================= */}

        {activeTab === "Files" && (
          <section className="portal-panel">

            <div className="panel-heading">
              <p>PROJECT DOCUMENTS</p>
              <h2>Files</h2>
            </div>

            <div className="file-list">

              <button className="file-card">
                <span>PDF</span>
                <div>
                  <h3>Brand Strategy.pdf</h3>
                  <small>2.4 MB · 12 AUG 2026</small>
                </div>
                <b>↓</b>
              </button>

              <button className="file-card">
                <span>PDF</span>
                <div>
                  <h3>Project Brief.pdf</h3>
                  <small>1.8 MB · 10 AUG 2026</small>
                </div>
                <b>↓</b>
              </button>

              <button className="file-card">
                <span>ZIP</span>
                <div>
                  <h3>Design Concepts.zip</h3>
                  <small>18.2 MB · 08 AUG 2026</small>
                </div>
                <b>↓</b>
              </button>

            </div>

          </section>
        )}


        {/* ================= PROFILE ================= */}

        {activeTab === "Profile" && (
          <section className="portal-panel">

            <div className="panel-heading">
              <p>ACCOUNT</p>
              <h2>Profile</h2>
            </div>

            <div className="profile-card">

              <div className="profile-avatar">
                C
              </div>

              <div className="profile-info">

                <div>
                  <span>NAME</span>
                  <strong>Client</strong>
                </div>

                <div>
                  <span>EMAIL</span>
                  <strong>client@example.com</strong>
                </div>

                <div>
                  <span>ACCOUNT TYPE</span>
                  <strong>FALDREN Client</strong>
                </div>

                <div>
                  <span>MEMBER SINCE</span>
                  <strong>2026</strong>
                </div>

              </div>

            </div>

          </section>
        )}

      </section>

    </main>
  );
}

export default ClientDashboard;