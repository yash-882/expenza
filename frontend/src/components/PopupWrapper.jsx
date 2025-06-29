import React from 'react'

function PopupWrapper(props) {
  return (
    <div
    className={`${props.hidden ? 'invisible' : 'visible'} d-flex justify-content-center px-4  flex-column align-items-center`}
    style={{
        width: '100%', 
        height: '100%', 
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        position: 'fixed',
        zIndex: 10000,
        top: 0,
        overflow:'auto'
    }}>
        {props.children}

    </div>
  )
}

export default PopupWrapper
