 import {
   elementOpen,
   elementClose,
   elementVoid,
   text,
   patch
 } from 'incremental-dom'

import UpdateQueue from './update-queue'

const instances = new Map()
const toMount = []

function renderComponent (element, owner, root) {
  let component = instances.get(element)

  if (component == null) {
    component = new element.type(element.props, null, new UpdateQueue(owner, root))

    component.updater.enqueueWillMount(component)

    instances.set(element, component)

    toMount.push(component)
  } else {
    component.updater.enqueueWillReceiveProps(element.props)
  }

  let tree = component.render(component.props, component.state)

  return rasterize(tree, owner)
}

function renderChildren (children, owner, root) {
  if (Array.isArray(children)) {
    children.forEach(child => rasterize(child, owner))
  } else if (children != null) {
    rasterize(children, owner)
  }
}

export function rasterize (element, owner, root) {
  if (element == null) {
    return
  } else if (typeof element === 'string') {
    text(element)
    return
  } else if (typeof element.type === 'function') {
    renderComponent(element, owner, root)
    return
  }

  let pairs = []

  for (let key in element.props) {
    if (key === 'children') {
      continue
    }

    let value = element.props[key]

    // Lowercase keys for events
    pairs.push(typeof value === 'function' ? key.toLowerCase() : key, value)
  }

  if (element.props.children) {
    elementOpen(element.type, element.key, element, ...pairs)
    renderChildren(element.props.children, owner, root)
    elementClose(element.type)
  } else {
    elementVoid(element.type, element.key, element, ...pairs)
  }
}

export default {

  render (element, container) {
    patch(container, () => {
      rasterize(element, element, container)

      while (toMount.length) {
        let component = toMount.shift()

        component.updater.enqueueMount(component)
      }
    })
  }
}
