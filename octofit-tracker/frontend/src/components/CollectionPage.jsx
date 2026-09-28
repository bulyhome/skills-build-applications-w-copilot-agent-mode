import { useEffect, useState } from 'react'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

function getRows(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function displayValue(value) {
  if (value === undefined || value === null || value === '') return '-'
  if (typeof value === 'object') {
    return value.displayName ?? value.username ?? value.name ?? value.title ?? value._id ?? '-'
  }
  return String(value)
}

export default function CollectionPage({ title, description, endpoint, columns }) {
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('loading')
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCollection() {
      setStatus('loading')
      try {
        const response = await fetch(`${apiBaseUrl}/${endpoint}/`, { signal: controller.signal })
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        const payload = await response.json()
        setRows(getRows(payload))
        setStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('error')
      }
    }

    loadCollection()
    return () => controller.abort()
  }, [endpoint, requestId])

  return (
    <section className="page-content">
      <div className="collection-header">
        <div>
          <p className="eyebrow">TRACKER DIRECTORY</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {status === 'success' && <span className="record-count">{rows.length} records</span>}
      </div>
      <div className="collection-surface table-responsive">
        {status === 'loading' && <div className="collection-state" role="status">Loading {title.toLowerCase()}...</div>}
        {status === 'error' && (
          <div className="collection-state collection-error" role="alert">
            Could not load {title.toLowerCase()} from the API.
            <div><button className="retry-button" onClick={() => setRequestId((value) => value + 1)}>Retry</button></div>
          </div>
        )}
        {status === 'success' && rows.length === 0 && (
          <div className="collection-state">No {title.toLowerCase()} found.</div>
        )}
        {status === 'success' && rows.length > 0 && (
          <table className="table table-hover align-middle">
            <thead><tr>{columns.map(({ label }) => <th key={label} scope="col">{label}</th>)}</tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row._id ?? row.id ?? `${endpoint}-${index}`}>
                  {columns.map(({ key, render }) => (
                    <td key={key}>{render ? render(row[key], row) : displayValue(row[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}