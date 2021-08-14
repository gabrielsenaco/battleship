function getShipImageClassName (verticalValue, horizontaValue, orientation) {
  return orientation === 'vertical' ? verticalValue : horizontaValue
}

function getValidBottomShipImage (orientation) {
  return getShipImageClassName(
    'bg-ship_bottom_vertical',
    'bg-ship_bottom_horizontal',
    orientation
  )
}

function getValidFrontShipImage (orientation) {
  return getShipImageClassName(
    'bg-ship_front_vertical',
    'bg-ship_front_horizontal',
    orientation
  )
}

function getValidBodyShipImage () {
  return 'bg-ship_body'
}

function getValidHittedShipImage () {
  return 'bg-ship_hitted'
}

function setShipComponentImage (component, maxlength, position, orientation) {
  component.className = 'ship-component'
  let className
  if (position === 0) {
    className = getValidFrontShipImage(orientation)
  } else if (position + 1 === maxlength) {
    className = getValidBottomShipImage(orientation)
  } else {
    className = getValidBodyShipImage()
  }
  component.classList.add(className)
}

export {
  setShipComponentImage,
  getValidBodyShipImage,
  getValidFrontShipImage,
  getValidBottomShipImage,
  getShipImageClassName,
  getValidHittedShipImage
}
