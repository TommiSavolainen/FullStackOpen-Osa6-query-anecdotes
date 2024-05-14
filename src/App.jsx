import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import axios from 'axios'
import { getAnecdotes, voteAnecdote } from './requests'
import { useNotification } from './components/NotificationProvider'

const App = () => {
  const { showMessage } = useNotification()

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation(
    (anecdote) => {
      const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
      return voteAnecdote(anecdote.id, updatedAnecdote)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      },
    }
  )

  const handleVote = (anecdote) => {
    showMessage('You voted for :' + anecdote.content)
    updateAnecdoteMutation.mutate(anecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>Loading...</div>
  }
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data


  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification/>
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default App
