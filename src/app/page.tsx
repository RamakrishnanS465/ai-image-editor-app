// src/app/page.tsx
import Layout from '@/components/Layout.tsx';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
          Unleash Your Creativity with AI 🎨
        </h2>
        <p className="text-xl text-gray-600 text-center max-w-2xl mb-8">
          Transform your images with powerful AI tools. Remove objects, upscale photos, and more, all with a single click.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
          Get Started
        </button>
      </div>
    </Layout>
  );
}