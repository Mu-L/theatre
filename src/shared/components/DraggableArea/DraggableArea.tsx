import React from 'react'
import createCursorLock from '../../utils/createCursorLock'
import noop from '$shared/utils/noop'

type Props = {
  children: React.ReactElement<HTMLElement | SVGElement>
  onDragStart?: (event: React.MouseEvent<HTMLElement | SVGElement>) => void
  onDragEnd?: (dragHappened: boolean) => void
  onDrag: (dx: number, dy: number, event: MouseEvent) => void
  shouldRegisterEvents?: boolean
  shouldReturnMovement?: boolean
  dontBlockMouseDown?: boolean
  lockCursorTo?: string
}

type State = {
  dragHappened: boolean
  startPos: {
    x: number
    y: number
  }
}

class DraggableArea extends React.PureComponent<Props, {}> {
  s: State
  getDeltas: (e: MouseEvent) => [number, number]
  relinquishCursorLock: () => void = noop

  constructor(props: Props) {
    super(props)
    this.s = {
      dragHappened: false,
      startPos: {
        x: 0,
        y: 0,
      },
    }
    if (props.shouldReturnMovement) {
      this.getDeltas = this.getMovements
    } else {
      this.getDeltas = this.getDistances
    }
  }

  render() {
    const shouldRegisterEvents =
      this.props.shouldRegisterEvents != null
        ? this.props.shouldRegisterEvents
        : true
    return shouldRegisterEvents
      ? React.cloneElement(this.props.children, {
          onMouseDown: this.dragStartHandler,
          onClickCapture: this.disableUnwantedClick,
        })
      : this.props.children
  }

  addDragListeners() {
    document.addEventListener('mousemove', this.dragHandler)
    document.addEventListener('mouseup', this.dragEndHandler)
  }

  removeDragListeners() {
    document.removeEventListener('mousemove', this.dragHandler)
    document.removeEventListener('mouseup', this.dragEndHandler)
  }

  disableUnwantedClick = (event: MouseEvent) => {
    if (this.s.dragHappened) {
      if (!this.props.dontBlockMouseDown) {
        event.stopPropagation()
        event.preventDefault()
      }
      this.s.dragHappened = false
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (
      newProps.lockCursorTo !== this.props.lockCursorTo &&
      this.s.dragHappened
    ) {
      this.relinquishCursorLock()
      this.relinquishCursorLock = noop
      if (newProps.lockCursorTo) {
        this.relinquishCursorLock = createCursorLock(newProps.lockCursorTo)
      }
    }
  }

  dragStartHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button !== 0) return
    if (!this.props.dontBlockMouseDown) {
      event.stopPropagation()
      event.preventDefault()
    }

    const {screenX, screenY} = event
    this.s.startPos = {x: screenX, y: screenY}
    this.s.dragHappened = false

    this.addDragListeners()
    this.props.onDragStart && this.props.onDragStart(event)
  }

  dragEndHandler = () => {
    this.removeDragListeners()

    this.props.onDragEnd && this.props.onDragEnd(this.s.dragHappened)
    this.relinquishCursorLock()
    this.relinquishCursorLock = noop
  }

  dragHandler = (event: MouseEvent) => {
    if (!this.s.dragHappened && this.props.lockCursorTo) {
      this.relinquishCursorLock = createCursorLock(this.props.lockCursorTo)
    }
    if (!this.s.dragHappened) this.s.dragHappened = true

    const deltas = this.getDeltas(event)
    this.props.onDrag(deltas[0], deltas[1], event)
  }

  getDistances(event: MouseEvent): [number, number] {
    const {startPos} = this.s
    return [event.screenX - startPos.x, event.screenY - startPos.y]
  }

  getMovements(event: MouseEvent): [number, number] {
    return [event.movementX, event.movementY]
  }

  componentWillUnmount() {
    this.relinquishCursorLock()
    this.relinquishCursorLock = noop
  }
}

export default DraggableArea
