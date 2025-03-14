// import './App.css';
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "./store";
// import { increment, decrement, incrementByAmount } from "./store/slices/counterSlice";
// import { toggleTheme } from "./store/slices/themeSlice";
// import { addCategory, addSubCategory } from "./store/slices/categorySlice";
// import { useEffect, useRef, useState } from 'react';
// import { AdminMode } from './context/Priveleges';
// import { useGetTodosQuery, useDeleteTodoMutation } from "./store/api";

// function App() {
//   const { data: todos, error, isLoading } = useGetTodosQuery();
//   const [deleteTodo] = useDeleteTodoMutation(); // Hook untuk hapus todo

//   const [mode, setMode] = useState("admin");
//   const count = useSelector((state: RootState) => state.counter.value);
//   const darkMode = useSelector((state: RootState) => state.theme.darkMode);
//   const categories = useSelector((state: RootState) => state.category.categories);
//   const dispatch = useDispatch<AppDispatch>();
//   const [data, setData] = useState(null);
//   const [text, setText] = useState("");

//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus(); // Fokus ke input
//     }

//     fetch("https://jsonplaceholder.typicode.com/todos/1")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Result fetch: ", data);
//         setData(data);
//       });

//     return () => {
//       console.log("Clean up page"); // dulu componentWillUnmount
//     };
//   }, []);

//   if (isLoading) return <h1>Loading...</h1>;
//   if (error) return <h1>Error fetching todo</h1>;

//   return (
//     <AdminMode.Provider value={mode}>
//       <button onClick={() => setMode(mode === "admin" ? "user" : "admin")}>
//         Model: {mode}
//       </button>


//       <div>
//         <h1>Todos</h1>
//         <ul>
//           {todos.map((todo: any) => (
//             <div key={todo.id}>
//               <li key={todo.id}>ID: {todo.id}, title: {todo.title}</li>
//               <button
//                 onClick={() => {
//                   console.log("Menghapus Todo dengan ID:", todo.id);
//                   deleteTodo(todo.id);
//                 }}
//               >
//                 ❌ Hapus
//               </button>
//             </div>
//           ))}
//         </ul>
//       </div>

//       <div
//         style={{
//           textAlign: "center",
//           marginTop: "50px",
//           background: darkMode ? "#333" : "#fff",
//           color: darkMode ? "#fff" : "#000",
//           height: "100vh",
//           transition: "all 0.3s",
//           padding: 0,
//           margin: 0,
//         }}
//       >
//         <h1>Counter: {count}</h1>
//         <button onClick={() => dispatch(increment())}>+1</button>
//         <button onClick={() => dispatch(decrement())}>-1</button>
//         <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>

//         <hr style={{ margin: "20px 0" }} />

//         <h2>Theme: {darkMode ? "Dark Mode" : "Light Mode"}</h2>
//         <button onClick={() => dispatch(toggleTheme())}>
//           Toggle Theme
//         </button>


//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           <h1>Product Categories</h1>

//           {/* Tampilkan kategori dan sub-kategorinya */}
//           <ul>
//             {categories.map(category => (
//               <li key={category.id}>
//                 <strong>{category.name}</strong>
//                 <ul>
//                   {category.subcategories.map(sub => (
//                     <li key={sub.id}>{sub.name}</li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>

//           {/* Tambah Kategori Baru */}
//           <button onClick={() => dispatch(addCategory({ id: "3", name: "Books" }))}>
//             Add Category: Books
//           </button>

//           {/* Tambah Sub-Kategori di Electronics */}
//           <button onClick={() => dispatch(addSubCategory({ categoryId: "1", subId: "1-3", subName: "Tablets" }))}>
//             Add SubCategory: Tablets (to Electronics)
//           </button>
//         </div>
//         <div>
//           <input ref={inputRef} type="text" onChange={e => setText(e.target.value)} />
//           <div>{text}</div>
//         </div>
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//       </div>
//     </AdminMode.Provider>
//   );
// }

// export default App;