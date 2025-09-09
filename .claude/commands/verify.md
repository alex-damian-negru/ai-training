---
allowed-tools: TodoWrite, Task, Glob, Grep, Read, Bash, mcp__ide__getDiagnostics
description: Verify if a completed plan file is working as intended
argument-hint: "[plan file path | *]"
---

# Verify Planning Document Implementation

## Context

You are verifying that a completed planning document has been properly implemented and is working as intended. This includes checking that all tasks are marked as completed, the implementation follows the specifications, and the functionality works correctly.

### Arguments
- Planning document path: `$ARGUMENTS`
- Use `*` to verify all completed planning documents: `*`

### Available Completed Planning Documents
!`find documentation/planning/completed -name "*.md" -type f`

## Your Task

Verify the implementation status and functionality of the specified completed planning document, or all completed planning documents if `*` is provided.

### Process

1. **Document Analysis**
   - If `$ARGUMENTS` is `*`, process all completed planning documents in batch mode
   - If `$ARGUMENTS` is a specific path, use that as the planning document path
   - If no arguments provided, list available completed planning documents and ask user to specify
   - Read and analyze the planning document structure(s)
   - Check that all action items are marked as completed (`[x]`)
   - Identify the key functionality that was supposed to be implemented

2. **Implementation Verification**
   - Check that referenced files and components exist
   - Verify code matches the technical architecture outlined in the plan
   - Test key functionality described in the plan
   - Run any tests mentioned in the planning document
   - Check that API endpoints work as specified (if applicable)

3. **Code Quality Checks**
   - Run linting and type checking as specified in the document
   - Check for any diagnostic errors in relevant files
   - Verify that code follows the principles and standards mentioned
   - Ensure proper error handling is implemented

4. **Functional Testing**
   - Test the main user flows described in the plan
   - Verify that the implementation meets the success criteria
   - Check edge cases and error scenarios
   - Test any UI components or interactions mentioned

5. **Report Generation and Plan Management**
   - Create a comprehensive verification report (individual or summary for batch mode)
   - List any discrepancies between plan and implementation
   - Note any missing functionality or incomplete tasks
   - Provide recommendations for any issues found
   - For batch mode (`*`): Generate summary report with overall health status
   - **Move Failed Plans**: If verification fails, move plan back to `documentation/planning/upcoming/`
   - **Add Missing Todos**: Identify and add any incomplete action items as todos using TodoWrite

### Verification Areas

#### Planning Document Completeness
- All action items marked as completed (`[x]`)
- Document moved to `completed/` folder
- All phases and sub-tasks addressed

#### Code Implementation
- Files and components exist as specified
- Technical architecture follows the plan
- API endpoints match specifications
- Validation and error handling implemented
- Type safety and schemas in place

#### Functionality Testing
- Core features work as described
- User experience matches specifications
- Edge cases handled appropriately
- Performance meets requirements

#### Quality Assurance  
- Code passes linting and type checks
- No diagnostic errors in implementation files
- Tests pass (if applicable)
- Security best practices followed

### Safety Rules

- **READ ONLY**: This is a verification command - do not modify any code during verification
- **PLAN MANAGEMENT**: Move failed plans back to upcoming folder and create todos for missing items
- **COMPREHENSIVE**: Test all major functionality mentioned in the plan
- **OBJECTIVE**: Report both successes and any issues found
- **SPECIFIC**: Reference exact file locations and line numbers for issues
- **CONSTRUCTIVE**: Provide actionable recommendations for any problems

## Instructions

Based on the arguments provided:

**For Single Document Verification:**

1. **Analyze the planning document**
   - Read the completed plan file
   - Extract key implementation details and success criteria
   - Note all files and components that should exist

**For Batch Verification (`*`):**

1. **Discover all completed plans**
   - Find all `.md` files in `documentation/planning/completed/`
   - Process each plan document systematically
   - Track overall verification progress with TodoWrite

2. **Process each document individually**
   - Run the same verification steps as single document mode
   - Collect results for each plan without stopping on failures
   - Continue processing remaining plans even if some fail verification
   - For each failed plan: move to upcoming and add missing todos

3. **Failed plan handling**
   - Scan for incomplete action items (lines with `- [ ]`)
   - Use TodoWrite to create todos for each incomplete item
   - Use `mv` to move plan from `completed/` to `upcoming/`
   - Update verification report with file movement details

**Common Verification Steps (for both modes):**

2. **Verify implementation completeness**
   - Check that all referenced files exist
   - Verify code matches technical specifications
   - Confirm API endpoints work as designed

3. **Test functionality**
   - Test main user workflows described
   - Verify UI components work as specified
   - Check error handling and edge cases

4. **Quality verification**
   - Run linting/type checking mentioned in plan
   - Check for diagnostic errors
   - Verify tests pass (if applicable)

5. **Generate verification report and handle failures**
   - **Single mode**: Detailed report for the specific plan
   - **Batch mode (`*`)**: Summary report with overall health status
     - List plans that passed verification completely
     - List plans that failed with brief issue summaries
     - Provide overall recommendation for codebase health
     - Include detailed individual reports for failed plans only
   
6. **Handle failed verifications**
   - **Move Failed Plans**: Use `mv` command to move failed plans from `completed/` back to `upcoming/`
   - **Add Missing Todos**: Use TodoWrite to create todos for incomplete action items found in failed plans
   - **Update Action Items**: Convert incomplete `[ ]` items to todos with appropriate descriptions
   - **Preserve Documentation**: Keep original planning structure when moving files

**Argument Handling:**
- If `$ARGUMENTS` is `*`: Process all completed planning documents in batch mode
- If `$ARGUMENTS` is a specific path: Verify that single document
- If no arguments provided: List available completed documents and ask user to choose

## Missing Todos Implementation

When verification fails, the command should identify incomplete action items and create todos:

### Todo Creation Process
1. **Scan for incomplete items**: Look for `- [ ]` markers in the planning document
2. **Extract action descriptions**: Get the text following each incomplete checkbox
3. **Create todos using TodoWrite**: Add each incomplete item as a todo with:
   - `content`: The action item description (imperative form)
   - `activeForm`: Present continuous form of the action
   - `status`: Set to "pending"

### Example Todo Creation
```markdown
Planning document contains:
- [ ] Add status update buttons to TaskTable component
- [ ] Create StatusActionButtons sub-component  
- [ ] Add error handling for failed updates
```

Should create todos:
```typescript
TodoWrite({
  todos: [
    {
      content: "Add status update buttons to TaskTable component",
      activeForm: "Adding status update buttons to TaskTable component",
      status: "pending"
    },
    {
      content: "Create StatusActionButtons sub-component",
      activeForm: "Creating StatusActionButtons sub-component", 
      status: "pending"
    },
    {
      content: "Add error handling for failed updates",
      activeForm: "Adding error handling for failed updates",
      status: "pending"
    }
  ]
})
```

## Success Criteria

**Single Document Mode:**
- All plan action items have been checked
- Implementation matches technical specifications
- Key functionality has been tested and works
- Code quality checks have passed
- Comprehensive report has been generated
- **If verification fails**: Plan moved to upcoming and missing todos created

**Batch Mode (`*`):**
- All completed planning documents have been processed
- Each document has been individually verified
- Summary report generated with overall health status
- Failed verifications include detailed individual reports
- TodoWrite tracking shows completion of all document verifications
- **Failed plans**: Moved back to upcoming with appropriate todos created

Remember: This is a verification command that can modify plan locations and create todos, but should not modify implementation code during the verification process.