import React from 'react'
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
    // TODO: Second argument of React.Component.constructor is context
    component = new element.type(element.props, null, new UpdateQueue(key, element))

    component.updater.enqueueWillMount(component)

    cache.components[key] = component
  } else {
    component.updater.enqueueWillReceiveProps(component, element.props)
  }

  return component.render(component.props, component.state)
}

function getPropList (props)  {
  let pairs = []

  for (let key in props) {
    if (key === 'children') {
      continue
    }

    let value = props[key]

    // Lowercase keys for events
    pairs.push(typeof value === 'function' ? key.toLowerCase() : key, value)
  }

  return pairs
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

  let pairs = getPropList(element.props)
  let children = element.props.children

  if (children) {
    elementOpen(element.type, key, null, ...pairs)

    React.Children.forEach(children, function rasterizeChild (child, i) {
      rasterize(child, `${key}.${child.key != null ? child.key : i}`)
    })

    elementClose(element.type)
  } else {
    elementVoid(element.type, element.key, null, ...pairs)
  }
}

export default {

  render (element, container, key='root') {
    patch(container, () => rasterize(element, key))
  }

}
