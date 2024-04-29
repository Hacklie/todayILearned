import "./style.css";
import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import supabase from "./supabase";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(`all`);

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");
        if (currentCategory !== `all`)
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order(`votesInteresting`, { ascending: false })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert("There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header setIsOpen={setIsOpen} isOpen={isOpen} />
      <NewFactForm isOpen={isOpen} setFacts={setFacts} setIsOpen={setIsOpen} />
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}
export default App;

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ setIsOpen, isOpen }) {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="todayILearned Logo" />
        <h1>todayILearned</h1>
      </div>
      <button
        className="btn btn-large share-button"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        {!isOpen ? `Share a fact` : `Close`}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ isOpen, setFacts, setIsOpen }) {
  const [text, setText] = useState(``);
  const [source, setSource] = useState(``);
  const [category, setCategory] = useState(``);
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    // 1. Prevent browser reload
    e.preventDefault();

    // 2. Check if data is valid. If so, create a new fact
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // 3. Create a new fact Object
      // const newFact = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };
      // 3. Upload fact to supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from(`facts`)
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      // 4. Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      // 5. Reset input fields
      setText(``);
      setSource(`http://example.com`);
      setCategory(``);

      // 6. Close the form
      setIsOpen(false);
    }
  }

  return (
    <>
      {isOpen && (
        <form className="fact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Share a fact with the world..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isUploading}
          />
          <span>{200 - textLength}</span>
          <input
            value={source}
            type="text"
            placeholder="Trustworthy source..."
            onChange={(e) => setSource(e.target.value)}
            disabled={isUploading}
          />
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isUploading}
          >
            <option value="">Choose category:</option>
            {CATEGORIES.map((cat) => {
              return (
                <option value={cat.name} key={cat.name}>
                  {cat.name.toUpperCase()}
                </option>
              );
            })}
          </select>
          <button className="btn btn-large" disabled={isUploading}>
            Post
          </button>
        </form>
      )}
    </>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory(`all`)}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.length !== 0 ? (
          facts.map((fact) => (
            <Fact fact={fact} setFacts={setFacts} key={fact.id} />
          ))
        ) : (
          <p className="message">
            No facts for this category yet! Create the first one ✌️
          </p>
        )}
      </ul>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from(`facts`)
      .update({ [columnName]: fact[columnName] + 1 })
      .eq(`id`, fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔️ DISPUTED]</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            ?.color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote(`votesInteresting`)}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote(`votesMindblowing`)}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote(`votesFalse`)} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}
