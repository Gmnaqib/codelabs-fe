# Architecture

Ringkasan struktur & konvensi setelah refactor ke feature-based architecture. Stack: Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind v4 + shadcn/ui.

## Struktur folder

```
src/
  app/                  # routes (App Router) — tipis, hanya compose feature components + ProtectedRoute
  features/<name>/
    components/         # UI komponen milik feature ini
    hooks/               # data-fetching & business logic hook (use<Feature>Table, dsb)
    config/              # column defs (columns.tsx), zod schemas (schemas.ts)
    state/               # zustand store lokal feature (kalau perlu, mis. features/operational/state)
    types.ts             # row types & tipe lokal feature
  shared/
    state/               # zustand store lintas-feature: authStore, tableStore
    services/            # errorHandler.ts (AppError, handleError, showAppErrorToast)
    utils/                # tokenStorage.ts (satu-satunya pemilik token di localStorage)
    constants/            # UI_CONFIG, API_ENDPOINTS, ROLES, dll
  services/<domain>/     # axios calls per domain (attendanceService.ts, kpiService.ts, dst)
  types/
    api/                  # tipe response API generik (ApiResponse, dll)
    domain/               # tipe domain final (User, AuthUser, OperationalRecord, dst)
    *.ts (sisa)           # beberapa *Props.ts lama masih dipakai 1 komponen (CardField, DialogField,
                           # InputField, Menubar, PicketCard, PicketPerson, Textarea, ToastOptions) —
                           # belum dipindah ke domain/, sengaja tidak diutak-atik karena masih terpakai
  components/
    ui/                    # shadcn primitives (table, pagination, dialog, dst)
    custom-ui/              # komponen custom lintas-fitur (InputField, DropdownField, MenuBar, dst)
                             # custom-ui/TableField/TableSection/* = bridge lama, sebagian jadi dead
                             # code (tidak ada importer) — kandidat cleanup, belum dihapus di refactor ini
  lib/                     # axiosClient.ts, toastHelper.tsx, utils.ts (cn helper, dsb)
  hooks/, utils/           # sisa hook & util generik pra-refactor yang belum sempat dipindah ke shared/
```

Halaman di `src/app/**/page.tsx` sengaja tipis: composisi `<ProtectedRoute roles={[...]}>` + import langsung komponen feature (`@/features/x/components/Y`), tanpa logic tabel di dalamnya.

## Auth (single JWT)

- Token disimpan di `localStorage` key `"token"` — **hanya** lewat `@/shared/utils/tokenStorage.ts` (`getStoredToken`/`setStoredToken`/`clearStoredToken`). Tidak ada refresh token.
- `shared/state/authStore.ts` (Zustand): `hydrateFromToken()` decode JWT (`jwt-decode`) dari `tokenStorage`, isi `user` kalau valid & belum expired, `logout()` clear token + `user`, `hasRole(roles)` untuk RBAC.
- `axiosClient.ts` menempel `Authorization: Bearer <token>` di tiap request; response interceptor: **401 → `clearStoredToken()` + redirect ke `/login`** (tanpa refresh, tanpa token di URL).
- `features/auth/components/ProtectedRoute.tsx`: redirect ke `/login` kalau belum login; kalau prop `roles` diisi dan role user tidak cocok → redirect ke `/`. Tanpa prop `roles` = boleh diakses semua user yang sudah login.
- Role-role valid didefinisikan di `types/domain/user.ts` (`USER_ROLES`), **pakai spasi** (mis. `"minister of operation"`, bukan underscore).

## Pola tabel: BaseTable + feature hooks + TableDispatcher

