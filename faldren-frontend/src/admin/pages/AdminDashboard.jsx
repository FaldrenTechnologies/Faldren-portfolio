import React from "react";
import {
  ArrowUpRight,
  Users,
  FolderKanban,
  Inbox,
  CheckCircle2
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import "../admin.css";

function AdminDashboard() {

  const stats = [
    {
      label: "Total Clients",
      value: "00",
      icon: Users
    },
    {
      label: "Active Projects",
      value: "00",
      icon: FolderKanban
    },
    {
      label: "New Requests",
      value: "00",
      icon: Inbox
    },
    {
      label: "Completed",
      value: "00",
      icon: CheckCircle2
    }
  ];

  return (
    <div className="admin-dashboard">

      <AdminSidebar />

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <span className="admin-page-label">
              FALDREN / ADMIN
            </span>

            <h1>
              Overview
            </h1>
          </div>

          <div className="admin-profile">

            <div className="admin-profile-copy">
              <strong>Administrator</strong>
              <span>FALDREN</span>
            </div>

            <div className="admin-avatar">
              A
            </div>

          </div>

        </header>


        <section className="admin-welcome">

          <div>

            <span>
              WORKSPACE
            </span>

            <h2>
              Good to see you.
            </h2>

            <p>
              Here's what's happening across FALDREN.
            </p>

          </div>

          <span className="admin-welcome-index">
            01 / OVERVIEW
          </span>

        </section>


        <section className="admin-stats">

          {stats.map((stat) => {

            const Icon = stat.icon;

            return (
              <article
                className="admin-stat-card"
                key={stat.label}
              >

                <div className="admin-stat-top">

                  <span>
                    {stat.label}
                  </span>

                  <Icon
                    size={18}
                    strokeWidth={1.6}
                  />

                </div>

                <strong>
                  {stat.value}
                </strong>

              </article>
            );

          })}

        </section>


        <section className="admin-dashboard-grid">

          <div className="admin-recent-projects">

            <div className="admin-section-head">

              <div>
                <span>
                  PROJECTS
                </span>

                <h3>
                  Recent projects
                </h3>
              </div>

              <button>
                View all
                <ArrowUpRight size={16} />
              </button>

            </div>


            <div className="admin-empty-state">

              <span>
                00
              </span>

              <h4>
                No projects yet.
              </h4>

              <p>
                Projects created in the FALDREN workspace
                will appear here.
              </p>

            </div>

          </div>


          <aside className="admin-activity">

            <div className="admin-section-head">

              <div>
                <span>
                  ACTIVITY
                </span>

                <h3>
                  Latest
                </h3>
              </div>

            </div>


            <div className="admin-empty-activity">

              <div className="admin-activity-dot" />

              <div>
                <strong>
                  Workspace ready
                </strong>

                <p>
                  Activity will appear here once
                  your projects begin moving.
                </p>
              </div>

            </div>

          </aside>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;