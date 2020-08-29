import React, { useState, useEffect } from "react";
import noteService from "./services/notes";
import loginService from "./services/login";

const OneNote = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

// const Note = ({ notes }) => {
//   // const { notes } = props;
//   window.console.log(notes, "notes");
//   return (
//     <div>
//       <h1>Notes</h1>
//       <ul>
//         {/* {notes.map((note, i) => (
//           <li key={i}>{note.content}</li>
//         ))} */}
//         {notes.map((note) => (
//           <OneNote key={note.id} note={note} />
//         ))}
//       </ul>
//     </div>
//   );
// };

const Note = () => {
  // uses the useState function to initialize the piece of state
  // stored in notes with the array of notes passed in the props
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log("effect");
    noteService
      .getAll()
      .then((initialNotes) => {
        console.log("promise fulfilled");
        console.log(initialNotes);
        setNotes(initialNotes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log("render", notes.length, "notes");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const toggleImportanceOf = (id) => {
    console.log("importance of " + id + " needs to be toggled");
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .updateOne(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const addNote = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);
    console.log(newNote);
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    noteService
      .createOne(noteObject)
      .then((returnedNote) => {
        console.log(returnedNote);
        setNotes(notes.concat(returnedNote));
        setNewNote("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNoteChange = (event) => {
    // console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with email", email);
    console.log("logging in with password", password);
    console.log("logging in with", email, password);

    try {
      const user = await loginService.login({
        email,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
      setEmail("");
      setPassword("");
      window.console.log(user, "user");
    } catch (err) {
      window.console.log(err.response, "err response");
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        email
        <input
          type="text"
          value={email}
          name="email"
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    // <button onSubmit={()=> loginService.logout()}>Logout</button>
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }

    return <div className="error">{message}</div>;
  };

  const Footer = () => {
    const footerStyle = {
      color: "green",
      fontStyle: "italic",
      fontSize: 16,
    };
    return (
      <div style={footerStyle}>
        <br />
        <em>
          Note app, Department of Computer Science, University of Helsinki 2020
        </em>
      </div>
    );
  };

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.email}</p>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      )}

      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <OneNote
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default Note;
