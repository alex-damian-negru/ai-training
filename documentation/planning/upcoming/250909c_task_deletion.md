# Implement Task Deletion Functionality

## Goal, Context

Implement functionality to delete tasks via the DELETE endpoint. Users should be able to remove tasks permanently from the task list interface. This requires careful UX design since deletion is a destructive action that cannot be easily undone.

The backend DELETE endpoint is already implemented and functional. This focuses on adding the frontend interface and ensuring proper user confirmation flows.

## References

- `documentation/reference/TASKS.md` - Complete task system documentation including DELETE endpoint details
- `docs/processes/API_DEVELOPMENT_STANDARDS.md` - API development standards and type safety requirements
- `frontend/src/pages/exercises/tasks/ExerciseTaskList.tsx` - Current task list component  
- `backend/src/controllers/exampleTask.controller.ts` - DELETE endpoint implementation (follows API standards)
- `backend/src/services/exampleTask.service.ts` - Task deletion business logic
- `docs/plans/01-Task-Example-API.md` - Original implementation plan showing this as Phase 5 item

## Principles, Key Decisions

- **API Standards Compliance**: Follow established API development standards from `docs/processes/API_DEVELOPMENT_STANDARDS.md`
- **Standardized Response Format**: Expect and handle `{ success: boolean, data?: any, message?: string }` response format
- **Type Safety**: Leverage existing Zod validation schemas and TypeScript interfaces from the backend
- **Confirmation Required**: All deletions must require explicit user confirmation
- **Visual Distinction**: Delete actions should be visually distinct (red/danger styling)
- **Optimistic Updates**: Remove from UI immediately after confirmation, rollback on API failure
- **Bulk Operations**: Support deleting multiple tasks at once (future enhancement)
- **Accessibility**: Proper ARIA labels and keyboard support for delete controls
- **Data Safety**: Clear messaging about permanent deletion

## Technical Architecture

### Deletion UI Patterns
- **Individual Delete Buttons**: Small delete button per task row
- **Confirmation Modal**: Bootstrap modal with task details and confirmation
- **Bulk Selection**: Checkboxes for multiple task selection (future enhancement)

### API Integration  
- Use existing DELETE `/api/exercises/tasks/:id` endpoint (follows API development standards)
- Handle standardized response format: `{ success: boolean, data?: any, message?: string }`
- Handle responses: 200 success, 404 not found, 500 server error
- Leverage existing Zod validation schemas for type safety
- Implement proper error handling and user feedback

### State Management
```typescript
const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set());
const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
const [taskToDelete, setTaskToDelete] = useState<ExampleTask | null>(null);
const [deleteError, setDeleteError] = useState<string | null>(null);
```

### Confirmation Flow
1. User clicks delete button → Show confirmation modal
2. Modal displays task name and deletion warning
3. User confirms → API call with loading state
4. Success → Remove from UI, close modal
5. Error → Show error message, keep task in UI

## Actions

### Phase 1: Delete Button and Modal Setup
- [ ] Add delete button to TaskTable component
  - [ ] Import Trash icon from lucide-react
  - [ ] Add delete button next to Edit button
  - [ ] Style with danger/red variant
  - [ ] Add onClick handler to show confirmation modal
- [ ] Create deletion confirmation modal
  - [ ] Bootstrap Modal with task details
  - [ ] Show task name being deleted
  - [ ] Warning about permanent deletion
  - [ ] Cancel and Delete buttons
- [ ] Update TodoWrite with progress

### Phase 2: Deletion Logic Implementation
- [ ] Implement deleteTask function following API standards
  - [ ] Use fetchApi utility with DELETE method
  - [ ] Handle standardized response format: `{ success: boolean, data?: any, message?: string }`
  - [ ] Handle loading states during deletion
  - [ ] Process success/error responses with proper data extraction
- [ ] Add optimistic UI updates
  - [ ] Remove task from state immediately after confirmation
  - [ ] Show loading spinner in modal during API call
  - [ ] Rollback if deletion fails
- [ ] Update TodoWrite with progress

### Phase 3: Error Handling and User Feedback
- [ ] Handle deletion errors
  - [ ] Network failures with retry option
  - [ ] Task not found (404) - show message and remove from UI
  - [ ] Server errors (500) - show error and keep task
