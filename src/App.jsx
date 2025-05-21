import React, { useState, useEffect } from 'react';

const API = 'http://localhost:3000/api/book';

const App = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', publishedYear: '' });
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setBooks(data);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const body = { ...form, publishedYear: new Date(form.publishedYear) };

    const res = await fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 
        'Content-Type': 'application/json'
       },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setForm({ title: '', author: '', publishedYear: '' });
      setEditingId(null);
      fetchBooks();
    }
  };

  const handleEdit = book => {
    setForm({
      title: book.title,
      author: book.author,
      publishedYear: new Date(book.publishedYear).getFullYear()
    });
    setEditingId(book._id);
  };

  const handleDelete = async id => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  const handleImport = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    await fetch(`${API}/import`, {
      method: 'POST',
      body: formData
    });
    setFile(null);
    fetchBooks();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>📚 Book Manager</h2>

 
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title"
          style={{ padding: '0.5rem' }} />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author"
          style={{ padding: '0.5rem' }} />
        <input name="publishedYear" value={form.publishedYear} onChange={handleChange}
          placeholder="Published Year (e.g., 2020)" style={{ padding: '0.5rem' }} />
        <button onClick={handleSubmit} style={{
          gridColumn: 'span 3',
          padding: '0.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none'
        }}>{editingId ? 'Update' : 'Add'} Book</button>
      </div>

  
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleImport} style={{
          padding: '0.5rem',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none'
        }}>Import CSV</button>
      </div>

     
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {books.map(book => (
          <div key={book._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Year:</strong> {new Date(book.publishedYear).getFullYear()}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={() => handleEdit(book)} style={{ padding: '0.3rem', backgroundColor: '#ffc107' }}>Edit</button>
              <button onClick={() => handleDelete(book._id)} style={{ padding: '0.3rem', backgroundColor: '#dc3545', color: '#fff' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
