import './App.css'
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa'
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  // Realtime fetch todos from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({
        id: doc.id, 
        todo: doc.data().todo
      })));
    });

    return () => unsubscribe();
  }, []);

  const setEdit = (index) => {
    setInput(todos[index].todo);
    setEditIndex(index);
  };

  // Add todo
  const addTodo = async () => {
    try {
      if (input.trim() !== '') {
        await addDoc(collection(db, 'todos'), { todo: input }); // Firestore me add
        setInput('');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Update todo
  const updateTodo = async () => {
    try {
      if (input.trim() !== '') {
        const todoId = todos[editIndex].id;
        const todoRef = doc(db, 'todos', todoId);
        await updateDoc(todoRef, { todo: input }); // Firestore me update
        setInput('');
        setEditIndex(-1);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Delete todo
  const deleteTodo = async (index) => {
    try {
      const todoId = todos[index].id;
      await deleteDoc(doc(db, 'todos', todoId)); // Firestore se delete
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-custom-background bg-center bg-cover">
      {/* Input Section */}
      <div className="bg-gray-100 p-6 rounded-2xl shadow-lg w-full max-w-lg lg:w-1/4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Todo App</h1>

        <div className="flex">
          <input
            type="text"
            placeholder="Add a todo"
            className="py-2 px-4 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={editIndex === -1 ? addTodo : updateTodo}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
          >
            {editIndex === -1 ? <FaPlus /> : <FaPencilAlt />}
          </button>
        </div>
      </div>

      {/* Todo List Section */}
      <div className="bg-gray-100 p-6 rounded-2xl shadow-lg w-full max-w-lg lg:w-1/4">
        <ul>
          {todos.length > 0 &&
            todos.map((todo, index) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md mb-3"
              >
                <span className="text-lg text-gray-800">{todo.todo}</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setEdit(index)}
                    className="mr-2 p-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => deleteTodo(index)}
                    className="p-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
