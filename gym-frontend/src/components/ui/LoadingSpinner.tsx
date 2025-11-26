// components/ui/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      <p className="text-gray-600">Cargando datos...</p>
    </div>
  );
}