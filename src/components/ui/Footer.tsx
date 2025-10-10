export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 w-full">
      <div className="max-w-full mx-0 flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        {/* Logo / Marca */}
        <div className="text-lg font-semibold">FastFood</div>

        {/* Links */}
        <ul className="flex gap-6 text-sm">

        </ul>

        {/* Copy */}
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} FastFood. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}