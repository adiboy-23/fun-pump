function List({ toggleCreate }) {
  return (
    <div className="list">
      <h2>List New Token</h2>

      <form action="">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />

        <label htmlFor="ticker">Ticker</label>
        <input type="text" id="ticker" />

        <input type="submit" value="[ CREATE ]" />
      </form>

      <button onClick={toggleCreate}>[ Cancel ]</button>
    </div>
  );
}

export default List;