import React from 'react';
import TaskItem from './TaskItem';

// No seu TaskList.js, ajuste para usar IDs em vez de índices
function TaskList({ tasks, toggleTaskCompletion, deleteTask, editTask, loading }) {
    return (
        <ul className="task-list list-unstyled">
            {tasks.map((task, index) => (
                <TaskItem
                    key={task.id}  // Agora usando ID do banco
                    task={task}
                    index={index}
                    toggleTaskCompletion={toggleTaskCompletion}
                    deleteTask={deleteTask}
                    editTask={editTask}
                    loading={loading}
                />
            ))}
        </ul>
    );
}
export default TaskList;
