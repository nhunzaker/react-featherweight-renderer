import {notifications} from 'incremental-dom'

const components = {}
const owners = {}

function mount (node) {
  let key = node.__incrementalDOMData.key
  let component = components[key]

  if (component) {
    // Owner is the parent of the node. This is probably wrong, but it
    // keeps input focus!
    owners[key] = node.parentNode

    component.updater.enqueueMount(component)
  }
}

function unmount (node) {
  delete owner[node.__incrementalDOMData.key]
}

notifications.nodesCreated = function (nodes) {
  nodes.forEach(mount)
}

notifications.nodesDeleted = function (nodes) {
  nodes.forEach(unmount)
}

export default { components, owners }
