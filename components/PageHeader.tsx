interface Props {
  title: string;
  subtitle: string;
}

export default function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-10">

      <h1 className="text-6xl font-bold text-red-700">
        {title}
      </h1>

      <p className="text-xl text-gray-600 mt-3">
        {subtitle}
      </p>

    </div>
  );
}