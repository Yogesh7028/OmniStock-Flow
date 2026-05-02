import { Globe2, Mail, MessageCircle, Send } from "lucide-react";

function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <h2 className="text-xl font-bold">OmniStock Flow</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Modern inventory, order, warehouse, supplier, payment, and invoice management for MERN teams.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Links</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <a href="#features" className="block hover:text-white">Features</a>
              <a href="#workflow" className="block hover:text-white">Workflow</a>
              <a href="#analytics" className="block hover:text-white">Analytics</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Social</h3>
            <div className="mt-4 flex gap-3">
              {[Globe2, MessageCircle, Send, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#contact"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-200 transition hover:bg-teal-600 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} OmniStock Flow. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
