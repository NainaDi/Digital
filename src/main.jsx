import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Leaf, ShoppingBag, Sparkles } from 'lucide-react';
import './styles.css';

const products = [
  ['Char Bagh Kurta Set', 'Heritage-inspired everyday set', '₹8,900'],
  ['Fitoor Co-ord Set', 'Relaxed hand-crafted separates', '₹7,600'],
  ['Padmini Dress', 'Soft festive silhouette', '₹6,950'],
  ['Aprajita Odhani', 'Lightweight finishing layer', '₹3,400'],
];

const categories = ['Kurta Sets', 'Dresses', 'Co-ord Sets', 'Shirts', 'Skirts', 'Trousers'];

function App() {
  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#home">Ode to Odd</a>
        <div className="navLinks">
          <a href="#collection">Collection</a>
          <a href="#journal">Story</a>
          <a href="#shop">Shop</a>
        </div>
        <ShoppingBag aria-hidden="true" />
      </nav>

      <section id="home" className="hero">
        <div className="heroCopy">
          <p className="eyebrow"><Sparkles size={16} /> Char Bagh Collection</p>
          <h1>Slow fashion for beautifully imperfect days.</h1>
          <p>
            A polished static storefront preview built from the latest repository files. The uploaded source contained AppleDouble metadata files, so this Vite app provides a runnable web preview while preserving the brand direction.
          </p>
          <a className="button" href="#shop">Explore the edit <ArrowRight size={18} /></a>
        </div>
        <div className="heroCard" aria-label="Collection mood card">
          <div className="sun" />
          <h2>Rooted in craft</h2>
          <p>Natural textures, botanical color, and airy silhouettes arranged for a commerce-ready digital impression.</p>
        </div>
      </section>

      <section id="collection" className="categories">
        <p className="eyebrow"><Leaf size={16} /> Shop by category</p>
        <div className="categoryGrid">
          {categories.map((category) => <article key={category}>{category}</article>)}
        </div>
      </section>

      <section id="shop" className="products">
        <div className="sectionTitle">
          <p className="eyebrow">Featured pieces</p>
          <h2>Collection highlights</h2>
        </div>
        <div className="productGrid">
          {products.map(([name, desc, price], index) => (
            <article className="product" key={name}>
              <div className="productImage">{String(index + 1).padStart(2, '0')}</div>
              <h3>{name}</h3>
              <p>{desc}</p>
              <strong>{price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section id="journal" className="story">
        <p className="eyebrow">Digital setup</p>
        <h2>Website type: Vite React single-page storefront.</h2>
        <p>Run it locally with <code>npm run dev -- --port 5173</code>, then open the local preview URL printed by Vite.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
