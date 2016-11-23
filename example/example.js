import React from 'react'
import ReactIncremental from '../src/react-incremental'

class List extends React.Component {

  renderItem (text, i) {
    return (
      <li key={i}>
        {text} <button type="button" onClick={() => this.props.onDelete(i)}>x</button>
      </li>
    )
  }

  render ({ items }) {
    return (
      <ul class="items">
        {items.map(this.renderItem, this)}
      </ul>
    )
  }
}

class Example extends React.Component {
  state = {
    todos: []
  }

  onDelete = (position) => {
    this.setState({
      todos: this.state.todos.filter((_, index) => index !== position)
    })
  }

  onSubmit = event => {
    let form = event.target

    event.preventDefault()

    this.setState({
      todos: this.state.todos.concat(form.elements['task'].value)
    })

    form.reset()
  }

  render (_, { todos }) {
    return (
      <form onSubmit={this.onSubmit}>
        <List items={todos} onDelete={this.onDelete} />
        <label for="task">Task</label>
        <input id="task" name="task" />
        <button>Submit</button>
      </form>
    )
  }
}

ReactIncremental.render(<Example />, document.getElementById('app'))
