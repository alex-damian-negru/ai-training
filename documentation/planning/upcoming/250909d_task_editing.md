# Replace View Button with Edit Functionality

## Goal, Context

Replace the current "View" button with an "Edit" button and implement comprehensive task editing functionality. Users should be able to modify all task fields (name, description, priority, status) through an intuitive interface without navigating to a separate page.

Currently, the "View" button navigates to a detail page that only displays task information. The goal is to replace this with in-place or modal-based editing that leverages the existing PUT endpoint.

## References

- `documentation/reference/TASKS.md` - Complete task system documentation including PUT endpoint details
- `docs/processes/API_DEVELOPMENT_STANDARDS.md` - API development standards and type safety requirements
- `frontend/src/pages/exercises/tasks/ExerciseTaskList.tsx:95` - Current View button location
- `frontend/src/pages/exercises/tasks/ExerciseTaskDetail.tsx` - Current detail view component (reference for task display)
- `backend/src/controllers/exampleTask.controller.ts` - PUT endpoint implementation (follows API standards)
- `backend/src/middleware/exampleTask.validator.ts` - Input validation for task updates
- `docs/plans/01-Task-Example-API.md` - Original implementation plan showing this as Phase 5 item

## Principles, Key Decisions

- **API Standards Compliance**: Follow established API development standards from `docs/processes/API_DEVELOPMENT_STANDARDS.md`
- **Standardized Response Format**: Expect and handle `{ success: boolean, data?: any, message?: string }` response format
- **Type Safety**: Leverage existing Zod validation schemas and TypeScript interfaces from the backend
- **Modal-Based Editing**: Use Bootstrap modal for editing to maintain list context
- **Form Validation**: Implement client-side validation matching backend rules
- **Optimistic Updates**: Update UI immediately, rollback on failure
- **Field-Level Validation**: Real-time validation feedback per field
- **Cancel Protection**: Warn users about unsaved changes
- **Keyboard Shortcuts**: Support Enter to save, Escape to cancel

## Technical Architecture

### Edit Modal Design
- Replace "View" button with "Edit" button using pencil icon
- Modal form with all editable task fields
- Pre-populate form with current task data
- Save/Cancel buttons with proper validation

### Form Fields
Based on ExampleTask model:
- **name**: Required text input (validation: non-empty, trimmed)
- **description**: Optional textarea (validation: trimmed)
- **priority**: Select dropdown (LOW, MEDIUM, HIGH)
- **status**: Select dropdown (UPCOMING, IN_PROGRESS, COMPLETED)

### State Management
```typescript
const [editingTask, setEditingTask] = useState<ExampleTask | null>(null);
const [showEditModal, setShowEditModal] = useState<boolean>(false);
const [isUpdating, setIsUpdating] = useState<boolean>(false);
const [editError, setEditError] = useState<string | null>(null);
const [formData, setFormData] = useState<Partial<ExampleTask>>({});
const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
```

### Validation Strategy
- Real-time validation on field blur
- Form-level validation before submission
- Server-side error handling and display
- Dirty state tracking for unsaved changes warning

## Actions

### Phase 1: Edit Button and Modal Infrastructure
- [ ] Replace View button with Edit button
  - [ ] Import Edit/Pencil icon from lucide-react
  - [ ] Update button text and icon
  - [ ] Change onClick handler to show edit modal instead of navigation
  - [ ] Update button styling to match existing patterns
- [ ] Create edit modal component
  - [ ] Bootstrap Modal with form structure
  - [ ] Form fields for name, description, priority, status
  - [ ] Save and Cancel buttons
  - [ ] Modal state management
- [ ] Update TodoWrite with progress

### Phase 2: Form Implementation and Validation
- [ ] Implement controlled form inputs
  - [ ] Name input with required validation
  - [ ] Description textarea (optional)
  - [ ] Priority select dropdown with enum values
  - [ ] Status select dropdown with enum values
- [ ] Add form validation logic
  - [ ] Real-time field validation
  - [ ] Form submission validation
  - [ ] Display validation errors inline
  - [ ] Disable save button when form is invalid
- [ ] Update TodoWrite with progress

### Phase 3: API Integration and Data Flow
- [ ] Implement updateTask API function following API standards
  - [ ] Use existing fetchApi utility with PUT method
  - [ ] Handle standardized response format: `{ success: boolean, data?: ExampleTask, message?: string }`
  - [ ] Handle partial updates (only changed fields)
  - [ ] Process success/error responses with proper data extraction
- [ ] Integrate with task list state
  - [ ] Update task in state on successful save
  - [ ] Refresh task list on persistent errors
  - [ ] Maintain task filtering after updates
- [ ] Add optimistic updates
  - [ ] Update UI immediately on save
  - [ ] Rollback on API failure
  - [ ] Show loading states during save
- [ ] Update TodoWrite with progress

