export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <aside 
        className="glass-panel"
        style={{ 
          width: '250px', 
          margin: 'var(--space-md)', 
          padding: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h1 style={{ color: 'var(--primary-color)', margin: 0, fontSize: 'var(--space-lg)' }}>VentureSketch</h1>
        <div style={{ marginTop: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
          <p className="hover-scale" style={{ padding: 'var(--space-sm) 0', cursor: 'pointer' }}>Dashboard</p>
          <p className="hover-scale" style={{ padding: 'var(--space-sm) 0', cursor: 'pointer' }}>Projects</p>
          <p className="hover-scale" style={{ padding: 'var(--space-sm) 0', cursor: 'pointer' }}>Settings</p>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto', padding: 'var(--space-xl)' }}>
        {children}
      </main>
    </div>
  );
}
