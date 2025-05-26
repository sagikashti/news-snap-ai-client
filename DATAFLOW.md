# NewsSnapAI Client - Dataflow Diagram

## 🔄 URL Submission to Summary Display Flow

This document illustrates the complete dataflow when a user submits a URL for summarization.

## 📊 Visual Dataflow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Action   │    │   UI Components  │    │  State Manager  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│ 1. User enters  │              │                       │
│    URL in form  │              │                       │
└─────────────────┘              │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│ 2. Form         │◄─────────────┤                       │
│    validation   │              │                       │
│    (Zod schema) │              │                       │
└─────────────────┘              │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│ 3. User clicks  │              │                       │
│    Submit       │              │                       │
└─────────────────┘              │                       │
         │                       │                       │
         ▼                       ▼                       │
┌─────────────────┐    ┌──────────────────┐              │
│ 4. UrlForm      │───▶│ handleSubmit()   │              │
│    onSubmit     │    │ (React Hook Form)│              │
└─────────────────┘    └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ SummaryPage      │              │
         │              │ handleSubmit()   │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       ▼
         │              ┌──────────────────┐    ┌─────────────────┐
         │              │ Redux Dispatch   │───▶│ summarySlice    │
         │              │ summarizeUrl()   │    │ (Redux Toolkit) │
         │              └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 5. State Update │
         │                       │              │ - isLoading:true│
         │                       │              │ - error: null   │
         │                       │              │ - lastUrl: url  │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 6. UI Re-render │
         │                       │              │ - Show skeleton │
         │                       │              │ - Disable form  │
         │                       │              └─────────────────┘
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 7. Async Thunk   │              │
         │              │ summarizeUrl     │              │
         │              │ execution        │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 8. SummaryService│              │
         │              │ .summarizeUrl()  │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 9. API Service   │              │
         │              │ (Axios)          │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 10. HTTP Request │              │
         │              │ POST /api/       │              │
         │              │ summarize        │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 11. Backend API  │              │
         │              │ Processing       │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 12. API Response │              │
         │              │ (Success/Error)  │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 13. Response     │              │
         │              │ Processing       │              │
         │              │ (Interceptors)   │              │
         │              └──────────────────┘              │
         │                       │                       │
         │                       ▼                       ▼
         │              ┌──────────────────┐    ┌─────────────────┐
         │              │ 14. Thunk        │───▶│ State Update    │
         │              │ fulfilled/       │    │ (Success/Error) │
         │              │ rejected         │    └─────────────────┘
         │              └──────────────────┘              │
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │ 15. Final       │
         │                       │              │ UI Update       │
         │                       │              │ - Hide skeleton │
         │                       │              │ - Show summary  │
         │                       │              │ - Enable form   │
         │                       │              └─────────────────┘
         │                       ▼                       │
         │              ┌──────────────────┐              │
         │              │ 16. Component    │◄─────────────┘
         │              │ Re-render        │
         │              │ (useSelector)    │
         │              └──────────────────┘
```

## 🧩 Components Involved

### 1. **UI Components**

- **`UrlForm`** - Handles URL input and validation
- **`SummaryPage`** - Main container component
- **`LoadingSkeleton`** - Shows loading state
- **`SummaryDisplay`** - Displays the final summary
- **`ErrorBoundary`** - Catches and handles errors

### 2. **State Management**

- **`summarySlice`** - Redux slice for summary state
- **`store`** - Redux store configuration
- **`useAppDispatch`** - Typed dispatch hook
- **`useAppSelector`** - Typed selector hook

### 3. **Services & API**

- **`SummaryService`** - Service class for API calls
- **`apiClient`** - Axios instance with interceptors
- **`api`** - Generic API request wrapper

### 4. **Validation & Utils**

- **`Zod schema`** - URL validation
- **`React Hook Form`** - Form state management
- **`config`** - Application configuration

## 📋 Detailed Step-by-Step Flow

### Phase 1: User Input & Validation

1. **User types URL** in `UrlForm` component
2. **Real-time validation** using Zod schema via React Hook Form
3. **Submit button state** updates based on validation
4. **User clicks Submit** button

### Phase 2: Form Submission

5. **`UrlForm.onSubmit`** triggered with validated data
6. **`SummaryPage.handleSubmit`** receives form data
7. **Redux dispatch** calls `summarizeUrl` async thunk

### Phase 3: State Management

8. **`summarySlice.pending`** state update:
   - `isLoading: true`
   - `error: null`
   - `lastUrl: submittedUrl`

### Phase 4: UI Loading State

9. **Components re-render** due to state change
10. **`LoadingSkeleton`** component displays
11. **Form becomes disabled**

### Phase 5: API Call

12. **`SummaryService.summarizeUrl`** called
13. **Axios request** with interceptors
14. **HTTP POST** to `/api/summarize`
15. **Backend processing** (external)

### Phase 6: Response Handling

16. **API response** received
17. **Response interceptors** process data
18. **Error handling** if request fails

### Phase 7: State Update

19. **`summarySlice.fulfilled`** or **`summarySlice.rejected`**:

- Success: `currentSummary` updated, `isLoading: false`
- Error: `error` message set, `isLoading: false`

### Phase 8: Final UI Update

20. **Components re-render** with new state
21. **`SummaryDisplay`** shows if successful
22. **Error message** shows if failed
23. **Form re-enabled** for next submission

## 🔄 State Flow Diagram

```
Initial State
     │
     ▼
┌─────────────┐
│ isLoading:  │
│   false     │
│ error: null │
│ summary:    │
│   null      │
└─────────────┘
     │
     ▼ (URL submitted)
┌─────────────┐
│ isLoading:  │
│   true      │
│ error: null │
│ lastUrl:    │
│   "url"     │
└─────────────┘
     │
     ▼ (API response)
┌─────────────┐     ┌─────────────┐
│ SUCCESS:    │     │ ERROR:      │
│ isLoading:  │     │ isLoading:  │
│   false     │     │   false     │
│ summary:    │     │ error:      │
│   data      │     │   message   │
└─────────────┘     └─────────────┘
```

## 🎯 Key Features

- **Type Safety**: Full TypeScript coverage throughout the flow
- **Error Handling**: Multiple layers of error catching and user feedback
- **Loading States**: Skeleton loaders for better UX
- **Validation**: Client-side validation before API calls
- **State Persistence**: Redux state management with history
- **Responsive UI**: Real-time updates based on state changes

## 🔧 Error Handling Points

1. **Form Validation** - Zod schema validation
2. **Network Errors** - Axios interceptors
3. **API Errors** - Server response handling
4. **Component Errors** - Error boundaries
5. **State Errors** - Redux error states
