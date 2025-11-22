import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

const mockToggleTaskCompletion = jest.fn();
const mockDeleteTask = jest.fn();
const mockEditTask = jest.fn();

describe('TaskList Component', () => {
    test('renders the list with no tasks', () => {
        render(<TaskList tasks={[]} toggleTaskCompletion={mockToggleTaskCompletion} deleteTask={mockDeleteTask} editTask={mockEditTask} />);
        expect(screen.getByTestId('task-list')).toBeInTheDocument();
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    test('renders a list of tasks', () => {
        const tasks = [
            { text: 'Task 1', completed: false },
            { text: 'Task 2', completed: true },
        ];

        render(<TaskList tasks={tasks} toggleTaskCompletion={mockToggleTaskCompletion} deleteTask={mockDeleteTask} editTask={mockEditTask} />);

        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
});
