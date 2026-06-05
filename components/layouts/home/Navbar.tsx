export default function Navbar() {
  return (
    <nav className="flex items-center justify-between">
      
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0ea5a4] shadow-sm">
          <span className="text-2xl text-white">
            ♥
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[#0f172a]">
          Ebano
        </h1>
      </div>

      {/* LINKS */}
      <div className="hidden items-center gap-10 lg:flex">
        <a
          href="#"
          className="text-sm font-medium text-gray-700 transition hover:text-black"
        >
          Producto
        </a>

        <a
          href="#"
          className="text-sm font-medium text-gray-700 transition hover:text-black"
        >
          Precios
        </a>

        <a
          href="#"
          className="text-sm font-medium text-gray-700 transition hover:text-black"
        >
          Recursos
        </a>

        <a
          href="#"
          className="text-sm font-medium text-gray-700 transition hover:text-black"
        >
          Ayuda
        </a>

        <a
          href="#"
          className="text-sm font-medium text-gray-700 transition hover:text-black"
        >
          Nosotros
        </a>

        <a
          href="#"
          className="text-sm font-medium text-gray-700 transition hover:text-black"
        >
          Iniciar sesión
        </a>
      </div>

      {/* BUTTON */}
      <button className="rounded-full bg-[#0f172a] px-7 py-4 text-sm font-semibold text-white transition hover:scale-105">
        Prueba gratis
      </button>
    </nav>
  );
}