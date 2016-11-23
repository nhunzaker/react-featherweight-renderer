import React from 'react'
import ReactIncremental from '../src/react-incremental'

class List extends React.Component {

  render ({ items }) {
    return (
      <ul class="items">
        {items.map((text, i) => <li key={i}>{text}</li>)}
      </ul>
    )
  }
}

class Example extends React.Component {
  state = {
    todos: []
  }

  onSubmit = event => {
    let form = event.target

    event.preventDefault()

    this.setState({
      todos: this.state.todos.concat(form.elements.item('task').value)
    })

    form.reset()
  }

  render (_, { todos }) {
    return (
      <form onSubmit={this.onSubmit}>
        <List items={todos} />
        <label for="task">Task</label>
        <input id="task" name="task" />
        <button>Submit</button>
      </form>
    )
  }
}

ReactIncremental.render(<Example />, document.getElementById('app'))
