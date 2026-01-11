/**
 * Centralized exports from @introvoke/react package with proper tree-shaking
 *
 * This file serves as a single source of truth for imports from @introvoke/react,
 * making it easier to:
 * 1. Track which components are actually used
 * 2. Ensure proper tree-shaking by using deep imports
 * 3. Avoid importing the entire package
 *
 * USAGE:
 * ❌ BAD - Imports everything from the package:
 *   import { Button, Icon } from '@introvoke/react'
 *
 * ✅ GOOD - Import from this file:
 *   import { Button, Icon } from '@src/lib/introvoke-exports'
 *
 * TREE-SHAKING STRATEGY:
 * The @introvoke/react package has subdirectories with individual package.json files
 * that point to ES modules. By importing from these subdirectories, we enable
 * proper tree-shaking and only bundle what we use.
 */

// ===== COMPONENTS =====
export { Button } from "@introvoke/react/components/Button";
export type { ButtonProps } from "@introvoke/react/components/Button";
export { IconWrapper } from "@introvoke/react/components/IconWrapper";
export type { IconWrapperProps } from "@introvoke/react/components/IconWrapper";
export { FeaturedIcon } from "@introvoke/react/components/FeaturedIcon";
export { DecorationWrapper } from "@introvoke/react/components/DecorationWrapper";
export { IconButton } from "@introvoke/react/components/IconButton";

// ===== DECORATIONS =====
export { default as CirclesSm } from "@introvoke/react/decorations/CirclesSm";
export { default as DotsSm } from "@introvoke/react/decorations/DotsSm";

// ===== ICONS =====
// Note: Icons directory has 2500+ files, import selectively!
export { default as Check } from "@introvoke/react/icons/Check";
export { default as CheckVerified01 } from "@introvoke/react/icons/CheckVerified01";
export { default as CalendarPlus02 } from "@introvoke/react/icons/CalendarPlus02";
export { default as ClockStopwatch } from "@introvoke/react/icons/ClockStopwatch";
export { default as Signal01 } from "@introvoke/react/icons/Signal01";
export { default as XClose } from "@introvoke/react/icons/XClose";
export { default as LoaderIcon } from "@introvoke/react/icons/LoaderIcon";
export { default as ArrowNarrowUpRight } from "@introvoke/react/icons/ArrowNarrowUpRight";
