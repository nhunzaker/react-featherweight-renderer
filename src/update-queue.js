import ReactIncremental from './react-incremental'
import {patch} from 'incremental-dom'
import cache from './cache'

export default class Updater {

  constructor (key, element) {
    this.key = key
    this.element = element
  }

  isMounted (instance) {
    return instance._mounted
  }

  enqueueWillMount (instance) {
    if (instance.componentWillMount) {
      instance.componentWillMount()
    }
  }

  enqueueMount (instance) {
    instance._mounted = true

    if (instance.componentDidMount) {
      instance.componentDidMount()
    }
  }

  enqueueProps (instance, props) {
    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(props)
    }
  }

  enqueueWillReceiveProps (instance, props) {
    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(props)
    }

    instance.props = props
  }

  update (instance) {
    ReactIncremental.render(this.element, cache.owner.get(this.key), this.key)
  }

  enqueueForceUpdate (instance) {
    this.update(instance)
  }

  enqueueReplaceState (instance, state) {
    if (!instance.shouldComponentUpdate || instance.shouldComponentUpdate(instance.props, state)) {
      instance.state = state

      this.update(instance)
    }
  }

  enqueueSetState (instance, state) {
    let next = Object.assign({}, instance.state, state)

    if (!instance.shouldComponentUpdate || instance.shouldComponentUpdate(instance.props, next)) {
      instance.state = next

      this.update(instance)
    }
  }

}
