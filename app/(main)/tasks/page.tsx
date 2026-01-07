import { TasksView } from './components/tasks-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tasks | Clarity',
    description: 'Manage your tasks with clarity.',
};

export default function TasksPage() {
    return (
        <div className="h-full p-4 md:p-8 animate-fade-in text-slate-200">
            <TasksView />
        </div>
    );
}
