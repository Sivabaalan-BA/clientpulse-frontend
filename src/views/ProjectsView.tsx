import React, { useState, useEffect } from 'react';
import { FolderKanban, CheckCircle2, Clock, Plus, CheckSquare } from 'lucide-react';
import api from '../services/api';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchProjects = () => {
    api.get('/projects').then((res: any) => {
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      } else if (selectedProject) {
        const updated = res.data.find((p: any) => p.id === selectedProject.id);
        if (updated) setSelectedProject(updated);
      }
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;
    try {
      await api.post(`/projects/${selectedProject.id}/tasks`, {
        title: newTaskTitle,
        priority: 'high',
      });
      setNewTaskTitle('');
      fetchProjects();
    } catch (e: any) {
      alert('Error creating task: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Delivery & Milestones</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track agile project delivery, milestone sign-offs, and engineer task kanban boards.
          </p>
        </div>
      </div>

      {/* Project Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProject(p)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedProject?.id === p.id
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>{p.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${
              selectedProject?.id === p.id ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {p.clientName}
            </span>
          </button>
        ))}
      </div>

      {selectedProject && (
        <div className="space-y-6">
          {/* Milestone Sign-off Progress */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Contract Milestones & Client Sign-off Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedProject.milestones?.map((m: any) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        m.status === 'approved_by_client'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {m.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Due {m.dueDate}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500">
                    {m.status === 'approved_by_client' ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Signed off by client
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Awaiting sign-off
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban / Tasks Column */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-600" /> Tasks & Delivery Items ({selectedProject.tasks?.length || 0})
              </h3>
              <form onSubmit={handleAddTask} className="flex gap-2 w-full sm:w-80 md:w-96">
                <input
                  type="text"
                  placeholder="Add new delivery task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
              {selectedProject.tasks?.map((t: any) => (
                <div key={t.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      t.status === 'done' ? 'bg-emerald-500' : 'bg-brand-500 animate-pulse'
                    }`} />
                    <span className="font-semibold text-slate-800">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                      {t.priority}
                    </span>
                    <span className="text-slate-500 text-[11px]">{t.assignedToName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
