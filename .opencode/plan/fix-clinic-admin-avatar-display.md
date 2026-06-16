# Plan: Fix Avatar Display in Clinic-Admin Section

## Context
The clinic-admin section shows generic icons (Building2, initials) instead of user avatars. The patient section already has proper avatar support via `AvatarDisplay`, `AvatarSelectorModal`, and `useAvatarUpdate` hook. We need to bring the same avatar support to clinic-admin.

## Files to Modify

### 1. `app/clinic-admin/dashboard/page.tsx` (existing)
- **Fix 1**: Replace Building2 icon in header with user avatar
  - Add user query: `db.user.findUnique({ where: { id: session.user.id }, select: { avatar: true, name: true } })`
  - Import `AvatarDisplay` from `@/components/AvatarDisplay`
  - Replace lines 90-92 with AvatarDisplay using user avatar

- **Fix 2**: Replace patient initials in appointment list with avatars
  - Replace lines 151-153 (initial letter box) with AvatarDisplay using `app.patient.avatar`
  - Add doctor avatar next to doctor info (lines 158-160)
  - Query already includes `patient: true` and `doctor: { include: { user: true } }`, but need to verify avatar field is available

### 2. `app/clinic-admin/settings/ClinicSettingsClient.tsx` (NEW)
Create client component modeled after `PatientSettingsClient.tsx`:
- Avatar section with AvatarDisplay (large size)
- AvatarSelectorModal integration
- useAvatarUpdate hook for updates
- Password change form
- Same styling as patient settings

### 3. `app/clinic-admin/settings/page.tsx` (existing)
- Update to fetch current user's avatar
- Import and render ClinicSettingsClient with initialAvatar prop

## Implementation Order
1. Fix dashboard page (avatar in header + appointment list)
2. Create ClinicSettingsClient component
3. Update settings page to use ClinicSettingsClient

## Verification
- Check that avatar displays in dashboard header
- Check that patient and doctor avatars appear in appointment list
- Check that settings page shows avatar section with selector modal
- Run lint/typecheck if available
