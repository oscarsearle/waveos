'use client'

import { useState, useEffect, useCallback } from 'react'
import { Folder, Film, Image, File, Download, ChevronRight, ChevronLeft, Loader2, Link as LinkIcon } from 'lucide-react'
import type { FrameioAsset, FrameioProject } from '@/lib/frameio'

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function AssetIcon({ type, filetype }: { type: string; filetype: string | null }) {
  if (type === 'folder') return <Folder className="w-4 h-4 shrink-0" style={{ color: '#00B7FF', opacity: 0.6 }} />
  if (filetype?.startsWith('video/')) return <Film className="w-4 h-4 shrink-0" style={{ color: '#a78bfa', opacity: 0.7 }} />
  if (filetype?.startsWith('image/')) return <Image className="w-4 h-4 shrink-0" style={{ color: '#34d399', opacity: 0.7 }} />
  return <File className="w-4 h-4 shrink-0" style={{ color: '#5a7099' }} />
}

type BreadcrumbItem = { id: string; name: string }

export function FrameioPanel({ isConnected }: { isConnected: boolean }) {
  const [projects, setProjects] = useState<FrameioProject[]>([])
  const [assets, setAssets] = useState<FrameioAsset[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'projects' | 'assets'>('projects')

  useEffect(() => {
    if (!isConnected) return
    loadProjects()
  }, [isConnected])

  async function loadProjects() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/frameio/projects')
      if (!res.ok) throw new Error('Failed to load projects')
      const data = await res.json()
      setProjects(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading projects')
    } finally {
      setLoading(false)
    }
  }

  const loadFolder = useCallback(async (folderId: string, name: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/frameio/assets?folder_id=${folderId}`)
      if (!res.ok) throw new Error('Failed to load assets')
      const data = await res.json()
      setAssets(data ?? [])
      setBreadcrumbs(prev => [...prev, { id: folderId, name }])
      setView('assets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading assets')
    } finally {
      setLoading(false)
    }
  }, [])

  async function handleProjectClick(project: FrameioProject) {
    setBreadcrumbs([{ id: project.id, name: project.name }])
    setView('assets')
    await loadFolder(project.root_asset_id, project.name)
  }

  async function handleBreadcrumb(index: number) {
    const crumb = breadcrumbs[index]
    setBreadcrumbs(prev => prev.slice(0, index + 1))
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/frameio/assets?folder_id=${crumb.id}`)
      const data = await res.json()
      setAssets(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading assets')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border" style={{ background: '#0b1120', borderColor: '#162035' }}>
        <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: '#111d35' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z" fill="#00B7FF" opacity="0.5" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1" style={{ color: '#e8eeff' }}>Frame.io not connected</p>
        <p className="text-[12px] mb-4" style={{ color: '#3d5475' }}>Connect your account to browse and share assets.</p>
        <a
          href="/settings"
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md text-[12px] font-medium text-white transition-all hover:opacity-90"
          style={{ background: '#054F99' }}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Connect in Settings
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#0b1120', borderColor: '#162035' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: '#0d1728', borderColor: '#162035' }}>
        <div className="flex items-center gap-2 text-[12px] min-w-0">
          <button
            onClick={() => { setView('projects'); setBreadcrumbs([]) }}
            className="font-medium transition-colors hover:text-[#00B7FF] shrink-0"
            style={{ color: view === 'projects' ? '#00B7FF' : '#5a7099' }}
          >
            Projects
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.id} className="flex items-center gap-2 min-w-0">
              <ChevronRight className="w-3 h-3 shrink-0" style={{ color: '#2d4060' }} />
              <button
                onClick={() => handleBreadcrumb(i)}
                className="hover:text-[#00B7FF] transition-colors truncate"
                style={{ color: i === breadcrumbs.length - 1 ? '#e8eeff' : '#5a7099' }}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={{ color: '#3d5475' }} />}
      </div>

      {/* Content */}
      <div className="divide-y divide-[#162035]">
        {error && (
          <div className="px-4 py-3 text-[12px]" style={{ color: '#fca5a5' }}>{error}</div>
        )}

        {!loading && view === 'projects' && projects.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px]" style={{ color: '#3d5475' }}>No Frame.io projects found.</div>
        )}

        {view === 'projects' && projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02] group"
          >
            <Folder className="w-4 h-4 shrink-0" style={{ color: '#00B7FF', opacity: 0.5 }} />
            <span className="text-[13px] font-medium group-hover:text-[#00B7FF] transition-colors" style={{ color: '#e8eeff' }}>{project.name}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-30 group-hover:opacity-70" style={{ color: '#00B7FF' }} />
          </button>
        ))}

        {view === 'assets' && !loading && assets.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px]" style={{ color: '#3d5475' }}>This folder is empty.</div>
        )}

        {view === 'assets' && assets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02] group"
          >
            {asset.thumb_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset.thumb_url} alt="" className="w-8 h-8 rounded object-cover shrink-0" style={{ background: '#111d35' }} />
            ) : (
              <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: '#111d35' }}>
                <AssetIcon type={asset.type} filetype={asset.filetype} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              {asset.type === 'folder' ? (
                <button
                  onClick={() => loadFolder(asset.id, asset.name)}
                  className="text-[13px] font-medium hover:text-[#00B7FF] transition-colors text-left truncate w-full"
                  style={{ color: '#e8eeff' }}
                >
                  {asset.name}
                </button>
              ) : (
                <p className="text-[13px] font-medium truncate" style={{ color: '#e8eeff' }}>{asset.name}</p>
              )}
              <p className="text-[11px]" style={{ color: '#3d5475' }}>
                {asset.type === 'folder' ? `${asset.item_count ?? '—'} items` : formatBytes(asset.filesize)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {asset.type === 'folder' && (
                <button onClick={() => loadFolder(asset.id, asset.name)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4" style={{ color: '#00B7FF' }} />
                </button>
              )}
              {asset.download_url && (
                <a
                  href={asset.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" style={{ color: '#00B7FF' }} />
                </a>
              )}
              {asset.stream_url && (
                <a
                  href={asset.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium px-2 py-0.5 rounded border"
                  style={{ color: '#00B7FF', borderColor: 'rgba(0,183,255,0.3)', background: 'rgba(0,183,255,0.08)' }}
                >
                  View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {view === 'assets' && (
        <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: '#162035' }}>
          <button
            onClick={() => breadcrumbs.length > 1 ? handleBreadcrumb(breadcrumbs.length - 2) : (setView('projects'), setBreadcrumbs([]))}
            className="flex items-center gap-1 text-[12px] transition-colors hover:text-[#00B7FF]"
            style={{ color: '#3d5475' }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <span className="text-[11px]" style={{ color: '#2d4060' }}>{assets.length} items</span>
        </div>
      )}
    </div>
  )
}
