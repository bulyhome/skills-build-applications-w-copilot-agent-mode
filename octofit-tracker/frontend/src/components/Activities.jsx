import CollectionPage from './CollectionPage.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities`
  : 'http://localhost:8000/api/activities'

const columns = [
  { key: 'type', label: 'Activity' },
  { key: 'user', label: 'Athlete' },
  { key: 'durationMinutes', label: 'Duration', render: (value) => `${value ?? '-'} min` },
  { key: 'calories', label: 'Calories' },
  { key: 'completedAt', label: 'Completed', render: (value) => value ? new Date(value).toLocaleDateString() : '—' },
]

export default function Activities() {
  return <CollectionPage title="Activities" description="Training sessions logged by your community." endpoint="activities" apiUrl={apiUrl} columns={columns} />
}