interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading' }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fefcf3] dark:bg-[#111113]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-9 w-9">
          <div className="absolute inset-0 rounded-full border-2 border-black/10 dark:border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin [animation-duration:0.7s]" />
        </div>
        <p className="text-[13px] font-medium tracking-wide text-black/40 dark:text-white/40">
          {message}
        </p>
      </div>
    </div>
  );
}
