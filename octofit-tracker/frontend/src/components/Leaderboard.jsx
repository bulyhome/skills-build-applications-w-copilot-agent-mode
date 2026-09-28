import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'user', label: 'Athlete' },
  { key: 'points', label: 'Points' },
  { key: 'period', label: 'Period', render: (value) => <span className="value-pill">{value ?? 'all-time'}</span> },
]

export default function Leaderboard() {
  return <CollectionPage title="Leaderboard" description="See who's leading the way." endpoint="leaderboard" columns={columns} />
}