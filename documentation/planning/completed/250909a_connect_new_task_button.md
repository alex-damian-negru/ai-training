# Connect New Task Button to POST Endpoint

## Goal, Context

Connect the existing 'New Task' button in the ExerciseTaskList component to the backend POST endpoint (`/api/exercises/tasks`) to enable task creation functionality. Currently, the button exists in the UI (line 125-130 in `ExerciseTaskList.tsx`) but has no click handler or functionality.

The task system already has a complete backend API with POST endpoint implementation, but the frontend lacks the ability to create new tasks through the user interface.

## References

- `documentation/reference/TASKS.md` - Complete task system documentation including API endpoints and validation rules
- `docs/processes/API_DEVELOPMENT_STANDARDS.md` - API development standards and type safety requirements
- `frontend/src/pages/exercises/tasks/ExerciseTaskList.tsx:125-130` - Current New Task button location
- `backend/src/controllers/exampleTask.controller.ts` - POST endpoint implementation (follows API standards)
- `backend/src/services/exampleTask.service.ts` - Task creation business logic
- `backend/src/middleware/exampleTask.validator.ts` - Input validation rules for task creation
- `frontend/src/utils/apiClient.ts` - Existing API client utility for making requests

## Principles, Key Decisions

- **API Standards Compliance**: Follow established API development standards from `docs/processes/API_DEVELOPMENT_STANDARDS.md`
- **Standardized Response Format**: Expect and handle `{ success: boolean, data?: any, message?: string }` response format
- **Type Safety**: Leverage existing Zod validation schemas and TypeScript interfaces from the backend
- **Reuse Existing Patterns**: Follow the established API integration pattern already used in `ExerciseTaskList` for fetching tasks
- **Form Validation**: Implement client-side validation that matches backend validation rules (name required, optional description)
- **User Experience**: Provide immediate visual feedback for loading states, success, and error conditions
- **Modal Approach**: Use a Bootstrap modal for the task creation form to maintain current page context
- **Status Management**: New tasks should default to `UPCOMING` status as per backend logic
- **List Refresh**: After successful creation, refresh the task list to show the new task immediately

## Technical Architecture

### Component Structure
- Extend existing `ExerciseTaskList` component with modal state management
- Create inline task creation form within Bootstrap modal
- Use React Bootstrap components for consistency with existing UI

### API Integration
- Utilize existing `fetchApi` utility from `apiClient.ts`
- POST to `/api/exercises/tasks` endpoint (follows API development standards)
- Handle standardized response format: `{ success: boolean, data?: ExampleTask, message?: string }`
- Handle standard HTTP responses (201 success, 422 validation errors, 500 server errors)
- Leverage existing Zod validation schemas for type safety

### Form Fields
Based on backend validation rules from TASKS.md:
- **name**: Required text input, trimmed and escaped
- **description**: Optional textarea, trimmed and escaped  
- **priority**: Optional select dropdown (LOW, MEDIUM, HIGH) with MEDIUM default
- **status**: Hidden field defaulting to UPCOMING

### State Management
```typescript
const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
const [isCreating, setIsCreating] = useState<boolean>(false);
const [createError, setCreateError] = useState<string | null>(null);
const [formData, setFormData] = useState({
  name: '',
  description: '',
  priority: TaskPriority.MEDIUM
});
```

## Actions

### Phase 1: Modal Infrastructure
- [x] Add modal state management to ExerciseTaskList component
  - [x] Import Modal, Form components from react-bootstrap
  - [x] Add state variables for modal visibility and form data
  - [x] Add onClick handler to New Task button to show modal
- [x] Create basic modal structure with form fields
  - [x] Name input field (required)
  - [x] Description textarea (optional)
  - [x] Priority select dropdown with enum values
  - [x] Cancel and Create buttons in modal footer
- [x] Update TodoWrite with progress and move to current phase

### Phase 2: Form Handling and Validation
- [x] Implement form data management
  - [x] Add handleInputChange function for controlled inputs
  - [x] Add form validation (name required, trim whitespace)
  - [x] Show validation errors in form
- [x] Add form reset functionality
  - [x] Clear form when modal closes
  - [x] Reset validation errors on new form open
- [x] Update TodoWrite with progress

### Phase 3: API Integration
- [x] Implement task creation API call following API standards
  - [x] Add createTask function using fetchApi utility
  - [x] Handle standardized response format: `{ success: boolean, data?: ExampleTask, message?: string }`
  - [x] Handle loading states during API call
  - [x] Handle success response (201 status) with data extraction from `response.data`
  - [x] Handle validation errors (422 status) with message from `response.error/message`
  - [x] Handle server errors (500 status)
- [x] Integrate creation with existing task list
  - [x] Refresh task list after successful creation
  - [x] Close modal on success
  - [x] Show success feedback using `response.message` if available
- [x] Update TodoWrite with progress

### Phase 4: Testing and Polish
- [x] Test form validation
  - [x] Verify required field validation
  - [x] Test with various input combinations
  - [x] Verify error message display
- [x] Test API integration
  - [x] Verify successful task creation
  - [x] Test error handling scenarios
  - [x] Confirm task list refresh works
- [x] Polish user experience
  - [x] Ensure proper loading states
  - [x] Verify modal behavior (ESC key, backdrop click)
  - [x] Check responsive design on mobile
- [x] Run frontend linting and type checking
- [x] Update TodoWrite with completion status
- [x] Move planning doc to documentation/planning/completed/

## Appendix

### API Request Format
```json
POST /api/exercises/tasks
{
  "name": "New task name",
  "description": "Optional description",
  "priority": "MEDIUM"
}
```

### Success Response Format (API Standards Compliant)
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "New task name", 
    "description": "Optional description",
    "status": "UPCOMING",
    "priority": "MEDIUM",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### Error Response Format (API Standards Compliant)
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Request validation failed"
}
```

### Current Button Location
The New Task button currently exists in the TaskBoard component at line 125-130:
```typescript
<Button variant="primary" size="sm">
  <Plus size={18} /> New Task
</Button>
```

### Priority Enum Values
- LOW
- MEDIUM (default)
- HIGH

### Validation Rules
- **name**: Required, cannot be empty, trimmed
- **description**: Optional, can be empty, trimmed  
- **priority**: Optional, must match enum values, defaults to MEDIUM