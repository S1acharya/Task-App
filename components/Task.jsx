import { format } from 'date-fns';
import { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";

// icon for setting task as complete or not
import { IoStopOutline, IoCheckboxOutline } from 'react-icons/io5'

Modal.setAppElement('body')

export default function Task({ taskProps }) {

    // actual information about task, should be 1-to-1 with db
    const [task, setTask] = useState(taskProps);

    // temporary data from the modal when editing task
    const [tempTask, setTempTask] = useState(taskProps);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [visible, setVisible] = useState(true);

    const isLate = new Date() > task.completed_at;

    // functions for closing and opening the modal
    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = (event) => {
        event.stopPropagation();
        setIsOpen(false);
    }

    // event handler to update task with modal information
    const updateTask = async (event) => {
        event.preventDefault();
        setIsOpen(false);

        await fetch('/api/update-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempTask)
        });

        setTask(tempTask);
    }

    // event handler to delete task
    const deleteTask = async (event) => {
        event.preventDefault();
        setIsOpen(false);
        setVisible(false);

        await fetch('/api/delete-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempTask)
        });
    }

    // event handler for checkbox/button to deem a task complete
    const toggleCompleted = async (event) => {
        event.preventDefault();
        setTask(task => ({ ...task, completed: !task.completed }));

        await fetch('/api/update-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: task.id, completed: !task.completed })
        });
    }

    return (
        <div className={`${visible ? "flex" : "hidden"} flex-row`}>
            {/* to set task as coomplete */}
            <div className="w-4">
                <button className="mt-16" onClick={toggleCompleted}>
                    {task.completed ? <IoCheckboxOutline size={"1.5em"} /> : <IoStopOutline size={"1.5em"} />}
                </button>
            </div>


            {/* a button to open modal to update/delete. also displays data of task created */}
            <button className="m-2" onClick={openModal}>
                {/* show title of task with deadline to complete task*/}
                <div className="grid grid-cols-2 justify-start">
                    <h1 className="font-sans text-left text-2xl font-bold truncate max-w-lg">{task.title}</h1>
                    <h1 className={`${isLate ? "text-red-600" : "text-green-600"} font-sans text-left text-lg font-normal justify-self-end mt-2`}>{format(task.completed_at, "Pp")}</h1>
                </div>
                {/* shows description of task */}
                <div className="bg-gray-200 outline-none p-1 pb-16 rounded w-96">
                    <p className="text-left">{task.description}</p>
                </div>
                {/* show task was created at what time */}
                <p className="font-sans text-xs">Task created at {format(task.created_at, "Pp")}</p>
            </button>


            {/* below we create a form to update task */}
            {/* modal is box that appears on screen */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={true}
                contentLabel={"Edit Task Modal"}
                overlayClassName="fixed inset-0 bg-opacity-75 m-auto bg-white"
                className="bg-gradient-to-r from-white to-gray-100 max-w-sm mx-auto my-36 
                rounded overflow-hidden shadow-2xl h-auto"
            >
                <h1 className="mt-2 ml-2 font-sans font-bold text-center text-lg">Edit a Task</h1>
                <form>
                    <div className="flex flex-row p-2">

                        {/* input to update task name */}
                        <input
                            className="bg-gray-200 outline-none p-1 mr-2 rounded flex-grow"
                            onChange={e => setTempTask(tempTask => ({ ...tempTask, title: e.target.value }))}
                            type="text"
                            placeholder="Title"
                            value={tempTask.title} />


                        {/* input to update task */}
                        <DatePicker
                            className="bg-gray-200 outline-none p-1 rounded flex-none"
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Completion Date/Time"
                            selected={tempTask.completed_at}
                            onChange={date => setTempTask(tempTask => ({ ...tempTask, completed_at: date }))} />
                    </div>


                    {/* input to update description */}
                    <input
                        className="bg-gray-200 outline-none p-1 pb-16 m-2 rounded"
                        onChange={e => setTempTask(tempTask => ({ ...tempTask, description: e.target.value }))}
                        type="text"
                        style={{ width: "97%" }}
                        placeholder="Description"
                        value={tempTask.description} />

                        
                    {/* buttons to delete and update task */}
                    <div className="flex flex-row justify-between">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 mx-2 mb-2 rounded"
                            onClick={deleteTask}
                        >Delete Task</button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-2 mb-2 rounded float-right"
                            onClick={updateTask}
                        >Update Task</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}