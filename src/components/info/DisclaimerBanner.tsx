interface DisclaimerBannerProps {
  text: string;
}

export function DisclaimerBanner({ text }: DisclaimerBannerProps) {
  return (
    <div
      role="note"
      className="mb-6 px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-lg text-sm text-neutral-600"
    >
      <span className="font-semibold text-neutral-700">Hinweis: </span>
      {text}
    </div>
  );
}
