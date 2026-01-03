function ShareButton({
  url,
  IconComponent,
  iconProps = {},
  buttonClass = "absolute bottom-3 right-16 bg-white/40 shadow-md",
}) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this link!",
          url: url,
        })
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      console.log("Share not supported on this browser");
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center p-2 rounded-full ${buttonClass}`}
    >
      <IconComponent {...iconProps} />
    </button>
  );
}

export default ShareButton;
