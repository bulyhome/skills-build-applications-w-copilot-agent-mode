import CollectionPage from './CollectionPage.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams`
  : 'http://localhost:8000/api/teams'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'members', label: 'Members', render: (value) => Array.isArray(value) ? value.length : value ?? '-' },
  { key: 'points', label: 'Points' },
]

export default function Teams() {
  return <CollectionPage title="Teams" description="The crews setting goals and building momentum." endpoint="teams" apiUrl={apiUrl} columns={columns} />
}