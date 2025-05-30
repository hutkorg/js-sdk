import { isFunction, forEach } from './utils.js'

const PENDING = 0
const RESOLVED = 1
const REJECTED = 2
const PROGRESS = 3

export function Deferred() {
  const resolveCallbacks = []
  const rejectCallbacks = []
  const notifyCallbacks = []
  let status = PENDING
  let resultContext = undefined
  let resultArgs = null
  let chainArgs = null
  const executeCallback = (context, args, callbacks) => {
    const list = [].concat(callbacks)
    const save = (chainArgs, isArgs) => {
      if (isArgs) {
        resultArgs = Array.from(chainArgs)
      } else {
        resultArgs = [chainArgs]
      }
    }
    const execute = () => {
      const item = list.shift()
      if (item) {
        chainArgs = item.apply(resultContext, resultArgs)
        if (chainArgs !== undefined) {
          if (chainArgs && chainArgs.then) {
            chainArgs.then((...chainArgs) => {
              save(chainArgs, true)
              execute()
            })
          } else {
            save(chainArgs)
            execute()
          }
        } else {
          execute()
        }
      }
    }
    resultContext = context
    resultArgs = args
    execute()
  }
  /**
   * @lends Deferred.prototype
   */
  const promise = {
    done(callback) {
      if (isFunction(callback)) {
        if (status === RESOLVED) {
          callback.apply(resultContext, resultArgs)
        }
        resolveCallbacks.push(callback)
      }
      return this
    },
    fail(callback) {
      if (isFunction(callback)) {
        if (status === REJECTED) {
          callback.apply(resultContext, resultArgs)
        }
        rejectCallbacks.push(callback)
      }
      return this
    },
    progress(callback) {
      if (isFunction(callback)) {
        if (status === PROGRESS) {
          callback.apply(resultContext, resultArgs)
        }
        notifyCallbacks.push(callback)
      }
      return this
    },
    always(callback) {
      return this.done(callback).fail(callback)
    },
    then(resolve, reject, progress) {
      if (isFunction(resolve)) {
        this.done(resolve)
      }
      if (isFunction(reject)) {
        this.fail(reject)
      }
      if (isFunction(progress)) {
        this.progress(reject)
      }
      return this
    },
    promise(object) {
      if (object === null) {
        return promise
      }
      forEach(promise, (item, prop) => {
        object[prop] = item
      })
      return object
    },
    state: function () {
      return status
    },
    isPending() {
      return status === PENDING
    },
    isRejected() {
      return status === REJECTED
    },
    isResolved() {
      return status === RESOLVED
    },
    resetState() {
      status = PENDING
      return this
    },
    resolveWith(context, args) {
      if (status === PENDING) {
        status = RESOLVED
        executeCallback(context, args, resolveCallbacks)
      }
      return this
    },
    rejectWith(context, args) {
      if (status === PENDING) {
        status = REJECTED
        executeCallback(context, args, rejectCallbacks)
      }
      return this
    },
    notifyWith(context, args) {
      if (status === PENDING) {
        status = PROGRESS
        executeCallback(context, args, notifyCallbacks)
        status = PENDING
      }
      return this
    },

    resolve() {
      return this.resolveWith(this, Array.from(arguments))
    },
    reject() {
      return this.rejectWith(this, Array.from(arguments))
    },
    notify() {
      return this.notifyWith(this, Array.from(arguments))
    },
  }
  return promise
}
