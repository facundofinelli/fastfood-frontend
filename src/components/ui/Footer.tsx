export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 w-full">
      <div className="max-w-full mx-0 flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        <div className="text-lg font-semibold">FastFood</div>

        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} FastFood. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}