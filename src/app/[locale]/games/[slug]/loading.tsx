export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 opacity-75 blur-md dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="h-full w-full animate-[spin_1s_linear_infinite] rounded-full bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 p-[3px] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="h-full w-full rounded-full bg-background" />
        </div>
      </div>
    </div>
  );
}
