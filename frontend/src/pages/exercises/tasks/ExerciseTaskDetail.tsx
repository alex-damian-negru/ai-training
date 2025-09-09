import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { fetchApi } from "../../../utils/apiClient";

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
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
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

const ExerciseTaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<ExampleTask | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) {
        setError('Task ID is required');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const fetchedTask = await fetchApi<ExampleTask>(`/exercises/tasks/${taskId}`);
        setTask(fetchedTask);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
        setTask(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  const handleBackClick = () => {
    navigate('/exercises/tasks/list');
  };

  return (
    <React.Fragment>
      <Helmet title="Task Details" />
      <Container fluid className="p-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">Task Details</h1>
          <Button variant="outline-secondary" onClick={handleBackClick}>
            <ArrowLeft size={18} className="me-2" />
            Back to Task List
          </Button>
        </div>

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

        {!isLoading && !error && task && (
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <h2>{task.name}</h2>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Status:</strong>
                  <div className="mt-1">
                    <Badge bg="" className={`badge-subtle-info`}>
                      {statusMap[task.status]}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <strong>Priority:</strong>
                  <div className="mt-1">
                    <Badge bg="" className={`badge-subtle-${priorityVariantMap[task.priority]}`}>
                      {task.priority}
                    </Badge>
                  </div>
                </Col>
              </Row>

              {task.description && (
                <Row className="mb-3">
                  <Col>
                    <strong>Description:</strong>
                    <p className="mt-1 mb-0">{task.description}</p>
                  </Col>
                </Row>
              )}

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Created:</strong>
                  <div className="mt-1">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </Col>
                <Col md={6}>
                  <strong>Last Updated:</strong>
                  <div className="mt-1">
                    {new Date(task.updatedAt).toLocaleString()}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <strong>Task ID:</strong>
                  <div className="mt-1">
                    <code>{task.id}</code>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    </React.Fragment>
  );
};

export default ExerciseTaskDetail;