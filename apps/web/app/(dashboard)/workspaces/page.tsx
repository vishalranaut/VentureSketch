export default function WorkspacesPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Workspaces</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Workspace cards will go here */}
        <div className="p-6 border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="font-medium text-lg">Default Workspace</h3>
          <p className="text-sm text-slate-500 mt-1">Manage your projects</p>
        </div>
      </div>
    </div>
  );
}
