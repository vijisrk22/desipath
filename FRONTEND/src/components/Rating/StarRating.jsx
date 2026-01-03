function StarRating({ rating }) {
  const MAX_STARS = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  const stars = [];

  for (let i = 0; i < MAX_STARS; i++) {
    if (i < filledStars) {
      stars.push(<FullStar key={i} />);
    } else if (hasHalfStar && i === filledStars) {
      stars.push(<HalfStar key={i} />);
    } else {
      stars.push(<EmptyStar key={i} />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}

const FullStar = () => <span className="text-yellow-400 text-[20px]">★</span>;
const EmptyStar = () => <span className="text-gray-300 text-[20px]">★</span>;

// Optional: visually simulate a half star
const HalfStar = () => (
  <span className="text-yellow-400 relative inline-block w-[20px] h-[20px] overflow-hidden">
    <span className="absolute left-0 w-1/2 overflow-hidden">★</span>
    <span className="text-gray-300">★</span>
  </span>
);

export default StarRating;
