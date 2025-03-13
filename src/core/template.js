import { ClassObject } from './class.js'

import * as Views from '../views/index.js'

function empty(name) {
  return function (data) {
    return ['template', name, 'not found'].join(' ')
  }
}

export const Template = ClassObject.extend({
  init(name) {
    this.view = Views[name] || empty(name)
  },
  render(data) {
    return this.view(data)
  },
})
