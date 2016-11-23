import {notifications} from 'incremental-dom'

const components = new Map()
const owner = new Map()

function mount (node) {
  let key = node.__incrementalDOMData.key
  let component = components.get(key)

  if (component) {
    // Owner is the parent of the node. This is probably wrong, but it
    // keeps input focus!
    owner.set(key, node.parentNode)

    component.updater.enqueueMount(component)
  }
}

function unmount (node) {
  owner.delete(node.__incrementalDOMData.key)
}

notifications.nodesCreated = function (nodes) {
  nodes.forEach(mount)
}

notifications.nodesDeleted = function (nodes) {
  nodes.forEach(unmount)
}

export default { components, owner }
