import CollectionPage from './CollectionPage.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard`
  : 'http://localhost:8000/api/leaderboard'

const columns = [
  { key: 'user', label: 'Athlete' },
  { key: 'points', label: 'Points' },
  { key: 'period', label: 'Period', render: (value) => <span className="value-pill">{value ?? 'all-time'}</span> },
]

export default function Leaderboard() {
  return <CollectionPage title="Leaderboard" description="See who's leading the way." endpoint="leaderboard" apiUrl={apiUrl} columns={columns} />
}