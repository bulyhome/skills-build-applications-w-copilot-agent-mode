import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'members', label: 'Members', render: (value) => Array.isArray(value) ? value.length : value ?? '-' },
  { key: 'points', label: 'Points' },
]

export default function Teams() {
  return <CollectionPage title="Teams" description="The crews setting goals and building momentum." endpoint="teams" columns={columns} />
}