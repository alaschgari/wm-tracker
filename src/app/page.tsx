import { generateInitialMatches, TEAMS } from '../data/initialData';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const initialMatches = generateInitialMatches();

  return (
    <main className="app-container animate-fade-in">
      <Dashboard initialMatches={initialMatches} teams={TEAMS} />
    </main>
  );
}
