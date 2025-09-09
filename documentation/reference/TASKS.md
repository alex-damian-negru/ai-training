# Task System Documentation

Task management functionality that provides CRUD operations for tasks with status tracking, priority management, and detailed views across both backend API and frontend interfaces.

## See Also

- `docs/plans/01-Task-Example-API.md` - implementation planning and decisions for the task API
- `documentation/planning/completed/250909a_connect_new_task_button.md` - task creation implementation
- `documentation/planning/completed/250909b_task_status_update.md` - status update functionality implementation  
- `documentation/planning/completed/250909c_task_deletion.md` - task deletion functionality implementation
- `documentation/planning/completed/250909d_task_editing.md` - task editing functionality implementation
- `docs/processes/API_DEVELOPMENT_STANDARDS.md` - API development standards that use this task system as a reference implementation
- `docs/QUICKSTART.md` - project setup guide including database migration steps for task system
- `README.md` - main project overview highlighting the task management example
- `backend/prisma/schema.prisma` - database schema defining task model, enums, and relationships  
- `backend/src/controllers/exampleTask.controller.ts` - HTTP request handlers for task operations
- `backend/src/services/exampleTask.service.ts` - business logic layer for task operations
- `backend/src/routes/exerciseTask.routes.ts` - API route definitions and middleware configuration
- `backend/src/middleware/exampleTask.validator.ts` - input validation middleware for task endpoints
- `backend/docs/README.md` - backend-specific documentation referencing task API implementation
- `frontend/src/pages/exercises/tasks/ExerciseTaskList.tsx` - main task list interface with API integration
- `frontend/src/pages/exercises/tasks/ExerciseTaskDetail.tsx` - individual task detail view component
- `frontend/src/pages/apps/TasksList.tsx` - demo task component with static data
- `frontend/src/routes.tsx` - frontend routing configuration for task pages
- `frontend/README.md` - frontend-specific documentation referencing task components

## Principles and Key Decisions

- **RESTful API Design**: All task endpoints follow REST conventions with proper HTTP status codes
- **UUID-based Identification**: Tasks use UUIDs for primary keys to avoid enumeration attacks
- **Validation at Multiple Layers**: Input validation occurs at both middleware and service levels
- **Error-First Architecture**: Comprehensive error handling with Prisma-specific error codes
- **Separation of Concerns**: Clear layering between controllers, services, repositories, and models
- **Type Safety**: Full TypeScript integration with Prisma-generated types
- **Status-Based Workflow**: Tasks progress through defined states (UPCOMING → IN_PROGRESS → COMPLETED)

## Database Schema

### ExampleTask Model ✓

```typescript
model ExampleTask {
  id             String       @id @default(uuid())
  name           String
  assignedToName String?
  assignedToAvatar String?
  dueDate        DateTime?
  priority       TaskPriority @default(MEDIUM)
  status         TaskStatus   @default(UPCOMING)
  description    String?      // Added via migration
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}
```

### Enums ✓

- **TaskStatus**: `UPCOMING`, `IN_PROGRESS`, `COMPLETED`
- **TaskPriority**: `LOW`, `MEDIUM`, `HIGH`

## Backend API Architecture

### Endpoints ✓

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| GET | `/api/exercises/tasks` | Fetch all tasks (with optional status filter) | ✓ |
| GET | `/api/exercises/tasks/:id` | Fetch single task by UUID | ✓ |
| POST | `/api/exercises/tasks` | Create new task | ✓ |
| PUT | `/api/exercises/tasks/:id` | Update existing task | ✓ |
| DELETE | `/api/exercises/tasks/:id` | Delete task by UUID | ✓ |

### Request/Response Examples

**GET /api/exercises/tasks**
```json
[
  {
    "id": "uuid-string",
    "name": "Task name",
    "description": "Task description",
    "status": "UPCOMING",
    "priority": "MEDIUM",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**POST /api/exercises/tasks**
```json
{
  "name": "New task",
  "description": "Optional description",
  "status": "UPCOMING",
  "priority": "HIGH"
}
```

### Standardized Response Format ✓

All write operations (POST, PUT, DELETE) return consistent response format:

**Success Response (200/201)**
```json
{
  "success": true,
  "data": { /* Task object for POST/PUT */ },
  "message": "Task created successfully"
}
```

**Error Response (4xx/5xx)**
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": { /* Field-specific errors if applicable */ }
}
```