- `features/table/components/BaseTable.tsx` — komponen generik `<T extends { _id: string }>`, terima `data`, `columns: TableColumn<T>[]`, `loading`, `emptyMessage`, `onRowClick`, `onSort`, `sortConfig`, dan `paginate?: boolean` (pagination client-side lewat `usePagination`). Baris dirender lewat sub-komponen `React.memo`.
- Tiap feature table (`features/<x>/components/XTable.tsx`) adalah pola yang sama:
  1. `use<X>Table()` hook — fetch data (lewat `useTableData` generik), filter, expose `{ data, loading, error, ... }`.
  2. `create<X>Columns(...)` di `config/columns.tsx` — didefinisikan sebagai factory function, **selalu dipanggil di dalam `useMemo`** di komponen.
  3. Render `<BaseTable data={...} columns={...} loading={...} />`.
- `features/table/components/TableDispatcher.tsx` — dipakai untuk kartu dashboard yang butuh tabel dinamis berdasar `TablePage` (union type dari `shared/state/tableStore.ts`). Tiap entry di-`React.lazy` + di-bungkus `<Suspense fallback=...>` supaya code-split per fitur.
- Filter global (bulan/tahun/search) hidup di `shared/state/tableStore.ts` (Zustand), dibaca langsung oleh `use<X>Table()` hooks — bukan di-passing manual sebagai props dari page ke table.

## State: Zustand

- `shared/state/authStore.ts`, `shared/state/tableStore.ts` — store lintas-fitur.
- Store per-feature kalau perlu (mis. `features/operational/state/operationalStore.ts`) untuk state yang scope-nya cuma satu fitur (tab aktif, dsb).
- Semua store pakai middleware `devtools` untuk debugging.

## Forms: react-hook-form + zod

- Tiap form pakai `zodResolver` + `Controller` (bukan `register()`, karena komponen field custom seperti `InputField`/`SelectField`/`DropdownField` controlled-only, tidak forward ref).
- Schema Zod hidup di `features/<x>/config/schemas.ts`.

## Error handling: AppError

- `shared/services/errorHandler.ts`: `AppError` (code, status, message + helper `isAuthError()`/`isForbidden()`/`isValidationError()`/`isNetworkError()`), `handleError(err)` normalisasi error apapun (axios error, Error biasa, atau AppError yang sudah ada) jadi `AppError`, `showAppErrorToast(err)` map status ke toast message yang sesuai.
- Semua fungsi di `services/<domain>/*.ts` membungkus call axios dengan `try/catch` lalu `throw handleError(error)` — tidak ada silent-catch yang menelan error.

## Konvensi penamaan

- Import pakai alias `@/...` (bukan relative path panjang).
- File komponen: PascalCase (`AttendanceTable.tsx`). Hook: camelCase dengan prefix `use` (`useAttendanceTable.ts`). Service: `camelCaseService.ts`.
- Row/data type per fitur: `<Feature>Row` (mis. `AttendanceRow`, `PointsDetailRow`) di `features/<x>/types.ts`.
- Komponen tabel/feature yang masih dipanggil dari caller lama (belum full migrasi) menerima props via index signature `[key: string]: unknown` supaya prop lama yang belum relevan diterima-dan-diabaikan tanpa error TypeScript.

## Testing

- Vitest + Testing Library (`vitest.config.ts`, `vitest.setup.ts`, alias `@` → `src`, environment `jsdom`).
- `src/**/__tests__/*.test.ts(x)` — unit test untuk store/hook, component test untuk BaseTable & tabel operational.

## Technical debt yang diketahui (sengaja belum disentuh)

- `src/hooks/`, `src/utils/` (top-level, di luar `shared/`) masih berisi beberapa hook/util lama (`useClock`, `useMediaQuery`, `date.ts`, dll) yang belum dipindah ke `shared/`.
- `src/types/*.ts` (di luar `api/`/`domain/`) masih menyisakan beberapa `*Props.ts` lama yang masih dipakai 1 komponen masing-masing.
- `src/components/custom-ui/TableField/TableSection/*` — bridge lama dari sebelum migrasi ke `features/table`; sebagian file di dalamnya sudah jadi dead code (tidak ada importer) tapi belum dihapus.
- `src/context/` — folder kosong, sisa `AuthContext.tsx` yang sudah dihapus.
