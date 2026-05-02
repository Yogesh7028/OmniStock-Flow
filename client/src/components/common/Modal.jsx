import AnimatedModal from "../animations/AnimatedModal";

function Modal({ open, title, children, onClose }) {
  return (
    <AnimatedModal open={open}>
      <div className="glass-panel mx-auto w-full max-w-lg rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500">
            Close
          </button>
        </div>
        {children}
      </div>
    </AnimatedModal>
  );
}

export default Modal;
