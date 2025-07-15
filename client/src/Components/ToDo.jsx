import { useState } from "react";

function ToDo() {

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        // setTasks(newTask)
        let tsks = tasks;
        tsks.push(newTask);
        setTasks(tsks);
        setNewTask("");
    }

    function deleteTask(index) {
        const updated = tasks.filter((element, i) => i !== index);
        setTasks(updated);

    }

    function moveTaskUp(index) {

    }

    function moveTaskUp(index) {

    }


    return(
        <div className="flex flex-col items-center">
            <h1 className="font-bold m-2 text-5xl">To Do List</h1>
            <div>
                <input 
                    name="to-do-list-item" 
                    placeholder="Enter something to do"
                    value={newTask}
                    type="text"
                    onChange={handleInputChange}/>
                <button 
                    onClick={addTask}
                    className="border-1 rounded-md bg-indigo-400 px-2 hover:bg-indigo-200 active:bg-indigo-600 cursor-pointer">
                    Add
                </button>
            </div>
            <div>
                <ol>
                    {tasks.map((task, index) =>
                        <li key={index}>
                            <button
                                className="mx-1 hover:drop-shadow-2xl"
                                onClick={() => deleteTask(index)}>
                                    X</button>
                            <span
                                className="mx-2">{task}</span>
                            
                                
                                
                        </li>
                    )}
                </ol>
            </div>
        </div>

    )

}
export default ToDo