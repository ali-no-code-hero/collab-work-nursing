# Facebook Pixel Testing Guide

## Implementation Status

✅ **Code Structure**: Standard Facebook Pixel implementation restored
✅ **Pixel ID**: `2150111775458129` (consistent across all references)
✅ **Initialization**: Correctly placed in root layout
✅ **Event Tracking**: Lead event properly implemented in form

## Code Verification

### Base Pixel Code (app/layout.tsx)
- ✅ Uses standard Facebook Pixel IIFE pattern
- ✅ Creates `fbq` function synchronously (before script loads)
- ✅ Queues events until script loads
- ✅ Initializes with correct Pixel ID: `2150111775458129`
- ✅ Tracks PageView on all pages
- ✅ Includes noscript fallback for non-JS users

### Custom Event Tracking (app/form/page.tsx)
- ✅ Checks for `window.fbq` before calling (safe for ad blockers)
- ✅ Tracks 'Lead' event when email is validated
- ✅ Includes event parameters (content_name, content_category)
- ✅ Has error handling for development mode

## Testing Methods

### Method 1: Facebook Pixel Helper (Recommended)

1. **Install the Extension**:
   - Chrome: [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
   - Firefox: Available in Firefox Add-ons

2. **Test Steps**:
   - Navigate to your website
   - Click the Pixel Helper icon in your browser toolbar
   - You should see:
     - ✅ Green checkmark: "Facebook Pixel detected"
     - ✅ Pixel ID: `2150111775458129`
     - ✅ Events fired: `PageView`

3. **Test Lead Event**:
   - Go to `/form` page
   - Enter a valid email address
   - Click "Next"
   - Check Pixel Helper - should show:
     - ✅ `PageView` event
     - ✅ `Lead` event with parameters

### Method 2: Browser Console

1. **Open Developer Tools** (F12)
2. **Check for fbq function**:
   ```javascript
   typeof window.fbq
   // Should return: "function"
   ```

3. **Check Pixel initialization**:
   ```javascript
   window.fbq.queue
   // Should show array of queued events
   ```

4. **Manually test event**:
   ```javascript
   window.fbq('track', 'TestEvent', {test: 'value'})
   // Should execute without errors
   ```

### Method 3: Network Tab

1. **Open Developer Tools** → Network tab
2. **Filter by**: `facebook` or `fbevents`
3. **Reload page**:
   - Should see request to `connect.facebook.net/en_US/fbevents.js`
   - Should see POST requests to `facebook.com/tr` with event data

4. **Test Lead event**:
   - Fill out form and submit email
   - Should see additional POST request with `ev=Lead`

### Method 4: Facebook Events Manager

1. **Log in to Facebook Events Manager**:
   - Go to: https://business.facebook.com/events_manager
   - Select your Pixel: `2150111775458129`

2. **Check Activity**:
   - Navigate to "Test Events" tab
   - Visit your website
   - Should see `PageView` events appearing in real-time
   - Fill out form with email
   - Should see `Lead` events appearing

3. **Verify Event Details**:
   - Click on an event to see details
   - Check that Pixel ID matches: `2150111775458129`
   - For Lead events, verify parameters are included

## Expected Behavior

### ✅ Normal Operation (No Ad Blocker)
- Pixel loads successfully
- `PageView` fires on every page load
- `Lead` event fires when email is submitted
- Events appear in Facebook Events Manager within minutes

### ⚠️ With Ad Blocker
- Pixel script may be blocked (`ERR_BLOCKED_BY_CLIENT`)
- `fbq` function may not exist
- Events won't fire (expected behavior)
- Website functionality remains unaffected
- Lead event check (`if (window.fbq)`) prevents errors

## Common Issues & Solutions

### Issue: Pixel Helper shows "Pixel not detected"
**Solutions**:
- Check browser console for errors
- Verify ad blocker is disabled
- Ensure you're on the correct domain
- Check CSP headers allow Facebook domains

### Issue: Events not appearing in Events Manager
**Solutions**:
- Wait 5-10 minutes (there's a delay)
- Check you're viewing the correct Pixel ID
- Verify you're using "Test Events" tab (for immediate testing)
- Check browser console for JavaScript errors

### Issue: Lead event not firing
**Solutions**:
- Verify email validation passes
- Check browser console for errors
- Ensure `window.fbq` exists before event fires
- Test manually in console: `window.fbq('track', 'Lead')`

## Verification Checklist

- [ ] Pixel Helper shows green checkmark
- [ ] Pixel ID matches: `2150111775458129`
- [ ] PageView event fires on page load
- [ ] Lead event fires when email is submitted
- [ ] Events appear in Facebook Events Manager
- [ ] No JavaScript errors in console
- [ ] Website works normally with ad blockers
- [ ] Noscript fallback works (test with JS disabled)

## Code Locations

- **Base Pixel**: `app/layout.tsx` (lines 83-105)
- **Lead Event**: `app/form/page.tsx` (lines 301-314)
- **Type Definitions**: `types/facebook-pixel.d.ts`
- **CSP Configuration**: `next.config.mjs` (line 41)

## Next Steps

1. Run through all testing methods above
2. Verify events in Facebook Events Manager
3. Test with ad blocker enabled (should fail gracefully)
4. Monitor Events Manager for 24-48 hours to ensure consistent tracking