### Phase 4: User Experience Enhancements
- [ ] Implement unsaved changes protection
  - [ ] Track dirty state of form fields
  - [ ] Show confirmation dialog when closing with unsaved changes
  - [ ] Warn on browser refresh/navigation
- [ ] Add keyboard shortcuts and accessibility
  - [ ] Enter key to save form
  - [ ] Escape key to cancel (with confirmation if dirty)
  - [ ] Tab order and focus management
  - [ ] Screen reader support
- [ ] Polish interactions and feedback
  - [ ] Loading states in modal during save
  - [ ] Success/error feedback
  - [ ] Form reset on successful save
- [ ] Update TodoWrite with progress

### Phase 5: Testing and Cleanup
- [ ] Test all form scenarios
  - [ ] Valid form submissions with all field combinations
  - [ ] Validation errors and recovery
  - [ ] Unsaved changes warnings
  - [ ] Concurrent editing scenarios
- [ ] Test error handling
  - [ ] Network failures and retry
  - [ ] Server validation errors (422)
  - [ ] Task not found errors (404)
- [ ] Remove unused detail page components
  - [ ] Update routes.tsx to remove detail route
  - [ ] Remove ExerciseTaskDetail.tsx component if no longer used
  - [ ] Clean up unused imports and navigation
- [ ] Run frontend linting and type checking
- [ ] Update TodoWrite with completion status  
- [ ] Move planning doc to documentation/planning/completed/

## User Experience Planning

### Edit Modal Layout
```
Edit Task

Name: [Text Input - Required]
Description: [Textarea - Optional]
Priority: [Select: LOW/MEDIUM/HIGH]
Status: [Select: UPCOMING/IN_PROGRESS/COMPLETED]

[Cancel] [Save Changes]
```

### Validation Messages
- Name: "Task name is required"
- Priority: "Please select a valid priority"
- Status: "Please select a valid status"
- Server errors: Display specific backend validation messages

### Unsaved Changes Dialog
```
Unsaved Changes

You have unsaved changes. Are you sure you want to close this dialog?

[Keep Editing] [Discard Changes]
```

## Technical Implementation Details

### Form Data Structure
```typescript
interface TaskFormData {
  name: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
}
```

### API Integration Pattern
```typescript
const handleSaveTask = async (formData: TaskFormData) => {
  setIsUpdating(true);
  setEditError(null);
  
  try {
    const response = await fetchApi<{ success: boolean, data: ExampleTask, message?: string }>(
      `/exercises/tasks/${editingTask.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(formData),
      }
    );
    
    if (response.success && response.data) {
      // Update local state with data from standardized response
      setTasks(prev => prev.map(task => 
        task.id === response.data.id ? response.data : task
      ));
      
      setShowEditModal(false);
      setHasUnsavedChanges(false);
      
      // Show success message if provided
      if (response.message) {
        // Handle success feedback
      }
    } else {
      setEditError(response.message || 'Failed to update task');
    }
  } catch (error) {
    setEditError(error.message);
  } finally {
    setIsUpdating(false);
  }
};
```

### Validation Rules Implementation
- **name**: Required, non-empty after trim, max length validation
- **description**: Optional, trimmed, max length validation  
- **priority**: Must be valid TaskPriority enum value
- **status**: Must be valid TaskStatus enum value

## Appendix

### API Request Format
```json
PUT /api/exercises/tasks/:id
{
  "name": "Updated task name",
  "description": "Updated description", 
  "priority": "HIGH",
  "status": "IN_PROGRESS"
}
```

### Success Response Format (API Standards Compliant)
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Updated task name",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task updated successfully"
}
```

### Error Response Format (API Standards Compliant)
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Task name is required and cannot be empty"
}
```

### Component Architecture
```
ExerciseTaskList
├── TaskBoard (x3 - one per status)
│   └── TaskTable
│       └── TaskRow
│           └── EditButton → EditModal
└── EditTaskModal
    ├── TaskForm
    │   ├── NameInput
    │   ├── DescriptionTextarea  
    │   ├── PrioritySelect
    │   └── StatusSelect
    └── UnsavedChangesDialog
```

### Accessibility Requirements
- Modal should trap focus and return to edit button on close
- Form fields need proper labels and error announcements
- Save button should indicate loading state to screen readers
- Error messages should be associated with relevant form fields
- Keyboard navigation should work throughout entire form

### Error Handling Strategy
- **Validation Errors (422)**: Show field-specific errors inline
- **Not Found (404)**: Close modal, remove task from list, show notification
- **Network Errors**: Show generic error with retry option  
- **Concurrent Updates**: Refresh task data and show conflict warning

### Future Enhancements (Not in Scope)
- Inline editing directly in table cells
- Bulk edit functionality for multiple tasks
- Rich text editor for description field
- Auto-save drafts for form recovery
- Real-time collaborative editing