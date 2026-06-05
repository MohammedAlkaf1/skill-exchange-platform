import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unread={unread}
      />
      <Topbar
        onMenuClick={() => setSidebarOpen(true)}
        unread={unread}
        setUnread={setUnread}
      />
      <main
        className="min-h-screen"
        style={{
          marginLeft: '260px',
          paddingTop: '64px',
          transition: 'margin-left 0.25s',
        }}
      >
        <div className="p-4 lg:p-6 page-enter">
          <Outlet />
        </div>
      </main>

      {/* Mobile: no left margin */}
      <style>{`
        @media (max-width: 1023px) {
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
