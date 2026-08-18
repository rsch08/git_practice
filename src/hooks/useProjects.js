import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [tasksByProject, setTasksByProject] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })

    if (projectsError) {
      setError(projectsError.message)
      setLoading(false)
      return
    }

    const projectIds = projectsData.map((p) => p.id)
    let tasksData = []
    if (projectIds.length > 0) {
      const { data, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectIds)

      if (tasksError) {
        setError(tasksError.message)
        setLoading(false)
        return
      }
      tasksData = data
    }

    const grouped = {}
    for (const task of tasksData) {
      if (!grouped[task.project_id]) grouped[task.project_id] = []
      grouped[task.project_id].push(task)
    }

    setProjects(projectsData)
    setTasksByProject(grouped)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createProject = useCallback(
    async ({ name, priority, color }) => {
      const { error: insertError } = await supabase
        .from('projects')
        .insert({ name, priority, color })
      if (insertError) throw new Error(insertError.message)
      await refresh()
    },
    [refresh],
  )

  const deleteProject = useCallback(
    async (id) => {
      const { error: deleteError } = await supabase.from('projects').delete().eq('id', id)
      if (deleteError) throw new Error(deleteError.message)
      await refresh()
    },
    [refresh],
  )

  return { projects, tasksByProject, loading, error, refresh, createProject, deleteProject }
}
