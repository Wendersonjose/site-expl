// src/components/Modal.jsx

function Modal({ titulo, children, onFechar }) {
  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal
