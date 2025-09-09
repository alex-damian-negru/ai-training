# Implement Task Status Update Functionality

## Goal, Context

Implement functionality to update task status (mark complete/incomplete) via the PUT endpoint. This will allow users to change task status directly from the task list interface without navigating to a separate edit page. The backend PUT endpoint already exists and is fully functional.

Users should be able to quickly move tasks between UPCOMING → IN_PROGRESS → COMPLETED states through intuitive UI controls in each task board.

## References

- `documentation/reference/TASKS.md` - Complete task system documentation including PUT endpoint details
- `docs/processes/API_DEVELOPMENT_STANDARDS.md` - API development standards and type safety requirements
- `frontend/src/pages/exercises/tasks/ExerciseTaskList.tsx` - Current task list component
- `backend/src/controllers/exampleTask.controller.ts` - PUT endpoint implementation (follows API standards)
- `backend/src/services/exampleTask.service.ts` - Task update business logic
- `backend/src/middleware/exampleTask.validator.ts` - Input validation for updates
- `docs/plans/01-Task-Example-API.md` - Original implementation plan showing this as Phase 5 item

## Principles, Key Decisions

- **API Standards Compliance**: Follow established API development standards from `docs/processes/API_DEVELOPMENT_STANDARDS.md`
- **Standardized Response Format**: Expect and handle `{ success: boolean, data?: any, message?: string }` response format
- **Type Safety**: Leverage existing Zod validation schemas and TypeScript interfaces from the backend
- **Contextual Actions**: Status update controls should appear contextually based on current task status
- **Optimistic Updates**: Update UI immediately, rollback on API failure
- **Visual Feedback**: Clear loading states and success/error indicators
- **Workflow Logic**: Enforce logical status progression (UPCOMING → IN_PROGRESS → COMPLETED)
- **Batch Operations**: Consider allowing multiple tasks to be updated at once
- **Accessibility**: Ensure controls are keyboard accessible and screen reader friendly

## Technical Architecture

### Status Update Patterns
- **Status Buttons**: Add small action buttons next to each task for status changes
- **Dropdown Menus**: Alternative approach using status dropdown per task
- **Drag and Drop**: Future enhancement to drag tasks between columns (not in scope)

### API Integration
- Utilize existing PUT `/api/exercises/tasks/:id` endpoint (follows API development standards)
- Handle standardized response format: `{ success: boolean, data?: ExampleTask, message?: string }`
- Send partial updates with only status field
- Handle standard HTTP responses (200 success, 404 not found, 422 validation errors)
- Leverage existing Zod validation schemas for type safety

### State Management Strategy
```typescript
const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
const [updateErrors, setUpdateErrors] = useState<Map<string, string>>(new Map());

const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  // Optimistic update
  // API call
  // Rollback on failure
};
```

### UI Controls Design
For each task status, show relevant action buttons:
- **UPCOMING**: "Start Task" (→ IN_PROGRESS)
- **IN_PROGRESS**: "Mark Complete" (→ COMPLETED), "Move to Upcoming" (→ UPCOMING)  
- **COMPLETED**: "Reopen" (→ IN_PROGRESS)

## Actions

### Phase 1: UI Controls Implementation
- [ ] Add status update buttons to TaskTable component
  - [ ] Create StatusActionButtons sub-component
  - [ ] Define button variants for each status transition
  - [ ] Add loading spinner states for individual tasks
  - [ ] Implement optimistic UI updates
- [ ] Add error handling for failed updates
  - [ ] Show inline error messages per task
  - [ ] Add retry functionality
  - [ ] Implement rollback for failed optimistic updates
- [ ] Update TodoWrite with progress

### Phase 2: API Integration
- [ ] Implement updateTaskStatus function following API standards
  - [ ] Use existing fetchApi utility with PUT method
  - [ ] Handle standardized response format: `{ success: boolean, data?: ExampleTask, message?: string }`
  - [ ] Handle loading state per task (prevent multiple concurrent updates)
  - [ ] Parse and handle API response/errors with proper data extraction
- [ ] Integrate with task list state management
  - [ ] Update tasks array on successful API call
  - [ ] Refresh task list on persistent errors
  - [ ] Maintain task filtering by status after updates
- [ ] Update TodoWrite with progress

### Phase 3: User Experience Enhancements
- [ ] Add visual feedback for status changes
  - [ ] Smooth animations between status changes
  - [ ] Toast notifications for successful updates (optional)
  - [ ] Clear success/error indicators
- [ ] Implement keyboard shortcuts (optional)
  - [ ] Space bar to toggle task status
  - [ ] Enter to start/complete tasks
- [ ] Add confirmation dialogs for destructive actions
  - [ ] Confirm marking tasks as complete
  - [ ] Confirm reopening completed tasks
- [ ] Update TodoWrite with progress

### Phase 4: Testing and Polish
- [ ] Test all status transitions
  - [ ] UPCOMING → IN_PROGRESS
  - [ ] IN_PROGRESS → COMPLETED  
  - [ ] COMPLETED → IN_PROGRESS
  - [ ] IN_PROGRESS → UPCOMING
- [ ] Test error scenarios
  - [ ] Network failures
  - [ ] Invalid task IDs
  - [ ] Concurrent update conflicts
- [ ] Test optimistic updates
  - [ ] Verify immediate UI feedback
  - [ ] Confirm rollback on failure
- [ ] Run frontend linting and type checking
- [ ] Update TodoWrite with completion status
- [ ] Move planning doc to documentation/planning/completed/

## Appendix

### API Request Format
```json
PUT /api/exercises/tasks/:id
{
  "status": "IN_PROGRESS"
}
```

### Success Response Format (API Standards Compliant)
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Task name",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task status updated successfully"
}
```

### Error Response Format (API Standards Compliant)
```json
{
  "success": false,
  "error": "Task not found",
  "message": "The specified task could not be found"
}
```

### Status Workflow
```
UPCOMING ←→ IN_PROGRESS → COMPLETED
              ↑              ↓
              └── REOPEN ────┘
```

### Button Design Specifications
```typescript
interface StatusActionButtonsProps {
  task: ExampleTask;
  isUpdating: boolean;
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  error?: string;
}
```

### Error Handling Strategy
- **Network Errors**: Show retry button with exponential backoff
- **Validation Errors**: Display validation message inline
- **Not Found Errors**: Remove task from UI and show notification
- **Concurrent Updates**: Refresh task data and show conflict message

### Accessibility Requirements
- Button labels should be descriptive ("Mark Complete", not just "✓")
- Loading states should be announced to screen readers
- Error messages should be associated with relevant controls
- Keyboard navigation should work for all status update actions