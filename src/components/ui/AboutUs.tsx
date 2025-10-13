import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <section className="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-black text-5xl md:text-6xl font-bold z-10 text-center drop-shadow-lg"
        >
          Sobre Nosotros
        </motion.h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Pasión por la Comida Rápida
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
        >
          Somos una cadena de comida rápida moderna que nació con una idea
          simple: servir platos deliciosos, frescos y con la mejor atención.
          Nuestro objetivo es ofrecer una experiencia única donde la calidad y
          la velocidad se combinan para satisfacer tu apetito al instante.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Nuestros Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Calidad",
              desc: "Seleccionamos ingredientes frescos y locales para ofrecerte el mejor sabor en cada bocado.",
              icon: "🍔",
            },
            {
              title: "Velocidad",
              desc: "Sabemos que tu tiempo vale oro, por eso preparamos cada pedido en cuestión de minutos.",
              icon: "⚡",
            },
            {
              title: "Pasión",
              desc: "Nuestro equipo vive y respira comida rápida — pero de calidad — todos los días.",
              icon: "🔥",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}