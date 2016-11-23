import React from 'react'
import Feather from '../src/react-featherweight'

class List extends React.Component {

  componentWillReceiveProps (props) {
    console.log('List will get', props)
  }

  componentWillMount () {
    console.log('List will mount')
  }

  componentDidMount () {
    console.log('List did mount')
  }

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

  componentWillMount () {
    console.log('Example will mount')
  }

  componentDidMount () {
    console.log('Example did mount')
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

Feather.render(<Example />, document.getElementById('app'))
