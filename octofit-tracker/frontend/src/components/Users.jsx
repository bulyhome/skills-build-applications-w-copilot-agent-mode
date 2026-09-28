import CollectionPage from './CollectionPage.jsx'

const columns = [
  { key: 'displayName', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'team', label: 'Team' },
]

export default function Users() {
  return <CollectionPage title="Users" description="People in your OctoFit community." endpoint="users" columns={columns} />
}