- [ ] Add user feedback mechanisms
  - [ ] Success message/toast (optional)
  - [ ] Clear error messaging in modal
  - [ ] Proper loading states and disabled buttons
- [ ] Update TodoWrite with progress

### Phase 4: Accessibility and Polish  
- [ ] Ensure accessibility compliance
  - [ ] Proper ARIA labels for delete buttons
  - [ ] Screen reader announcements for deletions
  - [ ] Keyboard navigation support
  - [ ] Focus management in modals
- [ ] Test edge cases
  - [ ] Multiple rapid deletion attempts
  - [ ] Deletion while task list is loading
  - [ ] Modal behavior on ESC/backdrop click
- [ ] Run frontend linting and type checking
- [ ] Update TodoWrite with completion status
- [ ] Move planning doc to documentation/planning/completed/

## User Experience Planning

### Confirmation Modal Content
```
Delete Task?

Are you sure you want to delete "[Task Name]"? 

This action cannot be undone.

[Cancel] [Delete Task]
```

### Loading States
- Delete button shows spinner during API call
- Modal buttons disabled during deletion
- Task row grayed out during deletion process

### Error Messages
- "Failed to delete task. Please try again."
- "Task not found. It may have been deleted already."
- "Server error occurred. Please try again later."

## Actions

### Phase 1: Basic Delete Functionality
- [ ] Add delete button to each task row
  - [ ] Position next to existing Edit button  
  - [ ] Use Trash icon with red/danger styling
  - [ ] Add proper accessibility labels
- [ ] Create confirmation modal component
  - [ ] Display task name and deletion warning
  - [ ] Implement modal state management
  - [ ] Handle cancel and confirm actions
- [ ] Update TodoWrite with progress

### Phase 2: API Integration
- [ ] Implement deleteTask API function
  - [ ] Use existing fetchApi utility
  - [ ] Handle DELETE request to /api/exercises/tasks/:id
  - [ ] Process response and error states
- [ ] Integrate deletion with task list
  - [ ] Remove task from state on successful deletion
  - [ ] Update filtered task lists (upcoming/in-progress/completed)
  - [ ] Handle concurrent operations gracefully
- [ ] Update TodoWrite with progress

### Phase 3: Error Handling and UX
- [ ] Implement comprehensive error handling
  - [ ] Show specific error messages in modal
  - [ ] Handle network failures with retry option
  - [ ] Manage 404 errors (task already deleted)
- [ ] Add loading and feedback states
  - [ ] Disable interface during deletion
  - [ ] Show success feedback (optional)
  - [ ] Implement optimistic updates with rollback
- [ ] Update TodoWrite with progress

### Phase 4: Testing and Polish
- [ ] Test deletion functionality thoroughly  
  - [ ] Verify modal behavior and confirmation flow
  - [ ] Test error scenarios and recovery
  - [ ] Check concurrent deletion handling
- [ ] Ensure accessibility compliance
  - [ ] Keyboard navigation and focus management
  - [ ] Screen reader compatibility
  - [ ] ARIA labels and descriptions
- [ ] Run frontend linting and type checking
- [ ] Update TodoWrite with completion status
- [ ] Move planning doc to documentation/planning/completed/

## Appendix

### API Request Format
```http
DELETE /api/exercises/tasks/:id
```

### API Response Format (API Standards Compliant)

#### Success Response (200)
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Error Response (404)
```json
{
  "success": false,
  "error": "Task not found",
  "message": "The specified task could not be found"
}
```

#### Error Response (500)
```json
{
  "success": false,
  "error": "Server error",
  "message": "An unexpected error occurred while deleting the task"
}
```

### Component Interface
```typescript
interface DeleteButtonProps {
  task: ExampleTask;
  onDelete: (taskId: string) => Promise<void>;
  isDeleting: boolean;
}

interface DeleteModalProps {
  show: boolean;
  task: ExampleTask | null;
  isDeleting: boolean;
  error: string | null;
  onHide: () => void;
  onConfirm: () => Promise<void>;
}
```

### Security Considerations
- Ensure DELETE requests include proper task ID validation
- Handle unauthorized deletions gracefully (if auth is added later)
- Consider soft delete vs hard delete implications
- Log deletion events for audit purposes (backend concern)

### Future Enhancements (Not in Scope)
- Bulk deletion with checkbox selection
- Undo functionality with temporary retention
- Deletion confirmation with typed task name
- Archive functionality instead of permanent deletion