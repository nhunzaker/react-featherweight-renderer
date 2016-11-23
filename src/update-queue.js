import Feather from './react-featherweight'
import {patch} from 'incremental-dom'

export default class Updater {

  constructor (owner, root) {
    this.owner = owner
    this.root = root
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
  }

  enqueueForceUpdate (instance) {
    Feather.render(this.owner, this.root)
  }

  enqueueReplaceState (instance, state) {
    if (!instance.shouldComponentUpdate || instance.shouldComponentUpdate(instance.props, state)) {
      instance.state = state

      this.enqueueForceUpdate()
    }
  }

  enqueueSetState (instance, state) {
    return this.enqueueReplaceState(instance, Object.assign({}, instance.state, state))
  }

}
