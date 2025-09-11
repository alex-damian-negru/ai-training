import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Table,
  Badge,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { Plus, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

// Import backend types (adjust path if needed, or define locally/shared)
// Assuming types might be manually defined or generated elsewhere if not directly importable
// For demonstration, let's define simplified versions inline or assume they exist
// import { ExampleTask, TaskStatus, TaskPriority } from "../../../../../backend/src/types/prisma-types"; // Keep commented out

import { fetchApi } from "../../../utils/apiClient"; // Path should be correct relative to new location

// UNCOMMENTED: Manual type definitions based on Prisma schema:
enum TaskStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}
interface ExampleTask {
  id: string;
  name: string;
  assignedToName: string | null;
  assignedToAvatar: string | null;
  dueDate: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string; // Dates will be strings from JSON
  updatedAt: string;
}

const priorityVariantMap: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "success",
  [TaskPriority.MEDIUM]: "warning",
  [TaskPriority.HIGH]: "danger",
};

const statusMap: Record<TaskStatus, string> = {
  [TaskStatus.UPCOMING]: "Upcoming",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.COMPLETED]: "Completed",
};

interface TaskTableProps {
  tasks: ExampleTask[];
  onViewTask: (taskId: string) => void;
  onDeleteTask: (task: ExampleTask) => void;
  deletingTasks: Set<string>;
}

const TaskTable = ({ tasks, onViewTask, onDeleteTask, deletingTasks }: TaskTableProps) => {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th className="align-middle w-25px">
          </th>
          <th className="align-middle w-50">Name</th>
          <th className="align-middle d-none d-xl-table-cell">Assigned To</th>
          <th className="align-middle d-none d-xxl-table-cell">Created</th>
          <th className="align-middle">Priority</th>
          <th className="align-middle text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className={deletingTasks.has(task.id) ? 'opacity-50' : ''}>
            <td>
            </td>
            <td>
              <strong>{task.name}</strong>
            </td>
            <td className="d-none d-xl-table-cell">{task.assignedToName || '-'}</td>
            <td className="d-none d-xxl-table-cell">{new Date(task.createdAt).toLocaleDateString()}</td>
            <td>
              <Badge bg="" className={`badge-subtle-${priorityVariantMap[task.priority]}`}>
                {task.priority}
              </Badge>
            </td>
            <td className="text-end">
              {" "}
              <Button variant="light" size="sm" onClick={() => onViewTask(task.id)} disabled={deletingTasks.has(task.id)}>View</Button>{" "}
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => onDeleteTask(task)}
                disabled={deletingTasks.has(task.id)}
                className="ms-1"
                aria-label={`Delete task ${task.name}`}
              >
                {deletingTasks.has(task.id) ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  <Trash2 size={14} />
                )}
              </Button>{" "}
            </td>
          </tr>
        ))}
        {tasks.length === 0 && (
            <tr>
                <td colSpan={6} className="text-center p-3">No tasks in this category.</td>
            </tr>
        )}
      </tbody>
    </Table>
  );
};

interface TaskBoardProps {
  title: string;
  tasks: ExampleTask[];
  onViewTask: (taskId: string) => void;
  onDeleteTask: (task: ExampleTask) => void;
  deletingTasks: Set<string>;
  onNewTask?: () => void;
}

const TaskBoard = ({ title, tasks, onViewTask, onDeleteTask, deletingTasks, onNewTask }: TaskBoardProps) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="mb-2">
          <Col xs={6}>
            <Card.Title as="h5">{title}</Card.Title>
          </Col>
          <Col xs={6}>
            <div className="text-sm-end">
              <Button
                variant="primary"
                size="sm"
                onClick={onNewTask}
              >
                <Plus size={18} /> New Task
              </Button>
            </div>
          </Col>
        </Row>
        <TaskTable tasks={tasks} onViewTask={onViewTask} onDeleteTask={onDeleteTask} deletingTasks={deletingTasks} />
      </Card.Body>
    </Card>
  );
};

const ExerciseTaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ExampleTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showIntroAlert, setShowIntroAlert] = useState<boolean>(true);
  
  // Modal state management
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    priority: TaskPriority.MEDIUM
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Deletion state management
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<ExampleTask | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTasks = await fetchApi<ExampleTask[]>('/exercises/tasks');
        setTasks(fetchedTasks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const upcomingTasks = tasks.filter((task) => task.status === TaskStatus.UPCOMING);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED);

  const handleViewTask = (taskId: string) => {
    navigate(`/exercises/tasks/${taskId}`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      priority: TaskPriority.MEDIUM
    });
    setValidationErrors({});
    setCreateError(null);
  };

  const handleNewTask = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Task name is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string | TaskPriority) => {
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    setFormData(prev => ({ ...prev, [field]: trimmedValue }));
    // Clear errors when user starts typing
    if (createError) {
      setCreateError(null);
    }
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const createTask = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        priority: formData.priority
      };

      const response = await fetchApi<ExampleTask>('/exercises/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response) {
        // Add the new task to the current tasks list
        setTasks(prev => [...prev, response]);
        handleCloseModal();
      } else {
        setCreateError('Failed to create task');
      }
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTask = (task: ExampleTask) => {
    setTaskToDelete(task);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
    setDeleteError(null);
  };

  const deleteTask = async () => {
    if (!taskToDelete) return;
    
    const taskId = taskToDelete.id;
    
    // Add to deleting set
    setDeletingTasks(prev => new Set([...Array.from(prev), taskId]));
    setDeleteError(null);
    
    // Optimistically remove from UI
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    try {
      await fetchApi(`/exercises/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      // Success - close modal
      handleCloseDeleteModal();
    } catch (error) {
      let errorMessage = 'Failed to delete task. Please try again.';
      
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes('404') || error.message.includes('not found')) {
          // Task not found - it was already deleted, don't rollback
          errorMessage = 'Task not found. It may have been deleted already.';
          handleCloseDeleteModal();
          return;
        } else if (error.message.includes('500') || error.message.includes('server')) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Rollback on error - add task back to UI
      setTasks(prev => [...prev, taskToDelete].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      setDeleteError(errorMessage);
    } finally {
      // Remove from deleting set
      setDeletingTasks(prev => {
        const next = new Set(Array.from(prev));
        next.delete(taskId);
        return next;
      });
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Task List Exercise" />
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Task List Exercise</h1>

        {/* Introductory Blurb */}
        {showIntroAlert && (
          <Alert 
            variant="primary" 
            className="alert-outline"
            onClose={() => setShowIntroAlert(false)}
            dismissible
          >
            <div className="alert-icon">
              <FontAwesomeIcon icon={faBell} fixedWidth />
            </div>
            <div className="alert-message">
              <strong>Welcome to the Task List Exercise!</strong>
              <p className="mb-2">
                This page demonstrates a basic task list connected to a backend API. 
                The tasks you see below are fetched live from the database via 
                <code>/api/exercises/tasks</code>.
              </p>
              <p className="mb-1">
                While the read functionality is complete, there are still features 
                to implement as outlined in the project plan (
                <a href="/docs/plans/01-Task-Exercise-API.md" target="_blank" rel="noopener noreferrer"><code>docs/plans/01-Task-Exercise-API.md</code></a>).
                Your next steps are to implement the following, using AI assistance:
              </p>
              <ul>
                <li>Connect the 'New Task' button to the POST endpoint.</li>
                <li>Implement functionality to update task status (mark complete/incomplete) via the PUT endpoint.</li>
                <li>Implement functionality to delete tasks via the DELETE endpoint.</li>
                <li>Replace the 'View' button with an 'Edit' button and implement task editing functionality.</li>
              </ul>
            </div>
          </Alert>
        )}

        {isLoading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <>
            <TaskBoard title={statusMap[TaskStatus.UPCOMING]} tasks={upcomingTasks} onViewTask={handleViewTask} onDeleteTask={handleDeleteTask} deletingTasks={deletingTasks} onNewTask={handleNewTask} />
            <TaskBoard title={statusMap[TaskStatus.IN_PROGRESS]} tasks={inProgressTasks} onViewTask={handleViewTask} onDeleteTask={handleDeleteTask} deletingTasks={deletingTasks} />
            <TaskBoard title={statusMap[TaskStatus.COMPLETED]} tasks={completedTasks} onViewTask={handleViewTask} onDeleteTask={handleDeleteTask} deletingTasks={deletingTasks} />
          </>
        )}

        {/* Create Task Modal */}
        <Modal show={showCreateModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createError && (
              <Alert variant="danger">
                <strong>Error:</strong> {createError}
              </Alert>
            )}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Task Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  isInvalid={!!validationErrors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                >
                  <option value={TaskPriority.LOW}>Low</option>
                  <option value={TaskPriority.MEDIUM}>Medium</option>
                  <option value={TaskPriority.HIGH}>High</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseModal}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={createTask}
              disabled={isCreating || !formData.name.trim()}
            >
              {isCreating ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Task Confirmation Modal */}
        <Modal 
          show={showDeleteModal} 
          onHide={handleCloseDeleteModal}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-body"
        >
          <Modal.Header closeButton>
            <Modal.Title id="delete-modal-title">Delete Task?</Modal.Title>
          </Modal.Header>
          <Modal.Body id="delete-modal-body">
            {deleteError && (
              <Alert variant="danger" role="alert">
                <strong>Error:</strong> {deleteError}
              </Alert>
            )}
            {taskToDelete && (
              <div>
                <p>
                  Are you sure you want to delete <strong>"{taskToDelete.name}"</strong>?
                </p>
                <p className="text-muted mb-0">
                  This action cannot be undone.
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseDeleteModal}
              disabled={taskToDelete ? deletingTasks.has(taskToDelete.id) : false}
              aria-label="Cancel task deletion"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={deleteTask}
              disabled={taskToDelete ? deletingTasks.has(taskToDelete.id) : true}
              aria-label={taskToDelete ? `Confirm deletion of ${taskToDelete.name}` : 'Confirm task deletion'}
            >
              {taskToDelete && deletingTasks.has(taskToDelete.id) ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Deleting...
                </>
              ) : (
                'Delete Task'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </React.Fragment>
  );
};

export default ExerciseTaskList; 