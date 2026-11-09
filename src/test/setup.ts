import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

// jsdom does not implement native modal dialogs.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '')
  this.querySelector<HTMLElement>('[autofocus]')?.focus()
}
HTMLDialogElement.prototype.close = function () {
  if (!this.open) return
  this.removeAttribute('open')
  // Browsers queue close events, including those from StrictMode effect cleanup.
  window.setTimeout(() => this.dispatchEvent(new Event('close')), 0)
}
