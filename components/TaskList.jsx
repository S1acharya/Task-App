import { useState } from "react";
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import Task from "@/components/Task";
// allow to work with functions like date etc 
import superjson from 'superjson';

// included at top level of list to avoid multiple imports for each task card
import "react-datepicker/dist/react-datepicker.css";

// needed for react-modal to work properly
Modal.setAppElement('body')

export default function TaskList({ tasksList }) {

    // initial list of tasks fetched from DB
    const [tasks, setTasks] = useState(tasksList);
    const [modalIsOpen, setIsOpen] = useState(false);

    // state for task modal information
    const [task, setTask] = useState({
        created_at: new Date(),
        completed_at: null,
        title: null,
        description: null,
        completed: false
    });

    // functions for closing and opening the modal
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = (event) => {
        event.stopPropagation();
        setIsOpen(false);
    }

    // event handler for saving/submitting a task
    const submitTask = async (event) => {
        event.preventDefault();
        setIsOpen(false);

        // POST request to internal api route which creates a task
        const res = await fetch('/api/create-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }).then(res => res.json());

        // update the task state data
        setTask(task => ({ ...task, id: res.id }))

        // append updated task state data into array of all tasks
        setTasks([...tasks, task]);

        // reset task data to initial state so that modal is a clean slate when adding a new task
        setTask({
            created_at: new Date(),
            completed_at: null,
            title: null,
            description: null,
            completed: false
        });
    }

    // event hanlder for fetching tasks in ascending completed_at order
    const sortTasks = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/sort-tasks').then(res => res.json());
        const taskJson = superjson.parse(res.tasks);

        // required since react doesn't re-paint
        setTasks([]);
        setTasks(taskJson);
    }

    // event handler which fetches tasks that are due for the end of day
    const limitTasks = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/limit-tasks').then(res => res.json());
        const taskJson = superjson.parse(res.tasks);
        setTasks(taskJson);
    }

    // event handler which fetches all tasks
    const allTasks = async (event) => {
        event.preventDefault();

        const res = await fetch('/api/all-tasks').then(res => res.json());
        const taskJson = superjson.parse(res.tasks);
        setTasks([]);
        setTasks(taskJson);
    }

    return (
        <div>
            <div className="flex flex-row space-x-4">
                {/* Add button */}
                <button
                    className="bg-blue-500 hover:bg-green-700 text-white font-bold py-4 px-14 rounded"
                    onClick={openModal}
                >Add a Task</button>

                {/* Sort button */}
                <button
                    className="bg-red-500 hover:bg-yellow-700 text-white font-bold py-4 px-14 rounded"
                    onClick={sortTasks}
                >Sort Tasks</button>
                {/* <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={limitTasks}
                >Limit Tasks</button>
                <button
                    className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                    onClick={allTasks}
                >All Tasks</button> */}
            </div>


            {/* modal opens when user clicks on add a task button */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={true}
                contentLabel={"Add Task Modal"}
                overlayClassName="fixed inset-0 bg-opacity-75 m-auto bg-white"
                className="bg-gradient-to-r from-white to-gray-100 max-w-sm mx-auto my-36 
                rounded overflow-hidden shadow-2xl h-auto"
            >
                <h1 className="mt-2 ml-2 font-sans font-bold text-center text-lg">Create a Task</h1>
                <form>
                    <div className="flex flex-row p-2">

                        {/* take title input */}
                        <input className="bg-gray-200 outline-none p-1 mr-2 rounded flex-grow" onChange={e => setTask(task => ({ ...task, title: e.target.value }))} type="text" placeholder="Title" />


                        {/* takes date input */}
                        <DatePicker
                            className="bg-gray-200 outline-none p-1 rounded flex-none"
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Completion Date/Time"
                            selected={task.completed_at}
                            onChange={date => setTask(task => ({ ...task, completed_at: date }))} />
                    </div>


                    {/* takes description input */}
                    <input className="bg-gray-200 outline-none p-1 pb-16 m-2 rounded" onChange={e => setTask(task => ({ ...task, description: e.target.value }))} type="text" style={{ width: "97%" }} placeholder="Description" />


                    {/* button to add task */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-2 mb-2 rounded float-right"
                        onClick={submitTask}
                    >Add Task</button>
                </form>
            </Modal>


            {/* displays the list of tasks */}
            <div>
                {tasks.map((task, index) => <Task key={index} taskProps={task} />)}
            </div>
        </div>
    );
}