import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useProject(projectId) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setProject(data)
    }
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { project, loading, error, refresh }
}
