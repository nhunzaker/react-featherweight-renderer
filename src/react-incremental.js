 import {
   elementOpen,
   elementClose,
   elementVoid,
   text,
   patch
 } from 'incremental-dom'

import UpdateQueue from './update-queue'
import Cache from './cache'

let toMount = []

function renderComponent (element, owner, root, key) {
  let component = Cache.get(key)

  if (component == null) {
    component = new element.type(element.props, null, new UpdateQueue(owner, root))

    component.updater.enqueueWillMount(component)

    Cache.set(key, component)

    toMount.push(component)
  } else {
    component.updater.enqueueWillReceiveProps(component, element.props)
  }

  let tree = component.render(component.props, component.state)

  rasterize(tree, owner, root, key)
}

export function rasterize (element, owner, root, key) {
  if (element == null) {
    return
  } else if (typeof element === 'string') {
    text(element)
    return
  } else if (typeof element.type === 'function') {
    renderComponent(element, owner, root, key)
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

  let children = element.props.children

  if (children) {
    elementOpen(element.type, key, null, ...pairs)

    if (Array.isArray(children)) {
      children.forEach(function rasterizeChild (child, i) {
        rasterize(child, owner, root, `${key}.${child.key != null ? child.key : i}`)
      })
    } else if (children != null) {
      rasterize(children, owner, root, children.key != null ? child.key : '0')
    }

    elementClose(element.type)
  } else {
    elementVoid(element.type, element.key, element, ...pairs)
  }
}

export default {

  render (element, container) {
    patch(container, () => {
      rasterize(element, element, container, 'root')

      while (toMount.length) {
        let component = toMount.shift()

        component.updater.enqueueMount(component)
      }
    })
  }
}
