export default function ProjectDashboardPage({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Project Dashboard</h2>
      <p className="text-slate-500">Project ID: {params.projectId}</p>
      
      <div className="mt-8 grid gap-6">
        {/* Project components will be rendered here */}
      </div>
    </div>
  );
}
