import CollectionPage from './CollectionPage.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts`
  : 'http://localhost:8000/api/workouts'

const columns = [
  { key: 'title', label: 'Workout' },
  { key: 'activityType', label: 'Activity' },
  { key: 'durationMinutes', label: 'Duration', render: (value) => `${value ?? '-'} min` },
  { key: 'difficulty', label: 'Difficulty', render: (value) => <span className="value-pill">{value ?? '-'}</span> },
  { key: 'description', label: 'Details' },
]

export default function Workouts() {
  return <CollectionPage title="Workouts" description="Find your next session and keep the routine going." endpoint="workouts" apiUrl={apiUrl} columns={columns} />
}