### Layer Architecture ✓

1. **Routes** (`exerciseTask.routes.ts`): URL routing and middleware composition
2. **Controllers** (`exampleTask.controller.ts`): HTTP request/response handling  
3. **Services** (`exampleTask.service.ts`): Business logic and orchestration
4. **Repositories** (`exampleTask.repository.ts`): Data access layer with Prisma
5. **Validation** (`exampleTask.validator.ts`): Input validation with express-validator

### Error Handling ✓

- **P2025**: Prisma record not found → 404 response
- **Validation errors**: 422 response with field-specific messages
- **Server errors**: 500 response with generic message (details logged)

## Frontend Components

### ExerciseTaskList ✓

**Location**: `frontend/src/pages/exercises/tasks/ExerciseTaskList.tsx`

**Features**:
- Live API integration with `/api/exercises/tasks`
- Three-column layout (Upcoming, In Progress, Completed)
- Task filtering by status
- Loading states and error handling
- **New Task creation** via modal form with validation
- **Status update buttons** (Start Task, Mark Complete) with optimistic updates
- **Delete functionality** with confirmation modal and error handling
- **Edit button** for inline task editing with form validation

**Navigation**: `/exercises/tasks/list`

### ExerciseTaskDetail ✓

**Location**: `frontend/src/pages/exercises/tasks/ExerciseTaskDetail.tsx`

**Features**:
- Individual task display with all fields
- API integration with `/api/exercises/tasks/:id`
- Formatted date display
- Priority and status badges
- Back navigation to task list

**Navigation**: `/exercises/tasks/:taskId`

**Note**: The View button in task lists now opens an inline edit modal instead of navigating to this detail page, making this component primarily accessible via direct URL navigation.

### TasksList (Demo) ✓

**Location**: `frontend/src/pages/apps/TasksList.tsx`

**Features**:
- Static demo data for UI showcase
- Similar three-column layout 
- Informational alerts directing to functional component
- Avatar and assignment information display

**Navigation**: `/tasks/list`

## UI Interaction Patterns

### Task Creation Flow

**New Task Button** → **Modal Form** → **API Call** → **List Refresh**

```typescript
// Modal state management
const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
const [formData, setFormData] = useState<TaskFormData>({ name: '', priority: TaskPriority.MEDIUM });

// Form submission with validation
const handleCreateTask = async (formData: TaskFormData) => {
  const response = await fetchApi<ExampleTask>('/exercises/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  // Refresh task list on success
};
```

### Task Status Updates

**Action Button** → **Optimistic Update** → **API Call** → **Rollback on Error**

```typescript
// Status transition buttons
const getStatusActions = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.UPCOMING:
      return [{ label: 'Start Task', newStatus: TaskStatus.IN_PROGRESS }];
    case TaskStatus.IN_PROGRESS:
      return [{ label: 'Mark Complete', newStatus: TaskStatus.COMPLETED }];
    case TaskStatus.COMPLETED:
      return [{ label: 'Reopen', newStatus: TaskStatus.UPCOMING }];
  }
};

// Optimistic updates with rollback
const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  const originalTasks = tasks;
  setTasks(prev => prev.map(task => 
    task.id === taskId ? { ...task, status: newStatus } : task
  ));
  
  try {
    await fetchApi(`/exercises/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
  } catch (error) {
    setTasks(originalTasks); // Rollback on failure
  }
};
```

### Task Deletion Flow

**Delete Button** → **Confirmation Modal** → **Optimistic Update** → **API Call** → **Rollback on Error**

```typescript
const deleteTask = async (task: ExampleTask) => {
  // Remove from UI immediately
  const originalTasks = tasks;
  setTasks(prev => prev.filter(t => t.id !== task.id));
  
  try {
    await fetchApi(`/exercises/tasks/${task.id}`, { method: 'DELETE' });
  } catch (error) {
    setTasks(originalTasks); // Restore on failure
  }
};
```

## Common Patterns

### API Integration Pattern

```typescript
const [data, setData] = useState<Type[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchApi<Type[]>('/api/endpoint');
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  loadData();
}, []);
```

### Status Badge Rendering

```typescript
const priorityVariantMap: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "success",
  [TaskPriority.MEDIUM]: "warning", 
  [TaskPriority.HIGH]: "danger",
};

