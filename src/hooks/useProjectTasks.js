import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useProjectTasks(projectId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setTasks(data)
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createTask = useCallback(
    async ({ title, priority, dueDate, parentTaskId = null }) => {
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert({
          project_id: projectId,
          parent_task_id: parentTaskId,
          title,
          priority,
          due_date: dueDate || null,
        })
        .select()
        .single()
      if (insertError) throw new Error(insertError.message)
      await refresh()
      return data
    },
    [projectId, refresh],
  )

  const updateTaskStatus = useCallback(
    async (taskId, status) => {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
      if (updateError) throw new Error(updateError.message)
      await refresh()
    },
    [refresh],
  )

  const deleteTask = useCallback(
    async (taskId) => {
      const { error: deleteError } = await supabase.from('tasks').delete().eq('id', taskId)
      if (deleteError) throw new Error(deleteError.message)
      await refresh()
    },
    [refresh],
  )

  return { tasks, loading, error, refresh, createTask, updateTaskStatus, deleteTask }
}
