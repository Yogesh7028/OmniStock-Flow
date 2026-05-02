import LoaderAnimation from "../animations/LoaderAnimation";

function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600">
      <LoaderAnimation />
      <span>{text}</span>
    </div>
  );
}

export default Loader;
