import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, BellRing } from 'lucide-react';

interface Notification {
  id: number;
  app: string;
  time: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
}

export default function Nudges() {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  const notificationsData: Notification[] = [
    {
      id: 1,
      app: "Smart Reminders",
      time: "Just now",
      icon: <BellRing size={14} color="#3B82F6" />,
      title: "Weekly Goal Nearby",
      message: "You're only one lesson away from your weekly goal. Spend 10 mins now to complete it!",
      color: "rgba(59, 130, 246, 0.08)",
    },
    {
      id: 2,
      app: "Adaptive AI Coach",
      time: "2m ago",
      icon: <Sparkles size={14} color="#FF6B6B" />,
      title: "Focused Review Needed",
      message: "You struggled with Functions yesterday. Let's spend 15 minutes reviewing parameters.",
      color: "rgba(255, 107, 107, 0.08)",
    },
    {
      id: 3,
      app: "Consistency Nudge",
      time: "10m ago",
      icon: <Flame size={14} color="#FACC15" />,
      title: "Streak Safe!",
      message: "Fantastic! Your consistency streak reached 10 days. Keep the momentum going!",
      color: "rgba(250, 204, 21, 0.08)",
    },
  ];

  useEffect(() => {
    setVisibleNotifications([]);
    
    const timers = [
      setTimeout(() => {
        setVisibleNotifications([notificationsData[2]]);
      }, 1000),
      setTimeout(() => {
        setVisibleNotifications([notificationsData[1], notificationsData[2]]);
      }, 3000),
      setTimeout(() => {
        setVisibleNotifications([notificationsData[0], notificationsData[1], notificationsData[2]]);
      }, 5000),
    ];

    const loopInterval = setInterval(() => {
      setVisibleNotifications([]);
      timers[0] = setTimeout(() => {
        setVisibleNotifications([notificationsData[2]]);
      }, 1000);
      timers[1] = setTimeout(() => {
        setVisibleNotifications([notificationsData[1], notificationsData[2]]);
      }, 3000);
      timers[2] = setTimeout(() => {
        setVisibleNotifications([notificationsData[0], notificationsData[1], notificationsData[2]]);
      }, 5000);
    }, 12000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <div style={styles.phoneContainer}>
      <div style={styles.phoneBezel}>
        <div style={styles.phoneNotch} />
        
        <div style={styles.phoneScreen}>
          <div style={styles.statusBar}>
            <span style={styles.statusTime}>9:41</span>
            <div style={styles.statusIcons}>
              <span style={styles.signalIcon}>📶</span>
              <span style={styles.wifiIcon}>📶</span>
              <span style={styles.batteryIcon}>🔋</span>
            </div>
          </div>

          <div style={styles.wallpaperOverlay}>
            <span style={styles.lockScreenDate}>Friday, July 17</span>
            <span style={styles.lockScreenClock}>9:41</span>
            <span style={styles.lockScreenFocus}>Focus mode: Learning</span>
          </div>

          <div style={styles.notificationsList}>
            <motion.div layout style={styles.motionContainer}>
              {visibleNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: -40, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 20 
                  }}
                  style={styles.notifCard}
                >
                  <div style={styles.notifHeader}>
                    <div style={styles.notifAppNameRow}>
                      <div style={styles.notifIcon(notif.color)}>
                        {notif.icon}
                      </div>
                      <span style={styles.notifAppName}>{notif.app}</span>
                    </div>
                    <span style={styles.notifTime}>{notif.time}</span>
                  </div>
                  <h5 style={styles.notifTitle}>{notif.title}</h5>
                  <p style={styles.notifMessage}>{notif.message}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div style={styles.swipeBar} />
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: any } = {
  phoneContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '340px',
    margin: '0 auto',
  },
  phoneBezel: {
    width: '300px',
    height: '600px',
    borderRadius: '40px',
    backgroundColor: '#000000',
    padding: '10px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 10px #1F2937',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  phoneNotch: {
    width: '120px',
    height: '24px',
    backgroundColor: '#000000',
    borderRadius: '0 0 16px 16px',
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
  },
  phoneScreen: {
    flexGrow: 1,
    borderRadius: '32px',
    backgroundImage: 'linear-gradient(to bottom, #FFE8E8 0%, #E0F2FE 100%)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.25rem 1rem',
    overflow: 'hidden',
    userSelect: 'none',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#1F2937',
    padding: '0 0.5rem',
  },
  statusTime: {
    fontSize: '0.75rem',
  },
  statusIcons: {
    display: 'flex',
    gap: '4px',
  },
  signalIcon: { fontSize: '0.65rem' },
  wifiIcon: { fontSize: '0.65rem' },
  batteryIcon: { fontSize: '0.75rem' },
  wallpaperOverlay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  lockScreenDate: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  lockScreenClock: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#111827',
    margin: '-0.25rem 0',
  },
  lockScreenFocus: {
    fontSize: '0.7rem',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: '2px 10px',
    borderRadius: '10px',
    color: '#374151',
    fontWeight: 600,
    marginTop: '0.25rem',
    backdropFilter: 'blur(4px)',
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
    flexGrow: 1,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  motionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
  },
  notifCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '0.875rem',
    boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    textAlign: 'left',
  },
  notifHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.35rem',
  },
  notifAppNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  notifIcon: (bg: string) => ({
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    backgroundColor: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }) as React.CSSProperties,
  notifAppName: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#4B5563',
    letterSpacing: '0.02em',
  },
  notifTime: {
    fontSize: '0.65rem',
    color: '#9CA3AF',
  },
  notifTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '2px',
  },
  notifMessage: {
    fontSize: '0.7rem',
    color: '#4B5563',
    lineHeight: 1.3,
  },
  swipeBar: {
    width: '110px',
    height: '4px',
    backgroundColor: '#374151',
    borderRadius: '2px',
    alignSelf: 'center',
    marginTop: '0.5rem',
  },
};
