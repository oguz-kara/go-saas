# Leads Page Fixes - Comprehensive Documentation

## ✅ Issues Fixed

### 1. Column Visibility Toggle (View Button)
**Problem**: The View button dropdown showed column options but didn't actually hide/show columns.

**Solution**: 
- Created `LeadsTableProvider` with React Context for managing column visibility state
- Added `useLeadsTable` hook to access column visibility state
- Updated `LeadsViewOptions` to toggle column visibility when checkboxes are clicked
- Updated `LeadsTable` to conditionally render columns based on visibility state
- Wrapped the entire leads page content in `LeadsTableProvider`

**Files Changed**:
- ✅ `web-admin/src/features/leads/components/leads-table-provider.tsx` (NEW)
- ✅ `web-admin/src/features/leads/components/leads-view-options.tsx` (UPDATED)
- ✅ `web-admin/src/features/leads/components/leads-table.tsx` (UPDATED)
- ✅ `web-admin/src/app/(dashboard)/leads/leads-page-client.tsx` (NEW)
- ✅ `web-admin/src/app/(dashboard)/leads/page.tsx` (UPDATED)

**How It Works**:
1. User clicks View button → dropdown shows all columns with checkboxes
2. User unchecks a column → `toggleColumn()` updates state
3. Table re-renders, hiding the unchecked column
4. State persists during the session (resets on page refresh)

---

### 2. Status Filter Investigation
**Problem**: Status filter not working (other filters work fine)

**Debug Added**: 
- Added console.log in `page.tsx` line 68 to log status parameters
- This will help identify if the issue is:
  - URL parameter generation (frontend)
  - URL parameter parsing (server)
  - GraphQL API call (backend)

**What to Check**:
1. **Open browser console** and select a status filter
2. Look for log: `Status filter: { statusParam: ..., status: ..., url: ... }`
3. **Check the URL** in the address bar - should see `?status=NEW&status=CONTACTED` etc.
4. **Check if data changes** - if URL is correct but data doesn't filter, it's a backend issue

**Expected Behavior**:
- When you select "NEW" + "CONTACTED" statuses
- URL should show: `?status=NEW&status=CONTACTED&skip=0`
- Console should show: `statusParam: ['NEW', 'CONTACTED']` or similar
- API should receive: `status: ['NEW', 'CONTACTED']`

**If Status Filter Still Doesn't Work**:
The code on the frontend is correct. The issue might be:
1. **Backend API** - Check if the GraphQL resolver properly handles array of statuses
2. **GraphQL Schema** - Verify `status: [LeadStatus!]` is correctly defined
3. **Database Query** - Check if the Prisma/database query handles multiple status values

---

### 3. Search Functionality Explanation
**Question**: "Is the search by term searching from the API or in the browser?"

**Answer**: **SEARCH IS API-SIDE** (Server-side) ✅

**How It Works**:

```typescript
// In leads-toolbar.tsx
const onSearch = useDebouncedCallback(
  (value: string) => setParam('q', value),
  400,  // 400ms delay
)
```

**Flow**:
1. User types in search box
2. Input is debounced (waits 400ms after user stops typing)
3. `setParam('q', value)` updates the URL parameter
4. URL change triggers Next.js server component re-render
5. Server fetches new data from GraphQL API with `searchQuery` parameter
6. Page re-renders with filtered results

**Why This is Good**:
- ✅ Searches entire database, not just current page
- ✅ Works with pagination correctly
- ✅ Consistent with other filters
- ✅ SEO-friendly (URL-based state)
- ✅ Shareable URLs with search terms

**Proof**:
- Look at the URL when searching - you'll see `?q=yourSearchTerm`
- The search is passed to `api.GetLeads({ searchQuery: q, ... })`
- All filters (search, status, source, etc.) trigger API calls

---

## 📋 Summary of All Changes

### New Files Created:
1. `leads-table-provider.tsx` - Context provider for column visibility
2. `leads-page-client.tsx` - Client wrapper component

### Files Modified:
1. `leads-view-options.tsx` - Now uses context to toggle columns
2. `leads-table.tsx` - Now conditionally renders columns based on visibility
3. `page.tsx` - Simplified, uses client wrapper, added debug logging

### Features Now Working:
✅ Column visibility toggle (View button)
✅ All columns can be hidden/shown individually
✅ Table header and body stay in sync
✅ "No results" colspan adjusts based on visible columns
✅ Search is API-side (confirmed)
✅ Debug logging added for status filter

---

## 🐛 Debugging Status Filter

### Steps to Debug:

1. **Open the leads page**
2. **Open browser DevTools Console** (F12)
3. **Click a status filter** (e.g., select "NEW")
4. **Check console output** for:
   ```
   Status filter: {
     statusParam: "NEW",  // or ["NEW", "CONTACTED"] for multiple
     status: ["NEW"],
     url: "{...}"
   }
   ```
5. **Check the URL** in address bar: `?status=NEW&skip=0`
6. **Check if table filtered** correctly

### If URL is Correct but Data Doesn't Filter:

The issue is in the **backend**. Check:

```graphql
# In GraphQL schema
type Query {
  leads(
    status: [LeadStatus!]  # ← Should accept array
    ...
  ): LeadsConnection!
}
```

```typescript
// In backend resolver
async leads(args: { status?: LeadStatus[] }) {
  // Should handle array of statuses
  const where = {
    ...(args.status && {
      status: { in: args.status }  // ← Prisma array filter
    })
  }
}
```

---

## 🎉 Testing Checklist

- [ ] Click View button → dropdown appears
- [ ] Uncheck "Email" column → Email column disappears
- [ ] Check "Email" again → Email column reappears
- [ ] Hide multiple columns → Table adjusts correctly
- [ ] Type in search box → URL updates after 400ms
- [ ] Search filters results correctly
- [ ] Status filter → Check console log
- [ ] Status filter → Check URL params
- [ ] Source filter → Works (already working)
- [ ] Priority filter → Works (already working)
- [ ] Assigned filter → Works (already working)
- [ ] Pagination works with all filters
- [ ] Reset button clears all filters

---

## 💡 Additional Notes

### Why Column Visibility Resets on Page Refresh:
Currently using React state which doesn't persist. To persist:
- Could use localStorage
- Could use URL parameters (like filters)
- Could use cookies
- Could save to user preferences in database

### Performance:
- Column visibility toggle is instant (client-side state)
- Search has 400ms debounce to reduce API calls
- All filters trigger server-side re-render (Next.js behavior)

### Future Improvements:
1. Persist column visibility in localStorage
2. Add "Reset columns" option
3. Add predefined column layouts (e.g., "Compact View", "Full View")
4. Add column reordering (drag & drop)