<Badge bg="" className={`badge-subtle-${priorityVariantMap[task.priority]}`}>
  {task.priority}
</Badge>
```

## Validation Rules

### Task Creation ✓

- **name**: Required, trimmed, escaped
- **description**: Optional, trimmed, escaped
- **status**: Optional, must be valid TaskStatus enum value
- **priority**: Optional, must be valid TaskPriority enum value

### Task Updates ✓

- **id**: Must be valid UUID format (URL parameter)
- **name**: Optional but cannot be empty if provided
- **description**: Optional, allows empty string
- **status/priority**: Optional, must be valid enum values

## Current Limitations & Future Work

### Implemented Features ✓

- [x] Full CRUD API operations
- [x] Task list display with filtering
- [x] Individual task detail views
- [x] Status and priority management
- [x] Input validation and error handling
- [x] Responsive UI components
- [x] **Task creation** via "New Task" button with modal form
- [x] **Task editing** with inline form (replaces view-only detail page)
- [x] **Task deletion** with confirmation modal and optimistic updates
- [x] **Status updates** via action buttons (Start Task, Mark Complete, etc.)
- [x] **Optimistic UI updates** with rollback on API failures
- [x] **Standardized API response handling** for all operations

### Planned Enhancements 📋

- [ ] User assignment functionality (database fields exist)
- [ ] Due date management and alerts
- [ ] Task search and advanced filtering
- [ ] Bulk operations (status updates, deletion)
- [ ] Task history/audit trail
- [ ] File attachments
- [ ] Comments/notes system

### Known Limitations

1. **No Authentication**: Tasks are publicly accessible
2. **No User Context**: Assignment fields exist but aren't integrated
3. **Limited Filtering**: Only status-based filtering implemented
4. **No Pagination**: All tasks loaded at once
5. **No Real-time Updates**: Changes require manual page refresh (optimistic updates provide immediate UI feedback)

## Development Workflow

### Adding New Task Features

1. **Database**: Update `schema.prisma` and run migrations
2. **Repository**: Add new query methods in `exampleTask.repository.ts`
3. **Service**: Implement business logic in `exampleTask.service.ts`
4. **Controller**: Add HTTP handlers in `exampleTask.controller.ts`
5. **Routes**: Configure endpoints in `exerciseTask.routes.ts`
6. **Validation**: Add rules in `exampleTask.validator.ts`
7. **Frontend**: Update components and types

### Testing Endpoints

```bash
# Get all tasks
curl http://localhost:5001/api/exercises/tasks

# Get specific task
curl http://localhost:5001/api/exercises/tasks/{uuid}

# Create task
curl -X POST http://localhost:5001/api/exercises/tasks \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Task", "priority": "HIGH"}'
```

## Troubleshooting

### Common Issues

**"Task not found" (404)**
- Verify UUID format is correct
- Check that task exists in database
- Ensure no trailing characters in URL

**Validation errors (422)**
- Review required fields (name for creation)
- Check enum values match exactly (case-sensitive)
- Verify UUID format for ID parameters

**"Failed to update task status" or "Failed to delete task"**
- ✅ **RESOLVED**: Backend now returns standardized `{ success, data?, message }` format
- These errors occurred when frontend expected standardized responses but backend returned raw data
- Fixed in controller methods to ensure consistent API response format

**Database connection issues**
- Check `DATABASE_URL` in backend `.env`
- Ensure database file exists: `backend/dev.db`
- Run migrations: `npm run db:migrate:dev -w backend`

**Frontend navigation issues**
- Verify routes are properly configured in `routes.tsx`
- Check component imports and lazy loading
- Ensure navigation paths match route definitions

## Data Seeding

Tasks are automatically seeded during database setup:

```bash
npm run db:seed -w backend
```

Seeds 9 example tasks across different statuses and priorities for development and testing.

## Appendix

### Migration History

- **Initial**: Basic task structure with status and priority
- **20250501164812_add_tasks**: Added ExampleTask model
- **20250501210451_add_monthly_analytics**: Added analytics support
- **Recent**: Added description field via schema evolution

### Environment Variables

```bash
# Backend
DATABASE_URL="file:./dev.db"
BACKEND_PORT=3001

# Frontend  
VITE_API_BASE_URL=http://localhost:3001/api
```