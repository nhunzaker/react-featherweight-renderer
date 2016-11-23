 import {
   elementOpen,
   elementClose,
   elementVoid,
   text,
   patch
 } from 'incremental-dom'

import UpdateQueue from './update-queue'
import cache from './cache'

function renderComponent (element, key) {
  let component = cache.components[key]

  if (component == null) {
    component = new element.type(element.props, null, new UpdateQueue(key, element))

    component.updater.enqueueWillMount(component)

    cache.components[key] = component
  } else {
    component.updater.enqueueWillReceiveProps(component, element.props)
  }

  return component.render(component.props, component.state)
}

function rasterize (element, key) {
  if (element == null) {
    return
  } else if (typeof element === 'string') {
    text(element)
    return
  } else if (typeof element.type === 'function') {
    element = renderComponent(element, key)
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

    // Note: Could use React.Children here, but the stack trace is pretty
    // deep. Keep it shallow...
    if (Array.isArray(children)) {
      children.forEach(function rasterizeChild (child, i) {
        rasterize(child, `${key}.${child.key != null ? child.key : i}`)
      })
    } else if (children != null) {
      rasterize(children, `${key}.${children.key != null ? children.key : 0}`)
    }

    elementClose(element.type)
  } else {
    elementVoid(element.type, element.key, element, ...pairs)
  }
}

export default {

  render (element, container, key='root') {
    patch(container, () => rasterize(element, key))
  }

}
